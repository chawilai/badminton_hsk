<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- facebook --}}
    <meta property="og:image" content="{{ Vite::asset('resources/images/warrior_exam.png') }}" />
    {{-- <meta property="og:image:width" content="1200" /> <!-- Optional: Width of image in pixels --> --}}
    {{-- <meta property="og:image:height" content="630" /> <!-- Optional: Height of image in pixels --> --}}
    <meta property="og:url" content="https://hskwarrior.com/warrior_home" />
    <meta property="og:title" content="HSK Warrior" />
    <meta property="og:description" content="เรียนภาษาจีน ผ่านเกม สุดแสนสนุก" />
    <meta property="og:type" content="website" />
    {{-- facebook --}}

    <link rel="icon" type="image/svg+xml" href="{{ Vite::asset('resources/images/warrior_logo.png') }}">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
