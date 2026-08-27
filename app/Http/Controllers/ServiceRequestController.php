<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceRequestController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('services/index', [
            'selectedType' => $request->input('type', 'Instalasi'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'service_type' => ['required', 'string', 'in:Instalasi,Survey,Maintenance'],
            'location' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string', 'max:2000'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        ServiceRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'service_type' => $validated['service_type'],
            'location' => $validated['location'],
            'description' => $validated['description'],
            'note' => $validated['note'] ?? null,
            'status' => ServiceRequest::STATUS_NEW,
        ]);

        return back()->with('success', 'Permintaan layanan Anda berhasil diajukan. Tim teknisi Dodolan akan segera menghubungi Anda.');
    }
}
