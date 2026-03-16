<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { Head, usePage, Link } from "@inertiajs/vue3";

const page = usePage();
const user = page.props.profileUser ?? page.props.auth.user;
const rank = user?.badminton_rank ?? user?.badmintonRank ?? null;

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
};

const genderLabel = (g) => {
    if (!g) return null;
    const map = { male: 'ชาย', female: 'หญิง', other: 'อื่นๆ' };
    return map[g] || g;
};

const memberSince = () => {
    const d = user?.created_at;
    if (!d) return '-';
    return new Date(d).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' });
};
</script>

<template>
  <Head title="Profile" />

  <AppLayout>
    <div class="tw-space-y-4">
      <!-- Profile Header Card -->
      <div class="tw-bg-white dark:tw-bg-court-900/80 tw-rounded-2xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-overflow-hidden">
        <!-- Cover gradient -->
        <div class="tw-h-28 tw-bg-gradient-to-br tw-from-court-600 tw-via-court-500 tw-to-court-300 tw-relative">
          <div class="tw-absolute tw-inset-0 tw-bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent)]"></div>
        </div>

        <!-- Profile info -->
        <div class="tw-px-5 tw-pb-5 tw--mt-10 tw-relative">
          <!-- Avatar row -->
          <UserAvatar :src="user?.avatar" :name="user?.name" size="2xl" rounded="2xl" class="tw-border-4 tw-border-white dark:tw-border-court-900 tw-shadow-lg tw-mb-3" />

          <!-- Name & details -->
          <h1 class="tw-text-xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0 tw-truncate">{{ user?.name }}</h1>
          <p class="tw-text-sm tw-text-gray-500 tw-m-0 tw-mt-0.5">{{ user?.email }}</p>
          <div v-if="rank" class="tw-flex tw-items-center tw-gap-2 tw-mt-2">
            <span class="tw-px-2.5 tw-py-0.5 tw-bg-court-100 dark:tw-bg-court-800 tw-text-court-700 dark:tw-text-court-300 tw-rounded-md tw-text-xs tw-font-semibold">{{ rank.general_rank }}</span>
            <span class="tw-text-xs tw-text-gray-400">{{ rank.education_rank }}</span>
          </div>
          <p v-if="user?.player_motto" class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400 tw-italic tw-mt-3 tw-m-0">"{{ user.player_motto }}"</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="tw-grid tw-grid-cols-2 tw-gap-3">
        <div class="tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-p-4">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-10 tw-h-10 tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-shrink-0">
              <i class="pi pi-user tw-text-blue-500"></i>
            </div>
            <div class="tw-min-w-0">
              <p class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-uppercase tw-tracking-wider">เพศ</p>
              <p class="tw-text-sm tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">{{ genderLabel(user?.gender) || 'ยังไม่ระบุ' }}</p>
            </div>
          </div>
        </div>

        <div class="tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-p-4">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-10 tw-h-10 tw-bg-pink-50 dark:tw-bg-pink-900/20 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-shrink-0">
              <i class="pi pi-calendar tw-text-pink-500"></i>
            </div>
            <div class="tw-min-w-0">
              <p class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-uppercase tw-tracking-wider">วันเกิด</p>
              <p class="tw-text-sm tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">{{ formatDate(user?.date_of_birth) || 'ยังไม่ระบุ' }}</p>
            </div>
          </div>
        </div>

        <div class="tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-p-4">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-10 tw-h-10 tw-bg-court-50 dark:tw-bg-court-900 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-shrink-0">
              <span class="tw-text-lg">🏸</span>
            </div>
            <div class="tw-min-w-0">
              <p class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-uppercase tw-tracking-wider">แรงค์</p>
              <p class="tw-text-sm tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">{{ rank?.education_rank || 'ยังไม่ระบุ' }}</p>
            </div>
          </div>
        </div>

        <div class="tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-p-4">
          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-w-10 tw-h-10 tw-bg-amber-50 dark:tw-bg-amber-900/20 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-shrink-0">
              <i class="pi pi-star-fill tw-text-amber-500"></i>
            </div>
            <div class="tw-min-w-0">
              <p class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-uppercase tw-tracking-wider">ระดับ</p>
              <p class="tw-text-sm tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">{{ rank?.general_rank || 'ยังไม่ระบุ' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Details -->
      <div class="tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-overflow-hidden">
        <div class="tw-px-4 tw-py-3 tw-border-b tw-border-gray-100 dark:tw-border-court-800">
          <h2 class="tw-text-sm tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0 tw-uppercase tw-tracking-wider">ข้อมูลบัญชี</h2>
        </div>
        <div class="tw-divide-y tw-divide-gray-50 dark:tw-divide-court-800">
          <div class="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3">
            <div class="tw-flex tw-items-center tw-gap-3">
              <i class="pi pi-link tw-text-gray-400 tw-text-sm"></i>
              <div>
                <p class="tw-text-sm tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">Provider</p>
                <p class="tw-text-xs tw-text-gray-400 tw-m-0">{{ user?.provider || 'Email' }}</p>
              </div>
            </div>
          </div>
          <div class="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3">
            <div class="tw-flex tw-items-center tw-gap-3">
              <i class="pi pi-envelope tw-text-gray-400 tw-text-sm"></i>
              <div>
                <p class="tw-text-sm tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">Email</p>
                <p class="tw-text-xs tw-text-gray-400 tw-m-0">{{ user?.email }}</p>
              </div>
            </div>
          </div>
          <div class="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3">
            <div class="tw-flex tw-items-center tw-gap-3">
              <i class="pi pi-clock tw-text-gray-400 tw-text-sm"></i>
              <div>
                <p class="tw-text-sm tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">สมาชิกตั้งแต่</p>
                <p class="tw-text-xs tw-text-gray-400 tw-m-0">{{ memberSince() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logout -->
      <Link
        as="button"
        :href="route('logout')"
        method="post"
        class="tw-w-full tw-py-3 tw-px-4 tw-bg-red-50 dark:tw-bg-red-900/20 tw-text-red-600 dark:tw-text-red-400 tw-font-medium tw-rounded-xl tw-border tw-border-red-200 dark:tw-border-red-800/30 tw-text-sm tw-text-center tw-no-underline tw-cursor-pointer tw-transition-colors hover:tw-bg-red-100 dark:hover:tw-bg-red-900/30"
      >
        <i class="pi pi-sign-out tw-mr-2 tw-text-xs"></i>ออกจากระบบ
      </Link>
    </div>
  </AppLayout>
</template>
