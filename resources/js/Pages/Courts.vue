<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { Head, usePage, router } from "@inertiajs/vue3";
import { ref, reactive, computed } from "vue";
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import axios from "axios";

const { t } = useLocale();
const toast = useToast();
const { confirm } = useConfirm();
const page = usePage();

const props = defineProps({
  courts: { type: Array, default: () => [] },
});

// Dialog state
const showDialog = ref(false);
const editingId = ref(null);
const submitting = ref(false);

const form = reactive({
  name: "",
  address: "",
  phone: "",
  field_total: 1,
  court_type: "",
  play_price: "",
  latitude: "",
  longitude: "",
  available_for_booking: true,
});

const errors = ref({});

const dialogTitle = computed(() =>
  editingId.value ? t("courts.editCourt") : t("courts.addCourt")
);

const courtTypeOptions = [
  { value: "rubber", labelKey: "courts.rubber" },
  { value: "wood", labelKey: "courts.wood" },
  { value: "synthetic", labelKey: "courts.synthetic" },
];

const courtTypeLabel = (type) => {
  const option = courtTypeOptions.find((o) => o.value === type);
  return option ? t(option.labelKey) : type || "-";
};

// === Dialog actions ===
const openAdd = () => {
  editingId.value = null;
  resetForm();
  errors.value = {};
  showDialog.value = true;
};

const openEdit = (court) => {
  editingId.value = court.id;
  form.name = court.name || "";
  form.address = court.address || "";
  form.phone = court.phone || "";
  form.field_total = court.field_total || 1;
  form.court_type = court.court_type || "";
  form.play_price = court.play_price || "";
  form.latitude = court.latitude || "";
  form.longitude = court.longitude || "";
  form.available_for_booking = court.available_for_booking ?? true;
  errors.value = {};
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  editingId.value = null;
  resetForm();
  errors.value = {};
};

const resetForm = () => {
  form.name = "";
  form.address = "";
  form.phone = "";
  form.field_total = 1;
  form.court_type = "";
  form.play_price = "";
  form.latitude = "";
  form.longitude = "";
  form.available_for_booking = true;
};

// === Validation ===
const validate = () => {
  const errs = {};
  if (!form.name.trim()) {
    errs.name = t("courts.name") + " is required";
  }
  if (form.field_total < 1) {
    errs.field_total = t("courts.fieldTotal") + " min 1";
  }
  errors.value = errs;
  return Object.keys(errs).length === 0;
};

// === CRUD ===
const submitForm = async () => {
  if (!validate()) return;
  submitting.value = true;

  const payload = {
    name: form.name,
    address: form.address || null,
    phone: form.phone || null,
    field_total: parseInt(form.field_total) || 1,
    court_type: form.court_type || null,
    play_price: form.play_price ? parseFloat(form.play_price) : null,
    latitude: form.latitude ? parseFloat(form.latitude) : null,
    longitude: form.longitude ? parseFloat(form.longitude) : null,
    available_for_booking: form.available_for_booking,
  };

  try {
    if (editingId.value) {
      await axios.post(`/courts/${editingId.value}/update`, payload);
      toast.add({
        severity: "success",
        summary: t("courts.editCourt"),
        detail: t("common.save"),
        life: 3000,
      });
    } else {
      await axios.post("/courts", payload);
      toast.add({
        severity: "success",
        summary: t("courts.addCourt"),
        detail: t("common.save"),
        life: 3000,
      });
    }
    closeDialog();
    router.reload({ preserveScroll: true, only: ["courts"] });
  } catch (e) {
    if (e.response?.status === 422 && e.response?.data?.errors) {
      errors.value = {};
      Object.entries(e.response.data.errors).forEach(([key, msgs]) => {
        errors.value[key] = msgs[0];
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: e.response?.data?.message || "Something went wrong",
        life: 3000,
      });
    }
  } finally {
    submitting.value = false;
  }
};

const deleteCourt = (court) => {
  confirm({
    message: t("courts.deleteConfirm"),
    header: t("common.delete"),
    accept: async () => {
      try {
        await axios.delete(`/courts/${court.id}`);
        toast.add({
          severity: "success",
          summary: t("common.delete"),
          detail: t("common.delete"),
          life: 3000,
        });
        router.reload({ preserveScroll: true, only: ["courts"] });
      } catch (e) {
        const msg =
          e.response?.data?.errors?.court ||
          e.response?.data?.message ||
          "Something went wrong";
        toast.add({
          severity: "error",
          summary: "Error",
          detail: msg,
          life: 5000,
        });
      }
    },
  });
};
</script>

