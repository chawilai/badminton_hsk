<template>
  <Head title="Party Lists" />

  <AppLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-base-content m-0">Party Lists</h1>
          <p class="text-sm text-base-content/60 m-0 mt-0.5">{{ filteredParties.length }} parties available</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="reloadPage()"
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          <button
            @click="showDialog = true"
            class="h-9 px-4 flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-medium border-0 cursor-pointer transition-colors active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span class="hidden sm:inline">Create Party</span>
            <span class="sm:hidden">New</span>
          </button>
        </div>
      </div>

      <!-- Party Cards -->
      <div v-if="filteredParties.length > 0" class="space-y-3">
        <div
          v-for="party in paginatedParties"
          :key="party.id"
          class="badminton-card bg-base-100 rounded-xl border border-base-300 overflow-hidden"
        >
          <!-- Card top accent -->
          <div class="h-1" :class="statusAccentColor(party.status)"></div>

          <div class="p-4">
            <!-- Top row: Court name + Status -->
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="min-w-0 flex-1">
                <h3 class="text-base font-semibold text-base-content m-0 truncate">
                  {{ party.court?.name || 'Unknown Court' }}
                </h3>
                <p class="text-xs text-base-content/50 m-0 mt-0.5">
                  #{{ party.id }}
                  <span v-if="party.is_private" class="ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> Private
                  </span>
                </p>
              </div>
              <span
                class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="statusBadgeClass(party.status)"
              >
                {{ party.status }}
              </span>
            </div>

            <!-- Info grid -->
            <div class="grid grid-cols-3 gap-3 mb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] text-base-content/50 m-0 uppercase tracking-wide">Date</p>
                  <p class="text-sm font-medium text-base-content m-0 truncate">{{ formatDisplayDate(party.play_date) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] text-base-content/50 m-0 uppercase tracking-wide">Time</p>
                  <p class="text-sm font-medium text-base-content m-0">{{ formatTime(party.start_time) }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] text-base-content/50 m-0 uppercase tracking-wide">Players</p>
                  <p class="text-sm font-medium m-0" :class="party.members_count >= party.max_players ? 'text-error' : 'text-base-content'">
                    {{ party.members_count }}/{{ party.max_players }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Members avatars + Action button -->
            <div class="flex items-center justify-between pt-3 border-t border-base-200">
              <!-- Member avatars -->
              <div class="flex items-center">
                <div class="flex -space-x-2">
                  <UserAvatar
                    v-for="(member, idx) in party.members?.slice(0, 5)"
                    :key="member.id"
                    :src="member.user?.avatar"
                    :name="member.user?.name"
                    size="sm"
                    rounded="full"
                    class="border-2 border-base-100"
                  />
                </div>
                <span v-if="party.members?.length > 5" class="ml-1.5 text-xs text-base-content/50">
                  +{{ party.members.length - 5 }}
                </span>
              </div>

              <!-- Action -->
              <button
                v-if="!isUserInParty(party.members)"
                @click="joinParty(party.id)"
                class="h-8 px-4 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary/10 text-primary hover:bg-primary/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg> Join
              </button>
              <button
                v-else
                @click="enterParty(party.id)"
                class="h-8 px-4 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary text-white hover:bg-primary/80"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg> Enter
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
        <h3 class="text-lg font-semibold text-base-content m-0">No parties yet</h3>
        <p class="text-sm text-base-content/60 mt-1 m-0">Create the first party to get started!</p>
        <button
          @click="showDialog = true"
          class="mt-4 h-10 px-6 rounded-xl bg-primary hover:bg-primary/80 text-white text-sm font-medium border-0 cursor-pointer transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg> Create Party
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-2 pb-4">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="currentPage = p"
          class="w-9 h-9 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors"
          :class="currentPage === p
            ? 'bg-primary text-white'
            : 'bg-base-100 text-base-content/70 border border-base-300 hover:bg-base-200'"
        >
          {{ p }}
        </button>
      </div>

      <!-- Create Party Dialog -->
      <dialog
        class="modal"
        :class="{ 'modal-open': showDialog }"
      >
        <div class="modal-box w-full max-w-lg">
          <h3 class="font-bold text-lg mb-4">Create Party</h3>
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="showDialog = false">X</button>
          <form @submit.prevent="createParty">
            <div class="w-full">
              <h4 class="text-sm font-semibold uppercase tracking-wide text-base-content/60 mb-3">Party Details</h4>
              <div class="grid grid-cols-3 gap-4">
                <div class="form-control">
                  <label class="label" for="play_date">
                    <span class="label-text">Play Date</span>
                  </label>
                  <input type="date" id="play_date" v-model="form.play_date" class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label class="label" for="max_players">
                    <span class="label-text">Max Players</span>
                  </label>
                  <input type="number" id="max_players" v-model="form.max_players" min="1" class="input input-bordered w-full" />
                </div>
                <div class="form-control">
                  <label class="label" for="status">
                    <span class="label-text">Status</span>
                  </label>
                  <select id="status" v-model="form.status" class="select select-bordered w-full">
                    <option value="" disabled>Select Status</option>
                    <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="form-control">
                  <label class="label" for="court_id">
                    <span class="label-text">Court</span>
                  </label>
                  <select id="court_id" v-model="form.court_id" class="select select-bordered w-full">
                    <option value="" disabled>Select Court</option>
                    <option v-for="court in courts" :key="court.id" :value="court.id">{{ court.name }}</option>
                  </select>
                </div>
              </div>

              <div class="form-control mt-4">
                <label class="label cursor-pointer justify-start gap-2">
                  <input type="checkbox" v-model="form.is_private" class="checkbox checkbox-primary" />
                  <span class="label-text">Private Party</span>
                </label>
              </div>

              <h4 class="text-sm font-semibold uppercase tracking-wide text-base-content/60 mb-3 mt-6">Court Bookings</h4>
              <div
                v-for="(booking, index) in form.court_bookings"
                :key="index"
                class="court-booking p-3 mb-2 rounded-lg shadow-md border border-base-300"
              >
                <h4 class="mb-2 font-semibold">Booking #{{ index + 1 }}</h4>
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="label"><span class="label-text">คอร์ทที่</span></label>
                    <select
                      v-model="booking.court_field_number"
                      class="select select-bordered w-full"
                    >
                      <option v-for="i in 12" :key="i" :value="i">{{ i }}</option>
                    </select>
                  </div>
                  <div class="flex-1">
                    <label class="label"><span class="label-text">เวลาเริ่ม</span></label>
                    <select v-model="booking.start_time" class="select select-bordered w-full">
                      <option v-for="t in timeOptions" :key="t.name" :value="t.name">{{ t.name }}</option>
                    </select>
                  </div>
                  <div class="flex-1">
                    <label class="label"><span class="label-text">เวลาจบ</span></label>
                    <select v-model="booking.end_time" class="select select-bordered w-full">
                      <option v-for="t in filteredEndTimeOptions(index)" :key="t.name" :value="t.name">{{ t.name }}</option>
                    </select>
                  </div>
                </div>
                <button type="button" class="btn btn-error btn-sm mt-3" @click="removeCourtBooking(index)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" /></svg>
                  ลบคอร์ท
                </button>
              </div>
              <button type="button" class="btn btn-secondary btn-sm mt-3" @click="addCourtBooking">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                เพิ่มคอร์ท
              </button>
            </div>

            <div class="mt-4 flex justify-end gap-2">
              <button type="submit" class="btn btn-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                Create
              </button>
              <button type="button" class="btn btn-secondary" @click="showDialog = false">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showDialog = false">close</button>
        </form>
      </dialog>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { ref, computed } from "vue";
import { Head, usePage, router } from "@inertiajs/vue3";
import { useToast } from "@/composables/useToast";

const toast = useToast();
const showDialog = ref(false);
const page = usePage();

const parties = ref(page.props.parties ?? []);
const courts = ref(page.props.courts ?? []);
const statuses = ["Open", "Full", "Over"];
const currentPage = ref(1);
const perPage = 10;

const form = ref({
  play_date: null,
  court_id: null,
  max_players: 18,
  status: "Open",
  is_private: false,
  court_bookings: [{ court_id: null, court_field_number: null, start_time: "", end_time: "" }],
});

const authUser = page.props.auth.user;

const filteredParties = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  return parties.value
    .filter((party) => party.play_date >= today)
    .sort((a, b) => a.play_date.localeCompare(b.play_date));
});

