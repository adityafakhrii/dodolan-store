import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { CustomSelect } from '@/components/ui/custom-select';
import { formatRupiah } from '@/lib/format';
import { Plus, Search, Edit2, Trash2, Package, Eye, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    status: boolean;
    image_url: string;
    category?: {
        id: number;
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
}

interface ProductIndexProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: Category[];
    filters: {
        q: string;
        category_id: string;
    };
}

export default function ProductIndex({ products, categories, filters }: ProductIndexProps) {
    const [search, setSearch] = useState(filters.q || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/products', { ...filters, q: search }, { preserveState: true, replace: true });
    };

    const handleCategoryFilter = (categoryId: string) => {
        router.get('/admin/products', { ...filters, category_id: categoryId }, { preserveState: true, replace: true });
    };

    const handleDelete = (product: Product) => {
        if (confirm(`Apakah Anda yakin ingin menghapus / mengarsipkan produk "${product.name}"?`)) {
            router.delete(`/admin/products/${product.id}`, {
                onSuccess: () => toast.success('Produk berhasil diperbarui.'),
            });
        }
    };

    return (
        <AdminLayout title="Kelola Katalog Produk IoT">
            <Head title="Admin - Produk — Dodolan Store" />

            <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Daftar Produk Hardware ({products.total})
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola harga, stok unit, spesifikasi teknis, dan gambar produk.
                        </p>
                    </div>

                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Produk Baru</span>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    <form onSubmit={handleSearch} className="relative flex-1 w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama produk..."
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </form>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <CustomSelect
                            value={filters.category_id || ''}
                            onChange={(val) => handleCategoryFilter(val)}
                            className="w-full sm:w-52"
                            size="sm"
                            options={[
                                { value: '', label: 'Semua Kategori' },
                                ...categories.map((c) => ({ value: String(c.id), label: c.name })),
                            ]}
                        />
                    </div>
                </div>

                {/* Hybrid Responsive Table & Mobile Cards */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    {/* Mobile Cards View (< 768px) */}
                    <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                        {products.data.length > 0 ? (
                            products.data.map((product) => (
                                <div key={product.id} className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-16 w-16 shrink-0 rounded-xl object-cover bg-slate-900 border border-slate-200 dark:border-slate-800"
                                        />
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                                    {product.category?.name || 'Umum'}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    product.status
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                    {product.status ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <div className="font-black text-sm text-slate-900 dark:text-white">
                                                {formatRupiah(product.price)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                                        <span className="text-slate-400 text-[11px]">Sisa Stok:</span>
                                        <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                                            product.stock <= 0
                                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                                : product.stock <= 5
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                        }`}>
                                            {product.stock} unit
                                        </span>
                                    </div>

                                    {/* Action Buttons with 44px Touch Targets */}
                                    <div className="grid grid-cols-3 gap-2 pt-1">
                                        <Link
                                            href={`/produk/${product.slug}`}
                                            target="_blank"
                                            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>Lihat</span>
                                        </Link>
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/50 text-xs font-bold hover:bg-amber-100"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            <span>Edit</span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(product)}
                                            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-slate-400">
                                Tidak ada produk yang sesuai dengan kriteria filter.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View (>= 768px) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Produk</th>
                                    <th className="px-5 py-3.5">Kategori</th>
                                    <th className="px-5 py-3.5">Harga Satuan</th>
                                    <th className="px-5 py-3.5">Stok</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {products.data.length > 0 ? (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-10 w-10 shrink-0 rounded-lg object-cover bg-slate-900 border border-slate-200 dark:border-slate-800"
                                                    />
                                                    <div className="min-w-0">
                                                        <span className="font-bold text-slate-900 dark:text-white block truncate max-w-xs">
                                                            {product.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            /{product.slug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                                                {product.category?.name || '-'}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                                                {formatRupiah(product.price)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`font-bold px-2 py-0.5 rounded-md ${
                                                    product.stock <= 0
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                                        : product.stock <= 5
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                }`}>
                                                    {product.stock} unit
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    product.status
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                    {product.status ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/produk/${product.slug}`}
                                                        target="_blank"
                                                        className="p-2 text-slate-400 hover:text-emerald-600 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                                        title="Lihat Halaman Publik"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition rounded-lg"
                                                        title="Edit Produk"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(product)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                                        title="Hapus/Arsipkan"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                                            Tidak ada produk yang sesuai dengan kriteria filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-1.5 sm:gap-2">
                            {products.links.map((link, idx) => link.url ? (
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
