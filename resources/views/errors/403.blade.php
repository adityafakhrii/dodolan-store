@extends('errors.layout')

@section('code', '403')
@section('badge', 'Area Khusus & Hak Akses Terbatas')
@section('title', 'Akses Ditolak (Forbidden)')
@section('message', $exception->getMessage() ?: 'Maaf, Anda tidak memiliki izin atau hak akses administrator untuk membuka halaman ini.')

@section('icon')
    <svg class="h-10 w-10 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
@endsection
