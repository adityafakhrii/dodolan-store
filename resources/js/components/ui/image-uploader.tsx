import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, FileImage, Loader2, Sparkles } from 'lucide-react';
import { formatFileSize } from '@/lib/format';
import { convertImageToWebp, ConvertedImageResult } from '@/lib/image-converter';
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
    label = 'Gambar',
    required = false,
    currentImageUrl = null,
    onChange,
    error,
    maxSizeMb = 5,
    helperText = 'Maks. 5MB (JPG, PNG, WEBP)',
    className = '',
}: ImageUploaderProps) {
    const [conversion, setConversion] = useState<ConvertedImageResult | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Synchronize currentImageUrl if it changes externally
    useEffect(() => {
        if (!conversion) {
            setPreviewUrl(currentImageUrl);
        }
    }, [currentImageUrl, conversion]);

    const handleFileSelect = async (file: File | null) => {
        if (!file) {
            setConversion(null);
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

        // Validate image type
        if (!file.type.startsWith('image/')) {
            toast.error('File yang dipilih harus berupa gambar (JPG, PNG, WEBP).');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        try {
            setIsConverting(true);
            const result = await convertImageToWebp(file);
            setConversion(result);
            setPreviewUrl(result.previewUrl);
            onChange(result.file);
        } catch (err) {
            console.error('Image convert error:', err);
            // Fallback to original file
            const fallbackResult: ConvertedImageResult = {
                file,
                originalSize: file.size,
                convertedSize: file.size,
                originalType: file.type.split('/')[1]?.toUpperCase() || 'IMAGE',
                previewUrl: URL.createObjectURL(file),
            };
            setConversion(fallbackResult);
            setPreviewUrl(fallbackResult.previewUrl);
            onChange(file);
        } finally {
            setIsConverting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileSelect(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConversion(null);
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

    // Calculate percentage saved
    const savedBytes = conversion ? conversion.originalSize - conversion.convertedSize : 0;
    const savedPercent = conversion && conversion.originalSize > 0 
        ? Math.max(0, Math.round((savedBytes / conversion.originalSize) * 100))
        : 0;

    return (
        <div className={`space-y-1.5 ${className}`}>
            {/* Header Label & Compact Helper Text */}
            {label && (
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
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
                className={`group relative flex items-center gap-3 rounded-xl border-2 border-dashed p-3 sm:p-3.5 transition-all duration-200 cursor-pointer ${
                    error
                        ? 'border-rose-300 bg-rose-50/40 dark:border-rose-800 dark:bg-rose-950/20'
                        : conversion || previewUrl
                        ? 'border-emerald-300 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20'
                        : 'border-slate-200 bg-slate-50/50 hover:border-emerald-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-emerald-600'
                }`}
            >
                {/* Thumbnail Preview or Upload Icon */}
                {isConverting ? (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                ) : previewUrl ? (
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-xs">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                                e.currentTarget.src = '/assets/images/placeholder-product.svg';
                            }}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold">
                            Ganti
                        </div>
                    </div>
                ) : (
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform shadow-xs">
                        <UploadCloud className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                )}

                {/* File Information */}
                <div className="flex-1 min-w-0">
                    {isConverting ? (
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Mengonversi ke WebP &amp; mengompresi gambar...
                        </div>
                    ) : conversion ? (
                        <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white min-w-0">
                                <FileImage className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="truncate">{conversion.file.name}</span>
                            </div>
                            
                            {/* Before vs After Size & Format Info */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                                <span className="line-through text-slate-400">
                                    {formatFileSize(conversion.originalSize)}
                                </span>
                                <span className="text-slate-400">&rarr;</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatFileSize(conversion.convertedSize)}
                                </span>
                                <span className="font-semibold px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] uppercase">
                                    {conversion.file.type.split('/')[1] || 'WEBP'}
                                </span>
                                {savedPercent > 0 && (
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                        (Hemat {savedPercent}%)
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : previewUrl ? (
                        <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Gambar Terpasang
                            </div>
                            <p className="text-[11px] text-slate-500">
                                Klik untuk memilih atau seret gambar baru.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                                Pilih atau seret gambar ke sini
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Klik untuk membuka file explorer.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Action Buttons */}
                {(conversion || previewUrl) && (
                    <div className="shrink-0 flex items-center gap-1.5">
                        {conversion && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-rose-950 dark:hover:text-rose-400 transition cursor-pointer"
                                title="Batalkan Pilihan"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-bold text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1.5 rounded-lg transition shrink-0"
                        >
                            {previewUrl ? 'Ganti' : 'Pilih'}
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
