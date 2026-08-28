@extends('errors.layout')

@section('code', '404')
@section('badge', 'Tidak Ditemukan')
@section('title', 'Halaman Tidak Ditemukan')
@section('message', $exception->getMessage() ?: 'Halaman atau produk yang Anda cari tidak ditemukan. Periksa kembali alamat tautan Anda.')

@section('icon')
    <svg class="h-10 w-10 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
@endsection

@section('actions')
    <a href="/produk" class="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition">
        Jelajah Katalog Produk
    </a>
@endsection
