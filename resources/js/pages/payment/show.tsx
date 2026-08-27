import { Head, Link, router } from '@inertiajs/react';
import { PublicLayout } from '@/layouts/public-layout';
import { formatRupiah, formatDate, getWhatsAppLink } from '@/lib/format';
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    CreditCard, 
    ShoppingBag, 
    PhoneCall, 
    ArrowRight, 
    RefreshCw, 
    ShieldCheck 
} from 'lucide-react';
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
    raw_response?: any;
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
    latest_payment?: Payment;
}

interface PaymentShowProps {
    order: Order;
}

export default function PaymentShow({ order }: PaymentShowProps) {
    const isPaid = order.payment_status === 'Paid' || order.order_status === 'Dibayar';

    const handleSimulatePayment = () => {
        router.post(`/pembayaran/${order.order_number}/simulate-success`, {}, {
            onSuccess: () => {
                toast.success('Simulasi pembayaran berhasil! Status pesanan kini DIBAYAR.');
            },
        });
    };

    const waConfirmationMessage = `Halo CS Dodolan Store, saya ingin mengonfirmasi pesanan #${order.order_number} atas nama ${order.customer_name} (Total: ${formatRupiah(order.total)}). Status pembayaran: ${order.payment_status}.`;

    return (
        <PublicLayout>
            <Head title={`Status Pembayaran #${order.order_number} — Dodolan Store`} />

            {/* Header */}
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full mb-4 shadow-lg">
                        {isPaid ? (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                                <Clock className="h-10 w-10 animate-pulse" />
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        {isPaid ? 'Pembayaran Berhasil Diterima!' : 'Menunggu Konfirmasi Pembayaran'}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                        Nomor Pesanan: <span className="font-mono font-bold text-white">{order.order_number}</span>
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
                {/* Status Alert Banner */}
                {isPaid ? (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50 p-6 dark:bg-emerald-950/30 dark:border-emerald-900 flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-sm text-emerald-900 dark:text-emerald-300">
                            <h3 className="font-bold">Pesanan Anda Telah Lunas &amp; Masuk Antrean Proses</h3>
                            <p className="text-xs text-emerald-800/80 dark:text-emerald-400 leading-relaxed">
                                Terima kasih atas pembayaran Anda. Tim operasional Dodolan Store sedang memverifikasi dan menyiapkan perangkat IoT Anda untuk segera diproses dan dikirim.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-50 p-6 dark:bg-amber-950/30 dark:border-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <Clock className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-sm text-amber-900 dark:text-amber-300">
                                <h3 className="font-bold">Menunggu Pembayaran via Mayar Gateway</h3>
                                <p className="text-xs text-amber-800/80 dark:text-amber-400 leading-relaxed">
                                    Silakan selesaikan pembayaran sesuai instruksi invoice Mayar. Status akan otomatis diperbarui begitu pembayaran terverifikasi.
                                </p>
                            </div>
                        </div>

                        {/* Local Dev Sandbox Test Button */}
                        <button
                            type="button"
                            onClick={handleSimulatePayment}
                            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition active:scale-95"
                            title="Simulasikan status sukses pada mode lokal/sandbox"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Simulasi Bayar Lunas (Dev)</span>
                        </button>
                    </div>
                )}

                {/* Order & Payment Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Data Snapshot */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                            Informasi Pemesan
                        </h3>
                        <div className="space-y-2 text-xs">
                            <div>
                                <span className="text-slate-400 block">Nama Penerima:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{order.customer_name}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Email:</span>
                                <span className="text-slate-700 dark:text-slate-300">{order.customer_email}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">No. WhatsApp/HP:</span>
                                <span className="text-slate-700 dark:text-slate-300">{order.customer_phone}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Alamat Pengiriman:</span>
                                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{order.customer_address}</span>
                            </div>
                            {order.note && (
                                <div>
                                    <span className="text-slate-400 block">Catatan Pesanan:</span>
                                    <span className="text-slate-700 dark:text-slate-300 italic">{order.note}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                            Rincian Transaksi
                        </h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Status Pembayaran:</span>
                                <span className={`font-bold px-2 py-0.5 rounded-md ${
                                    isPaid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                }`}>
                                    {order.payment_status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Status Pesanan:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{order.order_status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Gateway Provider:</span>
                                <span className="font-semibold text-slate-900 dark:text-white">Mayar</span>
                            </div>
                            {order.latest_payment?.payment_reference && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Payment Reference:</span>
                                    <span className="font-mono text-slate-700 dark:text-slate-300">{order.latest_payment.payment_reference}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-400">Tanggal Pesanan:</span>
                                <span className="text-slate-700 dark:text-slate-300">{formatDate(order.created_at)}</span>
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between items-baseline">
                                <span className="font-bold text-slate-900 dark:text-white">Total Tagihan:</span>
                                <span className="font-black text-lg text-slate-900 dark:text-white">{formatRupiah(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Purchased Table */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                        Rincian Item Hardware
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
                </div>

                {/* WhatsApp Support & Catalog CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                    <a
                        href={getWhatsAppLink('6281234567890', waConfirmationMessage)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition"
                    >
                        <PhoneCall className="h-4 w-4" />
                        <span>Konfirmasi / Tanya Status ke WhatsApp</span>
                    </a>

                    <Link
                        href="/produk"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Kembali ke Katalog Produk</span>
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
