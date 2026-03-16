<script setup>
import UserAvatar from "@/Components/UserAvatar.vue";

const props = defineProps({
  party: { type: Object, required: true },
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
</script>

<template>
  <div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
    <div class="px-4 py-3 border-b border-base-200">
      <h2 class="text-base font-bold text-base-content m-0">Players <span class="text-sm font-normal text-base-content/50">({{ party.members?.length || 0 }})</span></h2>
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
            placeholder="Display name"
            @blur="handleBlur(member)"
            @focus="setOriginalDisplayName(member)"
          />
          <span class="text-xs text-base-content/50 truncate hidden sm:inline">({{ member.user?.name }})</span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
            :class="member.game_status === 'ready' ? 'bg-success/20 text-success' : 'bg-base-200 text-base-content/50'"
          >{{ member.game_status || '-' }}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
            :class="member.role === 'Host' ? 'bg-shuttle/20 text-amber-700 dark:text-amber-300' : 'bg-base-200 text-base-content/60'"
          >{{ member.role || 'Member' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
