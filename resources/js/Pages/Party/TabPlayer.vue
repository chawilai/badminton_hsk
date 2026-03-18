<script setup>
import UserAvatar from "@/Components/UserAvatar.vue";
import AddFriendButton from "@/Components/AddFriendButton.vue";
import { useLocale } from "@/composables/useLocale";
import { usePage, router } from "@inertiajs/vue3";
import { useToast } from "@/composables/useToast";

const { t } = useLocale();
const page = usePage();
const toast = useToast();
const currentUserId = page.props.auth.user.id;

const props = defineProps({
  party: { type: Object, required: true },
  friendshipMap: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['updateDisplayName']);

const setOriginalDisplayName = (member) => {
  if (!member.original_display_name) {
    member.original_display_name = member.display_name;
  }
};

const handleBlur = (member) => {
  emit('updateDisplayName', member.id, member.display_name, member.original_display_name);
};

const toggleGameStatus = (member) => {
  const newStatus = member.game_status === 'ready' ? 'break' : 'ready';
  router.post(
    `/party-members/${member.id}/update-game-status`,
    { game_status: newStatus },
    {
      preserveScroll: true,
      headers: { Accept: "application/json" },
      onSuccess: (res) => {
        member.game_status = newStatus;
        toast.add({
          severity: newStatus === 'ready' ? 'success' : 'info',
          summary: newStatus === 'ready' ? t('playerStatus.ready') : t('playerStatus.break'),
          detail: newStatus === 'ready' ? 'พร้อมเล่นแล้ว!' : 'เปลี่ยนเป็นพักผ่อน',
          life: 2000,
        });
      },
    }
  );
};

const isCurrentUser = (member) => member.user_id === currentUserId;
</script>

<template>
  <div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
    <div class="px-4 py-3 border-b border-base-200">
      <h2 class="text-base font-bold text-base-content m-0">{{ t('player.title') }} <span class="text-sm font-normal text-base-content/50">({{ party.members?.length || 0 }})</span></h2>
    </div>
    <div class="divide-y divide-base-200">
      <div
        v-for="(member, index) in party.members"
        :key="member.id"
        class="flex items-center gap-3 px-4 py-2.5"
      >
        <span class="text-xs font-bold text-base-content/50 w-5 text-center shrink-0">{{ index + 1 }}</span>
        <UserAvatar :src="member.user?.avatar" :name="member.display_name || member.user?.name" size="md" rounded="xl" class="shrink-0" />
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <input
            type="text"
            v-model="member.display_name"
            class="px-2 py-1 rounded-lg border border-base-300 bg-base-200 text-sm text-base-content w-24 sm:w-32 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-hidden transition-all"
            :placeholder="t('player.displayName')"
            @blur="handleBlur(member)"
            @focus="setOriginalDisplayName(member)"
          />
          <span class="text-[10px] text-base-content/40 truncate max-w-[5rem]">{{ member.user?.name }}</span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <!-- Status toggle for current user -->
          <button
            v-if="isCurrentUser(member)"
            @click="toggleGameStatus(member)"
            class="text-[10px] px-2 py-1 rounded-lg font-semibold cursor-pointer border-0 transition-all active:scale-95"
            :class="member.game_status === 'ready'
              ? 'bg-warning/15 text-warning hover:bg-warning/25'
              : 'bg-success/15 text-success hover:bg-success/25'"
          >{{ member.game_status === 'ready' ? t('playerStatus.setBreak') : t('playerStatus.setReady') }}</button>
          <!-- Status badge for others -->
          <span v-else class="text-[10px] px-1.5 py-0.5 rounded font-medium"
            :class="{
              'bg-success/20 text-success': member.game_status === 'ready',
              'bg-warning/20 text-warning': member.game_status === 'break',
              'bg-base-200 text-base-content/50': !member.game_status || !['ready','break'].includes(member.game_status),
            }"
          >{{ member.game_status === 'ready' ? t('playerStatus.ready') : (member.game_status === 'break' ? t('playerStatus.break') : '-') }}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
            :class="member.role === 'Host' ? 'bg-shuttle/20 text-amber-700 dark:text-amber-300' : 'bg-base-200 text-base-content/60'"
          >{{ member.role || 'Member' }}</span>
          <AddFriendButton
            v-if="!isCurrentUser(member)"
            :userId="member.user_id"
            :status="friendshipMap[member.user_id]?.status || null"
            :friendshipId="friendshipMap[member.user_id]?.friendship_id || null"
          />
        </div>
      </div>
    </div>
  </div>
</template>
