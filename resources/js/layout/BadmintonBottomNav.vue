<script setup>
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();

const tabs = [
    { label: 'Home', href: '/home', icon: 'pi pi-home' },
    { label: 'My Parties', href: '/my-parties', icon: 'pi pi-play' },
    { label: 'Chat', href: '/chat', icon: 'pi pi-comments' },
    { label: 'Profile', href: '/profile', icon: 'pi pi-user' },
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
    <nav class="bottom-nav-safe lg:tw-hidden tw-fixed tw-bottom-0 tw-left-0 tw-right-0 tw-z-50 tw-bg-white/90 dark:tw-bg-court-950/90 tw-backdrop-blur-xl tw-border-t tw-border-gray-200 dark:tw-border-court-800">
        <div class="tw-flex tw-items-stretch tw-justify-around tw-h-16">
            <Link
                v-for="tab in tabs"
                :key="tab.href"
                :href="tab.href"
                class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-min-w-[44px] tw-min-h-[44px] tw-no-underline tw-transition-colors tw-duration-200 tw-relative"
                :class="isActive(tab.href)
                    ? 'tw-text-court-500 dark:tw-text-court-400'
                    : 'tw-text-gray-400 dark:tw-text-gray-500'"
            >
                <!-- Active top indicator -->
                <span
                    v-if="isActive(tab.href)"
                    class="tw-absolute tw-top-0 tw-left-1/2 tw--translate-x-1/2 tw-w-5 tw-h-[3px] tw-bg-court-500 tw-rounded-b-sm"
                ></span>
                <i :class="tab.icon" class="tw-text-lg tw-mb-1"></i>
                <span class="tw-text-[10px] tw-font-medium">{{ tab.label }}</span>
            </Link>
        </div>
    </nav>
</template>
