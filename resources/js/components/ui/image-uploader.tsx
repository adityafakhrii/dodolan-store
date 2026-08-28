import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, FileImage } from 'lucide-react';
import { formatFileSize } from '@/lib/format';
import { toast } from 'sonner';

interface ImageUploaderProps {
    id?: string;
    label?: string;
    required?: boolean;
    currentImageUrl?: string | null;
    onChange: (file: File | null) => void;
    error?: string;
    maxSizeMb?: number;
    helperText?: string;
    className?: string;
}

export function ImageUploader({
    id = 'image-upload',
    label = 'Unggah Gambar',
    required = false,
    currentImageUrl = null,
    onChange,
    error,
    maxSizeMb = 5,
    helperText = 'Format JPG, PNG, WEBP (Maks. 5MB) • Auto-convert ke WebP & kompresi',
    className = '',
}: ImageUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Synchronize currentImageUrl if it changes externally
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(currentImageUrl);
        }
    }, [currentImageUrl, selectedFile]);

    const handleFileSelect = (file: File | null) => {
        if (!file) {
            setSelectedFile(null);
            setPreviewUrl(currentImageUrl);
            onChange(null);
            return;
        }

        // Validate max size (5MB by default)
        const maxBytes = maxSizeMb * 1024 * 1024;
        if (file.size > maxBytes) {
            toast.error(`Ukuran gambar terlalu besar (${formatFileSize(file.size)}). Maksimal ${maxSizeMb}MB.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validate type
        if (!file.type.startsWith('image/')) {
            toast.error('File yang dipilih harus berupa gambar (JPG, PNG, WEBP).');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        onChange(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileSelect(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onChange(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0] || null;
        handleFileSelect(file);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 cursor-pointer">
                        {label} {required && <span className="text-rose-500">*</span>}
                    </label>
                    {helperText && (
                        <span className="text-[11px] text-slate-400 font-normal">
                            {helperText}
                        </span>
                    )}
                </div>
            )}

            {/* Hidden Native File Input */}
            <input
                ref={fileInputRef}
                id={id}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handleInputChange}
                className="hidden"
            />

            {/* Interactive Upload Box */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`group relative flex flex-col sm:flex-row items-center gap-4 rounded-2xl border-2 border-dashed p-4 transition-all duration-200 cursor-pointer ${
                    error
                        ? 'border-rose-300 bg-rose-50/40 dark:border-rose-800 dark:bg-rose-950/20'
                        : selectedFile || previewUrl
                        ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20'
                        : 'border-slate-200 bg-slate-50/50 hover:border-emerald-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-emerald-600'
                }`}
            >
                {/* Thumbnail Preview or Upload Icon */}
                {previewUrl ? (
                    <div className="relative h-20 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
                        <img
                            src={previewUrl}
                            alt="Preview Gambar"
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                                e.currentTarget.src = '/assets/images/placeholder-product.svg';
                            }}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            Ganti
                        </div>
                    </div>
                ) : (
                    <div className="flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform shadow-xs">
                        <UploadCloud className="h-7 w-7" />
                    </div>
                )}

                {/* File Information / Prompt Text */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                    {selectedFile ? (
                        <div className="space-y-1">
                            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-900 dark:text-white truncate">
                                <FileImage className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="truncate">{selectedFile.name}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-500">
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {formatFileSize(selectedFile.size)}
                                </span>
                                <span>&bull;</span>
                                <span className="uppercase">{selectedFile.type.split('/')[1] || 'IMAGE'}</span>
                                <span>&bull;</span>
                                <span className="text-emerald-700 dark:text-emerald-300 font-medium">Siap di-upload</span>
                            </div>
                        </div>
                    ) : previewUrl ? (
                        <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Gambar Terpasang Saat Ini
                            </div>
                            <p className="text-[11px] text-slate-500">
                                Klik area ini atau seret file baru untuk mengganti gambar.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                                Klik untuk memilih gambar atau seret file ke sini
                            </div>
                            <p className="text-[11px] text-slate-400 leading-normal">
                                Otomatis dikonversi ke WebP &amp; dikompresi untuk performa toko maksimal.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Action: Change / Clear Button */}
                {(selectedFile || previewUrl) && (
                    <div className="shrink-0 flex items-center gap-2">
                        {selectedFile && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-950 dark:hover:text-rose-400 transition cursor-pointer"
                                title="Hapus Pilihan Gambar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-2 rounded-xl transition hover:bg-emerald-100"
                        >
                            {previewUrl ? 'Ganti Foto' : 'Pilih File'}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {error}
                </p>
            )}
        </div>
    );
}
