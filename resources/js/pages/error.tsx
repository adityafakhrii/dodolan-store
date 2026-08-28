import { Head, Link } from '@inertiajs/react';
import { 
    ShieldAlert, 
    Compass, 
    RefreshCw, 
    ZapOff, 
    AlertTriangle, 
    Wrench, 
    Home, 
    ArrowLeft, 
    ShoppingBag, 
    PhoneCall, 
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import { getWhatsAppLink } from '@/lib/format';

interface Props {
    status: number;
    message?: string | null;
}

export default function ErrorPage({ status, message }: Props) {
    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    const getErrorDetails = (code: number) => {
        switch (code) {
            case 403:
                return {
                    title: 'Akses Ditolak (Forbidden)',
                    subtitle: 'Area Khusus & Hak Akses Terbatas',
                    description: 'Maaf, Anda tidak memiliki izin atau hak akses administrator untuk membuka halaman ini.',
                    icon: ShieldAlert,
                    accentColor: 'text-amber-400',
                    iconBg: 'bg-amber-500/10 border-amber-500/30',
                    gradientGlow: 'from-amber-500/15 via-orange-500/5 to-transparent',
                    primaryAction: {
                        label: 'Kembali ke Beranda',
                        href: '/',
                        icon: Home,
                    },
                };
            case 404:
                return {
                    title: 'Halaman Tidak Ditemukan (Not Found)',
                    subtitle: 'Tautan URL Tidak Valid atau Telah Dipindahkan',
                    description: 'Halaman, produk hardware, atau layanan yang Anda cari tidak ditemukan. Periksa kembali alamat URL Anda.',
                    icon: Compass,
                    accentColor: 'text-emerald-400',
                    iconBg: 'bg-emerald-500/10 border-emerald-500/30',
                    gradientGlow: 'from-emerald-500/15 via-teal-500/5 to-transparent',
                    primaryAction: {
                        label: 'Jelajahi Katalog Produk',
                        href: '/produk',
                        icon: ShoppingBag,
                    },
                };
            case 419:
                return {
                    title: 'Sesi Keamanan Berakhir (Page Expired)',
                    subtitle: 'Token Keamanan CSRF Telah Kadaluarsa',
                    description: 'Sesi formulir atau token otentikasi Anda telah berakhir karena tidak ada aktivitas. Silakan muat ulang halaman.',
                    icon: RefreshCw,
                    accentColor: 'text-blue-400',
                    iconBg: 'bg-blue-500/10 border-blue-500/30',
                    gradientGlow: 'from-blue-500/15 via-indigo-500/5 to-transparent',
                    primaryAction: {
                        label: 'Muat Ulang Halaman (Refresh)',
                        href: '#refresh',
                        icon: RefreshCw,
                        onClick: () => window.location.reload(),
                    },
                };
            case 429:
                return {
                    title: 'Terlalu Banyak Permintaan (Rate Limit)',
                    subtitle: 'Batas Frekuensi Akses Tercapai',
                    description: 'Sistem mendeteksi terlalu banyak permintaan dari perangkat Anda dalam waktu singkat. Mohon tunggu beberapa saat.',
                    icon: ZapOff,
                    accentColor: 'text-purple-400',
                    iconBg: 'bg-purple-500/10 border-purple-500/30',
                    gradientGlow: 'from-purple-500/15 via-pink-500/5 to-transparent',
                    primaryAction: {
                        label: 'Coba Muat Ulang',
                        href: '#refresh',
                        icon: RefreshCw,
                        onClick: () => window.location.reload(),
                    },
                };
            case 503:
                return {
                    title: 'Pemeliharaan Sistem (Under Maintenance)',
                    subtitle: 'Peningkatan Infrastruktur Dodolan Store',
                    description: 'Kami sedang melakukan pemeliharaan dan peningkatan server. Silakan kunjungi kembali beberapa saat lagi.',
                    icon: Wrench,
                    accentColor: 'text-cyan-400',
                    iconBg: 'bg-cyan-500/10 border-cyan-500/30',
                    gradientGlow: 'from-cyan-500/15 via-blue-500/5 to-transparent',
                    primaryAction: {
                        label: 'Periksa Status Sistem',
                        href: '#refresh',
                        icon: RefreshCw,
                        onClick: () => window.location.reload(),
                    },
                };
            case 500:
            default:
                return {
                    title: 'Gangguan Server (Internal Server Error)',
                    subtitle: 'Terjadi Kesalahan yang Tidak Terduga',
                    description: 'Mohon maaf atas ketidaknyamanannya. Terjadi gangguan teknis pada server kami dan tim teknisi sedang menanganinya.',
                    icon: AlertTriangle,
                    accentColor: 'text-rose-400',
                    iconBg: 'bg-rose-500/10 border-rose-500/30',
                    gradientGlow: 'from-rose-500/15 via-red-500/5 to-transparent',
                    primaryAction: {
                        label: 'Muat Ulang Halaman',
                        href: '#refresh',
                        icon: RefreshCw,
                        onClick: () => window.location.reload(),
                    },
                };
        }
    };

    const details = getErrorDetails(status);
    const Icon = details.icon;

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-10 relative overflow-hidden selection:bg-emerald-500 selection:text-white antialiased">
            <Head title={`${status} — ${details.title}`} />

            {/* Background Ambient Static Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[580px] rounded-full bg-gradient-to-tr ${details.gradientGlow} blur-3xl pointer-events-none opacity-70`} />
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            {/* Top Minimal Brand Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group min-h-[44px]">
                    <img
                        src="/assets/logo/logo-white.png"
                        alt="Dodolan Store"
                        className="h-8 sm:h-9 w-auto object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </Link>

                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition min-h-[40px] flex items-center"
                    >
                        Beranda Toko
                    </Link>
                </div>
            </header>

            {/* Center Error Card */}
            <main className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 my-auto py-8">
                {/* Error Icon & Status Code */}
                <div className="space-y-3">
                    <div className="inline-flex items-center justify-center">
                        <div className={`flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl ${details.iconBg} border shadow-2xl backdrop-blur-xl`}>
                            <Icon className={`h-10 w-10 sm:h-12 sm:w-12 ${details.accentColor}`} />
                        </div>
                    </div>

                    {/* Big Clean Status Code & Subtitle Text */}
                    <div>
                        <div className="text-7xl sm:text-9xl font-black tracking-tight text-slate-100 select-none font-mono drop-shadow-sm">
                            {status}
                        </div>
                        <p className={`mt-2 text-xs sm:text-sm font-bold uppercase tracking-widest ${details.accentColor}`}>
                            {details.subtitle}
                        </p>
                    </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-3 max-w-lg mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        {details.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {details.description}
                    </p>

                    {/* Server reason callout if available */}
                    {message && (
                        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 text-left mt-3">
                            <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="leading-relaxed">
                                <strong className="text-emerald-400 font-bold block mb-0.5">Keterangan Sistem:</strong>
                                <span>{message}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Clean Recovery Action Buttons (No login CTA) */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {details.primaryAction.onClick ? (
                        <button
                            type="button"
                            onClick={details.primaryAction.onClick}
                            className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/50 transition cursor-pointer"
                        >
                            <details.primaryAction.icon className="h-4 w-4" />
                            <span>{details.primaryAction.label}</span>
                        </button>
                    ) : (
                        <Link
                            href={details.primaryAction.href}
                            className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/50 transition"
                        >
                            <details.primaryAction.icon className="h-4 w-4" />
                            <span>{details.primaryAction.label}</span>
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs sm:text-sm font-bold transition cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Halaman Sebelumnya</span>
                    </button>
                </div>

                {/* Quick Helpful Links / Support */}
                <div className="pt-6 border-t border-slate-900 max-w-md mx-auto">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-3">
                        Butuh bantuan lebih lanjut?
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                        <a
                            href={getWhatsAppLink('6281234567890', `Halo CS Dodolan Store, saya mengalami error ${status} (${details.title}) pada website.`)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 hover:text-emerald-400 border border-slate-800 transition font-semibold text-slate-400 min-h-[40px]"
                        >
                            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Hubungi CS WhatsApp</span>
                        </a>
                        <Link
                            href="/layanan"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition font-semibold text-slate-400 min-h-[40px]"
                        >
                            <Wrench className="h-3.5 w-3.5 text-slate-500" />
                            <span>Layanan IoT</span>
                        </Link>
                        <Link
                            href="/kontak"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition font-semibold text-slate-400 min-h-[40px]"
                        >
                            <span>Kontak Kami</span>
                            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                        </Link>
                    </div>
                </div>
            </main>

            {/* Bottom Minimal Copyright */}
            <footer className="relative z-10 text-center py-4 text-xs text-slate-600">
                <p>&copy; {new Date().getFullYear()} Dodolan Store. All rights reserved.</p>
            </footer>
        </div>
    );
}