const totalPages = computed(() => Math.ceil(filteredParties.value.length / perPage));
const paginatedParties = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredParties.value.slice(start, start + perPage);
});

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day} ${months[d.getMonth()]}`;
};

const formatTime = (timeStr) => {
  if (!timeStr) return '-';
  return timeStr.substring(0, 5);
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

const reloadPage = () => {
  router.get(`/party-lists`, {}, { preserveScroll: true });
};

const timeOptions = Array.from({ length: 24 }, (_, i) => ({
  name: `${String(i + 1).padStart(2, "0")}:00`,
}));

const filteredEndTimeOptions = (index) => {
  if (!form.value.court_bookings[index].start_time) return timeOptions;
  const startTimeIndex = timeOptions.findIndex(
    (option) => option.name === form.value.court_bookings[index].start_time
  );
  return timeOptions.filter((_, i) => {
    const diff = (i - startTimeIndex + 24) % 24;
    return diff <= 6;
  });
};

const isUserInParty = (members) => {
  return members?.some((member) => member.user_id === authUser.id) ?? false;
};

const joinParty = (partyId) => {
  router.post(`/party-join`, { party_id: partyId }, {
    onSuccess: (res) => {
      parties.value = res.props.parties;
      courts.value = res.props.courts;
      toast.add({ severity: "success", summary: "สำเร็จ", detail: "เข้าร่วมปาร์ตี้สำเร็จแล้ว!", life: 3000 });
    },
    onError: (error) => {
      toast.add({ severity: "error", summary: "ผิดพลาด", detail: error?.message || "เกิดข้อผิดพลาด", life: 3000 });
    },
  });
};

const enterParty = (partyId) => {
  router.get(`/party/${partyId}`);
};

const addCourtBooking = () => {
  form.value.court_bookings.push({ court_id: form.court_id, court_field_number: null, start_time: "", end_time: "" });
};

const removeCourtBooking = (index) => {
  form.value.court_bookings.splice(index, 1);
};

const createParty = () => {
  router.post("/party-create", form.value, {
    preserveScroll: true,
    onSuccess: (page) => {
      parties.value = page.props.parties;
      courts.value = page.props.courts;
      showDialog.value = false;
    },
    onError: (error) => {
      console.error("Error creating party:", error);
    },
  });
};
</script>

<style scoped>
.court-booking {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
</style>
