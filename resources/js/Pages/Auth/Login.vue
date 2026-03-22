<script setup>
import GuestLayout from "@/Layouts/GuestLayout.vue";
import InputError from "@/Components/InputError.vue";
import { Head, Link, useForm, usePage, router } from "@inertiajs/vue3";

import { ref, onMounted } from "vue";
import liff from "@line/liff";
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();

import btn_login_base from "@/../images/btn_login_base.png";

const page = usePage();

defineProps({
  canResetPassword: {
    type: Boolean,
  },
  status: {
    type: String,
  },
});

const form = useForm({
  email: "",
  password: "",
  remember: false,
});

const showEmailForm = ref(false);

const submit = () => {
  form.post(route("login"), {
    onFinish: () => form.reset("password"),
  });
};

// Social media login URLs
const lineLoginUrl = route("social.login", "line");
const googleLoginUrl = route("social.login", "google");

onMounted(() => {
  try {
    const isGuest = !page.props.auth.user;
    if (!isGuest) return;

    liff
      .init({ liffId: "2001165902-9zoxvoY1" })
      .then(() => {
        if (!liff.isInClient()) return;
        if (!liff.isLoggedIn()) return; // ไม่เรียก liff.login() — ให้ user กด LINE Login (OAuth) เอง

        liff.getProfile()
          .then((profile) => {
            router.post(`login/lineliff`, {
              provider: "line",
              userId: profile.userId,
              displayName: profile.displayName,
              email: liff.getDecodedIDToken()?.email,
              pictureUrl: profile.pictureUrl,
            }, { preserveScroll: true });
          })
          .catch(() => {});
      })
      .catch(() => {});
  } catch (e) {
    // LIFF not available — ignore, show normal login form
  }
});
</script>

<template>
  <GuestLayout>
    <Head :title="t('auth.login')" />

    <!-- Header -->
    <div class="text-center mb-6">
      <div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3">
        <span class="text-3xl">🏸</span>
      </div>
      <h1 class="text-2xl font-bold text-base-content m-0">{{ t('auth.login') }}</h1>
      <p class="text-sm text-base-content/60 mt-1 m-0">Badminton Party</p>
    </div>

    <!-- Status message -->
    <div v-if="status" class="mb-4 p-3 rounded-xl bg-court-50 text-court-700 text-sm text-center">
      {{ status }}
    </div>

    <!-- LINE Login Button (Primary) -->
    <a
      :href="lineLoginUrl"
      class="flex items-center justify-center w-full py-3 px-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] shadow-xs hover:shadow-md gap-3"
    >
      <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
      <span>{{ t('auth.loginWithLine') }}</span>
    </a>

    <!-- Google Login Button -->
    <a
      :href="googleLoginUrl"
      class="flex items-center justify-center w-full py-3 px-4 mt-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] shadow-xs hover:shadow-md gap-3 border border-gray-300"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span>{{ t('auth.loginWithGoogle') }}</span>
    </a>

    <!-- Divider -->
    <div class="flex items-center gap-3 my-5">
      <div class="flex-1 h-px bg-base-300"></div>
      <span class="text-xs text-base-content/50 uppercase tracking-wider">{{ t('auth.or') }}</span>
      <div class="flex-1 h-px bg-base-300"></div>
    </div>

    <!-- Email/Password toggle -->
    <button
      v-if="!showEmailForm"
      @click="showEmailForm = true"
      class="w-full py-3 px-4 bg-base-200 hover:bg-base-200 text-base-content/80 font-medium rounded-xl border border-base-300 transition-all duration-200 cursor-pointer text-sm"
    >
      <i class="pi pi-envelope mr-2 text-xs"></i>
      {{ t('auth.loginWithEmail') }}
    </button>

    <!-- Email/Password Form -->
    <transition name="page-fade">
      <form v-if="showEmailForm" @submit.prevent="submit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-base-content/80 mb-1">{{ t('auth.email') }}</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
            autofocus
            autocomplete="username"
            class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"
            placeholder="your@email.com"
          />
          <InputError class="mt-1" :message="form.errors.email" />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-base-content/80 mb-1">{{ t('auth.password') }}</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"
            placeholder="********"
          />
          <InputError class="mt-1" :message="form.errors.password" />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.remember"
              class="w-4 h-4 rounded border-base-300 text-court-600 focus:ring-court-500"
            />
            <span class="text-sm text-base-content/70">{{ t('auth.rememberMe') }}</span>
          </label>
          <Link
            v-if="canResetPassword"
            :href="route('password.request')"
            class="text-sm text-court-600 hover:text-court-700 no-underline transition-colors"
          >
            {{ t('auth.forgotPassword') }}
          </Link>
        </div>

        <button
          type="submit"
          :disabled="form.processing"
          class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <span v-if="form.processing" class="inline-flex items-center gap-2">
            <i class="pi pi-spinner pi-spin text-xs"></i> {{ t('auth.loggingIn') }}
          </span>
          <span v-else>{{ t('auth.login') }}</span>
        </button>
      </form>
    </transition>
  </GuestLayout>
</template>
