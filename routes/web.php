<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ServiceRequestController as AdminServiceRequestController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProductCatalogController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Store & Company Profile Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/tentang-kami', [AboutController::class, 'index'])->name('about');
Route::get('/produk', [ProductCatalogController::class, 'index'])->name('products.index');
Route::get('/produk/{slug}', [ProductCatalogController::class, 'show'])->name('products.show');
Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio');
Route::get('/kontak', [ContactController::class, 'index'])->name('contact');

// Services & Requests (Throttled to 10 submissions per minute)
Route::get('/layanan', [ServiceRequestController::class, 'index'])->name('services.index');
Route::post('/layanan', [ServiceRequestController::class, 'store'])->middleware('throttle:10,1')->name('services.store');

// Shopping Cart & Checkout (Throttled to 10 checkouts per minute)
Route::get('/keranjang', fn () => Inertia::render('cart'))->name('cart.index');
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('throttle:10,1')->name('checkout.store');

// Payment Gateway & Status
Route::get('/pembayaran/{orderNumber}', [PaymentController::class, 'show'])->name('payment.show');
Route::post('/pembayaran/{orderNumber}/simulate-success', [PaymentController::class, 'simulateSuccess'])->name('payment.simulate');
Route::post('/payments/webhook', [PaymentController::class, 'webhook'])
    ->middleware('throttle:60,1')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class])
    ->name('payment.webhook');

/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Strict Admin Authorization)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', EnsureUserIsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/', fn () => redirect()->route('admin.dashboard'));

    // Products Management
    Route::resource('products', AdminProductController::class);

    // Categories Management
    Route::resource('categories', AdminCategoryController::class)->except(['create', 'show', 'edit']);

    // Orders Management
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');

    // Customer Directory
    Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');

    // Service Requests Management
    Route::get('/service-requests', [AdminServiceRequestController::class, 'index'])->name('service-requests.index');
    Route::patch('/service-requests/{serviceRequest}/status', [AdminServiceRequestController::class, 'updateStatus'])->name('service-requests.update-status');
    Route::delete('/service-requests/{serviceRequest}', [AdminServiceRequestController::class, 'destroy'])->name('service-requests.destroy');

    // Banners Management
    Route::resource('banners', AdminBannerController::class)->except(['create', 'show', 'edit']);
});

// Default dashboard redirect: admins to admin dashboard, regular users to homepage
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        if ($request->user()?->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('home');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
