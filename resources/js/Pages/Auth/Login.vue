<script setup>
import GuestLayout from "@/Layouts/GuestLayout.vue";
import InputError from "@/Components/InputError.vue";
import { Head, Link, useForm, usePage, router } from "@inertiajs/vue3";

import { ref, onMounted } from "vue";
import liff from "@line/liff";

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
    <Head title="Log in" />

    <!-- Header -->
    <div class="tw-text-center tw-mb-6">
      <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-14 tw-h-14 tw-bg-court-100 tw-rounded-2xl tw-mb-3">
        <span class="tw-text-3xl">🏸</span>
      </div>
      <h1 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-m-0">เข้าสู่ระบบ</h1>
      <p class="tw-text-sm tw-text-gray-500 tw-mt-1 tw-m-0">Badminton Party</p>
    </div>

    <!-- Status message -->
    <div v-if="status" class="tw-mb-4 tw-p-3 tw-rounded-xl tw-bg-court-50 tw-text-court-700 tw-text-sm tw-text-center">
      {{ status }}
    </div>

    <!-- LINE Login Button (Primary) -->
    <a
      :href="lineLoginUrl"
      class="tw-flex tw-items-center tw-justify-center tw-w-full tw-py-3 tw-px-4 tw-bg-[#06C755] hover:tw-bg-[#05b34c] tw-text-white tw-font-semibold tw-rounded-xl tw-no-underline tw-transition-all tw-duration-200 active:tw-scale-[0.98] tw-shadow-sm hover:tw-shadow-md tw-gap-3"
    >
      <svg class="tw-w-6 tw-h-6 tw-fill-current" viewBox="0 0 24 24">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
      <span>เข้าสู่ระบบด้วย LINE</span>
    </a>

    <!-- Divider -->
    <div class="tw-flex tw-items-center tw-gap-3 tw-my-5">
      <div class="tw-flex-1 tw-h-px tw-bg-gray-200"></div>
      <span class="tw-text-xs tw-text-gray-400 tw-uppercase tw-tracking-wider">หรือ</span>
      <div class="tw-flex-1 tw-h-px tw-bg-gray-200"></div>
    </div>

    <!-- Email/Password toggle -->
    <button
      v-if="!showEmailForm"
      @click="showEmailForm = true"
      class="tw-w-full tw-py-3 tw-px-4 tw-bg-gray-50 hover:tw-bg-gray-100 tw-text-gray-700 tw-font-medium tw-rounded-xl tw-border tw-border-gray-200 tw-transition-all tw-duration-200 tw-cursor-pointer tw-text-sm"
    >
      <i class="pi pi-envelope tw-mr-2 tw-text-xs"></i>
      เข้าสู่ระบบด้วย Email
    </button>

    <!-- Email/Password Form -->
    <transition name="page-fade">
      <form v-if="showEmailForm" @submit.prevent="submit" class="tw-space-y-4">
        <div>
          <label for="email" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Email</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            required
            autofocus
            autocomplete="username"
            class="tw-w-full tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white tw-text-gray-900 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all"
            placeholder="your@email.com"
          />
          <InputError class="tw-mt-1" :message="form.errors.email" />
        </div>

        <div>
          <label for="password" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Password</label>
          <input
            id="password"
            type="password"
            v-model="form.password"
            required
            autocomplete="current-password"
            class="tw-w-full tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white tw-text-gray-900 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all"
            placeholder="********"
          />
          <InputError class="tw-mt-1" :message="form.errors.password" />
        </div>

        <div class="tw-flex tw-items-center tw-justify-between">
          <label class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer">
            <input
              type="checkbox"
              v-model="form.remember"
              class="tw-w-4 tw-h-4 tw-rounded tw-border-gray-300 tw-text-court-600 focus:tw-ring-court-500"
            />
            <span class="tw-text-sm tw-text-gray-600">Remember me</span>
          </label>
          <Link
            v-if="canResetPassword"
            :href="route('password.request')"
            class="tw-text-sm tw-text-court-600 hover:tw-text-court-700 tw-no-underline tw-transition-colors"
          >
            ลืม Password?
          </Link>
        </div>

        <button
          type="submit"
          :disabled="form.processing"
          class="tw-w-full tw-py-2.5 tw-px-4 tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-font-semibold tw-rounded-xl tw-border-0 tw-transition-all tw-duration-200 tw-cursor-pointer active:tw-scale-[0.98] tw-shadow-sm hover:tw-shadow-md disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-text-sm"
        >
          <span v-if="form.processing" class="tw-inline-flex tw-items-center tw-gap-2">
            <i class="pi pi-spinner pi-spin tw-text-xs"></i> กำลังเข้าสู่ระบบ...
          </span>
          <span v-else>เข้าสู่ระบบ</span>
        </button>
      </form>
    </transition>
  </GuestLayout>
</template>
