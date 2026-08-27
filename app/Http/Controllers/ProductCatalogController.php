<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductCatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category')->active();

        // Search by keyword
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Stock status filter
        if ($request->input('stock') === 'in_stock') {
            $query->inStock();
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'latest':
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(9)->withQueryString();

        $categories = Category::active()
            ->withCount(['products' => function ($q) {
                $q->active();
            }])
            ->get();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'q' => $request->input('q', ''),
                'category' => $request->input('category', ''),
                'stock' => $request->input('stock', ''),
                'sort' => $sort,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::with(['category', 'images'])
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        // Decode specification if it is JSON string
        $specs = $product->specification;
        if (is_string($specs)) {
            $decoded = json_decode($specs, true);
            $specs = is_array($decoded) ? $decoded : ['Detail' => $specs];
        }

        $relatedProducts = Product::with('category')
            ->active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return Inertia::render('products/show', [
            'product' => $product,
            'specification' => $specs,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
