<!DOCTYPE html>
<html lang="id" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('code', 'Error') — @yield('title', 'Terjadi Kesalahan') | Dodolan Store</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800,900" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-10 relative overflow-hidden selection:bg-emerald-500 selection:text-white antialiased">
    <!-- Top Minimal Brand Header -->
    <header class="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" class="flex items-center gap-2.5">
            <span class="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-sm font-black shadow-sm">D</span>
            <span class="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                <span>Dodolan</span><span class="text-emerald-400">Store</span>
            </span>
        </a>
        <a href="/" class="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition">
            Beranda Toko
        </a>
    </header>

    <!-- Main Content Center -->
    <main class="relative z-10 w-full max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 my-auto py-8">
        <!-- Ambient Static Glow -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <!-- Icon -->
        <div class="inline-flex items-center justify-center">
            <div class="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
                @yield('icon')
            </div>
        </div>

        <!-- Code & Subtitle (Clean text, no pill) -->
        <div>
            <div class="text-7xl sm:text-9xl font-black tracking-tight text-slate-100 font-mono">
                @yield('code')
            </div>
            <p class="mt-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400">
                @yield('badge', 'Status Error')
            </p>
        </div>

        <!-- Title & Message -->
        <div class="space-y-3 max-w-lg mx-auto">
            <h1 class="text-xl sm:text-2xl font-bold text-white">
                @yield('title')
            </h1>
            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
                @yield('message')
            </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            @yield('actions')
            <a href="/" class="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg transition">
                Kembali ke Beranda
            </a>
            <button onclick="window.history.back()" class="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs sm:text-sm font-bold transition cursor-pointer">
                Kembali ke Halaman Sebelumnya
            </button>
        </div>
    </main>

    <!-- Bottom Minimal Footer -->
    <footer class="relative z-10 text-center py-4 text-xs text-slate-600">
        <p>&copy; {{ date('Y') }} Dodolan Store. All rights reserved.</p>
    </footer>
</body>
</html>
