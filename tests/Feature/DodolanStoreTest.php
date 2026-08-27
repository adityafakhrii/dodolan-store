<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DodolanStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_public_pages_are_accessible(): void
    {
        $this->get('/')->assertOk();
        $this->get('/tentang-kami')->assertOk();
        $this->get('/produk')->assertOk();
        $this->get('/portfolio')->assertOk();
        $this->get('/kontak')->assertOk();
        $this->get('/layanan')->assertOk();
    }

    public function test_product_detail_page_loads_with_specs(): void
    {
        $product = Product::first();
        $this->assertNotNull($product);

        $response = $this->get("/produk/{$product->slug}");
        $response->assertOk();
    }

    public function test_service_request_submission(): void
    {
        $payload = [
            'name' => 'PT Ekspedisi Nusantara',
            'email' => 'fleet@nusantara.co.id',
            'phone' => '081234567890',
            'service_type' => 'Instalasi',
            'location' => 'Pool Truk Waru, Sidoarjo',
            'description' => 'Instalasi 10 unit AI MDVR pada truk kontainer.',
            'note' => 'Pemasangan hari Sabtu.',
        ];

        $response = $this->post('/layanan', $payload);
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('service_requests', [
            'name' => 'PT Ekspedisi Nusantara',
            'service_type' => 'Instalasi',
            'status' => 'Baru',
        ]);
    }

    public function test_checkout_creates_order_and_decrements_stock(): void
    {
        $product = Product::first();
        $initialStock = $product->stock;

        $payload = [
            'customer_name' => 'Budi Setiawan',
            'customer_email' => 'budi@example.com',
            'customer_phone' => '081987654321',
            'customer_address' => 'Jl. Pemuda No. 45, Surabaya',
            'note' => 'Packing kayu aman',
            'items' => [
                [
                    'id' => $product->id,
                    'quantity' => 2,
                ],
            ],
        ];

        $response = $this->postJson('/checkout', $payload);
        $response->assertOk();
        $response->assertJsonStructure(['success', 'order_number', 'redirect_url']);

        $orderNumber = $response->json('order_number');

        // Verify Order snapshot
        $this->assertDatabaseHas('orders', [
            'order_number' => $orderNumber,
            'customer_name' => 'Budi Setiawan',
            'payment_status' => 'Pending',
            'order_status' => 'Menunggu Pembayaran',
        ]);

        // Verify Order Item snapshot
        $this->assertDatabaseHas('order_items', [
            'product_name' => $product->name,
            'unit_price' => $product->price,
            'quantity' => 2,
        ]);

        // Verify Stock decremented
        $product->refresh();
        $this->assertEquals($initialStock - 2, $product->stock);

        // Verify Payment Created
        $this->assertDatabaseHas('payments', [
            'provider' => 'mayar',
            'status' => 'Pending',
        ]);
    }

    public function test_payment_status_page_and_simulation(): void
    {
        $product = Product::first();

        $payload = [
            'customer_name' => 'Dewi Lestari',
            'customer_email' => 'dewi@example.com',
            'customer_phone' => '081122334455',
            'customer_address' => 'Jl. Basuki Rahmat, Surabaya',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ];

        $checkoutRes = $this->postJson('/checkout', $payload);
        $orderNumber = $checkoutRes->json('order_number');

        $this->get("/pembayaran/{$orderNumber}")->assertOk();

        // Simulate successful payment
        $simRes = $this->post("/pembayaran/{$orderNumber}/simulate-success");
        $simRes->assertRedirect(route('payment.show', ['orderNumber' => $orderNumber]));

        $this->assertDatabaseHas('orders', [
            'order_number' => $orderNumber,
            'payment_status' => 'Paid',
            'order_status' => 'Dibayar',
        ]);
    }

    public function test_mayar_webhook_idempotency(): void
    {
        $product = Product::first();

        $checkoutRes = $this->postJson('/checkout', [
            'customer_name' => 'Hendra Gunawan',
            'customer_email' => 'hendra@example.com',
            'customer_phone' => '081555666777',
            'customer_address' => 'Gresik',
            'items' => [['id' => $product->id, 'quantity' => 1]],
        ]);

        $orderNumber = $checkoutRes->json('order_number');
        $order = Order::where('order_number', $orderNumber)->first();
        $payment = $order->latestPayment;

        $webhookPayload = [
            'event' => 'payment.received',
            'data' => [
                'id' => $payment->payment_reference,
                'referenceId' => $orderNumber,
                'amount' => (int) $order->total,
                'status' => 'PAID',
            ],
        ];

        // First webhook call
        $res1 = $this->postJson('/payments/webhook', $webhookPayload);
        $res1->assertOk();

        $order->refresh();
        $this->assertEquals('Paid', $order->payment_status);
        $this->assertEquals('Dibayar', $order->order_status);

        // Second duplicate webhook call (idempotent)
        $res2 = $this->postJson('/payments/webhook', $webhookPayload);
        $res2->assertOk();
    }

    public function test_admin_dashboard_and_order_status_update(): void
    {
        $admin = User::first();
        $this->actingAs($admin);

        // Admin Dashboard
        $this->get('/admin/dashboard')->assertOk();
        $this->get('/admin/products')->assertOk();
        $this->get('/admin/categories')->assertOk();
        $this->get('/admin/orders')->assertOk();
        $this->get('/admin/customers')->assertOk();
        $this->get('/admin/service-requests')->assertOk();
        $this->get('/admin/banners')->assertOk();

        // Create an order and test status transition
        $order = Order::create([
            'order_number' => 'DDL-TEST-999',
            'customer_name' => 'Admin Tester',
            'customer_email' => 'admin.test@dodolan.store',
            'customer_phone' => '081234567890',
            'customer_address' => 'Surabaya',
            'subtotal' => 1000000,
            'total' => 1000000,
            'payment_status' => 'Paid',
            'order_status' => 'Dibayar',
        ]);

        $res = $this->patch("/admin/orders/{$order->id}/status", [
            'order_status' => 'Diproses',
        ]);
        $res->assertSessionHas('success');

        $order->refresh();
        $this->assertEquals('Diproses', $order->order_status);
    }
}
