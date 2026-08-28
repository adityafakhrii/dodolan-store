import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import { formatRupiah, formatDate } from '@/lib/format';
import { 
    Package, 
    ShoppingCart, 
    Clock, 
    CheckCircle2, 
    Users, 
    Wrench, 
    TrendingUp, 
    ChevronRight, 
    ArrowUpRight, 
    AlertCircle 
} from 'lucide-react';

interface KPI {
    total_products: number;
    total_orders: number;
    pending_orders: number;
    paid_orders: number;
    total_customers: number;
    new_service_requests: number;
    total_revenue: number;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    total: number;
    payment_status: string;
    order_status: string;
    created_at: string;
}

interface ServiceRequest {
    id: number;
    name: string;
    email: string;
    phone: string;
    service_type: string;
    location: string;
    status: string;
    created_at: string;
}

interface DashboardProps {
    kpi: KPI;
    recentOrders: Order[];
    recentServiceRequests: ServiceRequest[];
}

export default function AdminDashboard({ kpi, recentOrders, recentServiceRequests }: DashboardProps) {
    const kpiCards = [
        {
            title: 'Total Pendapatan (Lunas)',
            value: formatRupiah(kpi.total_revenue),
            icon: TrendingUp,
            color: 'emerald',
            link: '/admin/orders?payment_status=Paid',
        },
        {
            title: 'Total Pesanan Masuk',
            value: `${kpi.total_orders} Pesanan`,
            icon: ShoppingCart,
            color: 'blue',
            link: '/admin/orders',
        },
        {
            title: 'Menunggu Pembayaran',
            value: `${kpi.pending_orders} Menunggu`,
            icon: Clock,
            color: 'amber',
            link: '/admin/orders?payment_status=Pending',
        },
        {
            title: 'Pengajuan Layanan Baru',
            value: `${kpi.new_service_requests} Pengajuan`,
            icon: Wrench,
            color: 'rose',
            link: '/admin/service-requests?status=Baru',
        },
        {
            title: 'Total Produk Aktif',
            value: `${kpi.total_products} Produk`,
            icon: Package,
            color: 'indigo',
            link: '/admin/products',
        },
        {
            title: 'Total Pelanggan Terdaftar',
            value: `${kpi.total_customers} Kontak`,
            icon: Users,
            color: 'slate',
            link: '/admin/customers',
        },
    ];

    return (
        <AdminLayout title="Dashboard KPI & Operasional">
            <Head title="Admin Dashboard — Dodolan Store" />

            <div className="space-y-6 sm:space-y-8">
                {/* Greeting */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                            Ringkasan Performa Dodolan Store
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Pantau metrik penjualan hardware IoT, pesanan masuk, dan permintaan instalasi teknis secara real-time.
                        </p>
                    </div>
                </div>

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                    {kpiCards.map((card, idx) => {
                        const IconComponent = card.icon;
                        return (
                            <Link
                                key={idx}
                                href={card.link}
                                className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                                            {card.title}
                                        </span>
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-emerald-600 group-hover:text-white transition">
                                            <IconComponent className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                                        {card.value}
                                    </div>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <span>Lihat rincian</span>
                                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Recent Orders */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>Pesanan Terbaru</span>
                            </h3>
                            <Link href="/admin/orders" className="text-xs font-semibold text-emerald-600 hover:underline min-h-[36px] flex items-center">
                                Semua Pesanan
                            </Link>
                        </div>

                        {recentOrders.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 text-xs">
                                        <div className="min-w-0 flex-1">
                                            <Link href={`/admin/orders/${order.id}`} className="font-bold text-slate-900 hover:text-emerald-600 dark:text-white block truncate">
                                                #{order.order_number} — {order.customer_name}
                                            </Link>
                                            <div className="text-slate-400 mt-0.5">{formatDate(order.created_at)}</div>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 gap-2 sm:gap-1">
                                            <div className="font-extrabold text-slate-900 dark:text-white">{formatRupiah(order.total)}</div>
                                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                order.payment_status === 'Paid'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                            }`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-xs text-slate-400">Belum ada pesanan terbaru.</div>
                        )}
                    </div>

                    {/* Recent Service Requests */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                <Wrench className="h-4 w-4 text-blue-600 shrink-0" />
                                <span>Pengajuan Layanan Terbaru</span>
                            </h3>
                            <Link href="/admin/service-requests" className="text-xs font-semibold text-emerald-600 hover:underline min-h-[36px] flex items-center">
                                Semua Pengajuan
                            </Link>
                        </div>

                        {recentServiceRequests.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentServiceRequests.map((req) => (
                                    <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 text-xs">
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-slate-900 dark:text-white truncate">
                                                {req.name} ({req.service_type})
                                            </div>
                                            <div className="text-slate-400 mt-0.5 truncate">{req.location} • {formatDate(req.created_at)}</div>
                                        </div>
                                        <div className="flex sm:justify-end shrink-0">
                                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                req.status === 'Baru'
                                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                                    : req.status === 'Diproses'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-xs text-slate-400">Belum ada pengajuan layanan baru.</div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
