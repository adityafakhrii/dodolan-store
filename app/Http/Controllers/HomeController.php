<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $banners = Banner::active()->ordered()->get();

        $featuredProducts = Product::with('category')
            ->active()
            ->latest()
            ->take(6)
            ->get();

        $categories = Category::active()
            ->withCount(['products' => function ($query) {
                $query->active();
            }])
            ->get();

        return Inertia::render('home', [
            'banners' => $banners,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }
}
