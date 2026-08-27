<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Services\MayarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('checkout');
    }

    public function store(Request $request, MayarService $mayarService): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'customer_address' => ['required', 'string'],
            'note' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($validated, $mayarService, $request) {
            $totalSubtotal = 0;
            $itemsData = [];

            // 1. Validate stocks and snapshot prices
            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->find($item['id']);

                if (! $product || ! $product->status) {
                    abort(422, "Produk {$item['id']} sudah tidak aktif.");
                }

                if ($product->stock < $item['quantity']) {
                    abort(422, "Stok {$product->name} tidak mencukupi (Tersedia: {$product->stock}).");
                }

                $itemSubtotal = $product->price * $item['quantity'];
                $totalSubtotal += $itemSubtotal;

                $itemsData[] = [
                    'product' => $product,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $itemSubtotal,
                ];
            }

            // 2. Generate unique Order Number
            $orderNumber = 'DDL-' . date('Ym') . '-' . strtoupper(Str::random(6));

            // 3. Create Order
            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'note' => $validated['note'] ?? null,
                'subtotal' => $totalSubtotal,
                'total' => $totalSubtotal,
                'payment_status' => Order::PAYMENT_PENDING,
                'order_status' => Order::STATUS_PENDING_PAYMENT,
            ]);

            // 4. Create Order Items & Decrement Stock
            foreach ($itemsData as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);

                $item['product']->decrement('stock', $item['quantity']);
            }

            // 5. Create Mayar Payment transaction
            $returnUrl = route('payment.show', ['orderNumber' => $order->order_number]);
            $paymentResult = $mayarService->createPayment($order, $returnUrl);

            Payment::create([
                'order_id' => $order->id,
                'provider' => 'mayar',
                'provider_reference' => $paymentResult['payment_reference'],
                'payment_reference' => $paymentResult['payment_reference'],
                'amount' => $order->total,
                'method' => 'Mayar Gateway',
                'status' => Payment::STATUS_PENDING,
                'raw_response' => $paymentResult['raw_response'],
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'order_number' => $order->order_number,
                    'redirect_url' => $paymentResult['payment_url'],
                ]);
            }

            return redirect()->to($paymentResult['payment_url']);
        });
    }
}
