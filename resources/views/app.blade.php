<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <style>
            html {
                background-color: #ffffff;
            }
        </style>

        <link rel="icon" type="image/png" href="/assets/logo/logo-only.png">
        <link rel="shortcut icon" href="/assets/logo/logo-only.png">
        <link rel="apple-touch-icon" href="/assets/logo/logo-only.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Dodolan Store') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased bg-white text-slate-900">
        <x-inertia::app />
    </body>
</html>
