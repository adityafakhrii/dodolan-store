import { PropsWithChildren, ReactNode } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { StoreHeader } from '@/components/store-header';
import { StoreFooter } from '@/components/store-footer';
import { 
    LayoutDashboard, 
    Package, 
    Wrench, 
    User, 
    ShieldCheck, 
    LogOut,
    ChevronRight
} from 'lucide-react';

interface Props extends PropsWithChildren {
    title: string;
    description?: string;
    action?: ReactNode;
}

export function CustomerLayout({ title, description, action, children }: Props) {
    const { url, props } = usePage<{ auth?: { user?: { name: string; email: string } } }>();
    const user = props.auth?.user;

    const navItems = [
        { name: 'Dashboard', href: '/akun/dashboard', icon: LayoutDashboard },
        { name: 'Pesanan Saya', href: '/akun/pesanan', icon: Package },
        { name: 'Pengajuan Layanan', href: '/akun/layanan', icon: Wrench },
        { name: 'Profil & Alamat', href: '/akun/profil', icon: User },
        { name: 'Keamanan & Password', href: '/settings/security', icon: ShieldCheck },
    ];

    const isActive = (href: string) => {
        if (href === '/akun/dashboard') return url === '/akun/dashboard';
        return url.startsWith(href);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Head title={`${title} — Dodolan Store`} />
            <StoreHeader />

            {/* Customer Portal Top Banner */}
            <div className="bg-slate-900 text-white py-8 border-b border-slate-800">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                                <Link href="/" className="hover:text-emerald-400">Beranda</Link>
                                <ChevronRight className="h-3 w-3" />
                                <Link href="/akun/dashboard" className="hover:text-emerald-400">Portal Pelanggan</Link>
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-emerald-400 font-semibold">{title}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-xs text-slate-400 mt-1">
                                    {description}
                                </p>
                            )}
                        </div>

                        {action && (
                            <div className="shrink-0">
                                {action}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area with Navigation Sidebar */}
            <main className="flex-1 mx-auto max-w-[1440px] w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Sidebar Nav (Desktop & Mobile Tabs) */}
                    <aside className="lg:col-span-3 space-y-4">
                        {/* User Mini Profile Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 font-extrabold text-white text-lg shadow-sm">
                                    {user?.name?.charAt(0).toUpperCase() || 'C'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {user?.name || 'Customer'}
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {user?.email || ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-1">
                            {navItems.map((item) => {
                                const active = isActive(item.href);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                                            active
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                                        <span className="flex-1 truncate">{item.name}</span>
                                    </Link>
                                );
                            })}

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition text-left"
                                >
                                    <LogOut className="h-4 w-4 shrink-0" />
                                    <span>Keluar Akun</span>
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Dynamic View */}
                    <div className="lg:col-span-9 space-y-6">
                        {children}
                    </div>
                </div>
            </main>

            <StoreFooter />
        </div>
    );
}
