import { Link } from '@inertiajs/react';
import { ShoppingBag, Eye, Heart, Check, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { formatRupiah } from '@/lib/format';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';

export interface ProductCardProps {
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        stock: number;
        stock_status: string;
        image_url: string;
        description?: string;
        category?: {
            id: number;
            name: string;
            slug: string;
        };
    };
    showBadge?: string;
    discountPercent?: number;
}

export function ProductCard({ product, showBadge, discountPercent }: ProductCardProps) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    const [liked, setLiked] = useState(false);

    const isOutOfStock = product.stock <= 0;
    const discount = discountPercent || 0;
    const originalPrice = discount > 0 ? product.price * (1 + discount / 100) : null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;

        addItem(product, 1);
        setAdded(true);
        toast.success(`${product.name} berhasil ditambahkan ke keranjang.`);
        setTimeout(() => setAdded(false), 1500);
    };

    const handleToggleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
        toast.info(liked ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            {/* Image Box */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-50 border-b border-slate-100 dark:bg-slate-950 dark:border-slate-800 p-2 sm:p-3 flex items-center justify-center">
                <Link href={`/produk/${product.slug}`} className="block h-full w-full flex items-center justify-center">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                </Link>

                {/* Top-Left Badges */}
                <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 sm:gap-1.5 z-10 pointer-events-none">
                    {discount > 0 && (
                        <span className="rounded-md bg-rose-600 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-extrabold text-white shadow-xs tracking-wider">
                            -{discount}%
                        </span>
                    )}
                    {showBadge && (
                        <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
                            {showBadge}
                        </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="rounded-md bg-amber-500 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
                            Sisa {product.stock}
                        </span>
                    )}
                    {product.stock <= 0 && (
                        <span className="rounded-md bg-slate-800 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
                            Habis
                        </span>
                    )}
                </div>

                {/* Top-Right Action Buttons */}
                <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 flex flex-col gap-1 sm:gap-1.5 z-10">
                    <button
                        type="button"
                        onClick={handleToggleLike}
                        className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs shadow-xs border border-slate-200 transition hover:bg-slate-50 dark:bg-slate-900/90 dark:border-slate-700 ${
                            liked ? 'text-rose-600' : 'text-slate-600 hover:text-rose-600 dark:text-slate-300'
                        }`}
                        title="Simpan ke Wishlist"
                    >
                        <Heart className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${liked ? 'fill-rose-600' : ''}`} />
                    </button>
                    <Link
                        href={`/produk/${product.slug}`}
                        className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-600 shadow-xs border border-slate-200 transition hover:bg-slate-50 hover:text-emerald-600 dark:bg-slate-900/90 dark:border-slate-700 dark:text-slate-300"
                        title="Lihat Detail Produk"
                    >
                        <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Link>
                </div>

                {/* Slide-Up Add To Cart Bar */}
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`absolute inset-x-0 bottom-0 z-10 hidden sm:flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all duration-300 ${
                        isOutOfStock
                            ? 'bg-slate-800/90 text-slate-400 cursor-not-allowed translate-y-full group-hover:translate-y-0'
                            : added
                            ? 'bg-emerald-600 text-white translate-y-0'
                            : 'bg-slate-900 text-white hover:bg-emerald-600 translate-y-full group-hover:translate-y-0 shadow-lg'
                    }`}
                >
                    {added ? (
                        <>
                            <Check className="h-4 w-4" />
                            <span>Tersimpan di Keranjang</span>
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="h-4 w-4" />
                            <span>{isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}</span>
                        </>
                    )}
                </button>
            </div>

            {/* Info Body */}
            <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-4">
                <div className="space-y-1 sm:space-y-1.5">
                    {/* Category */}
                    {product.category ? (
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 truncate block">
                            {product.category.name}
                        </span>
                    ) : (
                        <span className="text-[9px] sm:text-[10px] opacity-0 block select-none">
                            &nbsp;
                        </span>
                    )}

                    {/* Title with fixed height */}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 h-8 sm:h-10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
                        <Link href={`/produk/${product.slug}`} className="line-clamp-2">
                            {product.name}
                        </Link>
                    </h3>

                    {/* Price Line */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 pt-0.5 min-h-9 sm:min-h-7 justify-center">
                        <span className="text-xs sm:text-base font-black text-rose-600 dark:text-rose-500 leading-tight">
                            {formatRupiah(product.price)}
                        </span>
                        {originalPrice ? (
                            <span className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold leading-tight">
                                {formatRupiah(originalPrice)}
                            </span>
                        ) : null}
                    </div>
                </div>

                {/* Real Meta & Mobile Quick Add */}
                <div className="mt-2.5 pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Garansi Resmi 1 Thn</span>
                    </div>

                    {/* Mobile Quick Cart Button */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`sm:hidden flex h-7 w-7 items-center justify-center rounded-lg shadow-xs transition active:scale-95 ${
                            isOutOfStock
                                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                : added
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 text-white hover:bg-emerald-600 dark:bg-slate-800'
                        }`}
                        title="Tambah ke Keranjang"
                    >
                        {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
