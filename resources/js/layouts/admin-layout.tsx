import { PropsWithChildren, useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Package, 
    Layers, 
    ShoppingCart, 
    Users, 
    Wrench, 
    Image as ImageIcon, 
    LogOut, 
    ExternalLink, 
    Menu, 
    X, 
    ChevronRight,
    Shield,
    Settings
} from 'lucide-react';

interface AdminLayoutProps extends PropsWithChildren {
    title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    const { url, props } = usePage<any>();
    const auth = props?.auth;
    const currentUrl = url || '';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    const navItems = [
        { name: 'Dashboard KPI', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Katalog Produk', href: '/admin/products', icon: Package },
        { name: 'Kategori', href: '/admin/categories', icon: Layers },
        { name: 'Kelola Pesanan', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Data Customer', href: '/admin/customers', icon: Users },
        { name: 'Pengajuan Layanan', href: '/admin/service-requests', icon: Wrench },
        { name: 'Banner Promo', href: '/admin/banners', icon: ImageIcon },
        { name: 'Pengaturan & Keamanan', href: '/admin/settings', icon: Settings },
    ];

    const isActive = (href: string) => {
        if (href === '/admin/dashboard') return currentUrl === '/admin/dashboard';
        return currentUrl.startsWith(href);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen min-h-[100dvh] bg-slate-100 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 antialiased">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity duration-200"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 max-w-[85vw] h-full h-[100dvh] bg-slate-900 text-white flex flex-col justify-between transition-transform duration-200 ease-out shadow-2xl lg:shadow-none lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col min-h-0 flex-1">
                    {/* Brand Header */}
                    <div className="relative flex h-16 sm:h-20 shrink-0 items-center justify-center px-6 border-b border-slate-800">
                        <Link href="/admin/dashboard" className="flex items-center justify-center group py-2">
                            <img
                                src="/assets/logo/logo-white.png"
                                alt="Dodolan Store"
                                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Tutup Menu Navigasi"
                            className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 focus:outline-none">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                            Menu Utama
                        </div>
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex min-h-[44px] items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition active:scale-[0.98] ${
                                        active
                                            ? 'bg-emerald-600 text-white shadow-sm font-bold'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <IconComponent className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-3 sm:p-4 border-t border-slate-800 space-y-2 shrink-0 bg-slate-900/95 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex min-h-[44px] items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="flex items-center gap-2 truncate">
                            <ExternalLink className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">Buka Toko Publik</span>
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex min-h-[44px] items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition active:scale-[0.98] cursor-pointer"
                    >
                        <LogOut className="h-3.5 w-3.5 shrink-0" />
                        <span>Keluar (Logout)</span>
                    </button>
                </div>
            </aside>

            {/* Main Content View */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-3 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Buka Menu Navigasi"
                            className="lg:hidden flex h-11 w-11 shrink-0 items-center justify-center text-slate-700 hover:bg-slate-100 rounded-xl dark:text-slate-200 dark:hover:bg-slate-800 transition"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                            {title || 'Dashboard Administrasi'}
                        </h1>
                    </div>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-2.5 sm:gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                        title="Buka Pengaturan Akun Admin"
                    >
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {auth?.user?.name || 'Administrator'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                                {auth?.user?.email || 'admin@dodolan.store'}
                            </div>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs shadow-xs">
                            {auth?.user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </Link>
                </header>

                {/* Page Content Container */}
                <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
