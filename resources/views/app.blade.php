<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- facebook --}}
    <meta property="og:image" content="{{ Vite::asset('resources/assets/images/badminton_party_no_bg.png') }}" />
    {{-- <meta property="og:image:width" content="1200" /> <!-- Optional: Width of image in pixels --> --}}
    {{-- <meta property="og:image:height" content="630" /> <!-- Optional: Height of image in pixels --> --}}
    <meta property="og:url" content="https://badmintonparty.com/party" />
    <meta property="og:title" content="Badminton Party" />
    <meta property="og:description" content="ตั้งปาร์ตี้ จอยปาร์ตี้ ตีแบดมินตัน" />
    <meta property="og:type" content="website" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    {{-- facebook --}}

    <link rel="icon" type="image/svg+xml" href="{{ Vite::asset('resources/assets/images/badminton_party_no_bg.png') }}">

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

    {{-- Mobile debug overlay - remove after fixing --}}
    <div id="mobile-debug" style="display:none;position:fixed;bottom:70px;left:8px;right:8px;max-height:200px;overflow:auto;background:rgba(0,0,0,0.85);color:#f87171;font-size:11px;padding:8px 12px;border-radius:8px;z-index:99999;font-family:monospace;word-break:break-all;"></div>
    <script>
        (function(){
            var dbg = document.getElementById('mobile-debug');
            var logs = [];
            function show(type, args) {
                logs.push('[' + type + '] ' + Array.from(args).map(function(a){
                    try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
                    catch(e) { return String(a); }
                }).join(' '));
                if (logs.length > 20) logs.shift();
                dbg.style.display = 'block';
                dbg.innerHTML = logs.join('<br>');
                dbg.scrollTop = dbg.scrollHeight;
            }
            var origError = console.error;
            console.error = function() { origError.apply(console, arguments); show('ERR', arguments); };
            window.addEventListener('error', function(e) { show('ERR', [e.message, e.filename + ':' + e.lineno]); });
            window.addEventListener('unhandledrejection', function(e) { show('REJ', [e.reason]); });
        })();
    </script>
</body>

</html>
