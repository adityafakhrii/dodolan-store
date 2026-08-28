<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Order::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
                ->orWhere('customer_email', $user->email);
        })->with(['items', 'latestPayment']);

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('items', function ($itemQuery) use ($search) {
                        $itemQuery->where('product_name', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('order_status', $status);
        }

        if ($paymentStatus = $request->input('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        $orders = $query->latest()->paginate(8)->withQueryString();

        return Inertia::render('customer/orders/index', [
            'orders' => $orders,
            'filters' => [
                'q' => $request->input('q', ''),
                'status' => $request->input('status', ''),
                'payment_status' => $request->input('payment_status', ''),
            ],
        ]);
    }

    public function show(Request $request, string $orderNumber): Response
    {
        $user = $request->user();

        $order = Order::where('order_number', $orderNumber)
            ->with(['items', 'payments'])
            ->firstOrFail();

        // Ensure user can only view their own orders
        if ($order->user_id !== $user->id && strtolower($order->customer_email) !== strtolower($user->email) && ! $user->is_admin) {
            abort(403, 'Anda tidak memiliki akses untuk melihat rincian pesanan ini.');
        }

        return Inertia::render('customer/orders/show', [
            'order' => $order,
        ]);
    }
}
