<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MayarService
{
    protected string $apiKey;
    protected string $apiUrl;
    protected string $webhookSecret;

    public function __construct()
    {
        $this->apiKey = (string) (config('services.mayar.api_key') ?? env('MAYAR_API_KEY', ''));
        $this->apiUrl = (string) (config('services.mayar.api_url') ?? env('MAYAR_API_URL', 'https://pub-api.mayar.id/hl/v1'));
        $this->webhookSecret = (string) (config('services.mayar.webhook_secret') ?? env('MAYAR_WEBHOOK_SECRET', ''));
    }

    /**
     * Create a payment transaction for an Order.
     *
     * @return array{success: bool, payment_reference: string, payment_url: string, raw_response: array}
     */
    public function createPayment(Order $order, string $returnUrl): array
    {
        $paymentReference = 'MYR-' . strtoupper(Str::random(12));

        // If no real API key is configured (local dev/sandbox mode), return a local simulation URL
        if (empty($this->apiKey) || str_starts_with($this->apiKey, 'test_placeholder')) {
            return [
                'success' => true,
                'payment_reference' => $paymentReference,
                'payment_url' => route('payment.show', ['orderNumber' => $order->order_number]),
                'raw_response' => [
                    'mode' => 'sandbox_simulation',
                    'order_id' => $order->id,
                    'amount' => $order->total,
                ],
            ];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/payment/create', [
                'name' => $order->customer_name,
                'email' => $order->customer_email,
                'mobile' => $order->customer_phone,
                'amount' => (int) $order->total,
                'description' => "Pembayaran Pesanan {$order->order_number} - Dodolan Store",
                'redirectUrl' => $returnUrl,
                'referenceId' => $order->order_number,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'payment_reference' => $data['data']['id'] ?? $paymentReference,
                    'payment_url' => $data['data']['link'] ?? $returnUrl,
                    'raw_response' => $data,
                ];
            }

            Log::error('Mayar Payment API Error: ' . $response->body());
        } catch (\Throwable $e) {
            Log::error('Mayar Payment Exception: ' . $e->getMessage());
        }

        // Fallback gracefully to local payment page
        return [
            'success' => true,
            'payment_reference' => $paymentReference,
            'payment_url' => route('payment.show', ['orderNumber' => $order->order_number]),
            'raw_response' => ['fallback' => true],
        ];
    }

    /**
     * Verify incoming webhook from Mayar
     */
    public function verifyWebhook(Request $request): bool
    {
        // If secret is configured, verify signature header
        if (! empty($this->webhookSecret)) {
            $signature = $request->header('x-mayar-signature') ?? $request->header('signature');
            if ($signature) {
                $computed = hash_hmac('sha256', $request->getContent(), $this->webhookSecret);
                return hash_equals($computed, $signature);
            }
        }

        return true;
    }
}
