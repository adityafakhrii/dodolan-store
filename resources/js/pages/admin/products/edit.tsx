import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { ChevronLeft, Trash2, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    description?: string;
    image_url: string;
    status: boolean;
}

interface EditProductProps {
    product: Product;
    specification: Record<string, string>;
    categories: Category[];
}

export default function ProductEdit({ product, specification, categories }: EditProductProps) {
    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        category_id: string;
        name: string;
        price: string;
        stock: string;
        description: string;
        specification: Record<string, string>;
        image: File | null;
        status: boolean;
    }>({
        _method: 'PUT',
        category_id: String(product.category_id),
        name: product.name,
        price: String(product.price),
        stock: String(product.stock),
        description: product.description || '',
        specification: specification || {},
        image: null,
        status: Boolean(product.status),
    });

    const [specKey, setSpecKey] = useState('');
    const [specVal, setSpecVal] = useState('');

    const handleAddSpec = () => {
        if (!specKey.trim() || !specVal.trim()) return;
        setData('specification', {
            ...data.specification,
            [specKey.trim()]: specVal.trim(),
        });
        setSpecKey('');
        setSpecVal('');
    };

    const handleRemoveSpec = (keyToRemove: string) => {
        const updated = { ...data.specification };
        delete updated[keyToRemove];
        setData('specification', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}`, {
            forceFormData: true,
            onSuccess: () => toast.success('Produk berhasil diperbarui!'),
            onError: () => toast.error('Mohon periksa isian formulir.'),
        });
    };

    return (
        <AdminLayout title={`Edit Produk: ${product.name}`}>
            <Head title={`Admin - Edit ${product.name} — Dodolan Store`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Kembali ke Daftar Produk</span>
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                        Edit Informasi Hardware
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category & Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Kategori <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white font-semibold"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="mt-1 text-xs text-rose-500">{errors.category_id}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Nama Produk Hardware <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                            </div>
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Harga (IDR) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="1000"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                                />
                                {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Stok Unit <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                                />
                                {errors.stock && <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Current Image & Upload */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Ganti Foto Produk (Opsional)
                            </label>
                            <div className="flex items-center gap-4 mb-2">
                                <img src={product.image_url} alt="Current preview" className="h-16 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 bg-slate-900" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                />
                            </div>
                            {errors.image && <p className="mt-1 text-xs text-rose-500">{errors.image}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Deskripsi Produk
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                            {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
                        </div>

                        {/* Specifications Editor */}
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-emerald-600" />
                                <span>Spesifikasi Teknis (Key - Value)</span>
                            </label>

                            <div className="space-y-2">
                                {Object.entries(data.specification).map(([k, v]) => (
                                    <div key={k} className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <span className="font-bold w-1/3 text-slate-700 dark:text-slate-300">{k}</span>
                                        <span className="flex-1 text-slate-600 dark:text-slate-400 font-mono">{v}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpec(k)}
                                            className="text-slate-400 hover:text-rose-600 p-1"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="text"
                                    placeholder="Nama Spesifikasi"
                                    value={specKey}
                                    onChange={(e) => setSpecKey(e.target.value)}
                                    className="w-1/3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Nilai Spesifikasi"
                                    value={specVal}
                                    onChange={(e) => setSpecVal(e.target.value)}
                                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSpec}
                                    className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600"
                                >
                                    + Tambah
                                </button>
                            </div>
                        </div>

                        {/* Status Toggle */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="status-toggle"
                                checked={data.status}
                                onChange={(e) => setData('status', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="status-toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                Tampilkan Produk di Katalog Publik (Status Aktif)
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                            <Link
                                href="/admin/products"
                                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition"
                            >
                                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                <span>Simpan Perubahan</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
