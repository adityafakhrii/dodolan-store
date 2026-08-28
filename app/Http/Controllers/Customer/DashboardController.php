<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $ordersQuery = Order::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('customer_email', $user->email);
        });

        $stats = [
            'total_orders' => (clone $ordersQuery)->count(),
            'pending_payment' => (clone $ordersQuery)->where('order_status', Order::STATUS_PENDING_PAYMENT)->count(),
            'processing' => (clone $ordersQuery)->where('order_status', Order::STATUS_PROCESSING)->count(),
            'shipped' => (clone $ordersQuery)->where('order_status', Order::STATUS_SHIPPED)->count(),
            'completed' => (clone $ordersQuery)->where('order_status', Order::STATUS_COMPLETED)->count(),
        ];

        $recentOrders = (clone $ordersQuery)
            ->with(['items', 'latestPayment'])
            ->latest()
            ->take(5)
            ->get();

        $recentServices = ServiceRequest::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('email', $user->email);
        })
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('customer/dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentServices' => $recentServices,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
            ],
        ]);
    }
}
