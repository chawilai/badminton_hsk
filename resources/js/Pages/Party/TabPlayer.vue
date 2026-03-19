<script setup>
import { ref } from "vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import AddFriendButton from "@/Components/AddFriendButton.vue";
import { useLocale } from "@/composables/useLocale";
import { usePage, router } from "@inertiajs/vue3";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";

const { t } = useLocale();
const page = usePage();
const toast = useToast();
const { confirm } = useConfirm();
const currentUserId = page.props.auth.user.id;

const props = defineProps({
  party: { type: Object, required: true },
  friendshipMap: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['updateDisplayName']);

const isHost = props.party.creator_id === currentUserId;

const setOriginalDisplayName = (member) => {
  if (!member.original_display_name) {
    member.original_display_name = member.display_name;
  }
};

const handleBlur = (member) => {
  emit('updateDisplayName', member.id, member.display_name, member.original_display_name);
};

const canToggleStatus = (member) => isCurrentUser(member) || isHost;

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
          severity: newStatus === 'ready' ? 'success' : 'warn',
          summary: newStatus === 'ready' ? t('playerStatus.ready') : t('playerStatus.break'),
          detail: newStatus === 'ready' ? 'พร้อมเล่นแล้ว!' : 'เปลี่ยนเป็นหยุดพัก',
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
        class="flex items-center gap-2.5 px-4 py-2.5"
      >
        <span class="text-xs font-bold text-base-content/40 w-5 text-center shrink-0">{{ index + 1 }}</span>
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
          <!-- Role icon -->
          <span class="text-sm" :title="member.role === 'Host' ? 'Host' : 'Member'">{{ member.role === 'Host' ? '👑' : '👤' }}</span>

          <!-- Status toggle -->
          <label
            class="flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer select-none transition-all"
            :class="[
              canToggleStatus(member) ? 'hover:bg-base-200 active:scale-95' : 'cursor-default',
              isCurrentUser(member) ? '' : 'opacity-50',
            ]"
            @click.prevent="canToggleStatus(member) && toggleGameStatus(member)"
          >
            <div class="relative w-8 h-4 rounded-full transition-colors"
              :class="member.game_status === 'ready' ? 'bg-success' : 'bg-warning'">
              <div class="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all"
                :class="member.game_status === 'ready' ? 'left-[calc(100%-14px)]' : 'left-0.5'"></div>
            </div>
            <span class="text-[10px] font-semibold w-10"
              :class="member.game_status === 'ready' ? 'text-success' : 'text-warning'"
            >{{ member.game_status === 'ready' ? t('playerStatus.ready') : t('playerStatus.break') }}</span>
          </label>

          <!-- Add friend icon button -->
          <AddFriendButton
            v-if="!isCurrentUser(member)"
            :userId="member.user_id"
            :status="friendshipMap[member.user_id]?.status || null"
            :friendshipId="friendshipMap[member.user_id]?.friendship_id || null"
            icon-only
          />
        </div>
      </div>
    </div>
  </div>
</template>
