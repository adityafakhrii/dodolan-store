<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerPortalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_guest_is_redirected_when_accessing_checkout(): void
    {
        $response = $this->get('/checkout');
        $response->assertRedirect('/login');

        $postResponse = $this->postJson('/checkout', []);
        $postResponse->assertStatus(401);
    }

    public function test_authenticated_customer_can_access_checkout_with_prefilled_profile(): void
    {
        $user = User::factory()->create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'phone' => '081234567890',
            'address' => 'Jl. Gubeng No. 10, Surabaya',
            'is_admin' => false,
        ]);

        $response = $this->actingAs($user)->get('/checkout');
        $response->assertOk();
    }

    public function test_checkout_attaches_user_id_and_auto_updates_empty_profile_address(): void
    {
        $user = User::factory()->create([
            'phone' => null,
            'address' => null,
            'is_admin' => false,
        ]);

        $product = Product::first();

        $payload = [
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => '081987654321',
            'customer_address' => 'Jl. Rungkut Industri No. 20, Surabaya',
            'items' => [
                ['id' => $product->id, 'quantity' => 1],
            ],
        ];

        $response = $this->actingAs($user)->postJson('/checkout', $payload);
        $response->assertOk();

        $orderNumber = $response->json('order_number');

        $this->assertDatabaseHas('orders', [
            'order_number' => $orderNumber,
            'user_id' => $user->id,
            'customer_name' => $user->name,
        ]);

        // Verify user profile got updated with phone & address
        $user->refresh();
        $this->assertEquals('081987654321', $user->phone);
        $this->assertEquals('Jl. Rungkut Industri No. 20, Surabaya', $user->address);
    }

    public function test_customer_can_access_dashboard_and_view_stats(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        Order::create([
            'user_id' => $user->id,
            'order_number' => 'DDL-202608-TEST01',
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => '081234567890',
            'customer_address' => 'Surabaya',
            'subtotal' => 1000000,
            'total' => 1000000,
            'payment_status' => Order::PAYMENT_PENDING,
            'order_status' => Order::STATUS_PENDING_PAYMENT,
        ]);

        $response = $this->actingAs($user)->get('/akun/dashboard');
        $response->assertOk();
    }

    public function test_customer_can_view_orders_list(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'DDL-202608-TEST02',
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => '081234567890',
            'customer_address' => 'Surabaya',
            'subtotal' => 1500000,
            'total' => 1500000,
            'payment_status' => Order::PAYMENT_PAID,
            'order_status' => Order::STATUS_SHIPPED,
            'shipping_courier' => 'JNE',
            'tracking_number' => 'JNE123456789',
        ]);

        $response = $this->actingAs($user)->get('/akun/pesanan');
        $response->assertOk();
    }

    public function test_customer_can_view_own_order_detail_with_tracking_number(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'DDL-202608-TEST03',
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => '081234567890',
            'customer_address' => 'Surabaya',
            'subtotal' => 2000000,
            'total' => 2000000,
            'payment_status' => Order::PAYMENT_PAID,
            'order_status' => Order::STATUS_SHIPPED,
            'shipping_courier' => 'J&T Express',
            'tracking_number' => 'JT9988776655',
        ]);

        $response = $this->actingAs($user)->get("/akun/pesanan/{$order->order_number}");
        $response->assertOk();
    }

    public function test_customer_cannot_view_another_customer_order(): void
    {
        $customerA = User::factory()->create(['email' => 'customera@example.com', 'is_admin' => false]);
        $customerB = User::factory()->create(['email' => 'customerb@example.com', 'is_admin' => false]);

        $orderOfA = Order::create([
            'user_id' => $customerA->id,
            'order_number' => 'DDL-202608-PRIV01',
            'customer_name' => $customerA->name,
            'customer_email' => $customerA->email,
            'customer_phone' => '081234567890',
            'customer_address' => 'Surabaya',
            'subtotal' => 500000,
            'total' => 500000,
            'payment_status' => Order::PAYMENT_PENDING,
            'order_status' => Order::STATUS_PENDING_PAYMENT,
        ]);

        // Customer B tries to view Customer A's order
        $response = $this->actingAs($customerB)->get("/akun/pesanan/{$orderOfA->order_number}");
        $response->assertStatus(403);
    }

    public function test_customer_can_update_profile_and_default_address(): void
    {
        $user = User::factory()->create([
            'name' => 'Aditya R',
            'email' => 'aditya@example.com',
            'phone' => '0811111111',
            'address' => 'Alamat Lama',
            'is_admin' => false,
        ]);

        $payload = [
            'name' => 'Aditya Fakhri Riansyah',
            'email' => 'aditya@example.com',
            'phone' => '081234567890',
            'address' => 'Jl. Dharmahusada Indah No. 88, Surabaya, Jawa Timur',
        ];

        $response = $this->actingAs($user)->patch('/akun/profil', $payload);
        $response->assertSessionHas('success');

        $user->refresh();
        $this->assertEquals('Aditya Fakhri Riansyah', $user->name);
        $this->assertEquals('081234567890', $user->phone);
        $this->assertEquals('Jl. Dharmahusada Indah No. 88, Surabaya, Jawa Timur', $user->address);
    }

    public function test_customer_can_view_service_requests_history(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        ServiceRequest::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => '081234567890',
            'service_type' => 'Instalasi',
            'location' => 'Surabaya',
            'description' => 'Instalasi MDVR 5 unit',
            'status' => 'Baru',
        ]);

        $response = $this->actingAs($user)->get('/akun/layanan');
        $response->assertOk();
    }

    public function test_admin_can_update_order_status_with_courier_and_tracking_number(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $customer = User::factory()->create(['is_admin' => false]);

        $order = Order::create([
            'user_id' => $customer->id,
            'order_number' => 'DDL-202608-ADMIN01',
            'customer_name' => $customer->name,
            'customer_email' => $customer->email,
            'customer_phone' => '081234567890',
            'customer_address' => 'Surabaya',
            'subtotal' => 1000000,
            'total' => 1000000,
            'payment_status' => Order::PAYMENT_PAID,
            'order_status' => Order::STATUS_PROCESSING,
        ]);

        $response = $this->actingAs($admin)->patch("/admin/orders/{$order->id}/status", [
            'order_status' => Order::STATUS_SHIPPED,
            'shipping_courier' => 'SiCepat Cargo',
            'tracking_number' => 'SC123456789ID',
        ]);

        $response->assertSessionHas('success');

        $order->refresh();
        $this->assertEquals(Order::STATUS_SHIPPED, $order->order_status);
        $this->assertEquals('SiCepat Cargo', $order->shipping_courier);
        $this->assertEquals('SC123456789ID', $order->tracking_number);
    }
}
