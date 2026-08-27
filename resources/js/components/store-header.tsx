import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { ShoppingBag, Menu, X, PhoneCall, ChevronRight, Search, Heart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { getWhatsAppLink } from '@/lib/format';

export function StoreHeader() {
    const { url } = usePage();
    const { itemCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navLinks = [
        { name: 'Beranda', href: '/' },
        { name: 'Tentang Kami', href: '/tentang-kami' },
        { name: 'Produk', href: '/produk' },
        { name: 'Layanan', href: '/layanan' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Kontak', href: '/kontak' },
    ];

    const isActive = (href: string) => {
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.visit(`/produk?q=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
            {/* Top Announcement Bar */}
            <div className="bg-slate-950 border-b border-slate-800 text-xs text-slate-300">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Promo Spesial: Diskon Hardware IoT &amp; Gratis Biaya Survey Armada di Wilayah Jawa Timur</span>
                        <Link href="/produk" className="hidden sm:inline-block font-bold text-white underline hover:text-emerald-400 ml-1">
                            Belanja Sekarang
                        </Link>
                    </div>
                    <div className="hidden items-center gap-4 md:flex">
                        <a
                            href={getWhatsAppLink('6281234567890', 'Halo Dodolan, saya ingin info produk.')}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 hover:text-emerald-400 transition"
                        >
                            <PhoneCall className="h-3 w-3 text-emerald-400" />
                            <span>CS WhatsApp: +62 812-3456-7890</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-3 shrink-0 group">
                    <img
                        src="/assets/logo/logo-dark.png"
                        alt="Dodolan Store"
                        className="h-9 w-auto object-contain dark:hidden"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <img
                        src="/assets/logo/logo-white.png"
                        alt="Dodolan Store"
                        className="hidden h-9 w-auto object-contain dark:block"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </Link>

                {/* Center Navigation Links */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-3 py-1.5 text-xs font-semibold transition rounded-lg ${active
                                        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400'
                                        : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Search Box + Action Icons */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Header Search Box */}
                    <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-48 lg:w-64">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari GPS / MDVR..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                    </form>

                    {/* Wishlist Link */}
                    <Link
                        href="/produk"
                        className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-300 transition dark:border-slate-800 dark:text-slate-300"
                        title="Wishlist"
                    >
                        <Heart className="h-4 w-4" />
                    </Link>

                    {/* Cart Button */}
                    <Link
                        href="/keranjang"
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 transition dark:border-slate-800 dark:text-slate-300"
                        title="Keranjang Belanja"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white shadow-sm">
                                {itemCount > 99 ? '99+' : itemCount}
                            </span>
                        )}
                    </Link>

                    {/* Consultation Fast CTA */}
                    <a
                        href={getWhatsAppLink('6281234567890', 'Halo Dodolan Store, saya ingin berkonsultasi mengenai solusi IoT untuk bisnis saya.')}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition active:scale-95"
                    >
                        <span>Konsultasi IoT</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Navigation */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 dark:border-slate-800 dark:bg-slate-950 shadow-xl animate-in slide-in-from-top-2 duration-200">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearchSubmit} className="relative mb-3">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari GPS, Kamera, MDVR..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </form>

                    <div className="flex flex-col space-y-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${active
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                                            : 'text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900'
                                        }`}
                                >
                                    <span>{link.name}</span>
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
