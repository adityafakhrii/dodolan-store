<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Synchronize and validate cart items against the latest database prices and stocks.
     */
    public function sync(Request $request): JsonResponse
    {
        $ids = [];

        if ($request->filled('ids')) {
            // Support comma-separated IDs from GET query: ?ids=1,2,3
            $ids = array_filter(array_map('intval', explode(',', (string) $request->query('ids'))));
        } elseif ($request->has('items') && is_array($request->input('items'))) {
            // Support JSON array: items: [{ id: 1 }, { id: 2 }]
            $ids = array_filter(array_map('intval', array_column($request->input('items'), 'id')));
        }

        if (empty($ids)) {
            return response()->json(['items' => []]);
        }

        // Fetch all requested products in a single query
        $products = Product::whereIn('id', $ids)->get();

        $data = $products->map(function (Product $product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
                'status' => (bool) $product->status,
                'image_url' => $product->image_url,
            ];
        });

        return response()->json([
            'success' => true,
            'items' => $data,
        ]);
    }
}
