import { Link } from '@inertiajs/react';
import type { AuthLayoutProps } from '@/types';
import { ChevronLeft } from 'lucide-react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50 p-6 md:p-10 dark:bg-slate-950">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    {/* Brand Logo & Header */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-2 group transition"
                            title="Kembali ke Dodolan Store"
                        >
                            <img
                                src="/assets/logo/logo-dark.png"
                                alt="Dodolan Store"
                                className="h-10 w-auto object-contain dark:hidden"
                            />
                            <img
                                src="/assets/logo/logo-white.png"
                                alt="Dodolan Store"
                                className="hidden h-10 w-auto object-contain dark:block"
                            />
                        </Link>

                        <div className="space-y-1 mt-2">
                            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {title || 'Masuk ke Panel Administrator'}
                            </h1>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                                {description || 'Portal manajemen katalog, pesanan, dan layanan Dodolan Store'}
                            </p>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        {children}
                    </div>

                    {/* Back to Home Link */}
                    <div className="text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span>Kembali ke Beranda Toko</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
