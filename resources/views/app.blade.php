<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- facebook --}}
    <meta property="og:image" content="/icons/icon-512x512.png" />
    {{-- <meta property="og:image:width" content="1200" /> <!-- Optional: Width of image in pixels --> --}}
    {{-- <meta property="og:image:height" content="630" /> <!-- Optional: Height of image in pixels --> --}}
    <meta property="og:url" content="https://badmintonparty.com/party" />
    <meta property="og:title" content="Badminton Party" />
    <meta property="og:description" content="ตั้งปาร์ตี้ จอยปาร์ตี้ ตีแบดมินตัน" />
    <meta property="og:type" content="website" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    {{-- facebook --}}

    <link rel="icon" type="image/png" href="/icons/logo3.png">
    <link rel="apple-touch-icon" href="/icons/logo3.png">
    <link rel="manifest" href="/manifest.webmanifest">
    <meta name="theme-color" content="#1a4731">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Badminton Party">

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
    <script>
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
      }
    </script>
</body>

</html>
