<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ServiceRequest;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $kpi = [
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('payment_status', Order::PAYMENT_PENDING)->count(),
            'paid_orders' => Order::where('payment_status', Order::PAYMENT_PAID)->count(),
            'total_customers' => Order::distinct('customer_email')->count('customer_email'),
            'new_service_requests' => ServiceRequest::where('status', ServiceRequest::STATUS_NEW)->count(),
            'total_revenue' => Order::where('payment_status', Order::PAYMENT_PAID)->sum('total'),
        ];

        $recentOrders = Order::with('items')->latest()->take(5)->get();
        $recentServiceRequests = ServiceRequest::latest()->take(5)->get();

        return Inertia::render('admin/dashboard', [
            'kpi' => $kpi,
            'recentOrders' => $recentOrders,
            'recentServiceRequests' => $recentServiceRequests,
        ]);
    }
}
