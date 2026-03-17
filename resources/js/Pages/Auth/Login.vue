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

onMounted(() => {
  const isGuest = ref(!page.props.auth.user);

  if (isGuest.value) {
    liff
      .init({ liffId: "2001165902-9zoxvoY1" })
      .then(() => {
        console.log("LIFF initialization successful");

        if (!liff.isInClient()) {
          console.error("LIFF must be accessed from LINE app.");
          return;
        }

        if (!liff.isLoggedIn()) {
          liff.login();
        }

        liff
          .getProfile()
          .then((profile) => {
            const userData = {
              provider: "line",
              userId: profile.userId,
              displayName: profile.displayName,
              email: liff.getDecodedIDToken()?.email,
              pictureUrl: profile.pictureUrl,
            };

            router.post(`login/lineliff`, userData, {
              preserveScroll: true,
              onSuccess: (res) => {
                isGuest.value = res.props.auth.user;
              },
            });
          })
          .catch((err) => {
            console.error("Failed to get user profile:", err);
          });
      })
      .catch((err) => {
        console.error("LIFF Initialization failed", err);
      });
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
