<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminSettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_access_settings_page(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/settings');
        $response->assertOk();
    }

    public function test_regular_customer_cannot_access_admin_settings(): void
    {
        $customer = User::factory()->create([
            'is_admin' => false,
        ]);

        $response = $this->actingAs($customer)->get('/admin/settings');
        $response->assertForbidden();
    }

    public function test_admin_can_update_profile(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->patch('/admin/settings/profile', [
            'name' => 'Super Admin Baru',
            'email' => 'admin.baru@dodolan.store',
            'phone' => '081299998888',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
            'name' => 'Super Admin Baru',
            'email' => 'admin.baru@dodolan.store',
            'phone' => '081299998888',
        ]);
    }

    public function test_admin_can_update_password(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
            'password' => Hash::make('OldPassword123!'),
        ]);

        $response = $this->actingAs($admin)->put('/admin/settings/password', [
            'current_password' => 'OldPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertRedirect();
        $admin->refresh();
        $this->assertTrue(Hash::check('NewPassword123!', $admin->password));
    }
}
