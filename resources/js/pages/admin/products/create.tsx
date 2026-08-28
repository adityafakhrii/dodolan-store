import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { CustomSelect } from '@/components/ui/custom-select';
import { ChevronLeft, Plus, Trash2, Upload, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
}

interface CreateProductProps {
    categories: Category[];
}

export default function ProductCreate({ categories }: CreateProductProps) {
    const { data, setData, post, processing, errors } = useForm<{
        category_id: string;
        name: string;
        price: string;
        stock: string;
        description: string;
        specification: Record<string, string>;
        image: File | null;
        status: boolean;
    }>({
        category_id: categories[0]?.id ? String(categories[0].id) : '',
        name: '',
        price: '',
        stock: '10',
        description: '',
        specification: {
            'Jaringan': '4G LTE & GSM',
            'Tegangan Operasional': '9V - 36V DC',
            'Garansi': '1 Tahun Resmi Dodolan',
        },
        image: null,
        status: true,
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
        post('/admin/products', {
            forceFormData: true,
            onSuccess: () => toast.success('Produk baru berhasil disimpan!'),
            onError: () => toast.error('Mohon periksa isian formulir.'),
        });
    };

    return (
        <AdminLayout title="Tambah Produk Baru">
            <Head title="Admin - Tambah Produk — Dodolan Store" />

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
                        Informasi Perangkat IoT
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
                                    placeholder="Contoh: Dodolan AI MDVR FleetGuard (MD-404)"
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
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="1000"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="Contoh: 1450000"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
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
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                                />
                                {errors.stock && <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                Foto / Ilustrasi Produk
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            />
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
                                placeholder="Jelaskan kegunaan perangkat, fitur utama, dan keunggulan teknologi..."
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                            {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
                        </div>

                        {/* Specifications Key-Value Editor */}
                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>Spesifikasi Teknis (Key - Value)</span>
                            </label>

                            {/* Existing Specs */}
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
                                    placeholder="Nama Spesifikasi (misal: Resolusi)"
                                    value={specKey}
                                    onChange={(e) => setSpecKey(e.target.value)}
                                    className="w-full sm:w-1/3 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Nilai (misal: 1080P Full HD)"
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
                            <input
                                type="checkbox"
                                id="status-toggle"
                                checked={data.status}
                                onChange={(e) => setData('status', e.target.checked)}
                                className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="status-toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
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
                                <span>Simpan Produk Baru</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
