<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { Head, useForm, usePage, router } from "@inertiajs/vue3";
import { ref, computed, watch } from "vue";
import { useToast } from "@/composables/useToast";

const toast = useToast();
const page = usePage();
const props = defineProps({
  profileData: Object,
  linkedAccounts: { type: Array, default: () => [] },
});

const user = computed(() => page.props.auth.user);
const profileMissingFields = computed(() => page.props.profileMissingFields || []);
const profileCompleteness = computed(() => page.props.profileCompleteness ?? 100);
const missingFieldLabels = {
  gender: 'เพศ',
  date_of_birth: 'วันเกิด',
  phone: 'เบอร์โทรศัพท์',
  email: 'อีเมล',
  address: 'ที่อยู่',
};
const completenessColor = computed(() => {
  if (profileCompleteness.value >= 100) return 'text-success';
  if (profileCompleteness.value >= 60) return 'text-warning';
  return 'text-error';
});
const completenessBarColor = computed(() => {
  if (profileCompleteness.value >= 100) return 'bg-success';
  if (profileCompleteness.value >= 60) return 'bg-warning';
  return 'bg-error';
});

// Profile form (basic info)
const form = useForm({
  name: props.profileData.name || '',
  gender: props.profileData.gender || '',
  date_of_birth: props.profileData.date_of_birth || '',
  subdistrict: props.profileData.subdistrict || '',
  district: props.profileData.district || '',
  province: props.profileData.province || '',
});

// Check if profile has been saved before (has name at minimum)
const profileSaved = ref(!!props.profileData.name && !!props.profileData.gender);
const profileEditing = ref(!profileSaved.value);

const saveProfile = () => {
  form.patch(route('profile.update'), {
    onSuccess: () => {
      profileSaved.value = true;
      profileEditing.value = false;
    },
  });
};

const enableProfileEdit = () => {
  profileEditing.value = true;
};

// Phone verification
const phoneNumber = ref(props.profileData.phone || '');
const phoneVerified = ref(!!props.profileData.phone_verified_at);
const phoneOtp = ref('');
const phoneStep = ref(phoneVerified.value ? 'verified' : 'input'); // input, otp, verified
const phoneSending = ref(false);
const phoneVerifying = ref(false);
const phoneCooldown = ref(0);
let phoneCooldownTimer = null;

const startPhoneCooldown = () => {
  phoneCooldown.value = 60;
  phoneCooldownTimer = setInterval(() => {
    phoneCooldown.value--;
    if (phoneCooldown.value <= 0) clearInterval(phoneCooldownTimer);
  }, 1000);
};

const sendPhoneOtp = async () => {
  phoneSending.value = true;
  try {
    const res = await fetch(route('verify.phone.send'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content },
      body: JSON.stringify({ phone: phoneNumber.value }),
    });
    const data = await res.json();
    if (res.ok) {
      phoneStep.value = 'otp';
      startPhoneCooldown();
      toast.add({ severity: 'success', summary: data.message, life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: data.message, life: 4000 });
    }
  } catch { toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 3000 }); }
  phoneSending.value = false;
};

const verifyPhoneOtp = async () => {
  phoneVerifying.value = true;
  try {
    const res = await fetch(route('verify.phone.check'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content },
      body: JSON.stringify({ phone: phoneNumber.value, code: phoneOtp.value }),
    });
    const data = await res.json();
    if (res.ok) {
      phoneStep.value = 'verified';
      phoneVerified.value = true;
      toast.add({ severity: 'success', summary: data.message, life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: data.message, life: 4000 });
    }
  } catch { toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 3000 }); }
  phoneVerifying.value = false;
};

// Email verification
const isRandomEmail = (email) => !email || email.endsWith('@example.com');
const emailAddress = ref(isRandomEmail(props.profileData.email) ? '' : props.profileData.email);
const emailVerified = ref(!!props.profileData.email_verified_at && !isRandomEmail(props.profileData.email));
const emailCode = ref('');
const emailStep = ref(emailVerified.value ? 'verified' : 'input'); // input, code, verified
const emailSending = ref(false);
const emailVerifying = ref(false);
const emailCooldown = ref(0);
let emailCooldownTimer = null;

