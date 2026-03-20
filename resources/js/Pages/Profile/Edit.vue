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
});

const user = computed(() => page.props.auth.user);

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
      toast.add({ severity: 'success', summary: 'บันทึกโปรไฟล์เรียบร้อย', life: 3000 });
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
const emailAddress = ref(props.profileData.email || '');
const emailVerified = ref(!!props.profileData.email_verified_at);
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
let addressTimeout = null;

const searchAddress = (val) => {
  clearTimeout(addressTimeout);
  if (val.length < 2) { addressResults.value = []; return; }
  addressTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`/api/thai-address?q=${encodeURIComponent(val)}`);
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
  addressQuery.value = `${addr.district}, ${addr.amphoe}, ${addr.province}`;
  showAddressDropdown.value = false;
};

// Compute display address
const displayAddress = computed(() => {
  const parts = [form.subdistrict, form.district, form.province].filter(Boolean);
  return parts.join(', ');
});

// Init address query if data exists
if (props.profileData.subdistrict) {
  addressQuery.value = [props.profileData.subdistrict, props.profileData.district, props.profileData.province].filter(Boolean).join(', ');
}

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

      <!-- Basic Info -->
      <form @submit.prevent="saveProfile" class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
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
            <label class="text-xs font-semibold text-base-content/70 mb-1 block">เพศ</label>
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
            <label class="text-xs font-semibold text-base-content/70 mb-1 block">วันเกิด</label>
            <input v-model="form.date_of_birth" type="date" :disabled="!profileEditing"
              class="input input-bordered w-full" :class="!profileEditing && 'opacity-70'" />
            <p v-if="form.errors.date_of_birth" class="text-xs text-error mt-1">{{ form.errors.date_of_birth }}</p>
          </div>

          <!-- Address -->
          <div>
            <label class="text-xs font-semibold text-base-content/70 mb-1 block">ที่อยู่ (ตำบล/อำเภอ/จังหวัด)</label>
            <p class="text-[10px] text-base-content/40 mb-1.5">ใช้ประเมินความหนาแน่นของนักแบดมินตันในพื้นที่</p>
            <div class="relative">
              <input v-model="addressQuery" type="text" :disabled="!profileEditing"
                class="input input-bordered w-full" :class="!profileEditing && 'opacity-70'"
                placeholder="พิมพ์ชื่อตำบล อำเภอ หรือจังหวัด..."
                @focus="profileEditing && (showAddressDropdown = addressResults.length > 0)"
                @blur="setTimeout(() => showAddressDropdown = false, 200)"
              />
              <!-- Dropdown -->
              <div v-if="showAddressDropdown" class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
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
            </div>
            <!-- Selected display -->
            <div v-if="form.subdistrict" class="mt-1.5 flex items-center gap-1.5">
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

      <!-- Phone Verification -->
      <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200 flex items-center justify-between">
          <h2 class="text-sm font-bold text-base-content m-0">เบอร์โทรศัพท์</h2>
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
              <input v-model="phoneOtp" type="text" placeholder="กรอกรหัส 6 หลัก" maxlength="6"
                class="input input-bordered flex-1 text-center text-lg font-mono otp-input" />
              <button @click="verifyPhoneOtp" :disabled="phoneVerifying || phoneOtp.length !== 6"
                class="btn btn-primary btn-sm px-4" type="button">
                <span v-if="phoneVerifying" class="loading loading-spinner loading-xs"></span>
                <span v-else>ยืนยัน</span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <button @click="phoneStep = 'input'" type="button"
                class="text-xs text-base-content/50 border-0 bg-transparent cursor-pointer hover:text-primary">เปลี่ยนเบอร์</button>
              <button @click="sendPhoneOtp" :disabled="phoneCooldown > 0 || phoneSending" type="button"
                class="text-xs text-primary font-semibold border-0 bg-transparent cursor-pointer hover:underline disabled:text-base-content/30 disabled:no-underline">
                {{ phoneCooldown > 0 ? `ส่งใหม่ใน ${phoneCooldown}s` : 'ส่งรหัสอีกครั้ง' }}
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- Email Verification -->
      <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200 flex items-center justify-between">
          <h2 class="text-sm font-bold text-base-content m-0">อีเมล</h2>
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
              <input v-model="emailCode" type="text" placeholder="กรอกรหัส 6 หลัก" maxlength="6"
                class="input input-bordered flex-1 text-center text-lg font-mono otp-input" />
              <button @click="verifyEmailCode" :disabled="emailVerifying || emailCode.length !== 6"
                class="btn btn-primary btn-sm px-4" type="button">
                <span v-if="emailVerifying" class="loading loading-spinner loading-xs"></span>
                <span v-else>ยืนยัน</span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <button @click="emailStep = 'input'" type="button"
                class="text-xs text-base-content/50 border-0 bg-transparent cursor-pointer hover:text-primary">เปลี่ยนอีเมล</button>
              <button @click="sendEmailCode" :disabled="emailCooldown > 0 || emailSending" type="button"
                class="text-xs text-primary font-semibold border-0 bg-transparent cursor-pointer hover:underline disabled:text-base-content/30 disabled:no-underline">
                {{ emailCooldown > 0 ? `ส่งใหม่ใน ${emailCooldown}s` : 'ส่งรหัสอีกครั้ง' }}
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
