<template>
  <Head :title="t('partyList.title')" />

  <AppLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-bold text-base-content m-0">{{ t('partyList.title') }}</h1>
          <p class="text-sm text-base-content/60 m-0 mt-0.5">{{ t('partyList.count', { count: filteredParties.length }) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="reloadPage()"
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          <button
            @click="openCreateDialog()"
            class="h-9 px-4 flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-medium border-0 cursor-pointer transition-colors active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span>{{ t('partyList.createParty') }}</span>
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

          <div class="flex">
            <!-- Thumbnail -->
            <div class="w-20 shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <span class="text-3xl">🏸</span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 px-3 py-2">
              <!-- Row 1: Party Name + Status -->
              <div class="flex items-center justify-between gap-1 mb-0.5">
                <div class="flex-1 min-w-0 overflow-hidden">
                  <h3 class="text-[12px] font-semibold text-base-content m-0 leading-tight whitespace-nowrap party-name-scroll">{{ party.name || party.court?.name || 'Party' }}</h3>
                </div>
                <span class="shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  :class="party.members_count >= party.max_players ? 'bg-error/15 text-error' : 'bg-success/15 text-success'"
                >{{ party.members_count }}/{{ party.max_players }}</span>
              </div>

              <!-- Row 2: Court + Info inline -->
              <div class="flex items-center gap-3 text-[11px] text-base-content/60 mb-1.5">
                <span class="flex items-center gap-0.5">🏟️ {{ party.court?.name || '-' }}</span>
              </div>
              <div class="flex items-center gap-3 text-[11px] text-base-content/60 mb-1.5">
                <span class="flex items-center gap-0.5">📅 {{ formatDisplayDate(party.play_date) }}</span>
                <span class="flex items-center gap-0.5">⏰ {{ formatTime(party.start_time) }}</span>
                <span class="px-1 py-px rounded text-[10px] font-bold" :class="party.default_game_type === 'double' ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'">{{ party.default_game_type === 'double' ? '1v1' : '2v2' }}</span>
                <span v-if="party.is_private" class="text-base-content/40">🔒</span>
              </div>

              <!-- Row 3: Avatars + Action -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex -space-x-1.5">
                    <UserAvatar
                      v-for="member in party.members?.slice(0, 5)"
                      :key="member.id"
                      :src="member.user?.avatar"
                      :name="member.user?.name"
                      size="xs"
                      rounded="full"
                      class="border border-base-100"
                    />
                  </div>
                  <span v-if="party.members?.length > 5" class="ml-1 text-[9px] text-base-content/40">+{{ party.members.length - 5 }}</span>
                </div>

                <button
                  v-if="!isUserInParty(party.members)"
                  @click="joinParty(party.id)"
                  class="h-8 px-4 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                  {{ t('common.join') }}
                </button>
                <template v-else>
                  <button
                    v-if="isOwner(party)"
                    @click.stop="openEditDialog(party)"
                    class="h-6 px-2 rounded-md text-[10px] font-semibold border-0 cursor-pointer transition-all active:scale-[0.97] bg-base-200 text-base-content/60 hover:bg-base-300 flex items-center gap-0.5"
                  >
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
                  <button
                    @click="enterParty(party.id)"
                    class="h-8 px-4 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary text-white hover:bg-primary/80 flex items-center gap-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                    {{ t('common.enter') }}
                  </button>
                </template>
              </div>
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
        <p class="text-sm text-base-content/60 mt-1 m-0">{{ t('partyList.createFirst') }}</p>
        <button
          @click="openCreateDialog()"
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
      <dialog class="modal" :class="{ 'modal-open': showDialog }">
        <div class="modal-box w-full max-w-lg p-0">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 class="text-base font-bold text-base-content m-0">🏸 {{ isEditing ? t('createParty.editTitle') : t('createParty.title') }}</h3>
            <button @click="showDialog = false" class="w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors">
              <span class="text-base-content/60 text-sm">✕</span>
            </button>
          </div>

          <form @submit.prevent="createParty" class="px-5 pb-5 space-y-4 overflow-y-auto max-h-[75vh]">
            <!-- Load from old party -->
            <div v-if="!isEditing && myPastParties.length > 0">
              <label class="text-xs font-semibold text-base-content/60 mb-1.5 block">📋 ดึงจากก๊วนเก่า</label>
              <div class="flex gap-1.5 overflow-x-auto pb-1">
                <button
                  v-for="pp in myPastParties"
                  :key="pp.id"
                  type="button"
                  @click="loadFromTemplate(pp)"
                  class="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-base-300 bg-base-200 text-base-content/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary cursor-pointer transition-all whitespace-nowrap"
                >
                  {{ pp.name || pp.court?.name || `#${pp.id}` }}
                </button>
              </div>
            </div>

            <!-- Section 1: Basic Info -->
            <div class="space-y-3">
              <!-- Party Name + Game Type -->
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-2">
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.partyName') }}</label>
                  <input type="text" v-model="form.name" :placeholder="t('createParty.partyNamePlaceholder')" class="input input-bordered input-sm w-full" />
                </div>
                <div>
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.gameType') }}</label>
                  <div class="flex gap-1 p-0.5 bg-base-200 rounded-lg">
                    <button type="button" @click="form.default_game_type = 'double'"
                      class="flex-1 py-1 rounded-md text-[10px] font-bold border-0 cursor-pointer transition-all text-center"
                      :class="form.default_game_type === 'double' ? 'bg-primary text-white' : 'bg-transparent text-base-content/50'"
                    >1v1</button>
                    <button type="button" @click="form.default_game_type = 'quadruple'"
                      class="flex-1 py-1 rounded-md text-[10px] font-bold border-0 cursor-pointer transition-all text-center"
                      :class="form.default_game_type === 'quadruple' ? 'bg-primary text-white' : 'bg-transparent text-base-content/50'"
                    >2v2</button>
                  </div>
                </div>
              </div>

              <!-- Play Date + Day -->
              <div>
                <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.playDate') }}</label>
                <div class="flex items-center gap-2">
                  <input type="date" v-model="form.play_date" class="input input-bordered input-sm flex-1" :class="{ 'input-error': formErrors.play_date }" />
                  <span v-if="selectedDayOfWeek" class="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">{{ selectedDayOfWeek }}</span>
                </div>
                <p v-if="formErrors.play_date" class="text-[10px] text-error m-0 mt-0.5">{{ formErrors.play_date }}</p>
              </div>

              <!-- Max Players + Court -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.maxPlayers') }}</label>
                  <input type="number" v-model="form.max_players" min="2" class="input input-bordered input-sm w-full" />
                </div>
                <div>
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.court') }}</label>
                  <select v-model="form.court_id" class="select select-bordered select-sm w-full" :class="{ 'select-error': formErrors.court_id }">
                    <option :value="null" disabled>{{ t('createParty.selectCourt') }}</option>
                    <option v-for="court in courts" :key="court.id" :value="court.id">{{ court.name }}</option>
                  </select>
                  <p v-if="formErrors.court_id" class="text-[10px] text-error m-0 mt-0.5">{{ formErrors.court_id }}</p>
                </div>
              </div>

              <!-- Private toggle -->
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.is_private" class="checkbox checkbox-primary checkbox-sm" />
                <span class="text-xs font-medium text-base-content/70">{{ t('createParty.private') }}</span>
              </label>

              <!-- Passcode (when private) -->
              <div v-if="form.is_private" class="flex items-center gap-2 pl-7">
                <span class="text-[10px] text-base-content/50">🔢 รหัสเข้าร่วม</span>
                <input type="text" v-model="form.invite_passcode" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="0000" class="input input-bordered input-xs w-20 text-center tracking-widest font-bold" />
              </div>
            </div>

            <!-- Section 2: Cost -->
            <div class="border-t border-base-200 pt-3 space-y-3">
              <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.costType') }}</label>
              <div class="flex gap-1.5">
                <button type="button" v-for="ct in [{ key: 'per_person', label: t('createParty.costPerPerson') }, { key: 'split_equal', label: t('createParty.costSplitEqual') }, { key: 'free', label: t('createParty.costFree') }]" :key="ct.key"
                  @click="form.cost_type = ct.key"
                  class="flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"
                  :class="form.cost_type === ct.key ? 'bg-primary text-white' : 'bg-base-200 text-base-content/60 hover:bg-base-300'"
                >{{ ct.label }}</button>
              </div>
              <!-- Per person: entry fee -->
              <div v-if="form.cost_type === 'per_person'" class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.costPerPerson_amount') }}</label>
                  <input type="number" v-model="form.cost_amount" min="0" step="1" class="input input-bordered input-sm w-full" placeholder="0" />
                </div>
                <div>
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.shuttlecockCost') }}</label>
                  <input type="number" v-model="form.shuttlecock_cost" min="0" step="1" class="input input-bordered input-sm w-full" placeholder="0" />
                </div>
              </div>
              <!-- Split equal: court/hr + shuttle/pc -->
              <div v-if="form.cost_type === 'split_equal'" class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.costAmount') }}</label>
                  <input type="number" v-model="form.cost_amount" min="0" step="1" class="input input-bordered input-sm w-full" placeholder="150" />
                </div>
                <div>
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.shuttlecockCost') }}</label>
                  <input type="number" v-model="form.shuttlecock_cost" min="0" step="1" class="input input-bordered input-sm w-full" placeholder="80" />
                </div>
              </div>
              <!-- Split equal: example calculation -->
              <div v-if="form.cost_type === 'split_equal' && form.cost_amount && bookingSummary" class="bg-primary/5 rounded-lg p-2.5 text-[10px] text-base-content/70 space-y-0.5">
                <div class="font-bold text-base-content/80 text-xs mb-1">💰 ตัวอย่างค่าใช้จ่าย</div>
                <div>ค่าคอร์ท: {{ form.cost_amount }} ฿/ชม. × {{ bookingSummary.totalHours }} ชม. = <span class="font-bold text-base-content">{{ form.cost_amount * bookingSummary.totalHours }} ฿</span></div>
                <div v-if="form.shuttlecock_cost">ค่าลูกแบด: {{ form.shuttlecock_cost }} ฿/ลูก × (จำนวนลูกที่ใช้จริง)</div>
                <div class="text-[9px] text-base-content/40 mt-1">* ยอดรวมจะคำนวณหลังจบ party โดยรวมค่าคอร์ท + ลูกแบดที่ใช้จริง แล้วหารเท่าตามจำนวนผู้เล่น</div>
              </div>
            </div>

            <!-- Section 3: Notes with Template System -->
            <div class="border-t border-base-200 pt-3 space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold text-base-content/60">📝 หมายเหตุ / กติกา</label>
                <!-- Template dropdown button -->
                <div class="relative">
                  <button type="button" @click="showNoteTemplateMenu = !showNoteTemplateMenu; confirmingDeleteIdx = null"
                    class="text-[10px] font-medium text-primary border border-primary/30 bg-primary/5 rounded-lg px-2 py-1 cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1">
                    📋 Template
                    <span v-if="noteTemplates.length" class="bg-primary text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center font-bold">{{ noteTemplates.length }}</span>
                    <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showNoteTemplateMenu }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>

                  <!-- Dropdown backdrop -->
                  <div v-if="showNoteTemplateMenu" class="fixed inset-0 z-10" @click="showNoteTemplateMenu = false; confirmingDeleteIdx = null"></div>

                  <!-- Dropdown menu -->
                  <div v-if="showNoteTemplateMenu" class="absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 py-1 max-h-60 overflow-y-auto">
                    <!-- Empty state -->
                    <div v-if="noteTemplates.length === 0" class="px-3 py-4 text-center">
                      <div class="text-lg mb-1">📋</div>
                      <div class="text-[10px] text-base-content/30">ยังไม่มี template</div>
                      <div class="text-[9px] text-base-content/20 mt-0.5">พิมพ์หมายเหตุแล้วกด 💾 ด้านล่าง</div>
                    </div>

                    <!-- Saved templates list -->
                    <template v-if="noteTemplates.length > 0">
                      <div class="px-3 py-1.5 text-[9px] font-bold text-base-content/40 uppercase tracking-wider">เลือก Template</div>
                      <div
                        v-for="(tmpl, i) in noteTemplates"
                        :key="i"
                        class="px-3 py-2 hover:bg-base-200 transition-colors"
                      >
                        <!-- Normal state -->
                        <div v-if="confirmingDeleteIdx !== i" class="flex items-center gap-2">
                          <div @click="applyNoteTemplate(tmpl)" class="flex-1 min-w-0 cursor-pointer">
                            <div class="text-xs font-medium text-base-content truncate">{{ tmpl.name }}</div>
                            <div class="text-[9px] text-base-content/40 truncate leading-tight mt-0.5">{{ tmpl.content.substring(0, 50) }}{{ tmpl.content.length > 50 ? '...' : '' }}</div>
                          </div>
                          <button type="button" @click.stop="deleteNoteTemplate(i)"
                            class="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] text-base-content/30 hover:text-error hover:bg-error/10 border-0 bg-transparent cursor-pointer transition-all">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                        <!-- Confirm delete state -->
                        <div v-else class="flex items-center gap-2">
                          <div class="flex-1 text-[10px] text-error font-medium">ลบ "{{ tmpl.name }}" ?</div>
                          <button type="button" @click.stop="confirmingDeleteIdx = null"
                            class="px-2 py-1 text-[10px] rounded-md bg-base-200 text-base-content/60 border-0 cursor-pointer hover:bg-base-300 transition-colors">ยกเลิก</button>
                          <button type="button" @click.stop="deleteNoteTemplate(i)"
                            class="px-2 py-1 text-[10px] rounded-md bg-error text-white border-0 cursor-pointer hover:bg-error/80 transition-colors font-bold">ลบ</button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Formatting toolbar -->
              <div class="flex items-center gap-0.5 w-full bg-base-200/50 rounded-lg p-1">
                <!-- Group 1: Content insertion -->
                <div class="flex items-center gap-0.5 flex-1">
                  <!-- Emoji picker -->
                  <div class="relative">
                    <button type="button" @click="toggleToolbarPopup('emoji')"
                      class="h-7 w-8 rounded-md border-0 cursor-pointer text-sm flex items-center justify-center transition-colors active:scale-95"
                      :class="showEmojiPicker ? 'bg-primary/15 text-primary' : 'hover:bg-base-300 bg-base-100/80'">
                      😀
                    </button>
                    <div v-if="showEmojiPicker" class="fixed inset-0 z-10" @click="showEmojiPicker = false"></div>
                    <div v-if="showEmojiPicker" class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 max-h-52 overflow-y-auto p-2 space-y-2">
                      <div v-for="cat in emojiCategories" :key="cat.label">
                        <div class="text-[9px] font-bold text-base-content/40 uppercase mb-1">{{ cat.label }}</div>
                        <div class="flex flex-wrap gap-0.5">
                          <button type="button" v-for="e in cat.emojis" :key="e"
                            @click="insertAtCursor(e + ' '); showEmojiPicker = false"
                            class="w-8 h-8 rounded-lg hover:bg-base-200 border-0 bg-transparent cursor-pointer text-base flex items-center justify-center transition-colors active:scale-90">
                            {{ e }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Bullet picker -->
                  <div class="relative">
                    <button type="button" @click="toggleToolbarPopup('bullet')"
                      class="h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95"
                      :class="showBulletPicker ? 'bg-primary/15 text-primary' : 'hover:bg-base-300 bg-base-100/80 text-base-content/60'">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/><circle cx="2" cy="6" r="1" fill="currentColor"/><circle cx="2" cy="12" r="1" fill="currentColor"/><circle cx="2" cy="18" r="1" fill="currentColor"/></svg>
                      <svg class="w-2 h-2 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div v-if="showBulletPicker" class="fixed inset-0 z-10" @click="showBulletPicker = false"></div>
                    <div v-if="showBulletPicker" class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-40 py-1">
                      <button type="button" v-for="b in bulletStyles" :key="b.label"
                        @click="insertBulletStyle(b)"
                        class="w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2 transition-colors">
                        <span class="w-5 text-center font-bold text-base-content font-mono">{{ b.preview }}</span>
                        <span class="text-base-content/70">{{ b.label }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Line/divider picker -->
                  <div class="relative">
                    <button type="button" @click="toggleToolbarPopup('line')"
                      class="h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95"
                      :class="showLinePicker ? 'bg-primary/15 text-primary' : 'hover:bg-base-300 bg-base-100/80 text-base-content/60'">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3 12h18"/></svg>
                      <svg class="w-2 h-2 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div v-if="showLinePicker" class="fixed inset-0 z-10" @click="showLinePicker = false"></div>
                    <div v-if="showLinePicker" class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-52 py-1">
                      <button type="button" v-for="l in lineStyles" :key="l.label"
                        @click="insertLineStyle(l)"
                        class="w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2 transition-colors">
                        <span class="text-[10px] text-base-content/50 font-mono truncate w-20">{{ l.preview }}</span>
                        <span class="text-base-content/70">{{ l.label }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="w-px h-5 bg-base-300"></div>

                <!-- Group 2: Indent -->
                <div class="flex items-center gap-0.5">
                  <button type="button" @click="outdentLines" title="ลดย่อหน้า"
                    class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95">
                    <svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M3 8h18M9 12h12M9 16h12M3 12l4 2-4 2V12z" transform="scale(-1,1) translate(-24,0)"/></svg>
                  </button>
                  <button type="button" @click="indentLines" title="เพิ่มย่อหน้า"
                    class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95">
                    <svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M3 8h18M9 12h12M9 16h12M3 12l4 2-4 2V12z"/></svg>
                  </button>
                </div>

                <div class="w-px h-5 bg-base-300"></div>

                <!-- Group 3: Text alignment -->
                <div class="flex items-center gap-0.5">
                  <button type="button" @click="alignLines('left')" title="ชิดซ้าย"
                    class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95">
                    <svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 10h12M3 14h18M3 18h12"/></svg>
                  </button>
                  <button type="button" @click="alignLines('center')" title="กึ่งกลาง"
                    class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95">
                    <svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M6 10h12M3 14h18M6 18h12"/></svg>
                  </button>
                  <button type="button" @click="alignLines('right')" title="ชิดขวา"
                    class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95">
                    <svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M9 10h12M3 14h18M9 18h12"/></svg>
                  </button>
                </div>
              </div>

              <!-- Textarea (monospace for proper alignment) -->
              <textarea ref="notesTextarea" v-model="form.notes" rows="5"
                class="textarea textarea-bordered textarea-sm w-full text-xs leading-relaxed font-mono"
                placeholder="เช่น&#10;🏸 ลูกใช้ RSL เบอร์ 5&#10;👟 ห้ามใส่รองเท้าตีนตุ๊กแก&#10;⏰ มาก่อนเวลา 15 นาที&#10;💰 จ่ายก่อนเล่น"></textarea>

              <!-- Save as template (bottom-right) -->
              <div class="flex justify-end">
                <template v-if="!showSaveNoteTemplate">
                  <button type="button" @click="showSaveNoteTemplate = true"
                    :disabled="!form.notes?.trim()"
                    class="text-[10px] font-medium text-primary/70 hover:text-primary border-0 bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors">
                    💾 บันทึกเป็น Template
                  </button>
                </template>
                <div v-else class="flex items-center gap-1.5 w-full sm:w-auto">
                  <input type="text" v-model="noteTemplateName" placeholder="ตั้งชื่อ template..."
                    class="input input-bordered input-xs text-xs flex-1 sm:w-40" @keyup.enter="saveCurrentAsNoteTemplate" />
                  <button type="button" @click="showSaveNoteTemplate = false; noteTemplateName = ''"
                    class="text-[10px] px-2 py-1 rounded-lg bg-base-200 text-base-content/60 border-0 cursor-pointer hover:bg-base-300 transition-colors">ยกเลิก</button>
                  <button type="button" @click="saveCurrentAsNoteTemplate" :disabled="!noteTemplateName.trim()"
                    class="text-[10px] px-2 py-1 rounded-lg bg-primary text-white border-0 cursor-pointer disabled:opacity-30 hover:bg-primary/80 transition-colors font-bold">💾 บันทึก</button>
                </div>
              </div>
            </div>

            <!-- Section 4: Template Members Selection -->
            <div v-if="templateMembers.length > 0" class="border-t border-base-200 pt-3 space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold text-base-content/60">👥 เลือกผู้เล่นประจำ ({{ templateSelectedCount }}/{{ templateMembers.length }})</label>
                <button type="button" @click="toggleAllTemplateMembers" class="text-[10px] text-primary font-semibold border-0 bg-transparent cursor-pointer">
                  {{ templateMembers.every(m => m.selected) ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด' }}
                </button>
              </div>
              <div class="space-y-1">
                <div
                  v-for="m in templateMembers"
                  :key="m.user_id"
                  @click="m.selected = !m.selected"
                  class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all"
                  :class="m.selected ? 'border-primary/40 bg-primary/5' : 'border-base-300 bg-base-100 opacity-50'"
                >
                  <input type="checkbox" :checked="m.selected" class="checkbox checkbox-primary checkbox-xs" @click.stop="m.selected = !m.selected" />
                  <UserAvatar :src="m.avatar" :name="m.name" size="xs" rounded="full" />
                  <div class="flex-1 min-w-0">
                    <span class="text-xs font-medium text-base-content truncate">{{ m.name }}</span>
                    <span v-if="m.role === 'Host'" class="ml-1 text-[9px] text-primary font-bold">HOST</span>
                  </div>
                </div>
              </div>
              <p class="text-[10px] text-base-content/40 m-0">* ผู้เล่นที่เลือกจะถูกเพิ่มเข้าก๊วนอัตโนมัติ</p>
            </div>

            <!-- Section 5: Court Booking -->
            <div class="border-t border-base-200 pt-3 space-y-3">
              <!-- Booking toggle -->
              <div class="flex gap-1.5">
                <button type="button" @click="form.has_booking = true"
                  class="flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"
                  :class="form.has_booking ? 'bg-primary text-white' : 'bg-base-200 text-base-content/60 hover:bg-base-300'"
                >{{ t('createParty.hasBooking') }}</button>
                <button type="button" @click="form.has_booking = false"
                  class="flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"
                  :class="!form.has_booking ? 'bg-primary text-white' : 'bg-base-200 text-base-content/60 hover:bg-base-300'"
                >{{ t('createParty.noBooking') }}</button>
              </div>

              <!-- If no booking: simple time inputs -->
              <div v-if="!form.has_booking" class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.startTime') }}</label>
                  <select v-model="form.start_time" class="select select-bordered select-sm w-full" :class="{ 'select-error': formErrors.start_time }">
                    <option v-for="opt in timeOptions" :key="opt.name" :value="opt.name">{{ opt.name }}</option>
                  </select>
                  <p v-if="formErrors.start_time" class="text-[10px] text-error m-0 mt-0.5">{{ formErrors.start_time }}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-base-content/60 mb-1 block">{{ t('createParty.endTime') }}</label>
                  <select v-model="form.end_time" class="select select-bordered select-sm w-full" :class="{ 'select-error': formErrors.end_time }">
                    <option v-for="opt in timeOptions" :key="opt.name" :value="opt.name">{{ opt.name }}</option>
                  </select>
                </div>
              </div>

              <!-- If booked: court bookings -->
              <template v-if="form.has_booking">
                <div v-for="(booking, index) in form.court_bookings" :key="index"
                  class="bg-base-200/50 rounded-xl p-3 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold text-base-content/40 uppercase">{{ t('createParty.courtBookings') }} #{{ index + 1 }}</span>
                    <button v-if="form.court_bookings.length > 1" type="button" @click="removeCourtBooking(index)"
                      class="text-[10px] text-error font-semibold border-0 bg-transparent cursor-pointer hover:underline">{{ t('createParty.removeCourt') }}</button>
                  </div>
                  <div class="grid grid-cols-3 gap-2">
                    <div>
                      <label class="text-[10px] text-base-content/50 block mb-0.5">{{ t('createParty.courtNumber') }}</label>
                      <select v-model="booking.court_field_number" class="select select-bordered select-xs w-full" :class="{ 'select-error': formErrors[`booking_${index}_court`] }">
                        <option :value="null" disabled>เลือก</option>
                        <option v-for="i in 12" :key="i" :value="i" :disabled="usedCourtNumbers.includes(i) && booking.court_field_number !== i">{{ i }}</option>
                      </select>
                      <p v-if="formErrors[`booking_${index}_court`]" class="text-[9px] text-error m-0 mt-0.5">{{ formErrors[`booking_${index}_court`] }}</p>
                    </div>
                    <div>
                      <label class="text-[10px] text-base-content/50 block mb-0.5">{{ t('createParty.startTime') }}</label>
                      <select v-model="booking.start_time" class="select select-bordered select-xs w-full" :class="{ 'select-error': formErrors[`booking_${index}_start`] }">
                        <option v-for="opt in timeOptions" :key="opt.name" :value="opt.name">{{ opt.name }}</option>
                      </select>
                      <p v-if="formErrors[`booking_${index}_start`]" class="text-[9px] text-error m-0 mt-0.5">{{ formErrors[`booking_${index}_start`] }}</p>
                    </div>
                    <div>
                      <label class="text-[10px] text-base-content/50 block mb-0.5">{{ t('createParty.endTime') }}</label>
                      <select v-model="booking.end_time" class="select select-bordered select-xs w-full" :class="{ 'select-error': formErrors[`booking_${index}_end`] }">
                        <option v-for="opt in filteredEndTimeOptions(index)" :key="opt.name" :value="opt.name">{{ opt.name }}</option>
                      </select>
                      <p v-if="formErrors[`booking_${index}_end`]" class="text-[9px] text-error m-0 mt-0.5">{{ formErrors[`booking_${index}_end`] }}</p>
                    </div>
                  </div>
                </div>
                <button type="button" @click="addCourtBooking"
                  class="w-full py-1.5 rounded-lg border border-dashed border-base-300 bg-transparent text-xs font-medium text-base-content/40 cursor-pointer hover:border-primary/50 hover:text-primary transition-colors">
                  + {{ t('createParty.addCourt') }}
                </button>

                <!-- Booking Summary -->
                <div v-if="bookingSummary" class="bg-primary/5 rounded-xl p-3 mt-2 space-y-1.5">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold text-primary uppercase tracking-wider">📋 สรุปการจอง</span>
                    <span class="text-xs font-bold text-base-content">{{ bookingSummary.overallStart }} - {{ bookingSummary.overallEnd }}</span>
                  </div>
                  <div v-for="(slot, i) in bookingSummary.slots" :key="i"
                    class="flex items-center justify-between bg-base-100/50 rounded-lg px-2.5 py-1.5">
                    <span class="text-[11px] font-medium text-base-content/70">{{ slot.time }}</span>
                    <div class="flex items-center gap-1.5">
                      <span class="text-[11px] font-bold text-primary">{{ slot.courtCount }} คอร์ท</span>
                      <span class="text-[10px] text-base-content/40">({{ slot.courts.join(', ') }})</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Submit -->
            <div class="flex gap-2 pt-2">
              <button type="button" @click="showDialog = false"
                class="flex-1 h-10 rounded-xl text-sm font-medium bg-base-200 text-base-content/80 border-0 cursor-pointer hover:bg-base-300 transition-colors">
                {{ t('common.cancel') }}
              </button>
              <button type="submit"
                class="flex-1 h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98]">
                {{ isEditing ? t('common.save') : t('createParty.title') }}
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
import { ref, computed, nextTick } from "vue";
import { Head, usePage, router } from "@inertiajs/vue3";
import { useToast } from "@/composables/useToast";
import { useLocale } from "@/composables/useLocale";

const { t, locale } = useLocale();
const toast = useToast();
const showDialog = ref(false);
const formErrors = ref({});
const editingPartyId = ref(null);
const isEditing = computed(() => !!editingPartyId.value);

const openCreateDialog = () => {
  editingPartyId.value = null;
  form.value = {
    name: '', default_game_type: 'quadruple', play_date: null, court_id: null, max_players: 18, status: "Open",
    is_private: false, invite_passcode: '', cost_type: "per_person", cost_amount: null, shuttlecock_cost: null,
    notes: "", has_booking: true, start_time: "", end_time: "",
    court_bookings: [{ court_id: null, court_field_number: null, start_time: "", end_time: "" }],
  };
  templateMembers.value = [];
  formErrors.value = {};
  showDialog.value = true;
};

const openEditDialog = (party) => {
  editingPartyId.value = party.id;
  form.value = {
    name: party.name || '',
    default_game_type: party.default_game_type || 'quadruple',
    play_date: party.play_date,
    court_id: party.court_id,
    max_players: party.max_players,
    status: party.status,
    is_private: party.is_private || false,
    invite_passcode: party.invite_passcode || '',
    cost_type: party.cost_type || 'per_person',
    cost_amount: party.cost_amount,
    shuttlecock_cost: party.shuttlecock_cost,
    notes: party.notes || '',
    has_booking: true,
    start_time: party.start_time || '',
    end_time: party.end_time || '',
    court_bookings: party.court_bookings?.length
      ? party.court_bookings.map(b => ({ court_id: b.court_id, court_field_number: b.court_field_number, start_time: b.start_time, end_time: b.end_time }))
      : [{ court_id: null, court_field_number: null, start_time: "", end_time: "" }],
  };
  formErrors.value = {};
  showDialog.value = true;
};

const isOwner = (party) => party.creator_id === authUser?.id;
const page = usePage();

const parties = ref(page.props.parties ?? []);
const courts = ref(page.props.courts ?? []);
const statuses = ["Open", "Full", "Over"];

// Past parties where user was host — for "use old settings" template
const myPastParties = computed(() =>
  parties.value
    .filter(p => p.creator_id === authUser?.id)
    .sort((a, b) => b.play_date.localeCompare(a.play_date))
    .slice(0, 10)
);

const loadFromTemplate = (party) => {
  form.value = {
    ...form.value,
    name: party.name || '',
    default_game_type: party.default_game_type || 'quadruple',
    court_id: party.court_id,
    max_players: party.max_players,
    is_private: party.is_private || false,
    cost_type: party.cost_type || 'per_person',
    cost_amount: party.cost_amount,
    shuttlecock_cost: party.shuttlecock_cost,
    notes: party.notes || '',
    has_booking: party.court_bookings?.length > 0,
    start_time: party.start_time || '',
    end_time: party.end_time || '',
    court_bookings: party.court_bookings?.length
      ? party.court_bookings.map(b => ({ court_id: b.court_id, court_field_number: b.court_field_number, start_time: b.start_time, end_time: b.end_time }))
      : [{ court_id: null, court_field_number: null, start_time: '', end_time: '' }],
  };

  // Load members from template party for selection
  const partyMembers = party.members || [];
  templateMembers.value = partyMembers.map(m => ({
    user_id: m.user_id,
    name: m.display_name || m.user?.name || 'Unknown',
    avatar: m.user?.avatar,
    role: m.role,
    selected: true,
  }));
};
const currentPage = ref(1);
const perPage = 10;

const form = ref({
  name: '',
  play_date: null,
  court_id: null,
  max_players: 18,
  status: "Open",
  is_private: false,
  cost_type: "per_person",
  cost_amount: null,
  shuttlecock_cost: null,
  notes: "",
  has_booking: true,
  start_time: "",
  end_time: "",
  court_bookings: [{ court_id: null, court_field_number: null, start_time: "", end_time: "" }],
});

// Template members from old party for selection
const templateMembers = ref([]);
const templateSelectedCount = computed(() => templateMembers.value.filter(m => m.selected).length);
const toggleAllTemplateMembers = () => {
  const allSelected = templateMembers.value.every(m => m.selected);
  templateMembers.value.forEach(m => m.selected = !allSelected);
};

// Note templates (localStorage)
const NOTE_TEMPLATES_KEY = 'badminton_note_templates';
const noteTemplates = ref([]);
const showNoteTemplateMenu = ref(false);
const showSaveNoteTemplate = ref(false);
const noteTemplateName = ref('');
const notesTextarea = ref(null);

// Load templates from localStorage
try {
  const stored = localStorage.getItem(NOTE_TEMPLATES_KEY);
  noteTemplates.value = stored ? JSON.parse(stored) : [];
} catch { noteTemplates.value = []; }

const saveNoteTemplates = () => {
  localStorage.setItem(NOTE_TEMPLATES_KEY, JSON.stringify(noteTemplates.value));
};

const saveCurrentAsNoteTemplate = () => {
  const name = noteTemplateName.value.trim();
  if (!name || !form.value.notes?.trim()) return;
  noteTemplates.value.push({ name, content: form.value.notes });
  saveNoteTemplates();
  noteTemplateName.value = '';
  showSaveNoteTemplate.value = false;
};

const applyNoteTemplate = (tmpl) => {
  form.value.notes = tmpl.content;
  showNoteTemplateMenu.value = false;
};

const confirmingDeleteIdx = ref(null);

const deleteNoteTemplate = (index) => {
  if (confirmingDeleteIdx.value === index) {
    noteTemplates.value.splice(index, 1);
    saveNoteTemplates();
    confirmingDeleteIdx.value = null;
  } else {
    confirmingDeleteIdx.value = index;
  }
};

// WYSIWYG helpers
const insertAtCursor = (text) => {
  const ta = notesTextarea.value;
  if (!ta) { form.value.notes = (form.value.notes || '') + text; return; }
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const val = form.value.notes || '';
  form.value.notes = val.substring(0, start) + text + val.substring(end);
  nextTick(() => {
    ta.selectionStart = ta.selectionEnd = start + text.length;
    ta.focus();
  });
};

// Toolbar popup states
const showEmojiPicker = ref(false);
const showBulletPicker = ref(false);
const showLinePicker = ref(false);

const closeAllToolbarPopups = () => {
  showEmojiPicker.value = false;
  showBulletPicker.value = false;
  showLinePicker.value = false;
};

const toggleToolbarPopup = (which) => {
  const map = { emoji: showEmojiPicker, bullet: showBulletPicker, line: showLinePicker };
  const wasOpen = map[which].value;
  closeAllToolbarPopups();
  if (!wasOpen) map[which].value = true;
};

// Emoji categories (badminton-focused)
const emojiCategories = [
  { label: '🏸 แบดมินตัน', emojis: ['🏸', '🧑‍🤝‍🧑', '🏆', '🥇', '🥈', '🥉', '🎯', '💪', '🔥', '⭐', '🤝', '👏'] },
  { label: '🏟️ สถานที่/เวลา', emojis: ['🏟️', '📅', '⏰', '🕐', '📍', '🅿️', '🚗', '🏠', '🚿', '🗓️'] },
  { label: '💰 เงิน/ค่าใช้จ่าย', emojis: ['💰', '💵', '💳', '🧾', '📊', '💲', '🏦', '🔢'] },
  { label: '⚠️ กฎ/เตือน', emojis: ['⚠️', '📌', '🚫', '❌', '✅', '⭕', '❗', '📢', '🔒', '🙅', '👉', '📣'] },
  { label: '👟 อุปกรณ์', emojis: ['👟', '👕', '🎽', '🧴', '💧', '🧊', '🎒', '🩳', '🧤', '😷'] },
  { label: '😊 อื่นๆ', emojis: ['📝', '📋', '👋', '🙏', '😊', '🎉', '🔄', '➡️', '⬇️', '☎️', '📱', '🔗'] },
];

// Bullet styles
const bulletStyles = [
  { label: 'จุดทึบ', preview: '•', char: '• ' },
  { label: 'ขีด', preview: '-', char: '- ' },
  { label: 'ลูกศร', preview: '▸', char: '▸ ' },
  { label: 'ถูก', preview: '✓', char: '✓ ' },
  { label: 'ดาว', preview: '★', char: '★ ' },
  { label: 'วงกลม', preview: '○', char: '○ ' },
  { label: 'สี่เหลี่ยม', preview: '▪', char: '▪ ' },
  { label: 'หมายเลข', preview: '1.', char: null, numbered: true },
];

// Line/divider styles
const lineStyles = [
  { label: 'เส้นตรง', preview: '─────', char: '───────────────' },
  { label: 'เส้นหนา', preview: '━━━━━', char: '━━━━━━━━━━━━━━━' },
  { label: 'จุดประ', preview: '· · · · ·', char: '· · · · · · · · · · ·' },
  { label: 'ขีดประ', preview: '- - - - -', char: '- - - - - - - - - - -' },
  { label: 'ดาว', preview: '★ ★ ★', char: '★ ★ ★ ★ ★' },
  { label: 'คลื่น', preview: '～～～', char: '～～～～～～～～～～～～' },
  { label: 'เพชร', preview: '◆ ◇ ◆', char: '◆ ◇ ◆ ◇ ◆ ◇ ◆' },
];

// Insert bullet at cursor
const insertBulletStyle = (style) => {
  const val = form.value.notes || '';
  const ta = notesTextarea.value;
  const pos = ta ? ta.selectionStart : val.length;
  const needNewline = pos > 0 && val[pos - 1] !== '\n';

  if (style.numbered) {
    const textBefore = val.substring(0, pos);
    const lines = textBefore.split('\n').reverse();
    const lastNum = lines.find(l => /^\s*\d+\./.test(l));
    const num = lastNum ? parseInt(lastNum.trim()) + 1 : 1;
    insertAtCursor((needNewline ? '\n' : '') + `${num}. `);
  } else {
    insertAtCursor((needNewline ? '\n' : '') + style.char);
  }
  showBulletPicker.value = false;
};

// Insert line/divider
const insertLineStyle = (style) => {
  const val = form.value.notes || '';
  const ta = notesTextarea.value;
  const pos = ta ? ta.selectionStart : val.length;
  const needBefore = pos > 0 && val[pos - 1] !== '\n';
  const needAfter = pos < val.length && val[pos] !== '\n';
  insertAtCursor((needBefore ? '\n' : '') + style.char + (needAfter ? '\n' : ''));
  showLinePicker.value = false;
};

// Indent / Outdent selected lines
const getSelectedLines = () => {
  const ta = notesTextarea.value;
  if (!ta) return null;
  const val = form.value.notes || '';
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const lineStart = val.lastIndexOf('\n', start - 1) + 1;
  const lineEndIdx = val.indexOf('\n', end);
  const lineEnd = lineEndIdx === -1 ? val.length : lineEndIdx;
  return { val, lineStart, lineEnd, text: val.substring(lineStart, lineEnd) };
};

const replaceLines = (sel, newText) => {
  form.value.notes = sel.val.substring(0, sel.lineStart) + newText + sel.val.substring(sel.lineEnd);
  nextTick(() => {
    const ta = notesTextarea.value;
    if (ta) { ta.selectionStart = sel.lineStart; ta.selectionEnd = sel.lineStart + newText.length; ta.focus(); }
  });
};

const indentLines = () => {
  const sel = getSelectedLines();
  if (!sel) return;
  replaceLines(sel, sel.text.split('\n').map(l => '    ' + l).join('\n'));
};

const outdentLines = () => {
  const sel = getSelectedLines();
  if (!sel) return;
  replaceLines(sel, sel.text.split('\n').map(l => {
    if (l.startsWith('    ')) return l.substring(4);
    if (l.startsWith('\t')) return l.substring(1);
    if (l.startsWith('  ')) return l.substring(2);
    return l;
  }).join('\n'));
};

// Text alignment (monospace — calculate column width from textarea)
const getTextareaColumns = () => {
  const ta = notesTextarea.value;
  if (!ta) return 40;
  // Measure approximate chars that fit by creating a hidden span
  const style = window.getComputedStyle(ta);
  const fontSize = parseFloat(style.fontSize);
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingRight = parseFloat(style.paddingRight) || 0;
  const availableWidth = ta.clientWidth - paddingLeft - paddingRight;
  // Monospace char width ≈ 0.6 × font-size
  const charWidth = fontSize * 0.6;
  return Math.floor(availableWidth / charWidth);
};

const alignLines = (align) => {
  const sel = getSelectedLines();
  if (!sel) return;
  const cols = getTextareaColumns();
  replaceLines(sel, sel.text.split('\n').map(l => {
    const trimmed = l.trim();
    if (align === 'left') return trimmed;
    if (align === 'center') {
      const pad = Math.max(0, Math.floor((cols - trimmed.length) / 2));
      return ' '.repeat(pad) + trimmed;
    }
    if (align === 'right') {
      const pad = Math.max(0, cols - trimmed.length);
      return ' '.repeat(pad) + trimmed;
    }
    return l;
  }).join('\n'));
};

const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const selectedDayOfWeek = computed(() => {
  if (!form.value.play_date) return '';
  const d = new Date(form.value.play_date + 'T00:00:00');
  const day = d.getDay();
  return locale.value === 'th' ? thaiDays[day] : enDays[day];
});

const authUser = page.props.auth.user;

const filteredParties = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  return parties.value
    .filter((party) => party.status !== 'Over' && party.play_date >= today)
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

// Court booking summary — group by time slots
const bookingSummary = computed(() => {
  const bookings = form.value.court_bookings.filter(b => b.start_time && b.end_time && b.court_field_number);
  if (!bookings.length) return null;

  // Collect all unique hours
  const allTimes = new Set();
  bookings.forEach(b => {
    const startH = parseInt(b.start_time.split(':')[0]);
    const endH = parseInt(b.end_time.split(':')[0]);
    for (let h = startH; h < endH; h++) allTimes.add(h);
  });

  const sortedHours = [...allTimes].sort((a, b) => a - b);
  if (!sortedHours.length) return null;

  // Group consecutive hours with same courts
  const slots = [];
  let currentSlot = null;

  sortedHours.forEach(h => {
    const courtsAtHour = bookings
      .filter(b => {
        const s = parseInt(b.start_time.split(':')[0]);
        const e = parseInt(b.end_time.split(':')[0]);
        return h >= s && h < e;
      })
      .map(b => b.court_field_number)
      .sort((a, b) => a - b);

    const key = courtsAtHour.join(',');
    if (currentSlot && currentSlot.key === key) {
      currentSlot.endH = h + 1;
    } else {
      currentSlot = { startH: h, endH: h + 1, courts: courtsAtHour, key };
      slots.push(currentSlot);
    }
  });

  const overallStart = `${String(sortedHours[0]).padStart(2, '0')}:00`;
  const overallEnd = `${String(sortedHours[sortedHours.length - 1] + 1).padStart(2, '0')}:00`;
  const totalHours = sortedHours.length;

  return {
    overallStart,
    overallEnd,
    totalHours,
    slots: slots.map(s => ({
      time: `${String(s.startH).padStart(2, '0')}:00 - ${String(s.endH).padStart(2, '0')}:00`,
      courtCount: s.courts.length,
      courts: s.courts,
    })),
  };
});

const addCourtBooking = () => {
  const last = form.value.court_bookings[form.value.court_bookings.length - 1];
  form.value.court_bookings.push({
    court_id: form.value.court_id,
    court_field_number: null,
    start_time: last?.start_time || "",
    end_time: last?.end_time || "",
  });
};

const usedCourtNumbers = computed(() =>
  form.value.court_bookings.map(b => b.court_field_number).filter(n => n != null)
);

const removeCourtBooking = (index) => {
  form.value.court_bookings.splice(index, 1);
};

const validationLabels = {
  play_date: 'วันเล่น',
  court_id: 'สนาม',
  max_players: 'จำนวนผู้เล่น',
  start_time: 'เวลาเริ่ม',
  end_time: 'เวลาจบ',
};

const createParty = () => {
  // Frontend validation
  const errors = {};
  if (!form.value.play_date) errors.play_date = 'กรุณาเลือกวันเล่น';
  if (!form.value.court_id) errors.court_id = 'กรุณาเลือกสนาม';
  if (form.value.has_booking) {
    form.value.court_bookings.forEach((b, i) => {
      if (!b.court_field_number) errors[`booking_${i}_court`] = 'เลือกคอร์ท';
      if (!b.start_time) errors[`booking_${i}_start`] = 'เลือกเวลาเริ่ม';
      if (!b.end_time) errors[`booking_${i}_end`] = 'เลือกเวลาจบ';
    });
  } else {
    if (!form.value.start_time) errors.start_time = 'กรุณาเลือกเวลาเริ่ม';
    if (!form.value.end_time) errors.end_time = 'กรุณาเลือกเวลาจบ';
  }

  formErrors.value = errors;

  if (Object.keys(errors).length) {
    toast.add({
      severity: 'error',
      summary: 'ข้อมูลไม่ครบ',
      detail: `กรุณากรอกข้อมูลที่ระบุ`,
      life: 3000,
    });
    return;
  }

  const url = isEditing.value ? `/party/${editingPartyId.value}/update` : "/party-create";

  // Include selected template members when creating
  const formData = { ...form.value };
  if (!isEditing.value && templateMembers.value.length > 0) {
    formData.member_ids = templateMembers.value.filter(m => m.selected).map(m => m.user_id);
  }

  router.post(url, formData, {
    preserveScroll: true,
    onSuccess: (page) => {
      parties.value = page.props.parties;
      courts.value = page.props.courts;
      showDialog.value = false;
      editingPartyId.value = null;
      formErrors.value = {};
      toast.add({ severity: 'success', summary: 'สำเร็จ', detail: isEditing.value ? 'แก้ไขปาร์ตี้เรียบร้อยแล้ว' : 'สร้างปาร์ตี้เรียบร้อยแล้ว', life: 3000 });
    },
    onError: (errors) => {
      const messages = Object.values(errors).flat();
      toast.add({
        severity: 'error',
        summary: 'ข้อมูลไม่ถูกต้อง',
        detail: messages.join(', '),
        life: 5000,
      });
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

/* Scrolling text for long party names */
.party-name-scroll {
  display: inline-block;
  animation: none;
}

div:has(> .party-name-scroll) {
  position: relative;
}

/* Only animate when text overflows */
@keyframes marquee {
  0%, 20% { transform: translateX(0); }
  80%, 100% { transform: translateX(calc(-100% + 10rem)); }
}

.party-name-scroll:where(:not(:empty)) {
  animation: marquee 6s linear infinite alternate;
  animation-play-state: paused;
}

div:hover > .party-name-scroll {
  animation-play-state: running;
}
</style>