const startEmailCooldown = () => {
  emailCooldown.value = 60;
  emailCooldownTimer = setInterval(() => {
    emailCooldown.value--;
    if (emailCooldown.value <= 0) clearInterval(emailCooldownTimer);
  }, 1000);
};

const sendEmailCode = async () => {
  emailSending.value = true;
  try {
    const res = await fetch(route('verify.email.send'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content },
      body: JSON.stringify({ email: emailAddress.value }),
    });
    const data = await res.json();
    if (res.ok) {
      emailStep.value = 'code';
      startEmailCooldown();
      toast.add({ severity: 'success', summary: data.message, life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: data.message, life: 4000 });
    }
  } catch { toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 3000 }); }
  emailSending.value = false;
};

const verifyEmailCode = async () => {
  emailVerifying.value = true;
  try {
    const res = await fetch(route('verify.email.check'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content },
      body: JSON.stringify({ email: emailAddress.value, code: emailCode.value }),
    });
    const data = await res.json();
    if (res.ok) {
      emailStep.value = 'verified';
      emailVerified.value = true;
      toast.add({ severity: 'success', summary: data.message, life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: data.message, life: 4000 });
    }
  } catch { toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 3000 }); }
  emailVerifying.value = false;
};

// Address autocomplete
const addressQuery = ref('');
const addressResults = ref([]);
const showAddressDropdown = ref(false);
const addressSelected = ref(!!props.profileData.subdistrict);
let addressTimeout = null;
let skipNextSearch = false;

const searchAddress = (val) => {
  clearTimeout(addressTimeout);
  if (skipNextSearch) { skipNextSearch = false; return; }
  if (val.length < 2) { addressResults.value = []; showAddressDropdown.value = false; return; }
  // เมื่อพิมพ์ใหม่ ล้างค่าเดิมออก
  if (addressSelected.value) {
    form.subdistrict = '';
    form.district = '';
    form.province = '';
    addressSelected.value = false;
  }
  addressTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`/api/thai-address?q=${encodeURIComponent(val)}`, { credentials: 'same-origin' });
      addressResults.value = await res.json();
      showAddressDropdown.value = addressResults.value.length > 0;
    } catch { addressResults.value = []; }
  }, 300);
};

watch(addressQuery, searchAddress);

const selectAddress = (addr) => {
  form.subdistrict = addr.district;
  form.district = addr.amphoe;
  form.province = addr.province;
  skipNextSearch = true;
  addressQuery.value = `${addr.district}, ${addr.amphoe}, ${addr.province}`;
  addressSelected.value = true;
  showAddressDropdown.value = false;
};

const clearAddress = () => {
  addressQuery.value = '';
  form.subdistrict = '';
  form.district = '';
  form.province = '';
  addressResults.value = [];
  addressSelected.value = false;
  showAddressDropdown.value = false;
};

// Init address query if data exists
if (props.profileData.subdistrict) {
  addressQuery.value = [props.profileData.subdistrict, props.profileData.district, props.profileData.province].filter(Boolean).join(', ');
}

// Linked accounts
const providers = [
  { key: 'line', label: 'LINE', color: 'bg-[#06C755]/10 text-[#06C755]' },
  { key: 'google', label: 'Google', color: 'bg-blue-500/10 text-blue-600' },
  { key: 'apple', label: 'Apple', color: 'bg-gray-800/10 text-gray-800 dark:bg-gray-200/10 dark:text-gray-200' },
];

const isLinked = (provider) => props.linkedAccounts.some(la => la.provider === provider);
const linkedName = (provider) => props.linkedAccounts.find(la => la.provider === provider)?.provider_name;
const unlinkingProvider = ref(null);

const unlinkAccount = (provider) => {
  if (!confirm(`ยืนยันยกเลิกการเชื่อมต่อ ${provider.toUpperCase()} ?`)) return;
  unlinkingProvider.value = provider;
  router.delete(route('linked-accounts.unlink', provider), {
    onSuccess: () => {
      toast.add({ severity: 'success', summary: `ยกเลิกการเชื่อมต่อ ${provider} แล้ว`, life: 3000 });
      unlinkingProvider.value = null;
    },
    onError: () => {
      toast.add({ severity: 'error', summary: 'ไม่สามารถยกเลิกได้', life: 3000 });
      unlinkingProvider.value = null;
    },
  });
};

