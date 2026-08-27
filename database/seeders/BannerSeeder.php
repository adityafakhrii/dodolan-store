<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'image' => '/assets/images/banners/banner-iot-solutions.svg',
                'title' => 'Solusi Cerdas IoT & Fleet Management Terpadu',
                'subtitle' => 'Tingkatkan efisiensi operasional armada, kurangi risiko kecelakaan, dan amankan aset bisnis dengan perangkat IoT bersertifikasi dan bergaransi resmi.',
                'cta_text' => 'Jelajahi Produk',
                'cta_url' => '/produk',
                'is_active' => true,
                'display_order' => 1,
            ],
            [
                'image' => '/assets/images/banners/banner-services.svg',
                'title' => 'Layanan Instalasi, Survey & Maintenance Nasional',
                'subtitle' => 'Didukung oleh tim teknisi bersertifikasi untuk instalasi perangkat GPS, MDVR, dan kamera armada langsung di lokasi Anda.',
                'cta_text' => 'Ajukan Layanan',
                'cta_url' => '/layanan',
                'is_active' => true,
                'display_order' => 2,
            ],
            [
                'image' => '/assets/images/banners/banner-ai-mdvr.svg',
                'title' => 'AI Dashcam & MDVR FleetGuard Generasi Baru',
                'subtitle' => 'Pantau perilaku pengemudi secara real-time dengan sensor AI ADAS dan Driver State Monitoring (DSM) untuk keselamatan maksimal.',
                'cta_text' => 'Lihat Katalog MDVR',
                'cta_url' => '/produk?category=mdvr',
                'is_active' => true,
                'display_order' => 3,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::updateOrCreate(['title' => $banner['title']], $banner);
        }
    }
}
