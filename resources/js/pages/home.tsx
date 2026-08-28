import { Head, Link } from '@inertiajs/react';
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
    Flame,
    CheckCircle2
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
        image_url: '/assets/images/banners/banner-iot-solutions.svg',
    };

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

    const latestProducts = featuredProducts.slice(0, 4);
    const bestSellingProducts = featuredProducts.slice(2, 6);
    const exploreProducts = featuredProducts;

    const technicalServices = [
        {
            title: 'Layanan Instalasi & Kelistrikan Armada',
            category: 'Pemasangan On-Site',
            description: 'Instalasi rapi dan terstandarisasi untuk unit GPS Tracker, AI MDVR, sensor BBM, dan dashcam berstandar keselamatan otomotif.',
            icon: Wrench,
            color: 'emerald',
            link: '/layanan?type=Instalasi',
            linkText: 'Ajukan Instalasi Sekarang',
        },
        {
            title: 'Telematika & Platform Cloud Monitoring',
            category: 'Integrasi Sistem',
            description: 'Integrasi telemetri armada real-time via REST API & MQTT ke server perusahaan untuk pelacakan live, rute, dan konsumsi BBM.',
            icon: Cpu,
            color: 'blue',
            link: '/portfolio',
            linkText: 'Lihat Portfolio Proyek',
        },
        {
            title: 'Sensor Suhu & Monitoring Cold-Chain',
            category: 'Sensor Industri',
            description: 'Pemantauan temperatur dan kelembaban berkala dengan sensor BLE presisi tinggi untuk armada logistik farmasi dan makanan beku.',
            icon: Gauge,
            color: 'indigo',
            link: '/produk?category=iot-sensors',
            linkText: 'Eksplor Sensor Suhu',
        },
        {
            title: 'Survey Teknis & Audit Kelayakan BoQ',
            category: 'Audit & Konsultasi',
            description: 'Pemeriksaan voltase aki (12V/24V), dimensi tangki bahan bakar, dan pemetaan blind-spot sebelum implementasi pengadaan massal.',
            icon: Search,
            color: 'rose',
            link: '/layanan?type=Survey',
            linkText: 'Jadwalkan Survey Lokasi',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Dodolan Store — Penyedia Produk IoT, GPS Tracking & AI MDVR Fleet" />

            <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 space-y-10 sm:space-y-16 py-4 sm:py-8">

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
                        <div className="relative min-h-[340px] sm:min-h-[420px] rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-12 text-white shadow-xl overflow-hidden flex flex-col justify-between border border-slate-800">
                            {/* Background Image / Graphic */}
                            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-25 sm:opacity-90 pointer-events-none flex items-center justify-end pr-4">
                                <img
                                    src={activeBanner.image_url}
                                    alt={activeBanner.title}
                                    className="h-64 sm:h-72 w-auto object-contain transition-all duration-700 animate-in fade-in"
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 max-w-lg space-y-3 sm:space-y-4">
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400">
                                    Enterprise IoT &amp; Telematics
                                </p>
                                <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight leading-snug sm:leading-tight">
                                    {activeBanner.title}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                                    {activeBanner.subtitle}
                                </p>
                                <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                                    <Link
                                        href={activeBanner.cta_url || '/produk'}
                                        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 sm:px-5 sm:py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition active:scale-95"
                                    >
                                        <span>{activeBanner.cta_text || 'Jelajahi Produk'}</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                    <Link
                                        href="/layanan"
                                        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 sm:px-5 sm:py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                                    >
                                        <Wrench className="h-3.5 w-3.5 text-emerald-400" />
                                        <span>Ajukan Instalasi</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Carousel Indicators & Arrows */}
                            <div className="relative z-10 flex items-center justify-between pt-4 sm:pt-6 border-t border-slate-800/60 mt-4 sm:mt-6">
                                <div className="flex items-center gap-2">
                                    {banners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentBanner(idx)}
                                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${currentBanner === idx ? 'w-6 sm:w-8 bg-emerald-500' : 'w-1.5 sm:w-2 bg-slate-600'
                                                }`}
                                            aria-label={`Slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                                        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                                        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 1: Produk Terbaru Dodolan (Latest Products Section)
                ========================================================================== */}
                <section className="space-y-4 sm:space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center justify-between gap-2">
                        <div className="space-y-1">
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                Rilis Terbaru
                            </span>
                            <h2 className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Produk Hardware Terbaru
                            </h2>
                            <p className="text-xs text-slate-500 hidden sm:block">
                                Inovasi perangkat IoT dan telemetri generasi terbaru dengan spesifikasi berstandar industri.
                            </p>
                        </div>

                        {/* Navigation Actions */}
                        <Link
                            href="/produk"
                            className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 px-2.5 py-1.5 sm:px-0 rounded-lg sm:rounded-none bg-emerald-50 sm:bg-transparent dark:bg-emerald-950/40 sm:dark:bg-transparent"
                        >
                            <span className="hidden sm:inline">Lihat Semua Produk</span>
                            <span className="sm:hidden">Semua</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
                        {latestProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                showBadge="TERBARU"
                            />
                        ))}
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 2: Browse By Category (Minimalist Icon Boxes)
                ========================================================================== */}
                <section className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                Kategori
                            </span>
                            <h2 className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Jelajahi Berdasarkan Kategori
                            </h2>
                        </div>
                    </div>

                    {/* Categories Icon Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
                        {categories.map((cat) => {
                            const IconComponent = getCategoryIcon(cat.slug);
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/produk?category=${cat.slug}`}
                                    className="group flex flex-col items-center justify-center p-3.5 sm:p-6 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 text-center shadow-xs"
                                >
                                    <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-700 group-hover:bg-emerald-700 group-hover:text-white dark:bg-slate-800 dark:text-slate-200 transition">
                                        <IconComponent className="h-5 w-5 sm:h-7 sm:w-7" />
                                    </div>
                                    <span className="text-[11px] sm:text-xs font-bold text-slate-900 group-hover:text-white dark:text-white mt-2 sm:mt-3 transition line-clamp-1">
                                        {cat.name}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] text-slate-400 group-hover:text-emerald-100 transition mt-0.5">
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
                <section className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-2">
                        <div className="space-y-1">
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-500">
                                Produk Populer
                            </span>
                            <h2 className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Produk Terlaris &amp; Teruji
                            </h2>
                        </div>

                        <Link
                            href="/produk"
                            className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-rose-600 sm:text-white sm:bg-rose-600 px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-rose-50 dark:bg-rose-950/40 sm:dark:bg-rose-600 shadow-xs hover:bg-rose-100 sm:hover:bg-rose-500 transition"
                        >
                            <span className="sm:hidden">Semua</span>
                            <span className="hidden sm:inline">Lihat Semua</span>
                            <ArrowRight className="h-3.5 w-3.5 sm:hidden" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
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
                    SECTION 4: Big Solution Spotlight Banner (Technical Hardware Specs)
                ========================================================================== */}
                <section className="rounded-2xl sm:rounded-3xl bg-slate-950 p-6 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                        <div className="lg:col-span-7 space-y-4 sm:space-y-6 z-10">
                            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400">
                                Solusi Keselamatan Pengemudi
                            </p>
                            <h2 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight">
                                Standar Keselamatan Armada dengan AI ADAS &amp; MDVR
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                                Monitoring video real-time 4G, peringatan dini blind-spot, sensor kelelahan pengemudi (DSM), serta pelacakan telemetri terintegrasi.
                            </p>

                            {/* Technical Spec Chips */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                                {[
                                    { label: 'Video Input', val: '4-Ch AHD / IPC' },
                                    { label: 'Resolusi Streaming', val: '1080P Full HD' },
                                    { label: 'Koneksi Jaringan', val: 'Dual SIM 4G' },
                                    { label: 'Fitur Pintar', val: 'ADAS + DSM Sensor' },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left">
                                        <span className="text-xs font-bold text-white block">{item.val}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/layanan?type=Instalasi"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 sm:px-7 sm:py-3.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition active:scale-95"
                                >
                                    <span>Jadwalkan Pemasangan On-Site</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Visual Right Container */}
                        <div className="lg:col-span-5 flex items-center justify-center relative">
                            <div className="relative aspect-4/3 w-full max-w-md rounded-2xl bg-slate-900 p-4 sm:p-6 border border-slate-800 shadow-inner flex items-center justify-center">
                                <img
                                    src="/assets/images/products/md-404.svg"
                                    alt="Dodolan AI MDVR"
                                    className="h-40 sm:h-56 w-auto object-contain drop-shadow-2xl"
                                    onError={(e) => {
                                        e.currentTarget.src = '/assets/images/placeholder-product.svg';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 5: Explore Our Products (Full Catalog Grid)
                ========================================================================== */}
                <section className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                Katalog Lengkap
                            </span>
                            <h2 className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Koleksi Hardware &amp; Sensor Dodolan
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
                        {exploreProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>

                    <div className="text-center pt-2 sm:pt-4">
                        <Link
                            href="/produk"
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition active:scale-95"
                        >
                            <span>Lihat Semua Koleksi Produk</span>
                        </Link>
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 6: Symmetrical Balanced 2x2 Grid Solutions & Technical Services
                ========================================================================== */}
                <section className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-2">
                        <div className="space-y-1">
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                Solusi &amp; Layanan
                            </span>
                            <h2 className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Layanan Teknis &amp; Portofolio Proyek
                            </h2>
                        </div>

                        <Link
                            href="/layanan"
                            className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline px-2.5 py-1.5 sm:px-0 rounded-lg sm:rounded-none bg-emerald-50 sm:bg-transparent dark:bg-emerald-950/40 sm:dark:bg-transparent"
                        >
                            <span className="hidden sm:inline">Semua Layanan</span>
                            <span className="sm:hidden">Semua</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Symmetrical 2x2 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {technicalServices.map((svc, idx) => {
                            const IconComp = svc.icon;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-white p-5 sm:p-7 text-slate-900 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 sm:space-y-6 group hover:border-emerald-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition"
                                >
                                    <div className="space-y-2.5 sm:space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                                {svc.category}
                                            </span>
                                            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-400 transition">
                                                <IconComp className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 transition leading-snug">
                                            {svc.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {svc.description}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <Link
                                            href={svc.link}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition"
                                        >
                                            <span>{svc.linkText}</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>


                {/* =========================================================================
                    SECTION 7: Trust Badges (Clean Modern Value Pillars)
                ========================================================================== */}
                <section className="py-6 sm:py-10 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* 1 */}
                        <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                <Truck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    Pengiriman 34 Provinsi
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                    Proteksi kemasan industri &amp; asuransi resmi ke seluruh Indonesia.
                                </p>
                            </div>
                        </div>

                        {/* 2 */}
                        <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                <Headphones className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    Dukungan Teknis
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                    Tim teknisi berpengalaman siap melayani via WhatsApp &amp; on-site.
                                </p>
                            </div>
                        </div>

                        {/* 3 */}
                        <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    Garansi Resmi 1 Tahun
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                    Jaminan ganti unit dan ketersediaan suku cadang asli.
                                </p>
                            </div>
                        </div>

                        {/* 4 */}
                        <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    Sertifikasi Resmi
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                    Legalitas frekuensi telekomunikasi dan sertifikasi standar nasional.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </PublicLayout>
    );
}
