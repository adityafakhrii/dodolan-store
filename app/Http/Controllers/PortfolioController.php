<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function index(): Response
    {
        $projects = [
            [
                'id' => 1,
                'title' => 'Instalasi AI MDVR 4-Channel pada 45 Armada Bus AKAP',
                'client' => 'PT Trans Nusantara Logistics',
                'category' => 'MDVR & Fleet Safety',
                'year' => '2026',
                'description' => 'Pemasangan unit AI MDVR lengkap dengan kamera DSM (Driver State Monitoring) dan ADAS pada 45 unit bus antarkota untuk monitoring perilaku berkendara dan keamanan penumpang secara real-time.',
                'results' => 'Menurunkan insiden kelelahan driver sebesar 78% dan integrasi video streaming ke command center.',
                'image' => '/assets/images/products/md-404.svg',
            ],
            [
                'id' => 2,
                'title' => 'Implementasi GPS Fleet Tracking & Sensor BBM untuk 80 Truk Tambang',
                'client' => 'PT Borneo Energi Minerals',
                'category' => 'GPS & Fuel Telemetry',
                'year' => '2025',
                'description' => 'Pemasangan GPS Tracker heavy-duty bersertifikasi IP67 dan sensor bahan bakar ultrasonik non-intrusif pada tangki 300L truk tambang untuk pencegahan manipulasi solar.',
                'results' => 'Efisiensi konsumsi bahan bakar hingga 18% dan transparansi rute operasional tambang.',
                'image' => '/assets/images/products/fs-100.svg',
            ],
            [
                'id' => 3,
                'title' => 'Cold-Chain Monitoring BLE IoT pada 25 Truk Distribusi Farmasi',
                'client' => 'PT Medika Logistik Prima',
                'category' => 'Cold-Chain IoT',
                'year' => '2026',
                'description' => 'Penerapan sensor suhu dan kelembaban wireless BLE 5.0 dengan logger cloud otomatis pada armada truk reefer pendingin untuk memastikan kepatuhan standar GDP (Good Distribution Practice).',
                'results' => 'Audit temperatur 100% terekam otomatis dengan alert notifikasi instan jika suhu kabin berubah.',
                'image' => '/assets/images/products/th-01.svg',
            ],
            [
                'id' => 4,
                'title' => 'Sistem CCTV AI Industri & Remote Guarding Gudang Terpadu 10.000m²',
                'client' => 'PT Mega Pergudangan Sentosa',
                'category' => 'Industrial CCTV & AI',
                'year' => '2025',
                'description' => 'Pemasangan 32 titik kamera CCTV bullet AI 5MP dengan pengenalan plat nomor (LPR) dan perimeter intrusion detection yang terhubung ke jaringan fiber optic.',
                'results' => 'Otomatisasi pencatatan keluar-masuk kendaraan logistik dan proteksi area perimeter 24/7.',
                'image' => '/assets/images/products/cc-800.svg',
            ],
        ];

        return Inertia::render('portfolio', [
            'projects' => $projects,
        ]);
    }
}
