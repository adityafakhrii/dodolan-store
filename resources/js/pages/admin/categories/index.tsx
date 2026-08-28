import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2, Layers, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    status: boolean;
    products_count: number;
}

interface CategoryIndexProps {
    categories: Category[];
}

export default function CategoryIndex({ categories }: CategoryIndexProps) {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form for create / edit
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        status: true,
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        setIsCreating(true);
    };

    const openEditModal = (cat: Category) => {
        setIsCreating(false);
        setEditingCategory(cat);
        setData({
            name: cat.name,
            description: cat.description || '',
            status: cat.status,
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setEditingCategory(null);
                    toast.success('Kategori berhasil diperbarui.');
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    setIsCreating(false);
                    reset();
                    toast.success('Kategori baru berhasil dibuat.');
                },
            });
        }
    };

    const handleDelete = (cat: Category) => {
        if (confirm(`Hapus kategori "${cat.name}"?`)) {
            router.delete(`/admin/categories/${cat.id}`, {
                onSuccess: () => toast.success('Kategori berhasil dihapus.'),
                onError: (err: any) => toast.error(err?.error || 'Gagal menghapus kategori.'),
            });
        }
    };

    return (
        <AdminLayout title="Kelola Kategori Produk">
            <Head title="Admin - Kategori — Dodolan Store" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Kategori Produk ({categories.length})
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelola kelompok produk telematika dan IoT Dodolan Store.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Kategori Baru</span>
                    </button>
                </div>

                {/* Hybrid Responsive Table & Mobile Cards */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    {/* Mobile Cards View (< 768px) */}
                    <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <div key={cat.id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                                {cat.name}
                                            </h3>
                                            <span className="text-[10px] font-mono text-slate-400 block">
                                                /{cat.slug}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            cat.status
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                            {cat.status ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>

                                    {cat.description && (
                                        <p className="text-xs text-slate-500 line-clamp-2">
                                            {cat.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                        <span className="font-semibold text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                                            {cat.products_count} Produk
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(cat)}
                                                className="flex min-h-[40px] items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/50 text-xs font-bold hover:bg-amber-100 transition"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(cat)}
                                                className="flex min-h-[40px] items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                <span>Hapus</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-slate-400">
                                Belum ada kategori yang ditambahkan.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View (>= 768px) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Nama Kategori</th>
                                    <th className="px-5 py-3.5">Slug URL</th>
                                    <th className="px-5 py-3.5">Deskripsi Singkat</th>
                                    <th className="px-5 py-3.5">Jumlah Produk</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                        <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                                            {cat.name}
                                        </td>
                                        <td className="px-5 py-4 font-mono text-slate-500">
                                            /{cat.slug}
                                        </td>
                                        <td className="px-5 py-4 text-slate-500 max-w-sm truncate">
                                            {cat.description || '-'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                                                {cat.products_count} produk
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                cat.status
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                {cat.status ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(cat)}
                                                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition rounded-lg"
                                                    title="Edit Kategori"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(cat)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    title="Hapus Kategori"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create/Edit Modal */}
                {(isCreating || editingCategory) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
                        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xl space-y-5 max-h-[90dvh] overflow-y-auto animate-in fade-in zoom-in-95">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                    {editingCategory ? `Edit Kategori: ${editingCategory.name}` : 'Tambah Kategori Baru'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setEditingCategory(null);
                                    }}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Nama Kategori <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: AI Camera"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Deskripsi Kategori
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Penjelasan ringkas fungsi kategori..."
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Checkbox
                                        id="cat-status"
                                        checked={data.status}
                                        onCheckedChange={(checked) => setData('status', !!checked)}
                                    />
                                    <label htmlFor="cat-status" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                        Aktifkan Kategori
                                    </label>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreating(false);
                                            setEditingCategory(null);
                                        }}
                                        className="w-full sm:w-auto min-h-[44px] flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
                                    >
                                        {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                        <span>Simpan Kategori</span>
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
