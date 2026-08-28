import { Head, Link, router, usePage } from '@inertiajs/react';
import { PublicLayout } from '@/layouts/public-layout';
import { useCart } from '@/hooks/use-cart';
import { formatRupiah } from '@/lib/format';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, ShieldCheck, ChevronLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
    const { auth } = usePage<{ auth?: { user?: any } }>().props;
    const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();

    const handleProceedToCheckout = () => {
        if (items.length === 0) return;

        if (!auth?.user) {
            toast.info('Silakan masuk atau daftar akun terlebih dahulu untuk melanjutkan ke checkout.');
            router.visit('/login');
            return;
        }

        router.visit('/checkout');
    };

    return (
        <PublicLayout>
            <Head title="Keranjang Belanja — Dodolan Store" />

            {/* Header */}
            <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Keranjang Belanja
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Periksa item perangkat IoT pilihan Anda sebelum melanjutkan ke formulir checkout.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Daftar Produk ({itemCount} unit)
                                </span>
                                <button
                                    onClick={() => {
                                        clearCart();
                                        toast.info('Keranjang berhasil dikosongkan.');
                                    }}
                                    className="min-h-[36px] flex items-center text-xs text-rose-600 hover:underline font-bold"
                                >
                                    Kosongkan Keranjang
                                </button>
                            </div>

                            <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs overflow-hidden">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* Thumbnail & Product Info */}
                                        <div className="flex items-start gap-3.5 w-full sm:w-auto flex-1 min-w-0">
                                            <Link href={`/produk/${item.slug}`} className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                                            </Link>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <Link href={`/produk/${item.slug}`} className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-600 dark:text-white line-clamp-2">
                                                    {item.name}
                                                </Link>
                                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                    {formatRupiah(item.price)}
                                                </div>
                                                {item.stock <= 5 && (
                                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">
                                                        Sisa stok: {item.stock} unit
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity Stepper & Price on Mobile Bar */}
                                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300"
                                                    aria-label="Kurangi jumlah"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                    className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-30 dark:text-slate-300"
                                                    aria-label="Tambah jumlah"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="text-right font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white min-w-[90px] sm:min-w-[110px]">
                                                {formatRupiah(item.price * item.quantity)}
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    removeItem(item.id);
                                                    toast.info(`${item.name} dihapus dari keranjang.`);
                                                }}
                                                className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                                                title="Hapus Item"
                                                aria-label="Hapus produk dari keranjang"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/produk"
                                    className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span>Lanjut Belanja Produk Lain</span>
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary Card */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                                    Ringkasan Pesanan
                                </h3>

                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Total Jumlah Unit</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{itemCount} unit</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Subtotal Hardware</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Metode Pembayaran</span>
                                        <span className="font-semibold text-emerald-600">Mayar Payment</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Total Tagihan</span>
                                    <span className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">{formatRupiah(subtotal)}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleProceedToCheckout}
                                    className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition active:scale-95 cursor-pointer"
                                >
                                    <span>Lanjut ke Form Checkout</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Trust Badge */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900/50 flex items-start gap-3 text-xs text-slate-500">
                                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Transaksi aman terenkripsi &amp; didukung oleh gateway pembayaran Mayar resmi.</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart State */
                    <div className="rounded-3xl border border-dashed border-slate-300 p-16 text-center dark:border-slate-800 max-w-xl mx-auto">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                            <ShoppingBag className="h-8 w-8" />
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                            Keranjang Belanja Masih Kosong
                        </h2>
                        <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                            Anda belum menambahkan perangkat IoT ke dalam keranjang. Silakan jelajahi katalog kami untuk menemukan produk yang sesuai.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/produk"
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition"
                            >
                                <span>Jelajahi Katalog Produk</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
