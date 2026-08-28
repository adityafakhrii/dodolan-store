@extends('errors.layout')

@section('code', $exception->getStatusCode())
@section('badge', 'Status ' . $exception->getStatusCode())
@section('title', $exception->getMessage() ?: 'Terjadi Kesalahan')
@section('message', 'Permintaan Anda tidak dapat diproses saat ini. Silakan periksa kembali tautan Anda atau kembali ke halaman utama.')

@section('icon')
    <svg class="h-10 w-10 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
@endsection

@section('actions')
    <a href="/" class="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition">
        Kembali ke Beranda
    </a>
@endsection