<template>
  <Head :title="t('courts.title')" />

  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-base font-bold text-base-content m-0">
          {{ t("courts.title") }}
        </h1>
        <div class="flex gap-2">
          <a href="/courts/map" class="btn btn-outline btn-success btn-sm gap-1 no-underline">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            แผนที่
          </a>
          <button
            class="btn btn-primary btn-sm gap-1"
            @click="openAdd"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          {{ t("courts.addCourt") }}
        </button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="courts.length === 0"
        class="text-center py-12 bg-base-100 rounded-xl border border-base-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p class="text-sm text-base-content/50 mt-3 m-0">
          {{ t("courts.noCourts") }}
        </p>
      </div>

      <!-- Court list -->
      <div class="space-y-3">
        <div
          v-for="court in courts"
          :key="court.id"
          class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"
        >
          <!-- Court header -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-base-content m-0 truncate">
                  {{ court.name }}
                </h3>
                <span
                  class="badge badge-xs"
                  :class="court.available_for_booking ? 'badge-success' : 'badge-ghost'"
                >
                  {{ court.available_for_booking ? t("courts.available") : "-" }}
                </span>
              </div>
              <p v-if="court.address" class="text-xs text-base-content/60 mt-1 m-0 truncate">
                {{ court.address }}
              </p>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                @click="openEdit(court)"
                class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-info/10 text-info border-0 cursor-pointer hover:bg-info/20 transition-colors"
              >
                {{ t("courts.editCourt") }}
              </button>
              <button
                @click="deleteCourt(court)"
                class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors"
              >
                {{ t("common.delete") }}
              </button>
            </div>
          </div>

          <!-- Court details -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div v-if="court.phone" class="bg-base-200/50 rounded-lg px-2.5 py-1.5">
              <div class="text-base-content/40 text-[10px]">{{ t("courts.phone") }}</div>
              <div class="text-base-content font-medium">{{ court.phone }}</div>
            </div>
            <div class="bg-base-200/50 rounded-lg px-2.5 py-1.5">
              <div class="text-base-content/40 text-[10px]">{{ t("courts.fieldTotal") }}</div>
              <div class="text-base-content font-medium">{{ court.field_total }}</div>
            </div>
            <div v-if="court.court_type" class="bg-base-200/50 rounded-lg px-2.5 py-1.5">
              <div class="text-base-content/40 text-[10px]">{{ t("courts.courtType") }}</div>
              <div class="text-base-content font-medium">{{ courtTypeLabel(court.court_type) }}</div>
            </div>
            <div v-if="court.play_price" class="bg-base-200/50 rounded-lg px-2.5 py-1.5">
              <div class="text-base-content/40 text-[10px]">{{ t("courts.playPrice") }}</div>
              <div class="text-base-content font-medium">{{ parseFloat(court.play_price).toLocaleString() }} ฿</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <dialog
      class="modal"
      :class="{ 'modal-open': showDialog }"
    >
      <div class="modal-box max-w-md bg-base-100">
        <h3 class="text-base font-bold text-base-content m-0 mb-4">
          {{ dialogTitle }}
        </h3>

        <form @submit.prevent="submitForm" class="space-y-3">
          <!-- Name -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-xs font-semibold">{{ t("courts.name") }} *</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="input input-bordered input-sm w-full"
              :class="{ 'input-error': errors.name }"
              :placeholder="t('courts.name')"
            />
            <label v-if="errors.name" class="label py-0.5">
              <span class="label-text-alt text-error text-[10px]">{{ errors.name }}</span>
            </label>
          </div>

          <!-- Address -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-xs font-semibold">{{ t("courts.address") }}</span>
            </label>
            <input
              v-model="form.address"
              type="text"
              class="input input-bordered input-sm w-full"
              :placeholder="t('courts.address')"
            />
          </div>

          <!-- Phone -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-xs font-semibold">{{ t("courts.phone") }}</span>
            </label>
            <input
              v-model="form.phone"
              type="text"
              class="input input-bordered input-sm w-full"
              :placeholder="t('courts.phone')"
            />
          </div>

          <!-- Field Total -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-xs font-semibold">{{ t("courts.fieldTotal") }}</span>
            </label>
            <input
              v-model.number="form.field_total"
              type="number"
              min="1"
              class="input input-bordered input-sm w-full"
              :class="{ 'input-error': errors.field_total }"
            />
            <label v-if="errors.field_total" class="label py-0.5">
              <span class="label-text-alt text-error text-[10px]">{{ errors.field_total }}</span>
            </label>
          </div>

          <!-- Court Type -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-xs font-semibold">{{ t("courts.courtType") }}</span>
            </label>
            <select
              v-model="form.court_type"
              class="select select-bordered select-sm w-full"
            >
              <option value="">-</option>
              <option
                v-for="opt in courtTypeOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ t(opt.labelKey) }}
              </option>
            </select>
          </div>

          <!-- Play Price -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-xs font-semibold">{{ t("courts.playPrice") }}</span>
            </label>
            <input
              v-model="form.play_price"
              type="number"
              min="0"
              step="0.01"
              class="input input-bordered input-sm w-full"
              :placeholder="t('courts.playPrice')"
            />
          </div>

          <!-- Latitude / Longitude -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text text-xs font-semibold">พิกัด (Latitude, Longitude)</span>
            </label>
            <div class="flex gap-2">
              <input
                v-model="form.latitude"
                type="number"
                step="0.0000001"
                class="input input-bordered input-sm flex-1"
                placeholder="เช่น 18.7883"
              />
              <input
                v-model="form.longitude"
                type="number"
                step="0.0000001"
                class="input input-bordered input-sm flex-1"
                placeholder="เช่น 98.9853"
              />
            </div>
            <label class="label py-0.5">
              <span class="label-text-alt text-base-content/40 text-[10px]">คัดลอกจาก Google Maps หรือกดขวาบนแผนที่</span>
            </label>
          </div>

          <!-- Available for Booking -->
          <div class="form-control">
            <label class="label cursor-pointer py-1 justify-start gap-3">
              <input
                v-model="form.available_for_booking"
                type="checkbox"
                class="checkbox checkbox-primary checkbox-sm"
              />
              <span class="label-text text-xs font-semibold">{{ t("courts.available") }}</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="modal-action mt-4">
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              @click="closeDialog"
            >
              {{ t("common.cancel") }}
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-sm"
              :disabled="submitting"
            >
              <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
              {{ t("common.save") }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeDialog">
        <button>close</button>
      </form>
    </dialog>
  </AppLayout>
</template>
