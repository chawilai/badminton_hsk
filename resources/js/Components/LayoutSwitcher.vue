<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useBadmintonLayout } from '@/layout/composables/badmintonLayout';

const { currentTheme, availableThemes, switchTheme } = useBadmintonLayout();
const menuVisible = ref(false);

const toggleMenu = () => {
    menuVisible.value = !menuVisible.value;
};

const selectTheme = (themeName) => {
    switchTheme(themeName);
    menuVisible.value = false;
};

const onOutsideClick = (e) => {
    if (!e.target.closest('.theme-switcher')) {
        menuVisible.value = false;
    }
};

onMounted(() => document.addEventListener('click', onOutsideClick));
onBeforeUnmount(() => document.removeEventListener('click', onOutsideClick));
</script>

<template>
    <div class="theme-switcher relative" @click.stop>
        <button
            @click="toggleMenu"
            class="w-9 h-9 flex items-center justify-center rounded-lg text-base-content/50 hover:bg-base-200 transition-colors border-0 bg-transparent cursor-pointer"
            title="Change theme"
        >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
            </svg>
        </button>

        <transition name="page-fade">
            <div
                v-if="menuVisible"
                class="absolute right-0 top-full mt-2 w-56 bg-base-100 rounded-2xl shadow-xl border border-base-300 py-2 z-50 animate-slide-up max-h-[70vh] overflow-y-auto"
            >
                <div class="px-3 py-2 border-b border-base-200">
                    <p class="text-xs font-bold text-base-content/40 uppercase tracking-wider m-0">Choose Theme</p>
                </div>
                <div class="py-1">
                    <button
                        v-for="theme in availableThemes"
                        :key="theme.name"
                        @click="selectTheme(theme.name)"
                        class="flex items-center gap-2.5 w-full px-3 py-2 text-sm border-0 bg-transparent cursor-pointer transition-colors font-sans text-left"
                        :class="currentTheme === theme.name
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-base-content/70 hover:bg-base-200'"
                    >
                        <span class="text-base w-6 text-center">{{ theme.label.split(' ')[0] }}</span>
                        <span class="flex-1">{{ theme.label.split(' ').slice(1).join(' ') }}</span>

                        <!-- Theme color preview -->
                        <div class="flex gap-0.5" :data-theme="theme.name">
                            <span class="w-2 h-4 rounded-xs bg-primary"></span>
                            <span class="w-2 h-4 rounded-xs bg-secondary"></span>
                            <span class="w-2 h-4 rounded-xs bg-accent"></span>
                            <span class="w-2 h-4 rounded-xs bg-neutral"></span>
                        </div>

                        <svg v-if="currentTheme === theme.name" class="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>
