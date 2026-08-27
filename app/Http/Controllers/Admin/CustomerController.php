<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::select(
            'customer_email',
            DB::raw('MAX(customer_name) as customer_name'),
            DB::raw('MAX(customer_phone) as customer_phone'),
            DB::raw('MAX(customer_address) as customer_address'),
            DB::raw('COUNT(id) as total_orders'),
            DB::raw("SUM(CASE WHEN payment_status = 'Paid' THEN total ELSE 0 END) as total_spent"),
            DB::raw('MAX(created_at) as last_order_at')
        )->groupBy('customer_email');

        if ($search = $request->input('q')) {
            $query->havingRaw('customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?', [
                "%{$search}%",
                "%{$search}%",
                "%{$search}%",
            ]);
        }

        $customers = $query->orderByDesc('last_order_at')->paginate(10)->withQueryString();

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => [
                'q' => $request->input('q', ''),
            ],
        ]);
    }
}
