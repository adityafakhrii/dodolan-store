import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { PublicLayout } from '@/layouts/public-layout';
import { ProductCard } from '@/components/product-card';
import { 
    ChevronRight, 
    ChevronLeft, 
    ShieldCheck, 
    Cpu, 
    Radio, 
    Camera, 
    BatteryCharging, 
    Gauge, 
    Wrench, 
    Search, 
    Activity, 
    PhoneCall, 
    Layers, 
    ArrowRight,
    Truck,
    Headphones,
    Award,
    Sparkles,
    Flame
} from 'lucide-react';
import { formatRupiah, getWhatsAppLink } from '@/lib/format';

interface Banner {
    id: number;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_url: string;
    image_url: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    products_count: number;
}

interface HomeProps {
    banners: Banner[];
    featuredProducts: any[];
    categories: Category[];
}

export default function Home({ banners, featuredProducts, categories }: HomeProps) {
    const [currentBanner, setCurrentBanner] = useState(0);

    // Flash sale countdown timer state
    const [timeLeft, setTimeLeft] = useState({
        days: 3,
        hours: 14,
        minutes: 28,
        seconds: 45,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Auto-advance hero banner
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const activeBanner = banners[currentBanner] || {
        title: 'Solusi Cerdas IoT & Fleet Management Terpadu',
        subtitle: 'Tingkatkan efisiensi armada dan amankan aset bisnis dengan teknologi telemetri andal.',
        cta_text: 'Jelajahi Produk',
        cta_url: '/produk',
        image_url: '/assets/images/banners/banner-1.svg',
    };

    // Helper to get category icon
    const getCategoryIcon = (slug: string) => {
        switch (slug) {
            case 'gps-tracker':
                return Radio;
            case 'ai-mdvr-camera':
                return Cpu;
            case 'dashcam-fleet':
                return Camera;
            case 'cctv-industrial':
                return Activity;
            case 'iot-sensors':
                return Gauge;
            case 'bess-power':
                return BatteryCharging;
            default:
                return Layers;
        }
    };

    const flashSaleProducts = featuredProducts.slice(0, 4);
    const bestSellingProducts = featuredProducts.slice(2, 6);
    const exploreProducts = featuredProducts;

    return (
        <PublicLayout>
            <Head title="Dodolan Store — Penyedia Produk IoT, GPS Tracking & AI MDVR Fleet" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 py-6 sm:py-8">

                {/* =========================================================================
                    HERO SECTION: Sidebar Categories + Hero Carousel (Exclusive Reference Style)
                ========================================================================== */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Category Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 pr-6 border-r border-slate-200 dark:border-slate-800">
                        <div className="space-y-1">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/produk?category=${cat.slug}`}
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 transition group"
                                >
                                    <span>{cat.name}</span>
                                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                                </Link>
                            ))}
                            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href="/layanan"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                                >
                                    <span>Layanan Survey &amp; Instalasi</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right: Hero Carousel */}
                    <div className="lg:col-span-9">
                        <div className="relative min-h-[380px] sm:min-h-[420px] rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 text-white shadow-xl overflow-hidden flex flex-col justify-between border border-slate-800">
                            {/* Background Image / Graphic */}
                            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-30 sm:opacity-90 pointer-events-none flex items-center justify-end pr-4">
                                <img
                                    src={activeBanner.image_url}
                                    alt={activeBanner.title}
                                    className="h-72 w-auto object-contain transition-all duration-700 animate-in fade-in"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 max-w-lg space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>Enterprise IoT &amp; Telematics Hardware</span>
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                                    {activeBanner.title}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                                    {activeBanner.subtitle}
                                </p>
                                <div className="pt-2 flex flex-wrap items-center gap-3">
                                    <Link
                                        href={activeBanner.cta_url || '/produk'}
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition active:scale-95"
                                    >
                                        <span>{activeBanner.cta_text || 'Jelajahi Produk'}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                    <Link
                                        href="/layanan"
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                                    >
                                        <Wrench className="h-3.5 w-3.5 text-emerald-400" />
                                        <span>Ajukan Instalasi</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Carousel Indicators & Arrows */}
                            <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800/60 mt-6">
                                <div className="flex items-center gap-2">
                                    {banners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentBanner(idx)}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                currentBanner === idx ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-600'
                                            }`}
                                            aria-label={`Slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 1: Flash Sales / Promo Hari Ini (with Countdown Timer)
                ========================================================================== */}
                <section className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-2">
                            {/* Section Pill Label */}
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-4 rounded-xs bg-rose-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500">
                                    Promo Terbatas
                                </span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-6">
                                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Flash Sale Hardware IoT
                                </h2>
                                {/* Countdown Timer */}
                                <div className="flex items-center gap-3 font-mono">
                                    <div className="text-center">
                                        <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold">Hari</span>
                                        <span className="text-xl font-black text-slate-900 dark:text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                                    </div>
                                    <span className="text-rose-600 font-bold text-lg">:</span>
                                    <div className="text-center">
                                        <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold">Jam</span>
                                        <span className="text-xl font-black text-slate-900 dark:text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    </div>
                                    <span className="text-rose-600 font-bold text-lg">:</span>
                                    <div className="text-center">
                                        <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold">Menit</span>
                                        <span className="text-xl font-black text-slate-900 dark:text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    </div>
                                    <span className="text-rose-600 font-bold text-lg">:</span>
                                    <div className="text-center">
                                        <span className="text-[10px] text-slate-400 font-sans block uppercase font-bold">Detik</span>
                                        <span className="text-xl font-black text-rose-600">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-2">
                            <Link
                                href="/produk"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/produk"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {flashSaleProducts.map((product, idx) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                discountPercent={15 + idx * 5}
                                showBadge={idx === 0 ? 'FLASH DEAL' : undefined}
                            />
                        ))}
                    </div>

                    {/* Center View All Button */}
                    <div className="text-center pt-4">
                        <Link
                            href="/produk"
                            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-rose-500 transition active:scale-95"
                        >
                            <span>Lihat Semua Produk Promo</span>
                        </Link>
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 2: Browse By Category (Minimalist Icon Boxes)
                ========================================================================== */}
                <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-4 rounded-xs bg-emerald-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                    Kategori
                                </span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Jelajahi Berdasarkan Kategori
                            </h2>
                        </div>
                    </div>

                    {/* Categories Icon Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat) => {
                            const IconComponent = getCategoryIcon(cat.slug);
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/produk?category=${cat.slug}`}
                                    className="group flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 text-center shadow-xs"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full text-slate-700 group-hover:text-white transition">
                                        <IconComponent className="h-7 w-7" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-white dark:text-white mt-3 transition line-clamp-1">
                                        {cat.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 group-hover:text-emerald-100 transition mt-0.5">
                                        {cat.products_count} Produk
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 3: Best Selling Products (This Month)
                ========================================================================== */}
                <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-end justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-4 rounded-xs bg-rose-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500">
                                    Bulan Ini
                                </span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Produk Terlaris &amp; Terpopuler
                            </h2>
                        </div>

                        <Link
                            href="/produk"
                            className="inline-flex items-center rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-500 transition"
                        >
                            <span>Lihat Semua</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {bestSellingProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                showBadge="TERLARIS"
                            />
                        ))}
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 4: Big Solution Spotlight Banner (JBL-Style Dark Aesthetic)
                ========================================================================== */}
                <section className="rounded-3xl bg-slate-950 p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-6 z-10">
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                                <Flame className="h-4 w-4" />
                                <span>Solusi Keselamatan Pengemudi</span>
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                                Tingkatkan Standar Armada dengan AI ADAS &amp; MDVR
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                                Deteksi dini kantuk, penggunaan ponsel saat menyetir, blind-spot pejalan kaki, dan streaming 4G langsung ke command center.
                            </p>

                            {/* Stat Counter Circles */}
                            <div className="flex flex-wrap items-center gap-4">
                                {[
                                    { label: 'Kamera', val: '4-Ch' },
                                    { label: 'Resolusi', val: '1080P' },
                                    { label: 'Jaringan', val: '4G LTE' },
                                    { label: 'Akurasi AI', val: '99%' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-center">
                                        <span className="text-xs font-black text-white">{item.val}</span>
                                        <span className="text-[9px] text-slate-400 uppercase font-semibold">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/layanan?type=Instalasi"
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition active:scale-95"
                                >
                                    <span>Konsultasi / Jadwalkan Pemasangan</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Visual Right Container */}
                        <div className="lg:col-span-5 flex items-center justify-center relative">
                            <div className="relative aspect-4/3 w-full max-w-md rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-6 border border-slate-700/60 shadow-inner flex items-center justify-center">
                                <img
                                    src="/assets/images/products/product-1.svg"
                                    alt="Dodolan AI MDVR"
                                    className="h-56 w-auto object-contain drop-shadow-2xl animate-in zoom-in-95"
                                />
                            </div>
                        </div>
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 5: Explore Our Products (Full Catalog Grid)
                ========================================================================== */}
                <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-4 rounded-xs bg-rose-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500">
                                    Katalog Lengkap
                                </span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Koleksi Hardware &amp; Sensor Dodolan
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {exploreProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>

                    <div className="text-center pt-4">
                        <Link
                            href="/produk"
                            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-8 py-3.5 text-xs font-bold text-white shadow-md hover:bg-rose-500 transition active:scale-95"
                        >
                            <span>Lihat Semua Koleksi Produk</span>
                        </Link>
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 6: Bento Grid Solutions & Services (New Arrival Style)
                ========================================================================== */}
                <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-4 rounded-xs bg-rose-600" />
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500">
                                Solusi &amp; Rekam Jejak
                            </span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            Layanan Teknis &amp; Portofolio Proyek
                        </h2>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Large Bento Card (2 cols, 2 rows) */}
                        <div className="lg:col-span-2 rounded-2xl bg-slate-950 p-8 text-white border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-lg group">
                            <div className="relative z-10 space-y-2 max-w-sm">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Pilar Utama</span>
                                <h3 className="text-2xl font-extrabold text-white leading-tight">
                                    Layanan Instalasi &amp; Kelistrikan Armada
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Teknisi bersertifikasi untuk pemasangan GPS, AI MDVR, sensor BBM, dan dashcam berstandar keselamatan otomotif.
                                </p>
                            </div>
                            <div className="relative z-10 pt-4">
                                <Link
                                    href="/layanan?type=Instalasi"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
                                >
                                    <span>Ajukan Survey &amp; Instalasi</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>

                        {/* Top Right Card (2 cols) */}
                        <div className="lg:col-span-2 rounded-2xl bg-slate-900 p-8 text-white border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-md group">
                            <div className="relative z-10 space-y-2 max-w-md">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Platform IoT</span>
                                <h3 className="text-xl font-bold text-white">
                                    Telematika &amp; Cloud Tracking
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Integrasi data sensor suhu, level bahan bakar, dan kecepatan armada secara real-time via API &amp; MQTT.
                                </p>
                            </div>
                            <div className="relative z-10 pt-3">
                                <Link
                                    href="/portfolio"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 underline"
                                >
                                    <span>Lihat Portofolio Proyek</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Right Card 1 */}
                        <div className="lg:col-span-1 rounded-2xl bg-slate-900 p-6 text-white border border-slate-800 flex flex-col justify-between min-h-[170px] shadow-sm">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase text-emerald-400">Cold-Chain</span>
                                <h4 className="text-sm font-bold text-white">Sensor Suhu Logistik</h4>
                                <p className="text-[11px] text-slate-400">Akurasi tinggi untuk truk pendingin &amp; farmasi.</p>
                            </div>
                            <Link href="/produk?category=iot-sensors" className="text-xs font-bold text-emerald-400 underline pt-2">
                                Detail Produk &rarr;
                            </Link>
                        </div>

                        {/* Bottom Right Card 2 */}
                        <div className="lg:col-span-1 rounded-2xl bg-slate-900 p-6 text-white border border-slate-800 flex flex-col justify-between min-h-[170px] shadow-sm">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase text-rose-400">Audit Armada</span>
                                <h4 className="text-sm font-bold text-white">Survey Teknis BoQ</h4>
                                <p className="text-[11px] text-slate-400">Pemeriksaan aki, tangki BBM, &amp; sinyal GPS.</p>
                            </div>
                            <Link href="/layanan?type=Survey" className="text-xs font-bold text-rose-400 underline pt-2">
                                Ajukan Survey &rarr;
                            </Link>
                        </div>
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 7: Trust Badges (4 Circular Service Value Pillars)
                ========================================================================== */}
                <section className="py-12 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {/* 1 */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 border-8 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                    Pengiriman 34 Provinsi
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Packing aman proteksi industri &amp; asuransi resmi.
                                </p>
                            </div>
                        </div>

                        {/* 2 */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 border-8 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white">
                                <Headphones className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                    Dukungan Teknis 24/7
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Teknisi standby siap melayani via WhatsApp &amp; on-site.
                                </p>
                            </div>
                        </div>

                        {/* 3 */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 border-8 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                    Garansi Resmi 1 Tahun
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Jaminan ganti unit dan ketersediaan suku cadang.
                                </p>
                            </div>
                        </div>

                        {/* 4 */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 border-8 border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white">
                                <Award className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                    Sertifikasi SDPPI
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Legalitas frekuensi telekomunikasi Kominfo terjamin.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}
