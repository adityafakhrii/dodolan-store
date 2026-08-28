import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { formatRupiah, formatDate, getWhatsAppLink } from '@/lib/format';
import { Search, Users, Phone, Mail, ShoppingCart } from 'lucide-react';

interface Customer {
    customer_email: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    total_orders: number;
    total_spent: number;
    last_order_at: string;
}

interface CustomerIndexProps {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        q: string;
    };
}

export default function CustomerIndex({ customers, filters }: CustomerIndexProps) {
    const [search, setSearch] = useState(filters.q || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/customers', { q: search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Direktori Pelanggan">
            <Head title="Admin - Customer — Dodolan Store" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Data Pelanggan ({customers.total})
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kontak pembeli terakumulasi dari histori transaksi checkout Dodolan Store.
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    <form onSubmit={handleSearch} className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama pelanggan, email, atau no. HP..."
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </form>
                </div>

                {/* Hybrid Responsive Table & Mobile Cards */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    {/* Mobile Cards View (< 768px) */}
                    <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                        {customers.data.length > 0 ? (
                            customers.data.map((c, idx) => (
                                <div key={idx} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                                {c.customer_name}
                                            </h3>
                                            <div className="text-[11px] text-slate-400">{c.customer_email}</div>
                                        </div>
                                        <span className="font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                                            {c.total_orders} Order
                                        </span>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                                            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span>{c.customer_phone}</span>
                                        </div>
                                        {c.customer_address && (
                                            <div className="text-slate-500 text-[11px] line-clamp-2">
                                                {c.customer_address}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Pembelian</div>
                                            <div className="font-black text-sm text-emerald-600 dark:text-emerald-400">{formatRupiah(c.total_spent)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-slate-400">Order Terakhir</div>
                                            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{formatDate(c.last_order_at)}</div>
                                        </div>
                                    </div>

                                    <div className="pt-1">
                                        <a
                                            href={getWhatsAppLink(c.customer_phone, `Halo Bapak/Ibu ${c.customer_name}, terima kasih telah berbelanja di Dodolan Store.`)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition active:scale-[0.99]"
                                        >
                                            <Phone className="h-4 w-4" />
                                            <span>Hubungi via WhatsApp</span>
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-slate-400">
                                Belum ada data pelanggan tercatat.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View (>= 768px) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Pelanggan</th>
                                    <th className="px-5 py-3.5">Kontak</th>
                                    <th className="px-5 py-3.5">Alamat Pengiriman Terakhir</th>
                                    <th className="px-5 py-3.5">Total Pesanan</th>
                                    <th className="px-5 py-3.5">Total Pembelian</th>
                                    <th className="px-5 py-3.5">Transaksi Terakhir</th>
                                    <th className="px-5 py-3.5 text-right">Hubungi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {customers.data.length > 0 ? (
                                    customers.data.map((c, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{c.customer_name}</div>
                                                <div className="text-slate-400">{c.customer_email}</div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-mono">
                                                {c.customer_phone}
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 max-w-xs truncate">
                                                {c.customer_address}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                                                {c.total_orders} order
                                            </td>
                                            <td className="px-5 py-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                                                {formatRupiah(c.total_spent)}
                                            </td>
                                            <td className="px-5 py-4 text-slate-400">
                                                {formatDate(c.last_order_at)}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <a
                                                    href={getWhatsAppLink(c.customer_phone, `Halo Bapak/Ibu ${c.customer_name}, terima kasih telah berbelanja di Dodolan Store.`)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 px-3.5 py-1.5 font-bold hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 transition"
                                                >
                                                    <Phone className="h-3.5 w-3.5" />
                                                    <span>Chat</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                                            Belum ada data pelanggan tercatat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {customers.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-1.5 sm:gap-2">
                            {customers.links.map((link, idx) => link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`min-h-[40px] min-w-[40px] flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold transition ${
                                        link.active ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                                    }`}
                                />
                            ) : null)}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
