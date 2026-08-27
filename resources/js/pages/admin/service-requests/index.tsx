import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { AdminLayout } from '@/layouts/admin-layout';
import { formatDate, getWhatsAppLink } from '@/lib/format';
import { Search, Wrench, Phone, Mail, MapPin, CheckCircle2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceRequest {
    id: number;
    name: string;
    email: string;
    phone: string;
    service_type: string;
    location: string;
    description: string;
    note?: string;
    status: string;
    created_at: string;
}

interface ServiceRequestIndexProps {
    requests: {
        data: ServiceRequest[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        q: string;
        status: string;
        service_type: string;
    };
}

export default function ServiceRequestsIndex({ requests, filters }: ServiceRequestIndexProps) {
    const [search, setSearch] = useState(filters.q || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/service-requests', { ...filters, q: search }, { preserveState: true, replace: true });
    };

    const handleFilterChange = (key: string, val: string) => {
        router.get('/admin/service-requests', { ...filters, [key]: val }, { preserveState: true, replace: true });
    };

    const handleStatusUpdate = (req: ServiceRequest, newStatus: string) => {
        router.patch(`/admin/service-requests/${req.id}/status`, { status: newStatus }, {
            onSuccess: () => toast.success(`Status pengajuan berhasil diubah menjadi "${newStatus}".`),
        });
    };

    const handleDelete = (req: ServiceRequest) => {
        if (confirm(`Hapus pengajuan layanan dari "${req.name}"?`)) {
            router.delete(`/admin/service-requests/${req.id}`, {
                onSuccess: () => toast.success('Pengajuan layanan berhasil dihapus.'),
            });
        }
    };

    return (
        <AdminLayout title="Kelola Pengajuan Layanan IoT">
            <Head title="Admin - Service Requests — Dodolan Store" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Pengajuan Layanan Instalasi, Survey &amp; Maintenance ({requests.total})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Tindak lanjuti permintaan teknisi armada dari calon klien atau pelanggan.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    <form onSubmit={handleSearch} className="relative flex-1 w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama pemohon, lokasi, email..."
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </form>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={filters.service_type || ''}
                            onChange={(e) => handleFilterChange('service_type', e.target.value)}
                            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 font-semibold"
                        >
                            <option value="">Semua Jenis Layanan</option>
                            <option value="Instalasi">Instalasi</option>
                            <option value="Survey">Survey</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>

                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 font-semibold"
                        >
                            <option value="">Semua Status</option>
                            <option value="Baru">Baru (Belum Ditindaklanjuti)</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Selesai">Selesai</option>
                        </select>
                    </div>
                </div>

                {/* Service Requests Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5">Pemohon</th>
                                    <th className="px-5 py-3.5">Jenis Layanan</th>
                                    <th className="px-5 py-3.5">Lokasi</th>
                                    <th className="px-5 py-3.5">Deskripsi Kebutuhan</th>
                                    <th className="px-5 py-3.5">Status Progres</th>
                                    <th className="px-5 py-3.5">Tanggal</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {requests.data.length > 0 ? (
                                    requests.data.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">{req.name}</div>
                                                <div className="text-[10px] text-slate-400">{req.phone} • {req.email}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`font-bold px-2 py-0.5 rounded-md ${
                                                    req.service_type === 'Instalasi'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                        : req.service_type === 'Survey'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                                                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                                }`}>
                                                    {req.service_type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                                                {req.location}
                                            </td>
                                            <td className="px-5 py-4 text-slate-500 max-w-sm">
                                                <div className="line-clamp-2">{req.description}</div>
                                                {req.note && <div className="text-[10px] italic text-slate-400 mt-0.5">Catatan: {req.note}</div>}
                                            </td>
                                            <td className="px-5 py-4">
                                                <select
                                                    value={req.status}
                                                    onChange={(e) => handleStatusUpdate(req, e.target.value)}
                                                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                                                        req.status === 'Baru'
                                                            ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                                                            : req.status === 'Diproses'
                                                            ? 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                                                            : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                                    }`}
                                                >
                                                    <option value="Baru">Baru</option>
                                                    <option value="Diproses">Diproses</option>
                                                    <option value="Selesai">Selesai</option>
                                                </select>
                                            </td>
                                            <td className="px-5 py-4 text-slate-400">
                                                {formatDate(req.created_at)}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={getWhatsAppLink(req.phone, `Halo Bapak/Ibu ${req.name}, kami dari tim teknisi Dodolan Store ingin menindaklanjuti pengajuan layanan ${req.service_type} di lokasi ${req.location}.`)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1 font-bold hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400"
                                                        title="Follow up WhatsApp"
                                                    >
                                                        <Phone className="h-3.5 w-3.5" />
                                                        <span>Chat</span>
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(req)}
                                                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                                                        title="Hapus Pengajuan"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                                            Belum ada pengajuan layanan yang sesuai filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {requests.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-center gap-2">
                            {requests.links.map((link, idx) => link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                        link.active ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
