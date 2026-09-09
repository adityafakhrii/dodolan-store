<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Services\MayarService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutPaymentFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_csrf_token_endpoint_returns_valid_token(): void
    {
        $response = $this->getJson('/csrf-token');

        $response->assertOk()
            ->assertJsonStructure(['token']);

        $this->assertNotEmpty($response->json('token'));
    }

    public function test_orders_show_route_is_accessible_at_pesanan_slug(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'DDL-202609-FLOW01',
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => '081234567890',
            'customer_address' => 'Surabaya',
            'subtotal' => 1500000,
            'total' => 1500000,
            'payment_status' => Order::PAYMENT_PENDING,
            'order_status' => Order::STATUS_PENDING_PAYMENT,
        ]);

        // Verify route('orders.show') generates correct path
        $expectedUrl = route('orders.show', ['orderNumber' => $order->order_number]);
        $this->assertStringContainsString('/pesanan/'.$order->order_number, $expectedUrl);

        // Access via /pesanan/{orderNumber}
        $response = $this->actingAs($user)->get("/pesanan/{$order->order_number}");
        $response->assertOk();
    }

    public function test_another_customer_cannot_access_pesanan_slug(): void
    {
        $userA = User::factory()->create(['email' => 'user_a@example.com', 'is_admin' => false]);
        $userB = User::factory()->create(['email' => 'user_b@example.com', 'is_admin' => false]);

        $orderOfA = Order::create([
            'user_id' => $userA->id,
            'order_number' => 'DDL-202609-FLOW02',
            'customer_name' => $userA->name,
            'customer_email' => $userA->email,
            'customer_phone' => '081234567890',
            'customer_address' => 'Surabaya',
            'subtotal' => 500000,
            'total' => 500000,
            'payment_status' => Order::PAYMENT_PENDING,
            'order_status' => Order::STATUS_PENDING_PAYMENT,
        ]);

        $response = $this->actingAs($userB)->get("/pesanan/{$orderOfA->order_number}");
        $response->assertStatus(403);
    }

    public function test_checkout_creates_order_and_returns_order_number_and_redirect_url(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $product = Product::first();

        $payload = [
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => '081234567890',
            'customer_address' => 'Jl. Pemuda No. 1, Surabaya',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ];

        $response = $this->actingAs($user)->postJson('/checkout', $payload);

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'order_number',
                'redirect_url',
            ]);

        $orderNumber = $response->json('order_number');
        $this->assertDatabaseHas('orders', [
            'order_number' => $orderNumber,
            'payment_status' => Order::PAYMENT_PENDING,
        ]);
    }

    public function test_order_show_actively_syncs_status_with_mayar_if_paid(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'DDL-202609-FLOW03',
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => '081234567890',
            'customer_address' => 'Surabaya',
            'subtotal' => 1000000,
            'total' => 1000000,
            'payment_status' => Order::PAYMENT_PENDING,
            'order_status' => Order::STATUS_PENDING_PAYMENT,
        ]);

        Payment::create([
            'order_id' => $order->id,
            'provider' => 'mayar',
            'provider_reference' => 'inv_test123',
            'payment_reference' => 'inv_test123',
            'amount' => 1000000,
            'method' => 'Mayar Gateway',
            'status' => Payment::STATUS_PENDING,
        ]);

        // Mock MayarService to return 'paid'
        $mockMayar = $this->mock(MayarService::class);
        $mockMayar->shouldReceive('checkInvoiceStatus')
            ->with('inv_test123')
            ->once()
            ->andReturn('paid');

        $response = $this->actingAs($user)->get("/pesanan/{$order->order_number}");
        $response->assertOk();

        // Verify order status is automatically updated to Paid
        $order->refresh();
        $this->assertEquals(Order::PAYMENT_PAID, $order->payment_status);
        $this->assertEquals(Order::STATUS_PAID, $order->order_status);
        $this->assertEquals(Payment::STATUS_PAID, $order->latestPayment->status);
    }

    public function test_forgot_password_sends_email_without_connection_refused_error(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertSessionHas('status');
    }
}
