import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { CustomSelect } from '@/components/ui/custom-select';
import { formatRupiah, formatDate, getWhatsAppLink } from '@/lib/format';
import { ChevronLeft, Phone, Mail, MapPin, CreditCard, ShoppingCart, CheckCircle2, Truck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
    id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
}

interface Payment {
    id: number;
    provider: string;
    payment_reference: string;
    amount: number;
    status: string;
    paid_at?: string;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    note?: string;
    subtotal: number;
    total: number;
    payment_status: string;
    order_status: string;
    created_at: string;
    items: OrderItem[];
    payments: Payment[];
}

interface OrderShowProps {
    order: Order;
}

export default function OrderShow({ order }: OrderShowProps) {
    const [status, setStatus] = useState(order.order_status);
    const [updating, setUpdating] = useState(false);

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        router.patch(`/admin/orders/${order.id}/status`, { order_status: status }, {
            onSuccess: () => {
                setUpdating(false);
                toast.success('Status pesanan berhasil diperbarui.');
            },
            onError: () => setUpdating(false),
        });
    };

    const waCustomerMessage = `Halo ${order.customer_name}, kami dari Dodolan Store ingin menginfokan bahwa pesanan Anda #${order.order_number} saat ini berstatus "${order.order_status}".`;

    return (
        <AdminLayout title={`Detail Pesanan #${order.order_number}`}>
            <Head title={`Admin - Pesanan #${order.order_number} — Dodolan Store`} />

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Kembali ke Daftar Pesanan</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left 2 Cols: Order Items & Customer Snapshot */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Header Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nomor Pesanan</span>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white font-mono">
                                        #{order.order_number}
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400 block">Waktu Transaksi</span>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDate(order.created_at)}</span>
                                </div>
                            </div>

                            {/* Customer Details Snapshot */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-slate-400 block">Nama Pemesan:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{order.customer_name}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">Email:</span>
                                    <span className="text-slate-700 dark:text-slate-300">{order.customer_email}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">No. WhatsApp / HP:</span>
                                    <span className="text-slate-700 dark:text-slate-300">{order.customer_phone}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">Alamat Pengiriman:</span>
                                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{order.customer_address}</span>
                                </div>
                                {order.note && (
                                    <div className="sm:col-span-2">
                                        <span className="text-slate-400 block">Catatan Pesanan:</span>
                                        <span className="text-slate-700 dark:text-slate-300 italic">{order.note}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <a
                                    href={getWhatsAppLink(order.customer_phone, waCustomerMessage)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-2 text-xs font-bold hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400"
                                >
                                    <Phone className="h-3.5 w-3.5" />
                                    <span>Hubungi / Notifikasi Customer via WhatsApp</span>
                                </a>
                            </div>
                        </div>

                        {/* Order Items Table */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                                Rincian Hardware (Snapshot Harga)
                            </h3>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {order.items.map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">{item.product_name}</div>
                                            <div className="text-slate-400">{item.quantity} unit x {formatRupiah(item.unit_price)}</div>
                                        </div>
                                        <div className="font-bold text-slate-900 dark:text-white">
                                            {formatRupiah(item.subtotal)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline text-sm">
                                <span className="font-bold text-slate-900 dark:text-white">Total Tagihan:</span>
                                <span className="font-black text-xl text-slate-900 dark:text-white">{formatRupiah(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Status Management & Payment Log */}
                    <div className="space-y-6">
                        {/* Order Status Transition Form */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                                Update Status Pesanan
                            </h3>

                            <form onSubmit={handleUpdateStatus} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Status Progres Saat Ini
                                    </label>
                                    <CustomSelect
                                        value={status}
                                        onChange={(val) => setStatus(val)}
                                        className="w-full"
                                        options={[
                                            { value: 'Menunggu Pembayaran', label: 'Menunggu Pembayaran' },
                                            { value: 'Dibayar', label: 'Dibayar (Lunas)' },
                                            { value: 'Diproses', label: 'Diproses (Packing & QC)' },
                                            { value: 'Dikirim', label: 'Dikirim (Dalam Ekspedisi)' },
                                            { value: 'Selesai', label: 'Selesai (Pesanan Tuntas)' },
                                        ]}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
                                >
                                    {updating ? 'Menyimpan...' : 'Perbarui Status Pesanan'}
                                </button>
                            </form>
                        </div>

                        {/* Payment Gateway Information */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                                Informasi Pembayaran
                            </h3>

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Status Pembayaran:</span>
                                    <span className={`font-bold px-2 py-0.5 rounded-md ${
                                        order.payment_status === 'Paid'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                    }`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Provider:</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Mayar Gateway</span>
                                </div>
                                {order.payments && order.payments.length > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Mayar Reference:</span>
                                        <span className="font-mono text-slate-700 dark:text-slate-300">{order.payments[0].payment_reference}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
