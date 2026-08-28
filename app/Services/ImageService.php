<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Upload an image file, automatically convert to WebP, compress, and store it.
     *
     * @param  UploadedFile  $file
     * @param  string  $directory  e.g. 'products', 'banners'
     * @param  int  $quality  1-100 (default 82)
     * @param  int  $maxDimension  Maximum width or height (default 1920)
     * @return string Path relative to public disk (e.g. 'products/abc123xyz.webp')
     */
    public static function uploadAndConvertToWebp(
        UploadedFile $file,
        string $directory = 'uploads',
        int $quality = 82,
        int $maxDimension = 1920
    ): string {
        $extension = strtolower($file->getClientOriginalExtension());
        $mime = $file->getMimeType();

        // If it's an SVG, preserve SVG format
        if ($extension === 'svg' || $mime === 'image/svg+xml') {
            return $file->store($directory, 'public');
        }

        // Try converting using GD
        try {
            $imageContent = file_get_contents($file->getRealPath());
            $srcImage = @imagecreatefromstring($imageContent);

            if ($srcImage !== false) {
                $origWidth = imagesx($srcImage);
                $origHeight = imagesy($srcImage);

                // Calculate scaled dimensions if larger than maxDimension
                $targetWidth = $origWidth;
                $targetHeight = $origHeight;

                if ($origWidth > $maxDimension || $origHeight > $maxDimension) {
                    if ($origWidth >= $origHeight) {
                        $targetWidth = $maxDimension;
                        $targetHeight = (int) round(($origHeight / $origWidth) * $maxDimension);
                    } else {
                        $targetHeight = $maxDimension;
                        $targetWidth = (int) round(($origWidth / $origHeight) * $maxDimension);
                    }
                }

                // Create truecolor canvas with alpha transparency support
                $dstImage = imagecreatetruecolor($targetWidth, $targetHeight);
                imagealphablending($dstImage, false);
                imagesavealpha($dstImage, true);
                $transparent = imagecolorallocatealpha($dstImage, 0, 0, 0, 127);
                imagefilledrectangle($dstImage, 0, 0, $targetWidth, $targetHeight, $transparent);

                // Resample with high quality interpolation
                imagecopyresampled(
                    $dstImage,
                    $srcImage,
                    0, 0, 0, 0,
                    $targetWidth,
                    $targetHeight,
                    $origWidth,
                    $origHeight
                );

                // Capture WebP output in buffer
                ob_start();
                imagewebp($dstImage, null, $quality);
                $webpData = ob_get_clean();

                imagedestroy($srcImage);
                imagedestroy($dstImage);

                if ($webpData !== false && strlen($webpData) > 0) {
                    $filename = Str::random(40) . '.webp';
                    $relativePath = trim($directory, '/') . '/' . $filename;
                    Storage::disk('public')->put($relativePath, $webpData);

                    return $relativePath;
                }
            }
        } catch (\Throwable $e) {
            report($e);
        }

        // Fallback to standard Laravel file storage if conversion failed
        return $file->store($directory, 'public');
    }

    /**
     * Delete an image from public storage if it exists.
     *
     * @param  string|null  $path
     * @return void
     */
    public static function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
