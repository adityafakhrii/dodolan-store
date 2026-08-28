import { Head, Link, router } from '@inertiajs/react';
import { PublicLayout } from '@/layouts/public-layout';
import { useCart } from '@/hooks/use-cart';
import { formatRupiah } from '@/lib/format';
import { 
    ChevronLeft, 
    ShieldCheck, 
    CreditCard, 
    ArrowRight, 
    Loader2 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
    customer?: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
}

export default function Checkout({ customer }: Props) {
    const { items, itemCount, subtotal, clearCart } = useCart();

    const [form, setForm] = useState({
        customer_name: customer?.name || '',
        customer_email: customer?.email || '',
        customer_phone: customer?.phone || '',
        customer_address: customer?.address || '',
        note: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (items.length === 0) {
            router.visit('/keranjang');
        }
    }, [items]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (items.length === 0) {
            toast.error('Keranjang belanja Anda kosong.');
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                ...form,
                items: items.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    setErrors(result.errors);
                }
                toast.error(result.message || 'Gagal memproses pesanan. Silakan periksa kembali formulir Anda.');
                setSubmitting(false);
                return;
            }

            // Success! Clear cart
            clearCart();
            toast.success('Pesanan berhasil dibuat! Membuka halaman pembayaran...');
            
            // Open Mayar payment link in a NEW TAB if available
            if (result.redirect_url && !result.redirect_url.includes(`/pembayaran/${result.order_number}`)) {
                window.open(result.redirect_url, '_blank');
            }

            // Navigate current tab to the order tracking status page
            router.visit(`/pembayaran/${result.order_number}`);
        } catch (error) {
            toast.error('Terjadi kesalahan koneksi. Silakan coba lagi.');
            setSubmitting(false);
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <PublicLayout>
            <Head title="Checkout Pesanan — Dodolan Store" />

            {/* Header */}
            <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Link href="/keranjang" className="hover:text-emerald-400 flex items-center gap-1">
                            <ChevronLeft className="h-3.5 w-3.5" /> Kembali ke Keranjang
                        </Link>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Checkout &amp; Konfirmasi Pesanan
                    </h1>
                </div>
            </div>

            <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                    {/* Left: Customer Information Form */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                    1. Data Pemesan &amp; Pengiriman
                                </h2>
                            </div>

                            {customer && (
                                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-xs">
                                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                                    <div>
                                        <p className="font-bold">Terhubung dengan Akun Anda ({customer.email})</p>
                                        <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">Data kontak dan alamat pengiriman Anda terisi secara otomatis.</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Nama Lengkap <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.customer_name}
                                        onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                                        placeholder="Contoh: Budi Santoso"
                                        className={`w-full min-h-[44px] rounded-xl border px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-white ${
                                            errors.customer_name ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500'
                                        }`}
                                    />
                                    {errors.customer_name && (
                                        <p className="mt-1 text-xs text-rose-500">{errors.customer_name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            Alamat Email <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={form.customer_email}
                                            onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                                            placeholder="budi@perusahaan.com"
                                            className={`w-full min-h-[44px] rounded-xl border px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-white ${
                                                errors.customer_email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500'
                                            }`}
                                        />
                                        {errors.customer_email && (
                                            <p className="mt-1 text-xs text-rose-500">{errors.customer_email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={form.customer_phone}
                                            onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                                            placeholder="081234567890"
                                            className={`w-full min-h-[44px] rounded-xl border px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-white ${
                                                errors.customer_phone ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500'
                                            }`}
                                        />
                                        {errors.customer_phone && (
                                            <p className="mt-1 text-xs text-rose-500">{errors.customer_phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Alamat Lengkap Pengiriman <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={form.customer_address}
                                        onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
                                        placeholder="Nama jalan, nomor gedung/rumah, kelurahan, kecamatan, kota/kabupaten, kode pos"
                                        className={`w-full rounded-xl border px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-white ${
                                            errors.customer_address ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500'
                                        }`}
                                    />
                                    {errors.customer_address && (
                                        <p className="mt-1 text-xs text-rose-500">{errors.customer_address}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Catatan Khusus Pesanan (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={form.note}
                                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                                        placeholder="Contoh: Titipkan di pos satpam atau hubungi PIC penerima"
                                        className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Notice */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-emerald-600" />
                                <span>2. Pembayaran Otomatis via Mayar</span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Setelah klik tombol konfirmasi di samping/bawah, invoice pembayaran Mayar akan terbuka di tab baru dengan pilihan metode <strong>QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay)</strong>, <strong>Virtual Account</strong>, dan <strong>E-Wallet</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Right: Order Review & Submit */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                                <span>Rincian Item</span>
                                <span className="text-xs font-normal text-slate-400">{itemCount} unit</span>
                            </h3>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-slate-900 dark:text-white truncate">{item.name}</div>
                                            <div className="text-slate-400">{item.quantity} x {formatRupiah(item.price)}</div>
                                        </div>
                                        <div className="font-bold text-slate-900 dark:text-white shrink-0">
                                            {formatRupiah(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-xs">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal Produk</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Biaya Payment Gateway</span>
                                    <span className="font-semibold text-emerald-600">Gratis (Termasuk)</span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Total Pembayaran</span>
                                    <span className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">{formatRupiah(subtotal)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 disabled:opacity-50 transition active:scale-95 cursor-pointer"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Memproses Pesanan...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Bayar Sekarang dengan Mayar</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Security Guarantee Box */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex items-start gap-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 shadow-xs">
                            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Data kontak dan histori transaksi dijamin keamanannya dan hanya digunakan untuk pemrosesan order resmi Dodolan Store.</span>
                        </div>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
