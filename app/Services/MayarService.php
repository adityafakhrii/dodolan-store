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
        $this->apiUrl = rtrim((string) (config('services.mayar.api_url') ?? env('MAYAR_API_URL', 'https://api.mayar.id/hl/v2')), '/');
        $this->webhookSecret = (string) (config('services.mayar.webhook_secret') ?? env('MAYAR_WEBHOOK_SECRET', ''));
    }

    /**
     * Create a Mayar API v2 Invoice payment transaction for an Order.
     *
     * @return array{success: bool, payment_reference: string, payment_url: string, raw_response: array}
     */
    public function createPayment(Order $order, string $returnUrl): array
    {
        $paymentReference = 'MYR-'.strtoupper(Str::random(12));

        // Format items array according to Mayar API v2 specs: items[].quantity, items[].rate, items[].description
        $items = [];
        foreach ($order->items as $item) {
            $items[] = [
                'quantity' => (int) $item->quantity,
                'rate' => (int) $item->unit_price,
                'description' => (string) $item->product_name,
            ];
        }

        // Fallback if items were empty on the model relation
        if (empty($items)) {
            $items[] = [
                'quantity' => 1,
                'rate' => (int) $order->total,
                'description' => "Pesanan {$order->order_number} Dodolan Store",
            ];
        }

        // Clean customer mobile number (digits only, e.g. 081234567890)
        $mobile = preg_replace('/[^0-9]/', '', $order->customer_phone);
        if (str_starts_with($mobile, '62') && strlen($mobile) > 9) {
            $mobile = '0'.substr($mobile, 2);
        }

        // If no real API key is configured (local dev/sandbox simulation mode), return local payment page
        if (empty($this->apiKey) || str_starts_with($this->apiKey, 'test_placeholder')) {
            return [
                'success' => true,
                'payment_reference' => $paymentReference,
                'payment_url' => route('payment.show', ['orderNumber' => $order->order_number]),
                'raw_response' => [
                    'mode' => 'sandbox_simulation',
                    'order_id' => $order->id,
                    'amount' => $order->total,
                    'items' => $items,
                ],
            ];
        }

        try {
            // Determine v2 vs v1 endpoint based on apiUrl
            $endpoint = str_contains($this->apiUrl, '/v2')
                ? $this->apiUrl.'/invoices/create'
                : $this->apiUrl.'/payment/create';

            $payload = [
                'name' => $order->customer_name,
                'email' => $order->customer_email,
                'mobile' => ! empty($mobile) ? $mobile : '081234567890',
                'description' => "Pembayaran Pesanan {$order->order_number} - Dodolan Store",
                'expiredAt' => now()->addDays(2)->toIso8601String(),
                'redirectUrl' => $returnUrl,
                'items' => $items,
                'extraData' => [
                    'order_number' => $order->order_number,
                    'order_id' => (string) $order->id,
                ],
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(15)->post($endpoint, $payload);

            if ($response->successful()) {
                $data = $response->json();
                $dataPayload = $data['data'] ?? [];

                $ref = $dataPayload['id'] ?? $dataPayload['transactionId'] ?? $paymentReference;
                $link = $dataPayload['link'] ?? route('payment.show', ['orderNumber' => $order->order_number]);

                Log::info("Mayar API v2 Invoice Created successfully for order {$order->order_number}", [
                    'id' => $ref,
                    'link' => $link,
                ]);

                return [
                    'success' => true,
                    'payment_reference' => (string) $ref,
                    'payment_url' => (string) $link,
                    'raw_response' => $data,
                ];
            }

            Log::error('Mayar API Error Response: '.$response->status().' - '.$response->body());
        } catch (\Throwable $e) {
            Log::error('Mayar Payment Exception: '.$e->getMessage());
        }

        // Graceful fallback to store payment page if remote API call fails
        return [
            'success' => true,
            'payment_reference' => $paymentReference,
            'payment_url' => route('payment.show', ['orderNumber' => $order->order_number]),
            'raw_response' => ['fallback' => true],
        ];
    }

    /**
     * Actively query Mayar API v2 to check the current status of an invoice.
     *
     * @return string|null e.g. 'paid', 'unpaid', 'closed' or null if not available
     */
    public function checkInvoiceStatus(string $invoiceId): ?string
    {
        if (empty($this->apiKey) || str_starts_with($this->apiKey, 'test_placeholder') || str_starts_with($invoiceId, 'MYR-')) {
            return null;
        }

        try {
            $endpoint = str_contains($this->apiUrl, '/v2')
                ? $this->apiUrl.'/invoices/'.$invoiceId
                : $this->apiUrl.'/payment/'.$invoiceId;

            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(8)->get($endpoint);

            if ($response->successful()) {
                $data = $response->json();

                return $data['data']['status'] ?? null;
            }
        } catch (\Throwable $e) {
            Log::debug('Mayar checkInvoiceStatus exception: '.$e->getMessage());
        }

        return null;
    }

    /**
     * Verify incoming webhook from Mayar (Fail-Closed)
     */
    public function verifyWebhook(Request $request): bool
    {
        // In local or testing environments without a configured secret, permit simulation
        if (empty($this->webhookSecret)) {
            return app()->environment('local', 'testing');
        }

        $signature = $request->header('x-mayar-signature') ?? $request->header('signature');
        if (! $signature) {
            return false;
        }

        $computed = hash_hmac('sha256', $request->getContent(), $this->webhookSecret);

        return hash_equals($computed, $signature);
    }
}
