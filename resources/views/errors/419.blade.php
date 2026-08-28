@extends('errors.layout')

@section('code', '419')
@section('badge', 'Sesi Berakhir')
@section('title', 'Sesi Keamanan Kadaluarsa')
@section('message', 'Sesi atau token keamanan Anda telah berakhir karena tidak ada aktivitas. Silakan muat ulang halaman.')

@section('icon')
    <svg class="h-10 w-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
@endsection

@section('actions')
    <button onclick="window.location.reload()" class="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition cursor-pointer">
        Muat Ulang Halaman
    </button>
@endsection
