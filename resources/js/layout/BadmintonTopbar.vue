<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { useBadmintonLayout } from '@/layout/composables/badmintonLayout';
import LayoutSwitcher from '@/Components/LayoutSwitcher.vue';
import LocaleSwitcher from '@/Components/LocaleSwitcher.vue';
import UserAvatar from '@/Components/UserAvatar.vue';
import { useLocale } from '@/composables/useLocale';

const { t } = useLocale();

const page = usePage();

const unreadCount = computed(() => page.props.unreadChatCount || 0);
const profileMissing = computed(() => (page.props.profileMissingFields || []).length);
const profileMenuVisible = ref(false);

const onDocumentClick = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
        profileMenuVisible.value = false;
    }
};
onMounted(() => document.addEventListener('click', onDocumentClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick));

const navLinks = computed(() => [
    { label: t('nav.home'), href: '/home', icon: 'home' },
    { label: t('nav.myParties'), href: '/my-parties', icon: 'play' },
    { label: t('nav.chat'), href: '/chat', icon: 'chat' },
    { label: t('nav.profile'), href: '/profile', icon: 'user' },
]);

const isActive = (href) => {
    const url = page.url;
    if (href === '/home') {
        return url === '/' || url === '/home';
    }
    return url === href || url.startsWith(href + '/');
};

const isAuthenticated = computed(() => !!page.props.auth?.user);

const toggleProfileMenu = () => {
    profileMenuVisible.value = !profileMenuVisible.value;
};

const userAvatar = computed(() => page.props.auth?.user?.avatar);
const userName = computed(() => page.props.auth?.user?.name || 'User');
</script>

<template>
    <header class="topbar-accent sticky top-0 z-50 h-14 lg:h-16 flex items-center px-4 lg:px-8 bg-base-100/80 backdrop-blur-xl border-b border-base-300">
        <!-- Left: Logo -->
        <div class="flex items-center gap-3 shrink-0">
            <Link href="/home" class="flex items-center no-underline">
                <img src="/icons/logo2.png" alt="Badminton Party" class="h-10 lg:h-12" />
            </Link>
        </div>

        <!-- Center: Desktop nav links -->
        <nav class="hidden lg:flex items-center gap-1 mx-auto">
            <Link
                v-for="link in navLinks"
                :key="link.href"
                :href="link.href"
                class="px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors duration-200"
                :class="isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'"
            >
                <svg v-if="link.icon === 'home'" class="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>
                <svg v-else-if="link.icon === 'play'" class="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span v-else-if="link.icon === 'chat'" class="relative inline-block mr-1.5 -mt-0.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    <span v-if="unreadCount > 0" class="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-1 flex items-center justify-center rounded-full bg-error text-white text-[8px] font-bold leading-none">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
                </span>
                <span v-else-if="link.icon === 'user'" class="relative inline-block mr-1.5 -mt-0.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    <span v-if="profileMissing > 0" class="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-1 flex items-center justify-center rounded-full bg-error text-white text-[8px] font-bold leading-none">{{ profileMissing }}</span>
                </span>
                {{ link.label }}
            </Link>
        </nav>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">
            <!-- Theme switcher -->
            <LocaleSwitcher />
            <LayoutSwitcher />

            <!-- Login button (guest) -->
            <Link v-if="!isAuthenticated" href="/login" class="h-8 px-4 rounded-lg bg-primary text-primary-content text-xs font-semibold no-underline flex items-center hover:bg-primary/80 transition-colors">
                {{ t('auth.login') }}
            </Link>

            <!-- Profile dropdown (authenticated) -->
            <div v-else class="profile-dropdown relative" @click.stop>
                <button
                    @click="toggleProfileMenu"
                    class="relative rounded-full overflow-visible border-2 border-primary/30 cursor-pointer p-0 bg-transparent transition-all hover:border-primary"
                >
                    <UserAvatar :src="userAvatar" :name="userName" size="md" rounded="full" />
                    <span
                        v-if="profileMissing > 0"
                        class="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold leading-none ring-2 ring-base-100"
                    >{{ profileMissing }}</span>
                </button>

                <transition name="page-fade">
                    <div
                        v-if="profileMenuVisible"
                        class="absolute right-0 top-full mt-2 w-48 bg-base-100 rounded-xl shadow-lg border border-base-300 py-2 z-50 animate-slide-up"
                    >
                        <div class="px-4 py-2 border-b border-base-200">
                            <p class="text-sm font-medium text-base-content m-0">{{ userName }}</p>
                        </div>
                        <Link
                            href="/profile"
                            class="flex items-center gap-2 px-4 py-2 text-sm text-base-content/70 hover:bg-base-200 no-underline transition-colors"
                            @click="profileMenuVisible = false"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            {{ t('nav.profile') }}
                        </Link>
                        <Link
                            as="button"
                            :href="route('logout')"
                            method="post"
                            class="flex items-center gap-2 px-4 py-2 text-sm text-base-content/70 hover:bg-base-200 no-underline transition-colors w-full border-0 bg-transparent text-left cursor-pointer font-sans"
                            @click="profileMenuVisible = false"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            {{ t('nav.logout') }}
                        </Link>
                    </div>
                </transition>
            </div>
        </div>
    </header>
</template>
