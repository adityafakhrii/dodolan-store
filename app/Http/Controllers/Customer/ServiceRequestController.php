<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = ServiceRequest::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
                ->orWhere('email', $user->email);
        });

        if ($type = $request->input('type')) {
            $query->where('service_type', $type);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $serviceRequests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('customer/services/index', [
            'serviceRequests' => $serviceRequests,
            'filters' => [
                'type' => $request->input('type', ''),
                'status' => $request->input('status', ''),
            ],
        ]);
    }
}
