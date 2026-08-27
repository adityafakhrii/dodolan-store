import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PublicLayout } from '@/layouts/public-layout';
import { ProductCard } from '@/components/product-card';
import { CustomSelect } from '@/components/ui/custom-select';
import { Search, SlidersHorizontal, X, ArrowUpDown, ChevronLeft, ChevronRight, Layers, Filter } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    stock_status: string;
    image_url: string;
    description: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

interface ProductsIndexProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    categories: Category[];
    filters: {
        q: string;
        category: string;
        stock: string;
        sort: string;
    };
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.q || '');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const applyFilter = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) {
            delete (newFilters as any)[key];
        }
        router.get('/produk', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter('q', search);
    };

    const clearAllFilters = () => {
        setSearch('');
        router.get('/produk', {}, { replace: true });
    };

    const hasActiveFilters = Boolean(filters.q || filters.category || filters.stock || (filters.sort && filters.sort !== 'latest'));

    return (
        <PublicLayout>
            <Head title="Katalog Produk IoT & Telematika — Dodolan Store" />

            {/* Page Header Banner */}
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                                <span>Katalog Resmi</span>
                                <span>•</span>
                                <span>{products.total} Total Produk</span>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight mt-1">
                                Perangkat IoT &amp; Telemetri Dodolan
                            </h1>
                            <p className="text-sm text-slate-400 mt-1 max-w-xl">
                                Temukan GPS Tracker, AI MDVR, Kamera Dashcam, CCTV Industri, dan Sensor Telemetri bergaransi resmi.
                            </p>
                        </div>

                        {/* Search Bar in Header */}
                        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama produk / sensor..."
                                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        applyFilter('q', '');
                                    }}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar Filter */}
                    <aside className="hidden lg:block w-64 shrink-0 space-y-6">
                        {/* Filter Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                                <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                                <span>Filter Produk</span>
                            </h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-rose-600 hover:underline font-semibold"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Category List */}
                        <div>
                            <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-3">Kategori</h4>
                            <div className="space-y-1">
                                <button
                                    onClick={() => applyFilter('category', '')}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition text-left ${
                                        !filters.category
                                            ? 'bg-emerald-50 text-emerald-700 font-bold dark:bg-emerald-950/60 dark:text-emerald-400'
                                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                                    }`}
                                >
                                    <span>Semua Kategori</span>
                                </button>
                                {categories.map((cat) => {
                                    const isSelected = filters.category === cat.slug;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => applyFilter('category', isSelected ? '' : cat.slug)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition text-left ${
                                                isSelected
                                                    ? 'bg-emerald-50 text-emerald-700 font-bold dark:bg-emerald-950/60 dark:text-emerald-400'
                                                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                                            }`}
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full dark:bg-slate-800">
                                                {cat.products_count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Stock Filter */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-3">Ketersediaan</h4>
                            <label className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={filters.stock === 'in_stock'}
                                    onChange={(e) => applyFilter('stock', e.target.checked ? 'in_stock' : '')}
                                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
                                />
                                <span>Hanya Stok Tersedia</span>
                            </label>
                        </div>
                    </aside>

                    {/* Product Listing Area */}
                    <div className="flex-1">
                        {/* Control Bar: Mobile Filter Toggle & Sort Selector */}
                        <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
                            <button
                                type="button"
                                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                                className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                                <Filter className="h-4 w-4 text-emerald-600" />
                                <span>Filter {hasActiveFilters && '(Aktif)'}</span>
                            </button>

                            <div className="hidden sm:block text-xs text-slate-500">
                                Menampilkan <span className="font-bold text-slate-900 dark:text-white">{products.data.length}</span> dari {products.total} produk
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Urutkan:</span>
                                <CustomSelect
                                    value={filters.sort || 'latest'}
                                    onChange={(val) => applyFilter('sort', val)}
                                    size="sm"
                                    className="w-48 sm:w-56"
                                    options={[
                                        { value: 'latest', label: 'Produk Terbaru' },
                                        { value: 'price_asc', label: 'Harga: Terendah ke Tertinggi' },
                                        { value: 'price_desc', label: 'Harga: Tertinggi ke Terendah' },
                                        { value: 'name_asc', label: 'Nama: A - Z' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Active Filter Chips */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="text-xs text-slate-400">Filter aktif:</span>
                                {filters.q && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                        Pencarian: "{filters.q}"
                                        <button onClick={() => applyFilter('q', '')} className="hover:text-rose-600"><X className="h-3 w-3" /></button>
                                    </span>
                                )}
                                {filters.category && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                        Kategori: {categories.find((c) => c.slug === filters.category)?.name || filters.category}
                                        <button onClick={() => applyFilter('category', '')} className="hover:text-rose-600"><X className="h-3 w-3" /></button>
                                    </span>
                                )}
                                {filters.stock === 'in_stock' && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                        Stok Tersedia
                                        <button onClick={() => applyFilter('stock', '')} className="hover:text-rose-600"><X className="h-3 w-3" /></button>
                                    </span>
                                )}
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-rose-600 hover:underline font-semibold ml-2"
                                >
                                    Hapus Semua
                                </button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {products.data.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                                    <Search className="h-7 w-7" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                                    Produk Tidak Ditemukan
                                </h3>
                                <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                    Tidak ada produk yang sesuai dengan kriteria filter atau kata kunci pencarian Anda. Silakan coba atur ulang filter.
                                </p>
                                <div className="mt-6">
                                    <button
                                        onClick={clearAllFilters}
                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition"
                                    >
                                        <span>Reset Semua Filter</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                {products.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-3 py-2 text-xs text-slate-400 select-none"
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                                                link.active
                                                    ? 'bg-emerald-600 text-white shadow-xs'
                                                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
