import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { CustomSelect } from '@/components/ui/custom-select';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUploader } from '@/components/ui/image-uploader';
import { formatNumber, formatRupiah } from '@/lib/format';
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

                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                        Edit Informasi Hardware
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category & Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Kategori <span className="text-rose-500">*</span>
                                </label>
                                <CustomSelect
                                    value={data.category_id}
                                    onChange={(val) => setData('category_id', val)}
                                    className="w-full"
                                    options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                                />
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
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                                <div className="relative">
                                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400 select-none">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        required
                                        value={data.price ? formatNumber(data.price) : ''}
                                        onChange={(e) => {
                                            const clean = e.target.value.replace(/[^0-9]/g, '');
                                            setData('price', clean);
                                        }}
                                        placeholder="1.450.000"
                                        className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                                    />
                                </div>
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
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                                />
                                {errors.stock && <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Current Image & Upload */}
                        <ImageUploader
                            id="edit-product-image"
                            label="Ganti Foto Produk (Opsional)"
                            required={false}
                            currentImageUrl={product.image_url}
                            onChange={(file) => setData('image', file)}
                            error={errors.image}
                        />

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Deskripsi Produk
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                            {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
                        </div>

                        {/* Specifications Editor */}
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <span>Spesifikasi Teknis (Key - Value)</span>
                            </label>

                            <div className="space-y-2">
                                {Object.entries(data.specification).map(([k, v]) => (
                                    <div key={k} className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <span className="font-bold w-1/3 text-slate-700 dark:text-slate-300 truncate">{k}</span>
                                        <span className="flex-1 text-slate-600 dark:text-slate-400 font-mono truncate">{v}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpec(k)}
                                            className="text-slate-400 hover:text-rose-600 p-2 rounded-lg"
                                            title="Hapus Spesifikasi"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Spec Row - Mobile Responsive */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                                <input
                                    type="text"
                                    placeholder="Nama Spesifikasi"
                                    value={specKey}
                                    onChange={(e) => setSpecKey(e.target.value)}
                                    className="w-full sm:w-1/3 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Nilai Spesifikasi"
                                    value={specVal}
                                    onChange={(e) => setSpecVal(e.target.value)}
                                    className="w-full sm:flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSpec}
                                    className="min-h-[42px] sm:min-h-0 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 transition"
                                >
                                    + Tambah
                                </button>
                            </div>
                        </div>

                        {/* Status Toggle */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <Checkbox
                                id="status-toggle"
                                checked={data.status}
                                onCheckedChange={(checked) => setData('status', !!checked)}
                            />
                            <label htmlFor="status-toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                Tampilkan Produk di Katalog Publik (Status Aktif)
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3">
                            <Link
                                href="/admin/products"
                                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition"
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
