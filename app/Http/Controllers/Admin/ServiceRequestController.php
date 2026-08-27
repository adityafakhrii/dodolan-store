<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ServiceRequest::query();

        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($type = $request->input('service_type')) {
            $query->where('service_type', $type);
        }

        $requests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/service-requests/index', [
            'requests' => $requests,
            'filters' => [
                'q' => $request->input('q', ''),
                'status' => $request->input('status', ''),
                'service_type' => $request->input('service_type', ''),
            ],
        ]);
    }

    public function updateStatus(Request $request, ServiceRequest $serviceRequest): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Baru,Diproses,Selesai'],
        ]);

        $serviceRequest->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', "Status pengajuan layanan berhasil diubah menjadi '{$validated['status']}'.");
    }

    public function destroy(ServiceRequest $serviceRequest): RedirectResponse
    {
        $serviceRequest->delete();
        return back()->with('success', 'Pengajuan layanan berhasil dihapus.');
    }
}