// Change phone/email (reset verification)
const changePhone = () => {
  phoneStep.value = 'input';
  phoneVerified.value = false;
  phoneOtp.value = '';
};
const changeEmail = () => {
  emailStep.value = 'input';
  emailVerified.value = false;
  emailCode.value = '';
};
</script>

<template>
  <Head title="แก้ไขโปรไฟล์" />
  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center">
        <UserAvatar :src="user.avatar" :name="user.name" size="2xl" rounded="full" class="mx-auto border-4 border-base-100 shadow-lg mb-3" />
        <h1 class="text-lg font-bold text-base-content m-0">แก้ไขโปรไฟล์</h1>
        <p class="text-xs text-base-content/50 mt-1 m-0">จัดการข้อมูลส่วนตัวและการยืนยันตัวตน</p>
      </div>

      <!-- Profile completeness -->
      <div class="bg-base-100 rounded-2xl border overflow-hidden" :class="profileCompleteness >= 100 ? 'border-success/40' : 'border-warning/40'">
        <div class="p-4">
          <!-- Header row -->
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold text-base-content">ความสมบูรณ์ของโปรไฟล์</span>
            <span class="text-lg font-extrabold" :class="completenessColor">{{ profileCompleteness }}%</span>
          </div>
          <!-- Progress bar -->
          <div class="w-full h-2.5 bg-base-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="completenessBarColor"
              :style="{ width: profileCompleteness + '%' }"
            ></div>
          </div>
          <!-- Missing items -->
          <div v-if="profileMissingFields.length > 0" class="mt-3 flex flex-wrap gap-1.5">
            <span v-for="field in profileMissingFields" :key="field"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-error/10 text-error text-[11px] font-semibold">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
              {{ missingFieldLabels[field] || field }}
            </span>
          </div>
          <div v-else class="mt-2 flex items-center gap-1.5 text-success text-xs font-semibold">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            โปรไฟล์สมบูรณ์แล้ว!
          </div>
        </div>
      </div>

      <!-- Basic Info -->
      <form @submit.prevent="saveProfile" class="bg-base-100 rounded-2xl border overflow-hidden" :class="profileMissingFields.some(f => ['gender','date_of_birth','address'].includes(f)) ? 'border-error/40' : 'border-base-300'">
        <div class="px-4 py-3 border-b border-base-200 flex items-center justify-between">
          <h2 class="text-sm font-bold text-base-content m-0">ข้อมูลส่วนตัว</h2>
          <button v-if="profileSaved && !profileEditing" @click="enableProfileEdit" type="button"
            class="btn btn-outline btn-primary btn-xs">แก้ไข</button>
          <span v-if="profileSaved && !profileEditing" class="badge badge-success badge-sm gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            บันทึกแล้ว
          </span>
        </div>
        <div class="p-4 space-y-4">
          <!-- Name -->
          <div>
            <label class="text-xs font-semibold text-base-content/70 mb-1 block">ชื่อที่แสดง</label>
            <input v-model="form.name" type="text" required :disabled="!profileEditing"
              class="input input-bordered w-full" :class="!profileEditing && 'opacity-70'" placeholder="ชื่อของคุณ" />
            <p v-if="form.errors.name" class="text-xs text-error mt-1">{{ form.errors.name }}</p>
          </div>

          <!-- Gender -->
          <div>
            <label class="text-xs font-semibold text-base-content/70 mb-1 block">
              เพศ
              <span v-if="profileMissingFields.includes('gender')" class="text-error ml-1">*</span>
            </label>
            <div class="flex gap-2">
              <button type="button" v-for="g in [{key:'male',label:'ชาย',icon:'👨'},{key:'female',label:'หญิง',icon:'👩'},{key:'other',label:'อื่นๆ',icon:'🧑'}]" :key="g.key"
                @click="profileEditing && (form.gender = g.key)"
                class="flex-1 py-2.5 rounded-xl border text-center transition-all text-sm font-semibold"
                :class="[
                  form.gender === g.key ? 'bg-primary/10 border-primary text-primary' : 'bg-base-100 border-base-300 text-base-content/60',
                  profileEditing ? 'cursor-pointer hover:border-primary/50' : 'cursor-default opacity-70'
                ]"
              >{{ g.icon }} {{ g.label }}</button>
            </div>
            <p v-if="form.errors.gender" class="text-xs text-error mt-1">{{ form.errors.gender }}</p>
          </div>

          <!-- Date of Birth -->
          <div>
            <label class="text-xs font-semibold text-base-content/70 mb-1 block">
              วันเกิด
              <span v-if="profileMissingFields.includes('date_of_birth')" class="text-error ml-1">*</span>
            </label>
            <input v-model="form.date_of_birth" type="date" :disabled="!profileEditing"
              class="input input-bordered w-full" :class="!profileEditing && 'opacity-70'" />
            <p v-if="form.errors.date_of_birth" class="text-xs text-error mt-1">{{ form.errors.date_of_birth }}</p>
          </div>

          <!-- Address -->
          <div>
            <label class="text-xs font-semibold text-base-content/70 mb-1 block">
              ที่อยู่ (ตำบล/อำเภอ/จังหวัด)
              <span v-if="profileMissingFields.includes('address')" class="text-error ml-1">*</span>
            </label>
            <p class="text-[10px] text-base-content/40 mb-1.5">ใช้ประเมินความหนาแน่นของนักแบดมินตันในพื้นที่</p>
            <div class="relative">
              <input v-model="addressQuery" type="text" :disabled="!profileEditing"
                class="input input-bordered w-full pr-8" :class="!profileEditing && 'opacity-70'"
                placeholder="พิมพ์ชื่อตำบล อำเภอ หรือจังหวัด..."
                @focus="profileEditing && addressQuery.length >= 2 && !addressSelected && (showAddressDropdown = addressResults.length > 0)"
                @blur="setTimeout(() => showAddressDropdown = false, 200)"
              />
              <!-- Clear button -->
              <button v-if="addressQuery && profileEditing" type="button" @mousedown.prevent="clearAddress"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-base-content/10 hover:bg-base-content/20 text-base-content/50 cursor-pointer border-0 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <!-- Dropdown -->
              <div v-if="showAddressDropdown && addressResults.length > 0" class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                <button v-for="(addr, i) in addressResults" :key="i"
                  type="button"
                  @mousedown.prevent="selectAddress(addr)"
                  class="w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 cursor-pointer border-0 bg-transparent transition-colors"
                >
                  <span class="font-semibold text-base-content">{{ addr.district }}</span>
                  <span class="text-base-content/50"> > {{ addr.amphoe }} > {{ addr.province }}</span>
                  <span class="text-base-content/30 text-xs ml-1">{{ addr.zipcode }}</span>
                </button>
              </div>
              <!-- Hint: พิมพ์แล้วยังไม่เลือก -->
              <p v-if="addressQuery.length >= 2 && !addressSelected" class="text-[10px] text-warning mt-1 m-0">กรุณาเลือกจากรายการด้านบน</p>
            </div>
            <!-- Selected display -->
            <div v-if="addressSelected && form.subdistrict" class="mt-1.5 flex items-center gap-1.5">
              <span class="badge badge-primary badge-sm gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ form.subdistrict }}, {{ form.district }}, {{ form.province }}
              </span>
            </div>
          </div>

          <!-- Save -->
          <button v-if="profileEditing" type="submit" :disabled="form.processing"
            class="w-full py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50">
            <span v-if="form.processing" class="loading loading-spinner loading-xs mr-1"></span>
            บันทึกข้อมูล
          </button>
        </div>
      </form>

      <!-- Linked Accounts -->
      <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200">
          <h2 class="text-sm font-bold text-base-content m-0">บัญชีที่เชื่อมต่อ</h2>
          <p class="text-[10px] text-base-content/40 mt-0.5 m-0">เชื่อมต่อเพื่อ login ได้หลายช่องทาง</p>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="p in providers" :key="p.key" class="flex items-center gap-3">
            <!-- Provider icon -->
            <div class="w-9 h-9 rounded-lg flex items-center justify-center" :class="p.color">
              <!-- LINE -->
              <svg v-if="p.key === 'line'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              <!-- Google -->
              <svg v-else-if="p.key === 'google'" class="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <!-- Apple -->
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-base-content">{{ p.label }}</div>
              <div v-if="isLinked(p.key)" class="text-[10px] text-success truncate">
                เชื่อมต่อแล้ว{{ linkedName(p.key) ? ' — ' + linkedName(p.key) : '' }}
              </div>
              <div v-else class="text-[10px] text-base-content/40">ยังไม่ได้เชื่อมต่อ</div>
            </div>
            <!-- Action -->
            <a v-if="!isLinked(p.key)" :href="route('linked-accounts.link', p.key)"
              class="btn btn-primary btn-xs no-underline">เชื่อมต่อ</a>
            <button v-else @click="unlinkAccount(p.key)"
              :disabled="linkedAccounts.length <= 1 || unlinkingProvider === p.key"
              class="btn btn-outline btn-error btn-xs">
              <span v-if="unlinkingProvider === p.key" class="loading loading-spinner loading-xs"></span>
              <span v-else>ยกเลิก</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Phone Verification -->
      <div class="bg-base-100 rounded-2xl border overflow-hidden" :class="profileMissingFields.includes('phone') ? 'border-error/40' : 'border-base-300'">
        <div class="px-4 py-3 border-b border-base-200 flex items-center justify-between">
          <h2 class="text-sm font-bold text-base-content m-0">
            เบอร์โทรศัพท์
            <span v-if="profileMissingFields.includes('phone')" class="text-error ml-1">*</span>
          </h2>
          <span v-if="phoneVerified" class="badge badge-success badge-sm gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            ยืนยันแล้ว
          </span>
        </div>
        <div class="p-4 space-y-3">
          <!-- Verified state -->
          <template v-if="phoneStep === 'verified'">
            <div class="flex items-center gap-3">
              <div class="flex-1">
                <div class="text-sm font-semibold text-base-content">{{ phoneNumber }}</div>
                <div class="text-[10px] text-success">ยืนยันแล้ว</div>
              </div>
              <button @click="changePhone" type="button"
                class="btn btn-outline btn-primary btn-xs">เปลี่ยน</button>
            </div>
          </template>

          <!-- Input state -->
          <template v-else-if="phoneStep === 'input'">
            <div>
              <label class="text-xs font-semibold text-base-content/70 mb-1 block">เบอร์โทร</label>
              <div class="flex gap-2">
                <input v-model="phoneNumber" type="tel" placeholder="08x-xxx-xxxx" maxlength="10"
                  class="input input-bordered flex-1" />
                <button @click="sendPhoneOtp" :disabled="phoneSending || !phoneNumber || phoneNumber.length < 9"
                  class="btn btn-primary btn-sm px-4" type="button">
                  <span v-if="phoneSending" class="loading loading-spinner loading-xs"></span>
                  <span v-else>ส่ง OTP</span>
                </button>
              </div>
            </div>
          </template>

          <!-- OTP state -->
          <template v-else-if="phoneStep === 'otp'">
            <p class="text-xs text-base-content/60 m-0">ส่งรหัส OTP ไปที่ <strong>{{ phoneNumber }}</strong></p>
            <div class="flex gap-2">
              <input v-model="phoneOtp" type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="กรอกรหัส 6 หลัก" maxlength="6"
                class="input input-bordered flex-1 text-center text-lg font-mono otp-input" />
              <button @click="verifyPhoneOtp" :disabled="phoneVerifying || phoneOtp.length !== 6"
                class="btn btn-primary btn-sm px-4" type="button">
                <span v-if="phoneVerifying" class="loading loading-spinner loading-xs"></span>
                <span v-else>ยืนยัน</span>
              </button>
            </div>
            <div class="flex items-center justify-between mt-1">
              <button @click="phoneStep = 'input'" type="button"
                class="btn btn-outline btn-xs">เปลี่ยนเบอร์</button>
              <button @click="sendPhoneOtp" :disabled="phoneCooldown > 0 || phoneSending" type="button"
                class="btn btn-sm"
                :class="phoneCooldown > 0 ? 'btn-disabled bg-base-200 text-base-content/40' : 'btn-outline btn-primary'">
                <span v-if="phoneSending" class="loading loading-spinner loading-xs"></span>
                <template v-else-if="phoneCooldown > 0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  ส่งอีกครั้งใน {{ phoneCooldown }}s
                </template>
                <template v-else>ส่งรหัสอีกครั้ง</template>
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- Email Verification -->
      <div class="bg-base-100 rounded-2xl border overflow-hidden" :class="profileMissingFields.includes('email') ? 'border-error/40' : 'border-base-300'">
        <div class="px-4 py-3 border-b border-base-200 flex items-center justify-between">
          <h2 class="text-sm font-bold text-base-content m-0">
            อีเมล
            <span v-if="profileMissingFields.includes('email')" class="text-error ml-1">*</span>
          </h2>
          <span v-if="emailVerified" class="badge badge-success badge-sm gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            ยืนยันแล้ว
          </span>
        </div>
        <div class="p-4 space-y-3">
          <!-- Verified state -->
          <template v-if="emailStep === 'verified'">
            <div class="flex items-center gap-3">
              <div class="flex-1">
                <div class="text-sm font-semibold text-base-content">{{ emailAddress }}</div>
                <div class="text-[10px] text-success">ยืนยันแล้ว</div>
              </div>
              <button @click="changeEmail" type="button"
                class="btn btn-outline btn-primary btn-xs">เปลี่ยน</button>
            </div>
          </template>

          <!-- Input state -->
          <template v-else-if="emailStep === 'input'">
            <div>
              <label class="text-xs font-semibold text-base-content/70 mb-1 block">อีเมล</label>
              <div class="flex gap-2">
                <input v-model="emailAddress" type="email" placeholder="you@example.com"
                  class="input input-bordered flex-1" />
                <button @click="sendEmailCode" :disabled="emailSending || !emailAddress"
                  class="btn btn-primary btn-sm px-4" type="button">
                  <span v-if="emailSending" class="loading loading-spinner loading-xs"></span>
                  <span v-else>ส่งรหัส</span>
                </button>
              </div>
            </div>
          </template>

          <!-- Code state -->
          <template v-else-if="emailStep === 'code'">
            <p class="text-xs text-base-content/60 m-0">ส่งรหัสยืนยันไปที่ <strong>{{ emailAddress }}</strong></p>
            <div class="flex gap-2">
              <input v-model="emailCode" type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="กรอกรหัส 6 หลัก" maxlength="6"
                class="input input-bordered flex-1 text-center text-lg font-mono otp-input" />
              <button @click="verifyEmailCode" :disabled="emailVerifying || emailCode.length !== 6"
                class="btn btn-primary btn-sm px-4" type="button">
                <span v-if="emailVerifying" class="loading loading-spinner loading-xs"></span>
                <span v-else>ยืนยัน</span>
              </button>
            </div>
            <div class="flex items-center justify-between mt-1">
              <button @click="emailStep = 'input'" type="button"
                class="btn btn-outline btn-xs">เปลี่ยนอีเมล</button>
              <button @click="sendEmailCode" :disabled="emailCooldown > 0 || emailSending" type="button"
                class="btn btn-sm"
                :class="emailCooldown > 0 ? 'btn-disabled bg-base-200 text-base-content/40' : 'btn-outline btn-primary'">
                <span v-if="emailSending" class="loading loading-spinner loading-xs"></span>
                <template v-else-if="emailCooldown > 0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  ส่งอีกครั้งใน {{ emailCooldown }}s
                </template>
                <template v-else>ส่งรหัสอีกครั้ง</template>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.otp-input {
  letter-spacing: 8px;
}
.otp-input::placeholder {
  letter-spacing: normal;
}
</style>
