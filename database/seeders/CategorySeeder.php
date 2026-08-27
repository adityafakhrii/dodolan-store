<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'GPS Tracking',
                'slug' => 'gps-tracking',
                'description' => 'Perangkat pelacak posisi armada, kendaraan komersial, dan aset logistik dengan akurasi tinggi dan transmisi data real-time.',
                'status' => true,
            ],
            [
                'name' => 'MDVR',
                'slug' => 'mdvr',
                'description' => 'Mobile Digital Video Recorder khusus armada transportasi dan industri dengan fitur AI ADAS & DSM Driver Monitoring.',
                'status' => true,
            ],
            [
                'name' => 'Dashcam',
                'slug' => 'dashcam',
                'description' => 'Kamera dashboard dual-lens dengan perekaman Full HD, konektivitas 4G/Cloud, dan pemantauan kabin secara langsung.',
                'status' => true,
            ],
            [
                'name' => 'CCTV',
                'slug' => 'cctv',
                'description' => 'Kamera pengawas pintar untuk area industri, pergudangan, dan perkantoran dengan sensor presisi tinggi dan akses remote.',
                'status' => true,
            ],
            [
                'name' => 'Battery & BESS',
                'slug' => 'battery',
                'description' => 'Sistem penyimpanan energi dan baterai lithium LiFePO4 tahan lama untuk perangkat IoT dan cadangan daya operasional.',
                'status' => true,
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Sensor level bahan bakar ultrasonik, sensor suhu wireless BLE, kabel harness, dan komponen pendukung IoT.',
                'status' => true,
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
