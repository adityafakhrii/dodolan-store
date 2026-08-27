<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Services\MayarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function show(string $orderNumber): Response
    {
        $order = Order::with(['items', 'latestPayment'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return Inertia::render('payment/show', [
            'order' => $order,
        ]);
    }

    /**
     * Handle incoming Mayar Webhook callback
     */
    public function webhook(Request $request, MayarService $mayarService): JsonResponse
    {
        if (! $mayarService->verifyWebhook($request)) {
            Log::warning('Mayar Webhook Invalid Signature: ' . $request->ip());
            return response()->json(['success' => false, 'message' => 'Invalid signature'], 401);
        }

        $payload = $request->all();
        Log::info('Mayar Webhook Received: ', $payload);

        // Standard Mayar webhook attributes
        $event = $payload['event'] ?? $payload['status'] ?? '';
        $paymentReference = $payload['data']['id'] ?? $payload['data']['payment_reference'] ?? $payload['data']['referenceId'] ?? null;
        $orderNumber = $payload['data']['referenceId'] ?? $payload['referenceId'] ?? null;

        return DB::transaction(function () use ($paymentReference, $orderNumber, $event, $payload) {
            $payment = null;

            if ($paymentReference) {
                $payment = Payment::where('payment_reference', $paymentReference)->first();
            }

            if (! $payment && $orderNumber) {
                $order = Order::where('order_number', $orderNumber)->first();
                $payment = $order?->latestPayment;
            }

            if (! $payment) {
                Log::warning("Mayar Webhook: Payment not found for ref {$paymentReference} or order {$orderNumber}");
                return response()->json(['success' => false, 'message' => 'Payment reference not found'], 404);
            }

            // Idempotency: If already paid, return success without duplicate side-effects
            if ($payment->status === Payment::STATUS_PAID) {
                return response()->json(['success' => true, 'message' => 'Payment already processed']);
            }

            // Check if status is paid / success
            $isPaid = in_array(strtolower($event), ['payment.received', 'paid', 'success', 'settlement', 'invoice.paid']);

            if ($isPaid) {
                $payment->update([
                    'status' => Payment::STATUS_PAID,
                    'paid_at' => now(),
                    'raw_response' => array_merge($payment->raw_response ?? [], ['webhook' => $payload]),
                ]);

                $payment->order->update([
                    'payment_status' => Order::PAYMENT_PAID,
                    'order_status' => Order::STATUS_PAID,
                ]);

                Log::info("Mayar Webhook: Order {$payment->order->order_number} marked as Paid successfully.");
            }

            return response()->json(['success' => true]);
        });
    }

    /**
     * Local Sandbox Simulation: Mark payment as paid for testing
     */
    public function simulateSuccess(string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        DB::transaction(function () use ($order) {
            $payment = $order->latestPayment;
            if ($payment) {
                $payment->update([
                    'status' => Payment::STATUS_PAID,
                    'paid_at' => now(),
                    'raw_response' => array_merge($payment->raw_response ?? [], ['simulated' => true]),
                ]);
            }

            $order->update([
                'payment_status' => Order::PAYMENT_PAID,
                'order_status' => Order::STATUS_PAID,
            ]);
        });

        return redirect()->route('payment.show', ['orderNumber' => $order->order_number])
            ->with('success', 'Pembayaran berhasil disimulasikan sebagai LUNAS.');
    }
}
