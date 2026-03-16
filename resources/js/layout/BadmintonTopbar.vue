<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { useBadmintonLayout } from '@/layout/composables/badmintonLayout';
import LayoutSwitcher from '@/Components/LayoutSwitcher.vue';
import UserAvatar from '@/Components/UserAvatar.vue';

const { isDarkMode, toggleDarkMode } = useBadmintonLayout();
const page = usePage();

const profileMenuVisible = ref(false);

// Close dropdown on outside click
const onDocumentClick = (e) => {
    if (!e.target.closest('.profile-dropdown')) {
        profileMenuVisible.value = false;
    }
};
onMounted(() => document.addEventListener('click', onDocumentClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick));

const navLinks = [
    { label: 'Party Lists', href: '/party-lists', icon: 'pi pi-list' },
    { label: 'My Parties', href: '/my-parties', icon: 'pi pi-play' },
    { label: 'Chat', href: '/chat', icon: 'pi pi-comments' },
    { label: 'Profile', href: '/profile', icon: 'pi pi-user' },
];

const isActive = (href) => {
    const url = page.url;
    return url === href || url.startsWith(href + '/');
};

const toggleProfileMenu = () => {
    profileMenuVisible.value = !profileMenuVisible.value;
};

const userAvatar = computed(() => page.props.auth?.user?.avatar);
const userName = computed(() => page.props.auth?.user?.name || 'User');
</script>

<template>
    <header class="topbar-accent tw-sticky tw-top-0 tw-z-50 tw-h-14 lg:tw-h-16 tw-flex tw-items-center tw-px-4 lg:tw-px-8 tw-bg-white/80 dark:tw-bg-court-950/80 tw-backdrop-blur-xl tw-border-b tw-border-gray-200 dark:tw-border-court-800">
        <!-- Left: Logo -->
        <div class="tw-flex tw-items-center tw-gap-3 tw-shrink-0">
            <Link href="/home" class="tw-flex tw-items-center tw-gap-2 tw-no-underline">
                <span class="tw-text-2xl">🏸</span>
                <span class="tw-font-bold tw-text-lg tw-text-court-600 dark:tw-text-court-400 tw-hidden sm:tw-inline">
                    Badminton Party
                </span>
            </Link>
        </div>

        <!-- Center: Desktop nav links -->
        <nav class="tw-hidden lg:tw-flex tw-items-center tw-gap-1 tw-mx-auto">
            <Link
                v-for="link in navLinks"
                :key="link.href"
                :href="link.href"
                class="tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm tw-font-medium tw-no-underline tw-transition-colors tw-duration-200"
                :class="isActive(link.href)
                    ? 'tw-bg-court-100 dark:tw-bg-court-900 tw-text-court-700 dark:tw-text-court-300'
                    : 'tw-text-gray-600 dark:tw-text-gray-400 hover:tw-bg-gray-100 dark:hover:tw-bg-court-900/50 hover:tw-text-gray-900 dark:hover:tw-text-gray-200'"
            >
                <i :class="link.icon" class="tw-mr-2 tw-text-xs"></i>
                {{ link.label }}
            </Link>
        </nav>

        <!-- Right: Actions -->
        <div class="tw-flex tw-items-center tw-gap-2 tw-ml-auto lg:tw-ml-0 tw-shrink-0">
            <!-- Dark mode toggle -->
            <button
                @click="toggleDarkMode"
                class="tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-text-gray-500 dark:tw-text-gray-400 hover:tw-bg-gray-100 dark:hover:tw-bg-court-900 tw-transition-colors tw-border-0 tw-bg-transparent tw-cursor-pointer"
                :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            >
                <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'" class="tw-text-base"></i>
            </button>

            <!-- Layout switcher -->
            <LayoutSwitcher />

            <!-- Profile dropdown -->
            <div class="profile-dropdown tw-relative" @click.stop>
                <button
                    @click="toggleProfileMenu"
                    class="tw-rounded-full tw-overflow-hidden tw-border-2 tw-border-court-300 dark:tw-border-court-700 tw-cursor-pointer tw-p-0 tw-bg-transparent tw-transition-all hover:tw-border-court-500"
                >
                    <UserAvatar :src="userAvatar" :name="userName" size="md" rounded="full" />
                </button>

                <transition name="page-fade">
                    <div
                        v-if="profileMenuVisible"
                        class="tw-absolute tw-right-0 tw-top-full tw-mt-2 tw-w-48 tw-bg-white dark:tw-bg-court-900 tw-rounded-xl tw-shadow-lg tw-border tw-border-gray-200 dark:tw-border-court-800 tw-py-2 tw-z-50 tw-animate-slide-up"
                    >
                        <div class="tw-px-4 tw-py-2 tw-border-b tw-border-gray-100 dark:tw-border-court-800">
                            <p class="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">{{ userName }}</p>
                        </div>
                        <Link
                            href="/profile"
                            class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-court-800 tw-no-underline tw-transition-colors"
                            @click="profileMenuVisible = false"
                        >
                            <i class="pi pi-user tw-text-xs"></i>
                            Profile
                        </Link>
                        <Link
                            as="button"
                            :href="route('logout')"
                            method="post"
                            class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-court-800 tw-no-underline tw-transition-colors tw-w-full tw-border-0 tw-bg-transparent tw-text-left tw-cursor-pointer tw-font-sans"
                            @click="profileMenuVisible = false"
                        >
                            <i class="pi pi-sign-out tw-text-xs"></i>
                            Logout
                        </Link>
                    </div>
                </transition>
            </div>
        </div>
    </header>
</template>
