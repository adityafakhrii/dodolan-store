<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_non_admin_users_are_forbidden_from_admin_dashboard()
    {
        $user = User::factory()->create(['is_admin' => false]);
        $this->actingAs($user);

        $response = $this->get(route('admin.dashboard'));
        $response->assertForbidden();

        $dashboardResponse = $this->get(route('dashboard'));
        $dashboardResponse->assertRedirect(route('customer.dashboard'));
    }

    public function test_admin_users_can_visit_the_dashboard()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin);

        $response = $this->get(route('admin.dashboard'));
        $response->assertOk();

        $dashboardResponse = $this->get(route('dashboard'));
        $dashboardResponse->assertRedirect(route('admin.dashboard'));
    }
}
