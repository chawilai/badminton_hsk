<template>
  <Head title="My Parties" />

  <AppLayout>
    <div class="tw-space-y-4">
      <!-- Header -->
      <div>
        <h1 class="tw-text-xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">My Parties</h1>
        <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-m-0 tw-mt-0.5">{{ parties.length }} parties joined</p>
      </div>

      <!-- Party Cards -->
      <div v-if="parties.length > 0" class="tw-space-y-3">
        <div
          v-for="party in parties"
          :key="party.id"
          class="badminton-card tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-overflow-hidden tw-cursor-pointer"
          @click="enterParty(party.id)"
        >
          <div class="tw-h-1" :class="statusAccentColor(party.status)"></div>

          <div class="tw-p-4">
            <!-- Top: Court name + Status -->
            <div class="tw-flex tw-items-start tw-justify-between tw-gap-3 tw-mb-3">
              <div class="tw-min-w-0 tw-flex-1">
                <h3 class="tw-text-base tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0 tw-truncate">
                  {{ party.court?.name || 'Unknown Court' }}
                </h3>
                <p class="tw-text-xs tw-text-gray-400 dark:tw-text-gray-500 tw-m-0 tw-mt-0.5">#{{ party.id }}</p>
              </div>
              <span
                class="tw-shrink-0 tw-px-2.5 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold"
                :class="statusBadgeClass(party.status)"
              >
                {{ party.status }}
              </span>
            </div>

            <!-- Info grid -->
            <div class="tw-grid tw-grid-cols-3 tw-gap-3 tw-mb-3">
              <div class="tw-flex tw-items-center tw-gap-2">
                <div class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-court-50 dark:tw-bg-court-900 tw-flex tw-items-center tw-justify-center tw-shrink-0">
                  <i class="pi pi-calendar tw-text-court-600 dark:tw-text-court-400 tw-text-xs"></i>
                </div>
                <div class="tw-min-w-0">
                  <p class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-uppercase tw-tracking-wide">Date</p>
                  <p class="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-gray-100 tw-m-0 tw-truncate">{{ formatDate(party.play_date) }}</p>
                </div>
              </div>

              <div class="tw-flex tw-items-center tw-gap-2">
                <div class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-court-50 dark:tw-bg-court-900 tw-flex tw-items-center tw-justify-center tw-shrink-0">
                  <i class="pi pi-clock tw-text-court-600 dark:tw-text-court-400 tw-text-xs"></i>
                </div>
                <div class="tw-min-w-0">
                  <p class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-uppercase tw-tracking-wide">Hours</p>
                  <p class="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">{{ party.play_hours }}h</p>
                </div>
              </div>

              <div class="tw-flex tw-items-center tw-gap-2">
                <div class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-court-50 dark:tw-bg-court-900 tw-flex tw-items-center tw-justify-center tw-shrink-0">
                  <i class="pi pi-users tw-text-court-600 dark:tw-text-court-400 tw-text-xs"></i>
                </div>
                <div class="tw-min-w-0">
                  <p class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-uppercase tw-tracking-wide">Players</p>
                  <p class="tw-text-sm tw-font-medium tw-m-0" :class="party.members_count >= party.max_players ? 'tw-text-red-500' : 'tw-text-gray-900 dark:tw-text-gray-100'">
                    {{ party.members_count }}/{{ party.max_players }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Bottom: Avatars + Enter button -->
            <div class="tw-flex tw-items-center tw-justify-between tw-pt-3 tw-border-t tw-border-gray-100 dark:tw-border-court-800">
              <div class="tw-flex tw-items-center">
                <div class="tw-flex -tw-space-x-2">
                  <UserAvatar
                    v-for="member in party.members?.slice(0, 5)"
                    :key="member.id"
                    :src="member.user?.avatar"
                    :name="member.user?.name"
                    size="sm"
                    rounded="full"
                    class="tw-border-2 tw-border-white dark:tw-border-court-900"
                  />
                </div>
                <span v-if="party.members?.length > 5" class="tw-ml-1.5 tw-text-xs tw-text-gray-400">+{{ party.members.length - 5 }}</span>
              </div>

              <button
                @click.stop="enterParty(party.id)"
                class="tw-h-8 tw-px-4 tw-rounded-lg tw-text-xs tw-font-semibold tw-border-0 tw-cursor-pointer tw-transition-all active:tw-scale-[0.97] tw-bg-court-600 tw-text-white hover:tw-bg-court-700"
              >
                <i class="pi pi-arrow-right tw-mr-1 tw-text-[10px]"></i> Enter
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="tw-text-center tw-py-16">
        <div class="tw-w-16 tw-h-16 tw-bg-court-100 dark:tw-bg-court-900 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
          <span class="tw-text-3xl">🏸</span>
        </div>
        <h3 class="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">No parties yet</h3>
        <p class="tw-text-sm tw-text-gray-500 tw-mt-1 tw-m-0">Join a party from the Party Lists page!</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { ref } from "vue";
import { Head, usePage, router } from "@inertiajs/vue3";

const page = usePage();
const parties = ref(page.props.parties ?? []);
const authUser = page.props.auth.user;

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day} ${months[d.getMonth()]}`;
};

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Open': return 'tw-bg-court-100 dark:tw-bg-court-900 tw-text-court-700 dark:tw-text-court-300';
    case 'Full': return 'tw-bg-amber-100 dark:tw-bg-amber-900/30 tw-text-amber-700 dark:tw-text-amber-300';
    case 'Over': return 'tw-bg-gray-100 dark:tw-bg-gray-800 tw-text-gray-500 dark:tw-text-gray-400';
    default: return 'tw-bg-gray-100 tw-text-gray-600';
  }
};

const statusAccentColor = (status) => {
  switch (status) {
    case 'Open': return 'tw-bg-court-500';
    case 'Full': return 'tw-bg-amber-500';
    case 'Over': return 'tw-bg-gray-300 dark:tw-bg-gray-700';
    default: return 'tw-bg-gray-300';
  }
};

const enterParty = (partyId) => {
  router.get(`/party/${partyId}`);
};
</script>
