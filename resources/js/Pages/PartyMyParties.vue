<template>
  <Head :title="t('nav.myParties')" />

  <AppLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <div class="text-xl font-bold text-base-content m-0">{{ t('nav.myParties') }}</div>
        <p class="text-sm text-base-content/60 m-0 mt-0.5">{{ t('partyList.joined', { count: parties.length }) }}</p>
      </div>

      <!-- Party Cards -->
      <div v-if="parties.length > 0" class="space-y-3">
        <div
          v-for="party in parties"
          :key="party.id"
          class="badminton-card bg-base-100 rounded-xl border border-base-300 overflow-hidden cursor-pointer"
          @click="enterParty(party.id)"
        >
          <div class="h-1" :class="statusAccentColor(party.status)"></div>

          <div class="p-4">
            <!-- Top: Court name + Status -->
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="min-w-0 flex-1">
                <div class="text-base font-semibold text-base-content m-0 truncate">
                  {{ party.court?.name || 'Unknown Court' }}
                </div>
                <p class="text-xs text-base-content/50 m-0 mt-0.5">#{{ party.id }}</p>
              </div>
              <span
                class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="statusBadgeClass(party.status)"
              >
                {{ party.status }}
              </span>
            </div>

            <!-- Info grid -->
            <div class="grid grid-cols-3 gap-2 mb-3">
              <div class="text-center">
                <p class="text-[10px] text-base-content/50 m-0">📅 วันที่</p>
                <p class="text-xs font-medium text-base-content m-0 mt-0.5">{{ formatDate(party.play_date) }}</p>
              </div>
              <div class="text-center">
                <p class="text-[10px] text-base-content/50 m-0">⏰ เวลา</p>
                <p class="text-xs font-medium text-base-content m-0 mt-0.5">{{ party.start_time?.substring(0,5) || '-' }}-{{ party.end_time?.substring(0,5) || '-' }} <span class="text-[10px] text-base-content/40">({{ party.play_hours }}h)</span></p>
              </div>
              <div class="text-center">
                <p class="text-[10px] text-base-content/50 m-0">👥 ผู้เล่น</p>
                <p class="text-xs font-medium m-0 mt-0.5" :class="party.members_count >= party.max_players ? 'text-error' : 'text-base-content'">
                  {{ party.members_count }}/{{ party.max_players }}
                </p>
              </div>
            </div>

            <!-- Bottom: Avatars + เข้า button -->
            <div class="flex items-center justify-between pt-3 border-t border-base-200">
              <div class="flex items-center">
                <div class="flex -space-x-2">
                  <UserAvatar
                    v-for="member in party.members?.slice(0, 5)"
                    :key="member.id"
                    :src="member.user?.avatar"
                    :name="member.user?.name"
                    size="sm"
                    rounded="full"
                    class="border-2 border-base-100"
                  />
                </div>
                <span v-if="party.members?.length > 5" class="ml-1.5 text-xs text-base-content/50">+{{ party.members.length - 5 }}</span>
              </div>

              <button
                @click.stop="enterParty(party.id)"
                class="h-8 px-4 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary text-white hover:bg-primary/80"
              >
                <i class="pi pi-arrow-right mr-1 text-[10px]"></i> {{ t('common.enter') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16">
        <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">🏸</span>
        </div>
        <h3 class="text-lg font-semibold text-base-content m-0">{{ t('partyList.noParties') }}</h3>
        <p class="text-sm text-base-content/60 mt-1 m-0">{{ t('partyList.joinFirst') }}</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { ref } from "vue";
import { Head, usePage, router } from "@inertiajs/vue3";
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();

const page = usePage();
const parties = ref(page.props.parties ?? []);
const authUser = page.props.auth.user;

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['อา','จ','อ','พ','พฤ','ศ','ส'];
  return `${days[d.getDay()]}. ${day} ${months[d.getMonth()]}`;
};

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Open': return 'bg-primary/10 text-primary';
    case 'Full': return 'bg-warning/20 text-warning';
    case 'Over': return 'bg-base-200 text-base-content/60';
    default: return 'bg-base-200 text-base-content/70';
  }
};

const statusAccentColor = (status) => {
  switch (status) {
    case 'Open': return 'bg-primary';
    case 'Full': return 'bg-warning';
    case 'Over': return 'bg-base-300';
    default: return 'bg-base-300';
  }
};

const enterParty = (partyId) => {
  router.get(`/party/${partyId}`);
};
</script>
