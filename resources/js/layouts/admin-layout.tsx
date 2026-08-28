import { PropsWithChildren, useState } from 'react';
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
    Shield
} from 'lucide-react';
import { Toaster } from 'sonner';

interface AdminLayoutProps extends PropsWithChildren {
    title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    const { url, props } = usePage<any>();
    const auth = props?.auth;
    const currentUrl = url || '';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard KPI', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Katalog Produk', href: '/admin/products', icon: Package },
        { name: 'Kategori', href: '/admin/categories', icon: Layers },
        { name: 'Kelola Pesanan', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Data Customer', href: '/admin/customers', icon: Users },
        { name: 'Pengajuan Layanan', href: '/admin/service-requests', icon: Wrench },
        { name: 'Banner Promo', href: '/admin/banners', icon: ImageIcon },
    ];

    const isActive = (href: string) => {
        if (href === '/admin/dashboard') return currentUrl === '/admin/dashboard';
        return currentUrl.startsWith(href);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div>
                    {/* Brand Header */}
                    <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
                        <Link href="/admin/dashboard" className="flex items-center gap-2.5 font-black tracking-tight text-white group">
                            <img
                                src="/assets/logo/logo-white.png"
                                alt="Dodolan Store"
                                className="h-7 w-auto object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <span className="rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                                Admin
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="p-4 space-y-1.5">
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
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                                        active
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <IconComponent className="h-4 w-4 shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="flex items-center gap-2">
                            <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Buka Toko Publik</span>
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Keluar (Logout)</span>
                    </button>
                </div>
            </aside>

            {/* Main Content View */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {title || 'Dashboard Administrasi'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {auth?.user?.name || 'Administrator'}
                            </div>
                            <div className="text-[10px] text-slate-500">
                                {auth?.user?.email || 'admin@dodolan.store'}
                            </div>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content Container */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            <Toaster position="bottom-right" richColors />
        </div>
    );
}
