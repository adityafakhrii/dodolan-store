@extends('errors.layout')

@section('code', '500')
@section('badge', 'Gangguan Sistem')
@section('title', 'Terjadi Kesalahan Server')
@section('message', 'Terjadi gangguan teknis pada server kami. Tim teknis sedang menangani masalah ini.')

@section('icon')
    <svg class="h-10 w-10 text-rose-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
@endsection

@section('actions')
    <a href="/" class="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition">
        Muat Ulang Beranda
    </a>
@endsection
