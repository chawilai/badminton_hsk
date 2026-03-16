<template>
  <Head title="Party Lists" />

  <AppLayout>
    <div class="tw-space-y-4">
      <!-- Header -->
      <div class="tw-flex tw-items-center tw-justify-between">
        <div>
          <h1 class="tw-text-xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">Party Lists</h1>
          <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-m-0 tw-mt-0.5">{{ filteredParties.length }} parties available</p>
        </div>
        <div class="tw-flex tw-items-center tw-gap-2">
          <button
            @click="reloadPage()"
            class="tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-gray-200 dark:tw-border-court-800 tw-bg-white dark:tw-bg-court-900 tw-text-gray-500 dark:tw-text-gray-400 hover:tw-bg-gray-50 dark:hover:tw-bg-court-800 tw-transition-colors tw-cursor-pointer"
          >
            <i class="pi pi-refresh tw-text-sm"></i>
          </button>
          <button
            @click="showDialog = true"
            class="tw-h-9 tw-px-4 tw-flex tw-items-center tw-gap-2 tw-rounded-lg tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-text-sm tw-font-medium tw-border-0 tw-cursor-pointer tw-transition-colors active:tw-scale-[0.98]"
          >
            <i class="pi pi-plus tw-text-xs"></i>
            <span class="tw-hidden sm:tw-inline">Create Party</span>
            <span class="sm:tw-hidden">New</span>
          </button>
        </div>
      </div>

      <!-- Party Cards -->
      <div v-if="filteredParties.length > 0" class="tw-space-y-3">
        <div
          v-for="party in paginatedParties"
          :key="party.id"
          class="badminton-card tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-overflow-hidden"
        >
          <!-- Card top accent -->
          <div class="tw-h-1" :class="statusAccentColor(party.status)"></div>

          <div class="tw-p-4">
            <!-- Top row: Court name + Status -->
            <div class="tw-flex tw-items-start tw-justify-between tw-gap-3 tw-mb-3">
              <div class="tw-min-w-0 tw-flex-1">
                <h3 class="tw-text-base tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0 tw-truncate">
                  {{ party.court?.name || 'Unknown Court' }}
                </h3>
                <p class="tw-text-xs tw-text-gray-400 dark:tw-text-gray-500 tw-m-0 tw-mt-0.5">
                  #{{ party.id }}
                  <span v-if="party.is_private" class="tw-ml-1">
                    <i class="pi pi-lock tw-text-[10px]"></i> Private
                  </span>
                </p>
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
                  <p class="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-gray-100 tw-m-0 tw-truncate">{{ formatDisplayDate(party.play_date) }}</p>
                </div>
              </div>

              <div class="tw-flex tw-items-center tw-gap-2">
                <div class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-court-50 dark:tw-bg-court-900 tw-flex tw-items-center tw-justify-center tw-shrink-0">
                  <i class="pi pi-clock tw-text-court-600 dark:tw-text-court-400 tw-text-xs"></i>
                </div>
                <div class="tw-min-w-0">
                  <p class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-uppercase tw-tracking-wide">Time</p>
                  <p class="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">{{ formatTime(party.start_time) }}</p>
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

            <!-- Members avatars + Action button -->
            <div class="tw-flex tw-items-center tw-justify-between tw-pt-3 tw-border-t tw-border-gray-100 dark:tw-border-court-800">
              <!-- Member avatars -->
              <div class="tw-flex tw-items-center">
                <div class="tw-flex -tw-space-x-2">
                  <UserAvatar
                    v-for="(member, idx) in party.members?.slice(0, 5)"
                    :key="member.id"
                    :src="member.user?.avatar"
                    :name="member.user?.name"
                    size="sm"
                    rounded="full"
                    class="tw-border-2 tw-border-white dark:tw-border-court-900"
                  />
                </div>
                <span v-if="party.members?.length > 5" class="tw-ml-1.5 tw-text-xs tw-text-gray-400">
                  +{{ party.members.length - 5 }}
                </span>
              </div>

              <!-- Action -->
              <button
                v-if="!isUserInParty(party.members)"
                @click="joinParty(party.id)"
                class="tw-h-8 tw-px-4 tw-rounded-lg tw-text-xs tw-font-semibold tw-border-0 tw-cursor-pointer tw-transition-all active:tw-scale-[0.97] tw-bg-court-100 dark:tw-bg-court-800 tw-text-court-700 dark:tw-text-court-300 hover:tw-bg-court-200 dark:hover:tw-bg-court-700"
              >
                <i class="pi pi-sign-in tw-mr-1 tw-text-[10px]"></i> Join
              </button>
              <button
                v-else
                @click="enterParty(party.id)"
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
        <p class="tw-text-sm tw-text-gray-500 tw-mt-1 tw-m-0">Create the first party to get started!</p>
        <button
          @click="showDialog = true"
          class="tw-mt-4 tw-h-10 tw-px-6 tw-rounded-xl tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-text-sm tw-font-medium tw-border-0 tw-cursor-pointer tw-transition-colors"
        >
          <i class="pi pi-plus tw-mr-2 tw-text-xs"></i> Create Party
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-pt-2 tw-pb-4">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="currentPage = p"
          class="tw-w-9 tw-h-9 tw-rounded-lg tw-text-sm tw-font-medium tw-border-0 tw-cursor-pointer tw-transition-colors"
          :class="currentPage === p
            ? 'tw-bg-court-600 tw-text-white'
            : 'tw-bg-white dark:tw-bg-court-900 tw-text-gray-600 dark:tw-text-gray-400 tw-border tw-border-gray-200 dark:tw-border-court-800 hover:tw-bg-gray-50 dark:hover:tw-bg-court-800'"
        >
          {{ p }}
        </button>
      </div>

      <!-- Create Party Dialog (kept PrimeVue for complex form) -->
      <Dialog
        header="Create Party"
        v-model:visible="showDialog"
        :modal="true"
        :closeOnEscape="true"
        :draggable="false"
        class="create-party-dialog mx-2"
      >
        <form @submit.prevent="createParty">
          <div class="p-fluid w-full sm:w-30rem">
            <h3 class="section-title">Party Details</h3>
            <div class="grid align-center justify-between">
              <div class="field col-4 md-4">
                <label for="play_date">Play Date</label>
                <Calendar v-model="form.play_date" showIcon iconDisplay="input" @date-select="formatDate" dateFormat="yy-mm-dd" />
              </div>
              <div class="field col-4 md-4">
                <label for="max_players">Max Players</label>
                <InputNumber id="max_players" v-model="form.max_players" :min="1" />
              </div>
              <div class="field col-4 md-4">
                <label for="status">Status</label>
                <Dropdown id="status" v-model="form.status" :options="statuses" placeholder="Select Status" />
              </div>
            </div>

            <div class="grid align-center justify-between">
              <div class="field col-12 md-6">
                <label for="court_id">Court</label>
                <Dropdown id="court_id" v-model="form.court_id" :options="courts" optionLabel="name" optionValue="id" placeholder="Select Court" />
              </div>
            </div>

            <div class="field-checkbox mt-4">
              <Checkbox name="is_private" v-model="form.is_private" binary inputId="is_private"></Checkbox>
              <label for="is_private">Private Party</label>
            </div>

            <h3 class="section-title">Court Bookings</h3>
            <div
              v-for="(booking, index) in form.court_bookings"
              :key="index"
              class="court-booking p-3 mb-2 border-round-lg shadow-2"
            >
              <h4 class="mb-2">Booking #{{ index + 1 }}</h4>
              <div class="flex gap-4">
                <div class="flex-1">
                  <label>คอร์ทที่</label>
                  <Dropdown
                    :options="Array.from({length: 12}, (_, i) => ({name: i+1}))"
                    optionLabel="name" optionValue="name"
                    v-model="booking.court_field_number"
                    class="w-full"
                  />
                </div>
                <div class="flex-1">
                  <label>เวลาเริ่ม</label>
                  <Dropdown :options="timeOptions" optionLabel="name" optionValue="name" v-model="booking.start_time" class="w-full" />
                </div>
                <div class="flex-1">
                  <label>เวลาจบ</label>
                  <Dropdown :options="filteredEndTimeOptions(index)" optionLabel="name" optionValue="name" v-model="booking.end_time" class="w-full" />
                </div>
              </div>
              <Button label="ลบคอร์ท" icon="pi pi-minus" class="p-button-danger mt-3" @click="removeCourtBooking(index)" />
            </div>
            <Button label="เพิ่มคอร์ท" icon="pi pi-plus" class="p-button-secondary mt-3" @click="addCourtBooking" />
          </div>

          <div class="mt-4 flex p-justify-end gap-2">
            <Button label="Create" icon="pi pi-check" class="p-button-success" type="submit" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="showDialog = false" />
          </div>
        </form>
      </Dialog>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { ref, computed } from "vue";
import { Head, usePage, router } from "@inertiajs/vue3";
import { useToast } from "primevue/usetoast";

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

const reloadPage = () => {
  router.get(`/party-lists`, {}, { preserveScroll: true });
};

const timeOptions = Array.from({ length: 24 }, (_, i) => ({
  name: `${String(i + 1).padStart(2, "0")}:00`,
}));

const formatDate = (date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  form.value.play_date = offsetDate.toISOString().split("T")[0];
};

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
