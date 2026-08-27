import { Link } from '@inertiajs/react';
import { ShoppingBag, Eye, Heart, Star, Check } from 'lucide-react';
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
    const discount = discountPercent || (product.id % 2 === 0 ? 15 : 0);
    const originalPrice = discount > 0 ? product.price * (1 + discount / 100) : null;
    const ratingCount = 20 + ((product.id * 7) % 65);

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
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
            {/* Image Box */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-50 border-b border-slate-100 p-3 flex items-center justify-center">
                <Link href={`/produk/${product.slug}`} className="block h-full w-full flex items-center justify-center">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                </Link>

                {/* Top-Left Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {discount > 0 && (
                        <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm tracking-wider">
                            -{discount}%
                        </span>
                    )}
                    {showBadge && (
                        <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            {showBadge}
                        </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            Sisa {product.stock}
                        </span>
                    )}
                    {product.stock <= 0 && (
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            Habis
                        </span>
                    )}
                </div>

                {/* Top-Right Action Buttons */}
                <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
                    <button
                        type="button"
                        onClick={handleToggleLike}
                        className={`flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 transition hover:bg-slate-50 ${
                            liked ? 'text-rose-600' : 'text-slate-600 hover:text-rose-600'
                        }`}
                        title="Simpan ke Wishlist"
                    >
                        <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-rose-600' : ''}`} />
                    </button>
                    <Link
                        href={`/produk/${product.slug}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm border border-slate-200 transition hover:bg-slate-50 hover:text-emerald-600"
                        title="Lihat Detail Produk"
                    >
                        <Eye className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {/* Slide-Up Add To Cart Bar */}
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`absolute inset-x-0 bottom-0 z-10 flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all duration-300 ${
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
            <div className="flex flex-1 flex-col p-4 space-y-2">
                {/* Category Pill */}
                {product.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        {product.category.name}
                    </span>
                )}

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 min-h-10 group-hover:text-emerald-600 transition leading-snug">
                    <Link href={`/produk/${product.slug}`}>
                        {product.name}
                    </Link>
                </h3>

                {/* Price Line */}
                <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-black text-rose-600">
                        {formatRupiah(product.price)}
                    </span>
                    {originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-semibold">
                            {formatRupiah(originalPrice)}
                        </span>
                    )}
                </div>

                {/* Star Ratings & Sold Count */}
                <div className="flex items-center gap-1.5 pt-1 text-xs">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400" />
                        ))}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                        ({ratingCount})
                    </span>
                </div>
            </div>
        </div>
    );
}
