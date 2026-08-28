export interface ConvertedImageResult {
    file: File;
    originalSize: number;
    convertedSize: number;
    originalType: string;
    previewUrl: string;
}

/**
 * Konversi gambar di sisi browser secara instan ke format WebP & kompresi.
 */
export async function convertImageToWebp(
    file: File,
    quality = 0.82,
    maxDimension = 1920
): Promise<ConvertedImageResult> {
    const originalType = file.type.split('/')[1]?.toUpperCase() || 'IMAGE';

    // Jika SVG, pertahankan SVG asli
    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        return {
            file,
            originalSize: file.size,
            convertedSize: file.size,
            originalType: 'SVG',
            previewUrl: URL.createObjectURL(file),
        };
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxDimension || height > maxDimension) {
                    if (width >= height) {
                        height = Math.round((height / width) * maxDimension);
                        width = maxDimension;
                    } else {
                        width = Math.round((width / height) * maxDimension);
                        height = maxDimension;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    resolve({
                        file,
                        originalSize: file.size,
                        convertedSize: file.size,
                        originalType,
                        previewUrl: URL.createObjectURL(file),
                    });
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Cek apakah browser mendukung export toBlob webp
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve({
                                file,
                                originalSize: file.size,
                                convertedSize: file.size,
                                originalType,
                                previewUrl: URL.createObjectURL(file),
                            });
                            return;
                        }

                        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                        const newFileName = `${nameWithoutExt}.webp`;
                        const webpFile = new File([blob], newFileName, {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });

                        resolve({
                            file: webpFile,
                            originalSize: file.size,
                            convertedSize: blob.size,
                            originalType,
                            previewUrl: URL.createObjectURL(blob),
                        });
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = () => {
                resolve({
                    file,
                    originalSize: file.size,
                    convertedSize: file.size,
                    originalType,
                    previewUrl: URL.createObjectURL(file),
                });
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            resolve({
                file,
                originalSize: file.size,
                convertedSize: file.size,
                originalType,
                previewUrl: URL.createObjectURL(file),
            });
        };

        reader.readAsDataURL(file);
    });
}
