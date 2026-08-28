import { Link, router } from '@inertiajs/react';
import { CustomerLayout } from '@/layouts/customer-layout';
import { formatDate } from '@/lib/format';
import { 
    Wrench, 
    MapPin, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Plus,
    Filter
} from 'lucide-react';

interface ServiceRequest {
    id: number;
    service_type: string;
    location: string;
    description: string;
    note: string | null;
    status: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    serviceRequests: {
        data: ServiceRequest[];
        links: PaginationLink[];
        total: number;
    };
    filters: {
        type: string;
        status: string;
    };
}

export default function CustomerServicesIndex({ serviceRequests, filters }: Props) {
    const serviceTypes = [
        { label: 'Semua Layanan', value: '' },
        { label: 'Instalasi', value: 'Instalasi' },
        { label: 'Survey Lokasi', value: 'Survey' },
        { label: 'Maintenance', value: 'Maintenance' },
    ];

    const handleTypeFilter = (typeValue: string) => {
        router.visit('/akun/layanan', {
            data: {
                ...filters,
                type: typeValue,
            },
            preserveState: true,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Baru':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
            case 'Diproses':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300';
            case 'Selesai':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300';
        }
    };

    return (
        <CustomerLayout
            title="Pengajuan Layanan IoT"
            description="Histori permohonan instalasi GPS/MDVR, survey teknis armada, dan maintenance sensor."
            action={
                <Link
                    href="/layanan"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition"
                >
                    <Plus className="h-4 w-4" />
                    <span>Ajukan Layanan Baru</span>
                </Link>
            }
        >
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {serviceTypes.map((type) => {
                    const active = filters.type === type.value;
                    return (
                        <button
                            key={type.label}
                            type="button"
                            onClick={() => handleTypeFilter(type.value)}
                            className={`min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                                active
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs dark:bg-white dark:text-slate-900 dark:border-white'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                            }`}
                        >
                            {type.label}
                        </button>
                    );
                })}
            </div>

            {/* Service Requests List */}
            {serviceRequests.data.length > 0 ? (
                <div className="space-y-4">
                    {serviceRequests.data.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                        <Wrench className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                            Layanan {item.service_type}
                                        </h3>
                                        <p className="text-[11px] text-slate-400">
                                            Diajukan pada {formatDate(item.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <span className={`self-start sm:self-auto inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-bold ${getStatusBadge(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed"><strong>Lokasi:</strong> {item.location}</span>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                    <strong className="text-slate-900 dark:text-white">Deskripsi Kebutuhan:</strong><br />
                                    {item.description}
                                    {item.note && (
                                        <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[11px] italic text-slate-400">
                                            <strong>Catatan Tambahan:</strong> {item.note}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {serviceRequests.links.length > 3 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
                            {serviceRequests.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveState
                                    className={`min-h-[40px] min-w-[40px] flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold transition ${
                                        link.active
                                            ? 'bg-emerald-600 text-white'
                                            : link.url
                                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                                            : 'opacity-40 cursor-not-allowed text-slate-400'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-3 dark:border-slate-800 dark:bg-slate-900">
                    <Wrench className="h-12 w-12 text-slate-300 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Belum ada pengajuan layanan</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Anda belum pernah mengajukan permohonan survey, instalasi, atau maintenance IoT.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/layanan"
                            className="inline-flex min-h-[44px] items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition"
                        >
                            Ajukan Layanan Sekarang
                        </Link>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
