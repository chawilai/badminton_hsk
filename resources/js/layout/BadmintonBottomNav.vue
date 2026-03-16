<script setup>
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();

const tabs = [
    { label: 'Home', href: '/home', icon: 'home' },
    { label: 'My Parties', href: '/my-parties', icon: 'play' },
    { label: 'Chat', href: '/chat', icon: 'chat' },
    { label: 'Profile', href: '/profile', icon: 'user' },
];

const isActive = (href) => {
    const url = page.url;
    if (href === '/home') {
        return url === '/home' || url === '/home/' || url === '/party-lists' || url.startsWith('/party-lists/');
    }
    return url === href || url.startsWith(href + '/');
};
</script>

<template>
    <nav class="bottom-nav-safe lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-xl border-t border-base-300">
        <div class="flex items-stretch justify-around h-16">
            <Link
                v-for="tab in tabs"
                :key="tab.href"
                :href="tab.href"
                class="flex flex-col items-center justify-center flex-1 min-w-[44px] min-h-[44px] no-underline transition-colors duration-200 relative"
                :class="isActive(tab.href)
                    ? 'text-primary'
                    : 'text-base-content/50'"
            >
                <!-- Active top indicator -->
                <span
                    v-if="isActive(tab.href)"
                    class="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-primary rounded-b-sm"
                ></span>

                <!-- Home -->
                <svg v-if="tab.icon === 'home'" class="w-5 h-5 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>
                <!-- Play -->
                <svg v-else-if="tab.icon === 'play'" class="w-5 h-5 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <!-- Chat -->
                <svg v-else-if="tab.icon === 'chat'" class="w-5 h-5 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                <!-- User -->
                <svg v-else-if="tab.icon === 'user'" class="w-5 h-5 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>

                <span class="text-[10px] font-medium">{{ tab.label }}</span>
            </Link>
        </div>
    </nav>
</template>
