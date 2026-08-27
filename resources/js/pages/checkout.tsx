import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { PublicLayout } from '@/layouts/public-layout';
import { useCart } from '@/hooks/use-cart';
import { formatRupiah } from '@/lib/format';
import { ShieldCheck, ArrowRight, ChevronLeft, Loader2, CreditCard, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
    const { items, subtotal, itemCount, clearCart } = useCart();
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        note: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (items.length === 0 && !submitting) {
            router.visit('/keranjang');
        }
    }, [items.length, submitting]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Frontend validation
        const newErrors: Record<string, string> = {};
        if (!form.customer_name.trim()) newErrors.customer_name = 'Nama lengkap wajib diisi.';
        if (!form.customer_email.trim()) newErrors.customer_email = 'Email wajib diisi.';
        if (!form.customer_phone.trim()) newErrors.customer_phone = 'Nomor HP/WhatsApp wajib diisi.';
        if (!form.customer_address.trim()) newErrors.customer_address = 'Alamat pengiriman wajib diisi.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Mohon lengkapi seluruh formulir yang bertanda wajib.');
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                ...form,
                items: items.map((i) => ({
                    id: i.id,
                    quantity: i.quantity,
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

            // Success! Clear cart and redirect
            clearCart();
            toast.success('Pesanan berhasil dibuat! Mengarahkan ke halaman pembayaran...');
            
            if (result.redirect_url) {
                window.location.href = result.redirect_url;
            } else {
                router.visit(`/pembayaran/${result.order_number}`);
            }
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

            <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Customer Information Form */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                1. Data Pemesan &amp; Pengiriman
                            </h2>

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
                                        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-1 dark:bg-slate-800 dark:text-white ${
                                            errors.customer_name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700'
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
                                            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-1 dark:bg-slate-800 dark:text-white ${
                                                errors.customer_email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700'
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
                                            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-1 dark:bg-slate-800 dark:text-white ${
                                                errors.customer_phone ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700'
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
                                        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:ring-1 dark:bg-slate-800 dark:text-white ${
                                            errors.customer_address ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700'
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
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Notice */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-emerald-600" />
                                <span>2. Pembayaran Otomatis via Mayar</span>
                            </h2>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Setelah klik tombol konfirmasi di bawah, Anda akan diarahkan ke invoice pembayaran Mayar yang mendukung metode <strong>QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay)</strong>, <strong>Virtual Account</strong>, dan <strong>Transfer Bank</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Right: Order Review & Submit */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-5">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                                <span>Rincian Item</span>
                                <span className="text-xs font-normal text-slate-400">{itemCount} unit</span>
                            </h3>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto pr-1">
                                {items.map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                                        <div className="min-w-0">
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
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">Total Pembayaran</span>
                                    <span className="font-black text-xl text-slate-900 dark:text-white">{formatRupiah(subtotal)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 px-6 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 disabled:opacity-50 transition active:scale-95"
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
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50 flex items-start gap-3 text-xs text-slate-500">
                            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Data kontak dan histori transaksi dijamin keamanannya dan hanya digunakan untuk pemrosesan order resmi Dodolan Store.</span>
                        </div>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
