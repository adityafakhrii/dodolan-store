<?php

use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('settings', function (Request $request) {
        return $request->user()?->is_admin
            ? redirect()->route('admin.settings.index')
            : redirect()->route('customer.profile.edit');
    })->name('profile.edit');

    Route::get('settings/profile', function (Request $request) {
        return $request->user()?->is_admin
            ? redirect()->route('admin.settings.index')
            : redirect()->route('customer.profile.edit');
    });

    Route::get('settings/security', [SecurityController::class, 'edit'])
        ->middleware(RequirePassword::class)
        ->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');
});

Route::get('.well-known/passkey-endpoints', function () {
    return response()->json([
        'enroll' => route('security.edit'),
        'manage' => route('security.edit'),
    ]);
})->name('well-known.passkeys');
