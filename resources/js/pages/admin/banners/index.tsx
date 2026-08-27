import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Banner {
    id: number;
    title?: string;
    subtitle?: string;
    cta_text?: string;
    cta_url?: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

interface BannersIndexProps {
    banners: Banner[];
}

export default function BannersIndex({ banners }: BannersIndexProps) {
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<{
        _method?: string;
        image: File | null;
        title: string;
        subtitle: string;
        cta_text: string;
        cta_url: string;
        display_order: number;
        is_active: boolean;
    }>({
        image: null,
        title: '',
        subtitle: '',
        cta_text: '',
        cta_url: '',
        display_order: 1,
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingBanner(null);
        reset();
        setIsCreating(true);
    };

    const openEditModal = (b: Banner) => {
        setIsCreating(false);
        setEditingBanner(b);
        setData({
            _method: 'PUT',
            image: null,
            title: b.title || '',
            subtitle: b.subtitle || '',
            cta_text: b.cta_text || '',
            cta_url: b.cta_url || '',
            display_order: b.display_order,
            is_active: b.is_active,
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBanner) {
            post(`/admin/banners/${editingBanner.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    setEditingBanner(null);
                    toast.success('Banner berhasil diperbarui.');
                },
            });
        } else {
            post('/admin/banners', {
                forceFormData: true,
                onSuccess: () => {
                    setIsCreating(false);
                    reset();
                    toast.success('Banner baru berhasil ditambahkan.');
                },
            });
        }
    };

    const handleDelete = (b: Banner) => {
        if (confirm('Hapus banner promo ini?')) {
            router.delete(`/admin/banners/${b.id}`, {
                onSuccess: () => toast.success('Banner berhasil dihapus.'),
            });
        }
    };

    return (
        <AdminLayout title="Kelola Banner Promo Homepage">
            <Head title="Admin - Banner Promo — Dodolan Store" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Banner Slider Homepage ({banners.length})
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola banner slider utama untuk promosi hardware IoT dan layanan teknis.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Banner Baru</span>
                    </button>
                </div>

                {/* Banners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between"
                        >
                            <div className="aspect-16/9 w-full bg-slate-950 relative overflow-hidden">
                                <img src={banner.image_url} alt={banner.title || 'Banner'} className="h-full w-full object-cover" />
                                <div className="absolute top-3 left-3">
                                    <span className="rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                                        Urutan: {banner.display_order}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-sm ${
                                        banner.is_active ? 'bg-emerald-600' : 'bg-slate-600'
                                    }`}>
                                        {banner.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                                        {banner.title || '(Tanpa Judul)'}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                        {banner.subtitle || '-'}
                                    </p>
                                </div>

                                {banner.cta_url && (
                                    <div className="text-[11px] text-emerald-600 font-semibold truncate pt-2">
                                        CTA: {banner.cta_text || 'Lihat'} &rarr; {banner.cta_url}
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(banner)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 transition"
                                        title="Edit Banner"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(banner)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                                        title="Hapus Banner"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Banner Create/Edit Modal */}
                {(isCreating || editingBanner) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                    {editingBanner ? 'Edit Banner Promo' : 'Tambah Banner Baru'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setEditingBanner(null);
                                    }}
                                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Gambar Banner {editingBanner ? '(Opsional jika ganti)' : <span className="text-rose-500">*</span>}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required={!editingBanner}
                                        onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    />
                                    {errors.image && <p className="mt-1 text-xs text-rose-500">{errors.image}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Judul Banner
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Contoh: Solusi IoT Fleet Management"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Subjudul / Penjelasan
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.subtitle}
                                        onChange={(e) => setData('subtitle', e.target.value)}
                                        placeholder="Keterangan singkat..."
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            Teks Tombol CTA
                                        </label>
                                        <input
                                            type="text"
                                            value={data.cta_text}
                                            onChange={(e) => setData('cta_text', e.target.value)}
                                            placeholder="Jelajahi Produk"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            Link URL CTA
                                        </label>
                                        <input
                                            type="text"
                                            value={data.cta_url}
                                            onChange={(e) => setData('cta_url', e.target.value)}
                                            placeholder="/produk"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            Urutan Tampil
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.display_order}
                                            onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            type="checkbox"
                                            id="banner-status"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <label htmlFor="banner-status" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                            Aktifkan Banner
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreating(false);
                                            setEditingBanner(null);
                                        }}
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                                    >
                                        {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                        <span>Simpan Banner</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
