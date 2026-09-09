<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartSyncTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_cart_sync_returns_latest_prices_and_stocks_via_get(): void
    {
        $product = Product::first();
        $product->update([
            'price' => 1000,
            'stock' => 15,
        ]);

        $response = $this->getJson('/keranjang/sync?ids='.$product->id);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'items' => [
                    [
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => 1000,
                        'stock' => 15,
                        'status' => true,
                    ],
                ],
            ]);
    }

    public function test_cart_sync_returns_empty_when_no_ids_provided(): void
    {
        $response = $this->getJson('/keranjang/sync');

        $response->assertOk()
            ->assertJson([
                'items' => [],
            ]);
    }

    public function test_cart_sync_works_via_post(): void
    {
        $product = Product::first();

        $response = $this->postJson('/keranjang/sync', [
            'items' => [
                ['id' => $product->id, 'quantity' => 2],
            ],
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'items' => [
                    '*' => ['id', 'name', 'price', 'stock', 'status'],
                ],
            ]);
    }
}
