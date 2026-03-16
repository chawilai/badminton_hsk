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
    <div class="space-y-4">
      <!-- Profile Header Card -->
      <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <!-- Cover gradient -->
        <div class="h-28 bg-gradient-to-br from-primary via-secondary to-accent relative">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(100%_0_0_/_0.15),transparent)]"></div>
        </div>

        <!-- Profile info -->
        <div class="px-5 pb-5 -mt-10 relative">
          <!-- Avatar row -->
          <UserAvatar :src="user?.avatar" :name="user?.name" size="2xl" rounded="2xl" class="border-4 border-base-100 shadow-lg mb-3" />

          <!-- Name & details -->
          <h1 class="text-xl font-bold text-base-content m-0 truncate">{{ user?.name }}</h1>
          <p class="text-sm text-base-content/60 m-0 mt-0.5">{{ user?.email }}</p>
          <div v-if="rank" class="flex items-center gap-2 mt-2">
            <span class="px-2.5 py-0.5 bg-primary/10 text-primary rounded-md text-xs font-semibold">{{ rank.general_rank }}</span>
            <span class="text-xs text-base-content/50">{{ rank.education_rank }}</span>
          </div>
          <p v-if="user?.player_motto" class="text-sm text-base-content/70 italic mt-3 m-0">"{{ user.player_motto }}"</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-base-100 rounded-xl border border-base-300 p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] text-base-content/50 m-0 uppercase tracking-wider">เพศ</p>
              <p class="text-sm font-semibold text-base-content m-0">{{ genderLabel(user?.gender) || 'ยังไม่ระบุ' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl border border-base-300 p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] text-base-content/50 m-0 uppercase tracking-wider">วันเกิด</p>
              <p class="text-sm font-semibold text-base-content m-0">{{ formatDate(user?.date_of_birth) || 'ยังไม่ระบุ' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl border border-base-300 p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <span class="text-lg">🏸</span>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] text-base-content/50 m-0 uppercase tracking-wider">แรงค์</p>
              <p class="text-sm font-semibold text-base-content m-0">{{ rank?.education_rank || 'ยังไม่ระบุ' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl border border-base-300 p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] text-base-content/50 m-0 uppercase tracking-wider">ระดับ</p>
              <p class="text-sm font-semibold text-base-content m-0">{{ rank?.general_rank || 'ยังไม่ระบุ' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Details -->
      <div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200">
          <h2 class="text-sm font-bold text-base-content m-0 uppercase tracking-wider">ข้อมูลบัญชี</h2>
        </div>
        <div class="divide-y divide-base-200">
          <div class="flex items-center justify-between px-4 py-3">
            <div class="flex items-center gap-3">
              <svg class="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              <div>
                <p class="text-sm text-base-content m-0">Provider</p>
                <p class="text-xs text-base-content/50 m-0">{{ user?.provider || 'Email' }}</p>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between px-4 py-3">
            <div class="flex items-center gap-3">
              <svg class="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <div>
                <p class="text-sm text-base-content m-0">Email</p>
                <p class="text-xs text-base-content/50 m-0">{{ user?.email }}</p>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between px-4 py-3">
            <div class="flex items-center gap-3">
              <svg class="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <div>
                <p class="text-sm text-base-content m-0">สมาชิกตั้งแต่</p>
                <p class="text-xs text-base-content/50 m-0">{{ memberSince() }}</p>
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
        class="w-full py-3 px-4 bg-error/10 text-error font-medium rounded-xl border border-error/20 text-sm text-center no-underline cursor-pointer transition-colors hover:bg-error/20"
      >
        ออกจากระบบ
      </Link>
    </div>
  </AppLayout>
</template>
