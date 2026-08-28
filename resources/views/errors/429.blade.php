@extends('errors.layout')

@section('code', '429')
@section('badge', 'Batas Akses')
@section('title', 'Terlalu Banyak Permintaan')
@section('message', 'Sistem mendeteksi terlalu banyak permintaan dari perangkat Anda dalam waktu singkat. Harap tunggu beberapa saat.')

@section('icon')
    <svg class="h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
@endsection

@section('actions')
    <button onclick="window.location.reload()" class="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition cursor-pointer">
        Coba Lagi
    </button>
@endsection
