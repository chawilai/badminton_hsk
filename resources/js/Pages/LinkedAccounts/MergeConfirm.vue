<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { Head, router } from "@inertiajs/vue3";
import { ref } from "vue";
import { useToast } from "@/composables/useToast";

const toast = useToast();

const props = defineProps({
  keepUser: Object,
  mergeUser: Object,
  conflicts: { type: Array, default: () => [] },
  provider: String,
});

const hasConflicts = props.conflicts.length > 0;

// Profile choices
const chosenName = ref(props.keepUser.name);
const chosenAvatar = ref(props.keepUser.avatar);
const merging = ref(false);

const confirmMerge = () => {
  if (hasConflicts) return;
  merging.value = true;

  router.post(route('linked-accounts.merge.confirm'), {
    name: chosenName.value,
    avatar: chosenAvatar.value,
  }, {
    onSuccess: () => {
      toast.add({ severity: 'success', summary: 'รวมบัญชีเรียบร้อย!', life: 3000 });
    },
    onError: () => {
      toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด กรุณาลองใหม่', life: 4000 });
      merging.value = false;
    },
  });
};
</script>

<template>
  <Head title="รวมบัญชี" />
  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl p-5 text-center">
        <div class="text-3xl mb-2">🔗</div>
        <h1 class="text-lg font-bold text-base-content m-0">รวมบัญชี</h1>
        <p class="text-xs text-base-content/50 mt-1 m-0">พบบัญชีที่ใช้ {{ provider?.toUpperCase() }} เดียวกัน</p>
      </div>

      <!-- Conflicts -->
      <div v-if="hasConflicts" class="bg-error/10 rounded-2xl border border-error/30 p-4">
        <h2 class="text-sm font-bold text-error m-0 mb-2">ไม่สามารถรวมบัญชีได้</h2>
        <div v-for="c in conflicts" :key="c.type" class="mb-2">
          <p class="text-sm text-error/80 m-0 font-semibold">{{ c.message }}</p>
          <ul v-if="c.details" class="text-xs text-error/60 mt-1 pl-4 m-0">
            <li v-for="d in c.details" :key="d.party_id">
              {{ d.name || `ปาร์ตี้ #${d.party_id}` }} ({{ d.play_date }})
            </li>
          </ul>
        </div>
        <p class="text-xs text-base-content/60 mt-3 m-0">
          กรุณาให้หัวหน้าก๊วนลบ account ซ้ำออกจากปาร์ตี้ก่อน แล้วลองอีกครั้ง
        </p>
        <a :href="route('profile.edit')" class="btn btn-sm btn-outline mt-3 no-underline">กลับไปหน้าโปรไฟล์</a>
      </div>

      <!-- Merge Preview (no conflicts) -->
      <template v-if="!hasConflicts">
        <!-- Two accounts side by side -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Current account -->
          <div class="bg-base-100 rounded-2xl border border-primary/30 p-4 text-center">
            <div class="badge badge-primary badge-sm mb-2">บัญชีปัจจุบัน</div>
            <UserAvatar :src="keepUser.avatar" :name="keepUser.name" size="xl" rounded="full" class="mx-auto mb-2" />
            <div class="text-sm font-bold text-base-content truncate">{{ keepUser.name }}</div>
            <div class="text-[10px] text-base-content/50 truncate">{{ keepUser.email }}</div>
            <div v-if="keepUser.mmr" class="text-[10px] text-primary mt-1">MMR {{ keepUser.mmr }}</div>
          </div>
          <!-- Other account -->
          <div class="bg-base-100 rounded-2xl border border-warning/30 p-4 text-center">
            <div class="badge badge-warning badge-sm mb-2">บัญชีที่จะรวม</div>
            <UserAvatar :src="mergeUser.avatar" :name="mergeUser.name" size="xl" rounded="full" class="mx-auto mb-2" />
            <div class="text-sm font-bold text-base-content truncate">{{ mergeUser.name }}</div>
            <div class="text-[10px] text-base-content/50 truncate">{{ mergeUser.email }}</div>
            <div v-if="mergeUser.mmr" class="text-[10px] text-primary mt-1">MMR {{ mergeUser.mmr }}</div>
          </div>
        </div>

        <!-- Choose profile data -->
        <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
          <div class="px-4 py-3 border-b border-base-200">
            <h2 class="text-sm font-bold text-base-content m-0">เลือกข้อมูลที่ต้องการใช้</h2>
          </div>
          <div class="p-4 space-y-4">
            <!-- Name -->
            <div>
              <label class="text-xs font-semibold text-base-content/70 mb-2 block">ชื่อที่แสดง</label>
              <div class="space-y-2">
                <label class="flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all"
                  :class="chosenName === keepUser.name ? 'border-primary bg-primary/5' : 'border-base-300'">
                  <input type="radio" :value="keepUser.name" v-model="chosenName" class="radio radio-primary radio-sm" />
                  <span class="text-sm">{{ keepUser.name }}</span>
                  <span class="badge badge-ghost badge-xs ml-auto">ปัจจุบัน</span>
                </label>
                <label v-if="mergeUser.name !== keepUser.name" class="flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all"
                  :class="chosenName === mergeUser.name ? 'border-primary bg-primary/5' : 'border-base-300'">
                  <input type="radio" :value="mergeUser.name" v-model="chosenName" class="radio radio-primary radio-sm" />
                  <span class="text-sm">{{ mergeUser.name }}</span>
                  <span class="badge badge-ghost badge-xs ml-auto">{{ provider }}</span>
                </label>
              </div>
            </div>

            <!-- Avatar -->
            <div>
              <label class="text-xs font-semibold text-base-content/70 mb-2 block">รูปโปรไฟล์</label>
              <div class="flex gap-4 justify-center">
                <label class="cursor-pointer text-center" @click="chosenAvatar = keepUser.avatar">
                  <div class="p-1 rounded-full border-2 transition-all"
                    :class="chosenAvatar === keepUser.avatar ? 'border-primary' : 'border-transparent'">
                    <UserAvatar :src="keepUser.avatar" :name="keepUser.name" size="xl" rounded="full" />
                  </div>
                  <div class="text-[10px] text-base-content/50 mt-1">ปัจจุบัน</div>
                </label>
                <label v-if="mergeUser.avatar && mergeUser.avatar !== keepUser.avatar"
                  class="cursor-pointer text-center" @click="chosenAvatar = mergeUser.avatar">
                  <div class="p-1 rounded-full border-2 transition-all"
                    :class="chosenAvatar === mergeUser.avatar ? 'border-primary' : 'border-transparent'">
                    <UserAvatar :src="mergeUser.avatar" :name="mergeUser.name" size="xl" rounded="full" />
                  </div>
                  <div class="text-[10px] text-base-content/50 mt-1">{{ provider }}</div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="bg-info/10 rounded-xl p-3">
          <p class="text-xs text-info m-0">
            ข้อมูลปาร์ตี้ เกม สถิติ เพื่อน และแชททั้งหมดจะถูกรวมเข้าด้วยกัน
            บัญชีเก่าจะถูกลบหลังรวมสำเร็จ
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <a :href="route('profile.edit')" class="btn btn-outline flex-1 no-underline">ยกเลิก</a>
          <button @click="confirmMerge" :disabled="merging"
            class="btn btn-primary flex-1">
            <span v-if="merging" class="loading loading-spinner loading-xs"></span>
            <span v-else>รวมบัญชี</span>
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>
