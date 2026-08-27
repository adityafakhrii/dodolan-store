<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $gpsCat = Category::where('slug', 'gps-tracking')->first();
        $mdvrCat = Category::where('slug', 'mdvr')->first();
        $dashcamCat = Category::where('slug', 'dashcam')->first();
        $cctvCat = Category::where('slug', 'cctv')->first();
        $batteryCat = Category::where('slug', 'battery')->first();
        $accCat = Category::where('slug', 'accessories')->first();

        $products = [
            [
                'category_id' => $gpsCat?->id,
                'name' => 'Dodolan GPS Tracker Pro Fleet (GT-400)',
                'slug' => 'dodolan-gps-tracker-pro-fleet-gt-400',
                'price' => 1450000,
                'stock' => 25,
                'description' => 'Perangkat pelacak armada tingkat lanjut dengan modul 4G LTE, antena internal sensitivitas tinggi, sensor akselerometer 3-axis, dan fitur engine cut-off jarak jauh. Cocok untuk manajemen armada truk, ekspedisi, dan kendaraan operasional perusahaan.',
                'specification' => json_encode([
                    'Jaringan' => '4G LTE-FDD / Cat.1 & 2G GSM',
                    'Akurasi Posisi' => '< 2.5 meter CEP',
                    'Tegangan Operasional' => '9V - 90V DC',
                    'Baterai Cadangan' => '300mAh Li-Po rechargeable',
                    'Fitur Sensor' => 'Ignition detection, Remote Cut-off, Ovespeed alert, Geofence',
                    'Dimensi' => '82 x 42 x 16 mm',
                    'Sertifikasi' => 'IP65 Water & Dust Resistant, Postel SDPPI',
                ]),
                'image' => '/assets/images/products/gt-400.svg',
                'status' => true,
            ],
            [
                'category_id' => $gpsCat?->id,
                'name' => 'Dodolan OBD-II Plug & Play Tracker (OBD-20)',
                'slug' => 'dodolan-obd-ii-plug-and-play-tracker-obd-20',
                'price' => 850000,
                'stock' => 40,
                'description' => 'GPS Tracker plug-and-play yang dapat langsung dipasang pada port OBD-II kendaraan tanpa memotong kabel. Mampu membaca data diagnostik ECU dasar dan lokasi real-time.',
                'specification' => json_encode([
                    'Antarmuka' => 'Standard 16-Pin OBD-II Port',
                    'Jaringan' => '4G LTE / GSM',
                    'Sensitivitas GPS' => '-165 dBm',
                    'Tegangan Operasional' => '12V / 24V DC',
                    'Fitur Tambahan' => 'Plug-out alarm, Towing alert, Driving behavior analysis',
                    'Berat' => '65 gram',
                ]),
                'image' => '/assets/images/products/obd-20.svg',
                'status' => true,
            ],
            [
                'category_id' => $mdvrCat?->id,
                'name' => 'Dodolan 4-Channel AI MDVR FleetGuard (MD-404)',
                'slug' => 'dodolan-4-channel-ai-mdvr-fleetguard-md-404',
                'price' => 4850000,
                'stock' => 12,
                'description' => 'Sistem perekam video bergerak 4-channel dengan dukungan prosesor AI terintegrasi untuk mendeteksi kelelahan pengemudi (DSM), peringatan tabrakan depan (ADAS), dan live streaming 4G langsung ke pusat kontrol.',
                'specification' => json_encode([
                    'Channel Video' => '4 Channel AHD 1080P Full HD',
                    'AI Analytics' => 'ADAS (Lane Departure, Forward Collision) & DSM (Mengantuk, Merokok, Main HP)',
                    'Penyimpanan' => 'Dual SD Card slot up to 512GB (Total 1TB)',
                    'Konektivitas' => '4G LTE, GPS/GLONASS, Wi-Fi 2.4GHz',
                    'Audio' => 'Interkom 2 arah (Two-way audio built-in)',
                    'Tegangan Input' => '8V - 36V DC dengan proteksi lonjakan arus',
                    'Suhu Operasional' => '-20°C hingga +70°C',
                ]),
                'image' => '/assets/images/products/md-404.svg',
                'status' => true,
            ],
            [
                'category_id' => $mdvrCat?->id,
                'name' => 'Dodolan 8-Channel Mobile NVR Ultra (MN-808)',
                'slug' => 'dodolan-8-channel-mobile-nvr-ultra-mn-808',
                'price' => 7950000,
                'stock' => 5,
                'description' => 'NVR kelas industri untuk armada bus besar dan kereta api dengan 8 port PoE kamera IP, storage HDD/SSD 2.5 inch tahan getaran, dan kemampuan pemantauan simultan.',
                'specification' => json_encode([
                    'Channel Video' => '8 Channel IP Camera via PoE (Power over Ethernet)',
                    'Resolusi Perekaman' => 'H.265 / H.264 up to 4K Ultra HD',
                    'Penyimpanan' => '1x 2.5" SSD/HDD up to 4TB + 1x SD Card 256GB',
                    'Anti-Shock' => 'Military standard MIL-STD-810G anti-vibration damping',
                    'Jaringan' => 'Dual SIM 4G/5G Ready, Gigabit Ethernet, GPS/Beidou',
                    'Output' => 'VGA, HDMI, CVBS',
                ]),
                'image' => '/assets/images/products/mn-808.svg',
                'status' => true,
            ],
            [
                'category_id' => $dashcamCat?->id,
                'name' => 'Dodolan Dual-Lens 4G Live Dashcam (DC-200)',
                'slug' => 'dodolan-dual-lens-4g-live-dashcam-dc-200',
                'price' => 2250000,
                'stock' => 18,
                'description' => 'Kamera dashboard cerdas dengan dua lensa (lensa depan 1080P jalan raya dan lensa kabin inframerah malam). Dilengkapi GPS built-in, hotspot Wi-Fi kabin, dan tombol SOS darurat.',
                'specification' => json_encode([
                    'Kamera Depan' => '1080P @30fps, 140° Wide Angle Glass Lens',
                    'Kamera Kabin' => '720P @30fps dengan IR Night Vision (merekam kabin gelap total)',
                    'Jaringan' => '4G Micro SIM Card slot',
                    'Fitur Cerdas' => 'G-Sensor auto lock video, Parking Surveillance, Remote Live View',
                    'Penyimpanan' => 'MicroSD up to 128GB (Class 10 U3)',
                    'Aplikasi' => 'Support Dodolan Cloud Web & Mobile Client',
                ]),
                'image' => '/assets/images/products/dc-200.svg',
                'status' => true,
            ],
            [
                'category_id' => $cctvCat?->id,
                'name' => 'Dodolan Smart PTZ Dome CCTV 4MP (CC-400)',
                'slug' => 'dodolan-smart-ptz-dome-cctv-4mp-cc-400',
                'price' => 1750000,
                'stock' => 30,
                'description' => 'Kamera pengawas putar 360 derajat dengan resolusi 4MP Super HD, smart human & vehicle tracking, lampu sorot peringatan LED, dan sirine pencegah penyusup.',
                'specification' => json_encode([
                    'Resolusi' => '4MP (2560 x 1440) @25fps',
                    'Pan & Tilt' => 'Pan 355°, Tilt 90° dengan kecepatan putar fleksibel',
                    'Jarak Night Vision' => 'Color Night Vision hingga 30 meter',
                    'Audio' => 'Mic & Speaker built-in (Two-way Talk)',
                    'Proteksi Cuaca' => 'IP66 Weatherproof outdoor ready',
                    'Daya' => '12V DC / PoE Standard 802.3af',
                ]),
                'image' => '/assets/images/products/cc-400.svg',
                'status' => true,
            ],
            [
                'category_id' => $cctvCat?->id,
                'name' => 'Dodolan Industrial Bullet CCTV AI (CC-800)',
                'slug' => 'dodolan-industrial-bullet-cctv-ai-cc-800',
                'price' => 2800000,
                'stock' => 15,
                'description' => 'Kamera bullet outdoor industrial grade dengan sensor Sony Starvis, casing logam tebal anti korosi, dan analitik AI pengenalan plat nomor kendaraan (LPR / ANPR).',
                'specification' => json_encode([
                    'Sensor' => '1/2.8" Sony STARVIS Progressive Scan CMOS',
                    'Resolusi' => '5MP @30fps Ultra High Definition',
                    'Fitur AI' => 'License Plate Recognition (LPR), Perimeter Intrusion, Line Crossing',
                    'Housing' => 'All-Metal Vandal-Proof IK10, IP67 Waterproof',
                    'Lensa' => '2.8 - 12mm Motorized Varifocal Lens (4x Optical Zoom)',
                ]),
                'image' => '/assets/images/products/cc-800.svg',
                'status' => true,
            ],
            [
                'category_id' => $batteryCat?->id,
                'name' => 'Dodolan LiFePO4 IoT Backup Battery 12V 50Ah (BT-1250)',
                'slug' => 'dodolan-lifepo4-iot-backup-battery-12v-50ah-bt-1250',
                'price' => 3650000,
                'stock' => 8,
                'description' => 'Baterai lithium ferofosfat berdensitas energi tinggi dengan BMS (Battery Management System) cerdas terintegrasi. Dirancang untuk catu daya cadangan BTS, pos pantau CCTV remote, dan sistem armada berat.',
                'specification' => json_encode([
                    'Kapasitas' => '12.8V / 50Ah (640Wh)',
                    'Siklus Hidup (Cycle Life)' => '> 3500 cycles @ 80% DoD',
                    'Smart BMS' => 'Overcharge, Overdischarge, Short Circuit, and Temperature Protection',
                    'Komunikasi Data' => 'RS485 / CANBUS telemetry ready',
                    'Berat' => '5.8 kg (60% lebih ringan dari aki timbal)',
                    'Suhu Kerja' => 'Charge: 0°C ~ 50°C, Discharge: -20°C ~ 60°C',
                ]),
                'image' => '/assets/images/products/bt-1250.svg',
                'status' => true,
            ],
            [
                'category_id' => $accCat?->id,
                'name' => 'Dodolan Ultrasonic Fuel Level Sensor (FS-100)',
                'slug' => 'dodolan-ultrasonic-fuel-level-sensor-fs-100',
                'price' => 1950000,
                'stock' => 20,
                'description' => 'Sensor level bahan bakar nirkontak berbasis gelombang ultrasonik yang dipasang di bagian luar bawah tangki solar/bensin tanpa perlu melubangi tangki kendaraan.',
                'specification' => json_encode([
                    'Metode Pengukuran' => 'Non-invasive Ultrasonic Reflection',
                    'Ketebalan Tangki' => 'Hingga 8mm (Besi, Aluminium, Plastik)',
                    'Tinggi Tangki Ukur' => '5cm - 100cm',
                    'Output Sinyal' => 'RS232 / RS485 / 0-5V Analog',
                    'Akurasi' => 'Toleransi kesalahan < 1%',
                    'Proteksi' => 'IP68 Submersible Waterproof',
                ]),
                'image' => '/assets/images/products/fs-100.svg',
                'status' => true,
            ],
            [
                'category_id' => $accCat?->id,
                'name' => 'Dodolan Wireless BLE Temperature & Humidity Sensor (TH-01)',
                'slug' => 'dodolan-wireless-ble-temperature-and-humidity-sensor-th-01',
                'price' => 650000,
                'stock' => 50,
                'description' => 'Sensor suhu dan kelembaban wireless Bluetooth Low Energy (BLE 5.0) untuk pemantauan rantai dingin (cold-chain), truk logistik pendingin (reefer), dan gudang penyimpanan farmasi.',
                'specification' => json_encode([
                    'Konektivitas' => 'Bluetooth Low Energy 5.0 (Jangkauan hingga 100 meter line-of-sight)',
                    'Rentang Suhu' => '-40°C hingga +85°C (Akurasi ±0.3°C)',
                    'Rentang Kelembaban' => '0% - 100% RH (Akurasi ±3% RH)',
                    'Baterai' => 'CR2477 Coin Cell (Daya tahan baterai hingga 3 tahun)',
                    'Proteksi' => 'IP67 Dust & Splash Resistant',
                    'Dimensi' => '50 x 50 x 15 mm',
                ]),
                'image' => '/assets/images/products/th-01.svg',
                'status' => true,
            ],
        ];

        foreach ($products as $p) {
            Product::updateOrCreate(['slug' => $p['slug']], $p);
        }
    }
}
