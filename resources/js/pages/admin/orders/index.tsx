import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { CustomSelect } from '@/components/ui/custom-select';
import { formatRupiah, formatDate } from '@/lib/format';
import { Search, ShoppingCart, Eye, Filter } from 'lucide-react';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total: number;
    payment_status: string;
    order_status: string;
    created_at: string;
    items: OrderItem[];
}

interface OrdersIndexProps {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        q: string;
        payment_status: string;
        order_status: string;
    };
}

export default function OrdersIndex({ orders, filters }: OrdersIndexProps) {
    const [search, setSearch] = useState(filters.q || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/orders', { ...filters, q: search }, { preserveState: true, replace: true });
    };

    const handleFilterChange = (key: string, val: string) => {
        router.get('/admin/orders', { ...filters, [key]: val }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Kelola Pesanan Pelanggan">
            <Head title="Admin - Pesanan — Dodolan Store" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Daftar Pesanan ({orders.total})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Pantau status pembayaran Mayar dan perbarui progres pengiriman hardware.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    <form onSubmit={handleSearch} className="relative flex-1 w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nomor pesanan / nama pemesan / email..."
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </form>

                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <CustomSelect
                            value={filters.payment_status || ''}
                            onChange={(val) => handleFilterChange('payment_status', val)}
                            size="sm"
                            className="w-full sm:w-48"
                            options={[
                                { value: '', label: 'Semua Status Bayar' },
                                { value: 'Pending', label: 'Pending (Belum Bayar)' },
                                { value: 'Paid', label: 'Paid (Lunas)' },
                            ]}
                        />

                        <CustomSelect
                            value={filters.order_status || ''}
                            onChange={(val) => handleFilterChange('order_status', val)}
                            size="sm"
                            className="w-full sm:w-48"
                            options={[
                                { value: '', label: 'Semua Status Pesanan' },
                                { value: 'Menunggu Pembayaran', label: 'Menunggu Pembayaran' },
                                { value: 'Dibayar', label: 'Dibayar' },
                                { value: 'Diproses', label: 'Diproses' },
                                { value: 'Dikirim', label: 'Dikirim' },
                                { value: 'Selesai', label: 'Selesai' },
                            ]}
                        />
                    </div>
                </div>

                {/* Hybrid Responsive Table & Mobile Cards */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    {/* Mobile Cards View (< 768px) */}
                    <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                        {orders.data.length > 0 ? (
                            orders.data.map((order) => (
                                <div key={order.id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                                            #{order.order_number}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                            order.payment_status === 'Paid'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                        }`}>
                                            {order.payment_status}
                                        </span>
                                    </div>

                                    <div className="space-y-1 text-xs">
                                        <div className="font-bold text-slate-900 dark:text-white">{order.customer_name}</div>
                                        <div className="text-[11px] text-slate-400">{order.customer_email} • {formatDate(order.created_at)}</div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Tagihan</div>
                                            <div className="font-black text-sm text-slate-900 dark:text-white">{formatRupiah(order.total)}</div>
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                                {order.order_status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="w-full flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white transition active:scale-[0.99]"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>Lihat Rincian & Update Status</span>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-slate-400">
                                Belum ada pesanan yang sesuai dengan filter.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View (>= 768px) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">No. Pesanan</th>
                                    <th className="px-5 py-3.5">Pelanggan</th>
                                    <th className="px-5 py-3.5">Total Belanja</th>
                                    <th className="px-5 py-3.5">Status Pembayaran</th>
                                    <th className="px-5 py-3.5">Status Progres</th>
                                    <th className="px-5 py-3.5">Tanggal</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {orders.data.length > 0 ? (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                            <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                                                #{order.order_number}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{order.customer_name}</div>
                                                <div className="text-[10px] text-slate-400">{order.customer_email}</div>
                                            </td>
                                            <td className="px-5 py-4 font-extrabold text-slate-900 dark:text-white">
                                                {formatRupiah(order.total)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`font-bold px-2 py-0.5 rounded-md ${
                                                    order.payment_status === 'Paid'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                                }`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                    {order.order_status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-400">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white transition"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>Detail</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                                            Belum ada pesanan yang sesuai dengan filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-1.5 sm:gap-2">
                            {orders.links.map((link, idx) => link.url ? (
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
