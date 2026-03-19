import { ref, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, renderList, createTextVNode, withModifiers, withDirectives, vModelText, vModelSelect, vModelCheckbox, withKeys, nextTick, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-DZFboRiE.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, Head, router } from "@inertiajs/vue3";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./badmintonLayout-Bmnf0xqT.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./useConfirm-CffLghyV.js";
const perPage = 10;
const NOTE_TEMPLATES_KEY = "badminton_note_templates";
const _sfc_main = {
  __name: "PartyLists",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useLocale();
    const toast = useToast();
    const showDialog = ref(false);
    const formErrors = ref({});
    const editingPartyId = ref(null);
    const isEditing = computed(() => !!editingPartyId.value);
    const openCreateDialog = () => {
      editingPartyId.value = null;
      form.value = {
        name: "",
        default_game_type: "quadruple",
        play_date: null,
        court_id: null,
        max_players: 18,
        status: "Open",
        is_private: false,
        invite_passcode: "",
        cost_type: "per_person",
        cost_amount: null,
        shuttlecock_cost: null,
        notes: "",
        has_booking: true,
        start_time: "",
        end_time: "",
        court_bookings: [{ court_id: null, court_field_number: null, start_time: "", end_time: "" }]
      };
      templateMembers.value = [];
      formErrors.value = {};
      showDialog.value = true;
    };
    const openEditDialog = (party) => {
      var _a;
      editingPartyId.value = party.id;
      form.value = {
        name: party.name || "",
        default_game_type: party.default_game_type || "quadruple",
        play_date: party.play_date,
        court_id: party.court_id,
        max_players: party.max_players,
        status: party.status,
        is_private: party.is_private || false,
        invite_passcode: party.invite_passcode || "",
        cost_type: party.cost_type || "per_person",
        cost_amount: party.cost_amount,
        shuttlecock_cost: party.shuttlecock_cost,
        notes: party.notes || "",
        has_booking: true,
        start_time: party.start_time || "",
        end_time: party.end_time || "",
        court_bookings: ((_a = party.court_bookings) == null ? void 0 : _a.length) ? party.court_bookings.map((b) => ({ court_id: b.court_id, court_field_number: b.court_field_number, start_time: b.start_time, end_time: b.end_time })) : [{ court_id: null, court_field_number: null, start_time: "", end_time: "" }]
      };
      formErrors.value = {};
      showDialog.value = true;
    };
    const isOwner = (party) => party.creator_id === (authUser == null ? void 0 : authUser.id);
    const page = usePage();
    const parties = ref(page.props.parties ?? []);
    const courts = ref(page.props.courts ?? []);
    const myPastParties = computed(
      () => parties.value.filter((p) => p.creator_id === (authUser == null ? void 0 : authUser.id)).sort((a, b) => b.play_date.localeCompare(a.play_date)).slice(0, 10)
    );
    const loadFromTemplate = (party) => {
      var _a, _b;
      form.value = {
        ...form.value,
        name: party.name || "",
        default_game_type: party.default_game_type || "quadruple",
        court_id: party.court_id,
        max_players: party.max_players,
        is_private: party.is_private || false,
        cost_type: party.cost_type || "per_person",
        cost_amount: party.cost_amount,
        shuttlecock_cost: party.shuttlecock_cost,
        notes: party.notes || "",
        has_booking: ((_a = party.court_bookings) == null ? void 0 : _a.length) > 0,
        start_time: party.start_time || "",
        end_time: party.end_time || "",
        court_bookings: ((_b = party.court_bookings) == null ? void 0 : _b.length) ? party.court_bookings.map((b) => ({ court_id: b.court_id, court_field_number: b.court_field_number, start_time: b.start_time, end_time: b.end_time })) : [{ court_id: null, court_field_number: null, start_time: "", end_time: "" }]
      };
      const partyMembers = party.members || [];
      templateMembers.value = partyMembers.map((m) => {
        var _a2, _b2;
        return {
          user_id: m.user_id,
          name: m.display_name || ((_a2 = m.user) == null ? void 0 : _a2.name) || "Unknown",
          avatar: (_b2 = m.user) == null ? void 0 : _b2.avatar,
          role: m.role,
          selected: true
        };
      });
    };
    const currentPage = ref(1);
    const form = ref({
      name: "",
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
      court_bookings: [{ court_id: null, court_field_number: null, start_time: "", end_time: "" }]
    });
    const templateMembers = ref([]);
    const templateSelectedCount = computed(() => templateMembers.value.filter((m) => m.selected).length);
    const toggleAllTemplateMembers = () => {
      const allSelected = templateMembers.value.every((m) => m.selected);
      templateMembers.value.forEach((m) => m.selected = !allSelected);
    };
    const noteTemplates = ref([]);
    const showNoteTemplateMenu = ref(false);
    const showSaveNoteTemplate = ref(false);
    const noteTemplateName = ref("");
    const notesTextarea = ref(null);
    try {
      const stored = localStorage.getItem(NOTE_TEMPLATES_KEY);
      noteTemplates.value = stored ? JSON.parse(stored) : [];
    } catch {
      noteTemplates.value = [];
    }
    const saveNoteTemplates = () => {
      localStorage.setItem(NOTE_TEMPLATES_KEY, JSON.stringify(noteTemplates.value));
    };
    const saveCurrentAsNoteTemplate = () => {
      var _a;
      const name = noteTemplateName.value.trim();
      if (!name || !((_a = form.value.notes) == null ? void 0 : _a.trim())) return;
      noteTemplates.value.push({ name, content: form.value.notes });
      saveNoteTemplates();
      noteTemplateName.value = "";
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
    const insertAtCursor = (text) => {
      const ta = notesTextarea.value;
      if (!ta) {
        form.value.notes = (form.value.notes || "") + text;
        return;
      }
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = form.value.notes || "";
      form.value.notes = val.substring(0, start) + text + val.substring(end);
      nextTick(() => {
        ta.selectionStart = ta.selectionEnd = start + text.length;
        ta.focus();
      });
    };
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
    const emojiCategories = [
      { label: "🏸 แบดมินตัน", emojis: ["🏸", "🧑‍🤝‍🧑", "🏆", "🥇", "🥈", "🥉", "🎯", "💪", "🔥", "⭐", "🤝", "👏"] },
      { label: "🏟️ สถานที่/เวลา", emojis: ["🏟️", "📅", "⏰", "🕐", "📍", "🅿️", "🚗", "🏠", "🚿", "🗓️"] },
      { label: "💰 เงิน/ค่าใช้จ่าย", emojis: ["💰", "💵", "💳", "🧾", "📊", "💲", "🏦", "🔢"] },
      { label: "⚠️ กฎ/เตือน", emojis: ["⚠️", "📌", "🚫", "❌", "✅", "⭕", "❗", "📢", "🔒", "🙅", "👉", "📣"] },
      { label: "👟 อุปกรณ์", emojis: ["👟", "👕", "🎽", "🧴", "💧", "🧊", "🎒", "🩳", "🧤", "😷"] },
      { label: "😊 อื่นๆ", emojis: ["📝", "📋", "👋", "🙏", "😊", "🎉", "🔄", "➡️", "⬇️", "☎️", "📱", "🔗"] }
    ];
    const bulletStyles = [
      { label: "จุดทึบ", preview: "•", char: "• " },
      { label: "ขีด", preview: "-", char: "- " },
      { label: "ลูกศร", preview: "▸", char: "▸ " },
      { label: "ถูก", preview: "✓", char: "✓ " },
      { label: "ดาว", preview: "★", char: "★ " },
      { label: "วงกลม", preview: "○", char: "○ " },
      { label: "สี่เหลี่ยม", preview: "▪", char: "▪ " },
      { label: "หมายเลข", preview: "1.", char: null, numbered: true }
    ];
    const lineStyles = [
      { label: "เส้นตรง", preview: "─────", char: "───────────────" },
      { label: "เส้นหนา", preview: "━━━━━", char: "━━━━━━━━━━━━━━━" },
      { label: "จุดประ", preview: "· · · · ·", char: "· · · · · · · · · · ·" },
      { label: "ขีดประ", preview: "- - - - -", char: "- - - - - - - - - - -" },
      { label: "ดาว", preview: "★ ★ ★", char: "★ ★ ★ ★ ★" },
      { label: "คลื่น", preview: "～～～", char: "～～～～～～～～～～～～" },
      { label: "เพชร", preview: "◆ ◇ ◆", char: "◆ ◇ ◆ ◇ ◆ ◇ ◆" }
    ];
    const insertBulletStyle = (style) => {
      const val = form.value.notes || "";
      const ta = notesTextarea.value;
      const pos = ta ? ta.selectionStart : val.length;
      const needNewline = pos > 0 && val[pos - 1] !== "\n";
      if (style.numbered) {
        const textBefore = val.substring(0, pos);
        const lines = textBefore.split("\n").reverse();
        const lastNum = lines.find((l) => /^\s*\d+\./.test(l));
        const num = lastNum ? parseInt(lastNum.trim()) + 1 : 1;
        insertAtCursor((needNewline ? "\n" : "") + `${num}. `);
      } else {
        insertAtCursor((needNewline ? "\n" : "") + style.char);
      }
      showBulletPicker.value = false;
    };
    const insertLineStyle = (style) => {
      const val = form.value.notes || "";
      const ta = notesTextarea.value;
      const pos = ta ? ta.selectionStart : val.length;
      const needBefore = pos > 0 && val[pos - 1] !== "\n";
      const needAfter = pos < val.length && val[pos] !== "\n";
      insertAtCursor((needBefore ? "\n" : "") + style.char + (needAfter ? "\n" : ""));
      showLinePicker.value = false;
    };
    const getSelectedLines = () => {
      const ta = notesTextarea.value;
      if (!ta) return null;
      const val = form.value.notes || "";
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      const lineEndIdx = val.indexOf("\n", end);
      const lineEnd = lineEndIdx === -1 ? val.length : lineEndIdx;
      return { val, lineStart, lineEnd, text: val.substring(lineStart, lineEnd) };
    };
    const replaceLines = (sel, newText) => {
      form.value.notes = sel.val.substring(0, sel.lineStart) + newText + sel.val.substring(sel.lineEnd);
      nextTick(() => {
        const ta = notesTextarea.value;
        if (ta) {
          ta.selectionStart = sel.lineStart;
          ta.selectionEnd = sel.lineStart + newText.length;
          ta.focus();
        }
      });
    };
    const indentLines = () => {
      const sel = getSelectedLines();
      if (!sel) return;
      replaceLines(sel, sel.text.split("\n").map((l) => "    " + l).join("\n"));
    };
    const outdentLines = () => {
      const sel = getSelectedLines();
      if (!sel) return;
      replaceLines(sel, sel.text.split("\n").map((l) => {
        if (l.startsWith("    ")) return l.substring(4);
        if (l.startsWith("	")) return l.substring(1);
        if (l.startsWith("  ")) return l.substring(2);
        return l;
      }).join("\n"));
    };
    const getTextareaColumns = () => {
      const ta = notesTextarea.value;
      if (!ta) return 40;
      const style = window.getComputedStyle(ta);
      const fontSize = parseFloat(style.fontSize);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      const availableWidth = ta.clientWidth - paddingLeft - paddingRight;
      const charWidth = fontSize * 0.6;
      return Math.floor(availableWidth / charWidth);
    };
    const alignLines = (align) => {
      const sel = getSelectedLines();
      if (!sel) return;
      const cols = getTextareaColumns();
      replaceLines(sel, sel.text.split("\n").map((l) => {
        const trimmed = l.trim();
        if (align === "left") return trimmed;
        if (align === "center") {
          const pad = Math.max(0, Math.floor((cols - trimmed.length) / 2));
          return " ".repeat(pad) + trimmed;
        }
        if (align === "right") {
          const pad = Math.max(0, cols - trimmed.length);
          return " ".repeat(pad) + trimmed;
        }
        return l;
      }).join("\n"));
    };
    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const enDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const selectedDayOfWeek = computed(() => {
      if (!form.value.play_date) return "";
      const d = /* @__PURE__ */ new Date(form.value.play_date + "T00:00:00");
      const day = d.getDay();
      return locale.value === "th" ? thaiDays[day] : enDays[day];
    });
    const authUser = page.props.auth.user;
    const filteredParties = computed(() => {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      return parties.value.filter((party) => party.status !== "Over" && party.play_date >= today).sort((a, b) => a.play_date.localeCompare(b.play_date));
    });
    const totalPages = computed(() => Math.ceil(filteredParties.value.length / perPage));
    const paginatedParties = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filteredParties.value.slice(start, start + perPage);
    });
    const formatDisplayDate = (dateStr) => {
      if (!dateStr) return "-";
      const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
      const day = d.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${day} ${months[d.getMonth()]}`;
    };
    const formatTime = (timeStr) => {
      if (!timeStr) return "-";
      return timeStr.substring(0, 5);
    };
    const statusAccentColor = (status) => {
      switch (status) {
        case "Open":
          return "bg-primary";
        case "Full":
          return "bg-warning";
        case "Over":
          return "bg-base-300";
        default:
          return "bg-base-300";
      }
    };
    const reloadPage = () => {
      router.get(`/party-lists`, {}, { preserveScroll: true });
    };
    const timeOptions = Array.from({ length: 24 }, (_, i) => ({
      name: `${String(i + 1).padStart(2, "0")}:00`
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
      return (members == null ? void 0 : members.some((member) => member.user_id === authUser.id)) ?? false;
    };
    const joinParty = (partyId) => {
      router.post(`/party-join`, { party_id: partyId }, {
        onSuccess: (res) => {
          parties.value = res.props.parties;
          courts.value = res.props.courts;
          toast.add({ severity: "success", summary: "สำเร็จ", detail: "เข้าร่วมปาร์ตี้สำเร็จแล้ว!", life: 3e3 });
        },
        onError: (error) => {
          toast.add({ severity: "error", summary: "ผิดพลาด", detail: (error == null ? void 0 : error.message) || "เกิดข้อผิดพลาด", life: 3e3 });
        }
      });
    };
    const enterParty = (partyId) => {
      router.get(`/party/${partyId}`);
    };
    const bookingSummary = computed(() => {
      const bookings = form.value.court_bookings.filter((b) => b.start_time && b.end_time && b.court_field_number);
      if (!bookings.length) return null;
      const allTimes = /* @__PURE__ */ new Set();
      bookings.forEach((b) => {
        const startH = parseInt(b.start_time.split(":")[0]);
        const endH = parseInt(b.end_time.split(":")[0]);
        for (let h = startH; h < endH; h++) allTimes.add(h);
      });
      const sortedHours = [...allTimes].sort((a, b) => a - b);
      if (!sortedHours.length) return null;
      const slots = [];
      let currentSlot = null;
      sortedHours.forEach((h) => {
        const courtsAtHour = bookings.filter((b) => {
          const s = parseInt(b.start_time.split(":")[0]);
          const e = parseInt(b.end_time.split(":")[0]);
          return h >= s && h < e;
        }).map((b) => b.court_field_number).sort((a, b) => a - b);
        const key = courtsAtHour.join(",");
        if (currentSlot && currentSlot.key === key) {
          currentSlot.endH = h + 1;
        } else {
          currentSlot = { startH: h, endH: h + 1, courts: courtsAtHour, key };
          slots.push(currentSlot);
        }
      });
      const overallStart = `${String(sortedHours[0]).padStart(2, "0")}:00`;
      const overallEnd = `${String(sortedHours[sortedHours.length - 1] + 1).padStart(2, "0")}:00`;
      const totalHours = sortedHours.length;
      return {
        overallStart,
        overallEnd,
        totalHours,
        slots: slots.map((s) => ({
          time: `${String(s.startH).padStart(2, "0")}:00 - ${String(s.endH).padStart(2, "0")}:00`,
          courtCount: s.courts.length,
          courts: s.courts
        }))
      };
    });
    const addCourtBooking = () => {
      const last = form.value.court_bookings[form.value.court_bookings.length - 1];
      form.value.court_bookings.push({
        court_id: form.value.court_id,
        court_field_number: null,
        start_time: (last == null ? void 0 : last.start_time) || "",
        end_time: (last == null ? void 0 : last.end_time) || ""
      });
    };
    const usedCourtNumbers = computed(
      () => form.value.court_bookings.map((b) => b.court_field_number).filter((n) => n != null)
    );
    const removeCourtBooking = (index) => {
      form.value.court_bookings.splice(index, 1);
    };
    const createParty = () => {
      const errors = {};
      if (!form.value.play_date) errors.play_date = "กรุณาเลือกวันเล่น";
      if (!form.value.court_id) errors.court_id = "กรุณาเลือกสนาม";
      if (form.value.has_booking) {
        form.value.court_bookings.forEach((b, i) => {
          if (!b.court_field_number) errors[`booking_${i}_court`] = "เลือกคอร์ท";
          if (!b.start_time) errors[`booking_${i}_start`] = "เลือกเวลาเริ่ม";
          if (!b.end_time) errors[`booking_${i}_end`] = "เลือกเวลาจบ";
        });
      } else {
        if (!form.value.start_time) errors.start_time = "กรุณาเลือกเวลาเริ่ม";
        if (!form.value.end_time) errors.end_time = "กรุณาเลือกเวลาจบ";
      }
      formErrors.value = errors;
      if (Object.keys(errors).length) {
        toast.add({
          severity: "error",
          summary: "ข้อมูลไม่ครบ",
          detail: `กรุณากรอกข้อมูลที่ระบุ`,
          life: 3e3
        });
        return;
      }
      const url = isEditing.value ? `/party/${editingPartyId.value}/update` : "/party-create";
      const formData = { ...form.value };
      if (!isEditing.value && templateMembers.value.length > 0) {
        formData.member_ids = templateMembers.value.filter((m) => m.selected).map((m) => m.user_id);
      }
      router.post(url, formData, {
        preserveScroll: true,
        onSuccess: (page2) => {
          parties.value = page2.props.parties;
          courts.value = page2.props.courts;
          showDialog.value = false;
          editingPartyId.value = null;
          formErrors.value = {};
          toast.add({ severity: "success", summary: "สำเร็จ", detail: isEditing.value ? "แก้ไขปาร์ตี้เรียบร้อยแล้ว" : "สร้างปาร์ตี้เรียบร้อยแล้ว", life: 3e3 });
        },
        onError: (errors2) => {
          const messages = Object.values(errors2).flat();
          toast.add({
            severity: "error",
            summary: "ข้อมูลไม่ถูกต้อง",
            detail: messages.join(", "),
            life: 5e3
          });
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: unref(t)("partyList.title")
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="space-y-4" data-v-a75cdc6c${_scopeId}><div class="flex items-center justify-between" data-v-a75cdc6c${_scopeId}><div data-v-a75cdc6c${_scopeId}><h1 class="text-lg font-bold text-base-content m-0" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("partyList.title"))}</h1><p class="text-sm text-base-content/60 m-0 mt-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("partyList.count", { count: filteredParties.value.length }))}</p></div><div class="flex items-center gap-2" data-v-a75cdc6c${_scopeId}><button class="w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer" data-v-a75cdc6c${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-a75cdc6c${_scopeId}></path></svg></button><button class="h-9 px-4 flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-medium border-0 cursor-pointer transition-colors active:scale-[0.98]" data-v-a75cdc6c${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" data-v-a75cdc6c${_scopeId}></path></svg><span data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("partyList.createParty"))}</span></button></div></div>`);
            if (filteredParties.value.length > 0) {
              _push2(`<div class="space-y-3" data-v-a75cdc6c${_scopeId}><!--[-->`);
              ssrRenderList(paginatedParties.value, (party) => {
                var _a2, _b2, _c, _d;
                _push2(`<div class="badminton-card bg-base-100 rounded-xl border border-base-300 overflow-hidden" data-v-a75cdc6c${_scopeId}><div class="${ssrRenderClass([statusAccentColor(party.status), "h-1"])}" data-v-a75cdc6c${_scopeId}></div><div class="flex" data-v-a75cdc6c${_scopeId}><div class="w-20 shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center" data-v-a75cdc6c${_scopeId}><span class="text-3xl" data-v-a75cdc6c${_scopeId}>🏸</span></div><div class="flex-1 min-w-0 px-3 py-2" data-v-a75cdc6c${_scopeId}><div class="flex items-center justify-between gap-1 mb-0.5" data-v-a75cdc6c${_scopeId}><div class="flex-1 min-w-0 overflow-hidden" data-v-a75cdc6c${_scopeId}><h3 class="text-[12px] font-semibold text-base-content m-0 leading-tight whitespace-nowrap party-name-scroll" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(party.name || ((_a2 = party.court) == null ? void 0 : _a2.name) || "Party")}</h3></div><span class="${ssrRenderClass([party.members_count >= party.max_players ? "bg-error/15 text-error" : "bg-success/15 text-success", "shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold"])}" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(party.members_count)}/${ssrInterpolate(party.max_players)}</span></div><div class="flex items-center gap-3 text-[11px] text-base-content/60 mb-1.5" data-v-a75cdc6c${_scopeId}><span class="flex items-center gap-0.5" data-v-a75cdc6c${_scopeId}>🏟️ ${ssrInterpolate(((_b2 = party.court) == null ? void 0 : _b2.name) || "-")}</span></div><div class="flex items-center gap-3 text-[11px] text-base-content/60 mb-1.5" data-v-a75cdc6c${_scopeId}><span class="flex items-center gap-0.5" data-v-a75cdc6c${_scopeId}>📅 ${ssrInterpolate(formatDisplayDate(party.play_date))}</span><span class="flex items-center gap-0.5" data-v-a75cdc6c${_scopeId}>⏰ ${ssrInterpolate(formatTime(party.start_time))}</span><span class="${ssrRenderClass([party.default_game_type === "double" ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700", "px-1 py-px rounded text-[10px] font-bold"])}" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(party.default_game_type === "double" ? "1v1" : "2v2")}</span>`);
                if (party.is_private) {
                  _push2(`<span class="text-base-content/40" data-v-a75cdc6c${_scopeId}>🔒</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="flex items-center justify-between" data-v-a75cdc6c${_scopeId}><div class="flex items-center" data-v-a75cdc6c${_scopeId}><div class="flex -space-x-1.5" data-v-a75cdc6c${_scopeId}><!--[-->`);
                ssrRenderList((_c = party.members) == null ? void 0 : _c.slice(0, 5), (member) => {
                  var _a3, _b3;
                  _push2(ssrRenderComponent(_sfc_main$2, {
                    key: member.id,
                    src: (_a3 = member.user) == null ? void 0 : _a3.avatar,
                    name: (_b3 = member.user) == null ? void 0 : _b3.name,
                    size: "xs",
                    rounded: "full",
                    class: "border border-base-100"
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]--></div>`);
                if (((_d = party.members) == null ? void 0 : _d.length) > 5) {
                  _push2(`<span class="ml-1 text-[9px] text-base-content/40" data-v-a75cdc6c${_scopeId}>+${ssrInterpolate(party.members.length - 5)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (!isUserInParty(party.members)) {
                  _push2(`<button class="h-8 px-4 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" data-v-a75cdc6c${_scopeId}></path></svg> ${ssrInterpolate(unref(t)("common.join"))}</button>`);
                } else {
                  _push2(`<!--[-->`);
                  if (isOwner(party)) {
                    _push2(`<button class="h-6 px-2 rounded-md text-[10px] font-semibold border-0 cursor-pointer transition-all active:scale-[0.97] bg-base-200 text-base-content/60 hover:bg-base-300 flex items-center gap-0.5" data-v-a75cdc6c${_scopeId}><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" data-v-a75cdc6c${_scopeId}></path></svg></button>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<button class="h-8 px-4 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary text-white hover:bg-primary/80 flex items-center gap-1" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" data-v-a75cdc6c${_scopeId}></path></svg> ${ssrInterpolate(unref(t)("common.enter"))}</button><!--]-->`);
                }
                _push2(`</div></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-16" data-v-a75cdc6c${_scopeId}><div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4" data-v-a75cdc6c${_scopeId}><span class="text-3xl" data-v-a75cdc6c${_scopeId}>🏸</span></div><h3 class="text-lg font-semibold text-base-content m-0" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("partyList.noParties"))}</h3><p class="text-sm text-base-content/60 mt-1 m-0" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("partyList.createFirst"))}</p><button class="mt-4 h-10 px-6 rounded-xl bg-primary hover:bg-primary/80 text-white text-sm font-medium border-0 cursor-pointer transition-colors" data-v-a75cdc6c${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" data-v-a75cdc6c${_scopeId}></path></svg> Create Party </button></div>`);
            }
            if (totalPages.value > 1) {
              _push2(`<div class="flex items-center justify-center gap-2 pt-2 pb-4" data-v-a75cdc6c${_scopeId}><!--[-->`);
              ssrRenderList(totalPages.value, (p) => {
                _push2(`<button class="${ssrRenderClass([currentPage.value === p ? "bg-primary text-white" : "bg-base-100 text-base-content/70 border border-base-300 hover:bg-base-200", "w-9 h-9 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors"])}" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(p)}</button>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<dialog class="${ssrRenderClass([{ "modal-open": showDialog.value }, "modal"])}" data-v-a75cdc6c${_scopeId}><div class="modal-box w-full max-w-lg p-0" data-v-a75cdc6c${_scopeId}><div class="flex items-center justify-between px-5 pt-5 pb-3" data-v-a75cdc6c${_scopeId}><h3 class="text-base font-bold text-base-content m-0" data-v-a75cdc6c${_scopeId}>🏸 ${ssrInterpolate(isEditing.value ? unref(t)("createParty.editTitle") : unref(t)("createParty.title"))}</h3><button class="w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors" data-v-a75cdc6c${_scopeId}><span class="text-base-content/60 text-sm" data-v-a75cdc6c${_scopeId}>✕</span></button></div><form class="px-5 pb-5 space-y-4 overflow-y-auto max-h-[75vh]" data-v-a75cdc6c${_scopeId}>`);
            if (!isEditing.value && myPastParties.value.length > 0) {
              _push2(`<div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1.5 block" data-v-a75cdc6c${_scopeId}>📋 ดึงจากก๊วนเก่า</label><div class="flex gap-1.5 overflow-x-auto pb-1" data-v-a75cdc6c${_scopeId}><!--[-->`);
              ssrRenderList(myPastParties.value, (pp) => {
                var _a2;
                _push2(`<button type="button" class="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-base-300 bg-base-200 text-base-content/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary cursor-pointer transition-all whitespace-nowrap" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(pp.name || ((_a2 = pp.court) == null ? void 0 : _a2.name) || `#${pp.id}`)}</button>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-3" data-v-a75cdc6c${_scopeId}><div class="grid grid-cols-3 gap-3" data-v-a75cdc6c${_scopeId}><div class="col-span-2" data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.partyName"))}</label><input type="text"${ssrRenderAttr("value", form.value.name)}${ssrRenderAttr("placeholder", unref(t)("createParty.partyNamePlaceholder"))} class="input input-bordered input-sm w-full" data-v-a75cdc6c${_scopeId}></div><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.gameType"))}</label><div class="flex gap-1 p-0.5 bg-base-200 rounded-lg" data-v-a75cdc6c${_scopeId}><button type="button" class="${ssrRenderClass([form.value.default_game_type === "double" ? "bg-primary text-white" : "bg-transparent text-base-content/50", "flex-1 py-1 rounded-md text-[10px] font-bold border-0 cursor-pointer transition-all text-center"])}" data-v-a75cdc6c${_scopeId}>1v1</button><button type="button" class="${ssrRenderClass([form.value.default_game_type === "quadruple" ? "bg-primary text-white" : "bg-transparent text-base-content/50", "flex-1 py-1 rounded-md text-[10px] font-bold border-0 cursor-pointer transition-all text-center"])}" data-v-a75cdc6c${_scopeId}>2v2</button></div></div></div><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.playDate"))}</label><div class="flex items-center gap-2" data-v-a75cdc6c${_scopeId}><input type="date"${ssrRenderAttr("value", form.value.play_date)} class="${ssrRenderClass([{ "input-error": formErrors.value.play_date }, "input input-bordered input-sm flex-1"])}" data-v-a75cdc6c${_scopeId}>`);
            if (selectedDayOfWeek.value) {
              _push2(`<span class="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(selectedDayOfWeek.value)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (formErrors.value.play_date) {
              _push2(`<p class="text-[10px] text-error m-0 mt-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(formErrors.value.play_date)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid grid-cols-2 gap-3" data-v-a75cdc6c${_scopeId}><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.maxPlayers"))}</label><input type="number"${ssrRenderAttr("value", form.value.max_players)} min="2" class="input input-bordered input-sm w-full" data-v-a75cdc6c${_scopeId}></div><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.court"))}</label><select class="${ssrRenderClass([{ "select-error": formErrors.value.court_id }, "select select-bordered select-sm w-full"])}" data-v-a75cdc6c${_scopeId}><option${ssrRenderAttr("value", null)} disabled data-v-a75cdc6c${ssrIncludeBooleanAttr(Array.isArray(form.value.court_id) ? ssrLooseContain(form.value.court_id, null) : ssrLooseEqual(form.value.court_id, null)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(unref(t)("createParty.selectCourt"))}</option><!--[-->`);
            ssrRenderList(courts.value, (court) => {
              _push2(`<option${ssrRenderAttr("value", court.id)} data-v-a75cdc6c${ssrIncludeBooleanAttr(Array.isArray(form.value.court_id) ? ssrLooseContain(form.value.court_id, court.id) : ssrLooseEqual(form.value.court_id, court.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(court.name)}</option>`);
            });
            _push2(`<!--]--></select>`);
            if (formErrors.value.court_id) {
              _push2(`<p class="text-[10px] text-error m-0 mt-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(formErrors.value.court_id)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><label class="flex items-center gap-2 cursor-pointer" data-v-a75cdc6c${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.is_private) ? ssrLooseContain(form.value.is_private, null) : form.value.is_private) ? " checked" : ""} class="checkbox checkbox-primary checkbox-sm" data-v-a75cdc6c${_scopeId}><span class="text-xs font-medium text-base-content/70" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.private"))}</span></label>`);
            if (form.value.is_private) {
              _push2(`<div class="flex items-center gap-2 pl-7" data-v-a75cdc6c${_scopeId}><span class="text-[10px] text-base-content/50" data-v-a75cdc6c${_scopeId}>🔢 รหัสเข้าร่วม</span><input type="text"${ssrRenderAttr("value", form.value.invite_passcode)} maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="0000" class="input input-bordered input-xs w-20 text-center tracking-widest font-bold" data-v-a75cdc6c${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="border-t border-base-200 pt-3 space-y-3" data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.costType"))}</label><div class="flex gap-1.5" data-v-a75cdc6c${_scopeId}><!--[-->`);
            ssrRenderList([{ key: "per_person", label: unref(t)("createParty.costPerPerson") }, { key: "split_equal", label: unref(t)("createParty.costSplitEqual") }, { key: "free", label: unref(t)("createParty.costFree") }], (ct) => {
              _push2(`<button type="button" class="${ssrRenderClass([form.value.cost_type === ct.key ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300", "flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"])}" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(ct.label)}</button>`);
            });
            _push2(`<!--]--></div>`);
            if (form.value.cost_type === "per_person") {
              _push2(`<div class="grid grid-cols-2 gap-3" data-v-a75cdc6c${_scopeId}><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.costPerPerson_amount"))}</label><input type="number"${ssrRenderAttr("value", form.value.cost_amount)} min="0" step="1" class="input input-bordered input-sm w-full" placeholder="0" data-v-a75cdc6c${_scopeId}></div><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.shuttlecockCost"))}</label><input type="number"${ssrRenderAttr("value", form.value.shuttlecock_cost)} min="0" step="1" class="input input-bordered input-sm w-full" placeholder="0" data-v-a75cdc6c${_scopeId}></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (form.value.cost_type === "split_equal") {
              _push2(`<div class="grid grid-cols-2 gap-3" data-v-a75cdc6c${_scopeId}><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.costAmount"))}</label><input type="number"${ssrRenderAttr("value", form.value.cost_amount)} min="0" step="1" class="input input-bordered input-sm w-full" placeholder="150" data-v-a75cdc6c${_scopeId}></div><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.shuttlecockCost"))}</label><input type="number"${ssrRenderAttr("value", form.value.shuttlecock_cost)} min="0" step="1" class="input input-bordered input-sm w-full" placeholder="80" data-v-a75cdc6c${_scopeId}></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (form.value.cost_type === "split_equal" && form.value.cost_amount && bookingSummary.value) {
              _push2(`<div class="bg-primary/5 rounded-lg p-2.5 text-[10px] text-base-content/70 space-y-0.5" data-v-a75cdc6c${_scopeId}><div class="font-bold text-base-content/80 text-xs mb-1" data-v-a75cdc6c${_scopeId}>💰 ตัวอย่างค่าใช้จ่าย</div><div data-v-a75cdc6c${_scopeId}>ค่าคอร์ท: ${ssrInterpolate(form.value.cost_amount)} ฿/ชม. × ${ssrInterpolate(bookingSummary.value.totalHours)} ชม. = <span class="font-bold text-base-content" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(form.value.cost_amount * bookingSummary.value.totalHours)} ฿</span></div>`);
              if (form.value.shuttlecock_cost) {
                _push2(`<div data-v-a75cdc6c${_scopeId}>ค่าลูกแบด: ${ssrInterpolate(form.value.shuttlecock_cost)} ฿/ลูก × (จำนวนลูกที่ใช้จริง)</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="text-[9px] text-base-content/40 mt-1" data-v-a75cdc6c${_scopeId}>* ยอดรวมจะคำนวณหลังจบ party โดยรวมค่าคอร์ท + ลูกแบดที่ใช้จริง แล้วหารเท่าตามจำนวนผู้เล่น</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="border-t border-base-200 pt-3 space-y-2" data-v-a75cdc6c${_scopeId}><div class="flex items-center justify-between" data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60" data-v-a75cdc6c${_scopeId}>📝 หมายเหตุ / กติกา</label><div class="relative" data-v-a75cdc6c${_scopeId}><button type="button" class="text-[10px] font-medium text-primary border border-primary/30 bg-primary/5 rounded-lg px-2 py-1 cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1" data-v-a75cdc6c${_scopeId}> 📋 Template `);
            if (noteTemplates.value.length) {
              _push2(`<span class="bg-primary text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center font-bold" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(noteTemplates.value.length)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<svg class="${ssrRenderClass([{ "rotate-180": showNoteTemplateMenu.value }, "w-3 h-3 transition-transform"])}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" data-v-a75cdc6c${_scopeId}></path></svg></button>`);
            if (showNoteTemplateMenu.value) {
              _push2(`<div class="fixed inset-0 z-10" data-v-a75cdc6c${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (showNoteTemplateMenu.value) {
              _push2(`<div class="absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 py-1 max-h-60 overflow-y-auto" data-v-a75cdc6c${_scopeId}>`);
              if (noteTemplates.value.length === 0) {
                _push2(`<div class="px-3 py-4 text-center" data-v-a75cdc6c${_scopeId}><div class="text-lg mb-1" data-v-a75cdc6c${_scopeId}>📋</div><div class="text-[10px] text-base-content/30" data-v-a75cdc6c${_scopeId}>ยังไม่มี template</div><div class="text-[9px] text-base-content/20 mt-0.5" data-v-a75cdc6c${_scopeId}>พิมพ์หมายเหตุแล้วกด 💾 ด้านล่าง</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (noteTemplates.value.length > 0) {
                _push2(`<!--[--><div class="px-3 py-1.5 text-[9px] font-bold text-base-content/40 uppercase tracking-wider" data-v-a75cdc6c${_scopeId}>เลือก Template</div><!--[-->`);
                ssrRenderList(noteTemplates.value, (tmpl, i) => {
                  _push2(`<div class="px-3 py-2 hover:bg-base-200 transition-colors" data-v-a75cdc6c${_scopeId}>`);
                  if (confirmingDeleteIdx.value !== i) {
                    _push2(`<div class="flex items-center gap-2" data-v-a75cdc6c${_scopeId}><div class="flex-1 min-w-0 cursor-pointer" data-v-a75cdc6c${_scopeId}><div class="text-xs font-medium text-base-content truncate" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(tmpl.name)}</div><div class="text-[9px] text-base-content/40 truncate leading-tight mt-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(tmpl.content.substring(0, 50))}${ssrInterpolate(tmpl.content.length > 50 ? "..." : "")}</div></div><button type="button" class="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] text-base-content/30 hover:text-error hover:bg-error/10 border-0 bg-transparent cursor-pointer transition-all" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-v-a75cdc6c${_scopeId}></path></svg></button></div>`);
                  } else {
                    _push2(`<div class="flex items-center gap-2" data-v-a75cdc6c${_scopeId}><div class="flex-1 text-[10px] text-error font-medium" data-v-a75cdc6c${_scopeId}>ลบ &quot;${ssrInterpolate(tmpl.name)}&quot; ?</div><button type="button" class="px-2 py-1 text-[10px] rounded-md bg-base-200 text-base-content/60 border-0 cursor-pointer hover:bg-base-300 transition-colors" data-v-a75cdc6c${_scopeId}>ยกเลิก</button><button type="button" class="px-2 py-1 text-[10px] rounded-md bg-error text-white border-0 cursor-pointer hover:bg-error/80 transition-colors font-bold" data-v-a75cdc6c${_scopeId}>ลบ</button></div>`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]--><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="flex items-center gap-0.5 w-full bg-base-200/50 rounded-lg p-1" data-v-a75cdc6c${_scopeId}><div class="flex items-center gap-0.5 flex-1" data-v-a75cdc6c${_scopeId}><div class="relative" data-v-a75cdc6c${_scopeId}><button type="button" class="${ssrRenderClass([showEmojiPicker.value ? "bg-primary/15 text-primary" : "hover:bg-base-300 bg-base-100/80", "h-7 w-8 rounded-md border-0 cursor-pointer text-sm flex items-center justify-center transition-colors active:scale-95"])}" data-v-a75cdc6c${_scopeId}> 😀 </button>`);
            if (showEmojiPicker.value) {
              _push2(`<div class="fixed inset-0 z-10" data-v-a75cdc6c${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (showEmojiPicker.value) {
              _push2(`<div class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 max-h-52 overflow-y-auto p-2 space-y-2" data-v-a75cdc6c${_scopeId}><!--[-->`);
              ssrRenderList(emojiCategories, (cat) => {
                _push2(`<div data-v-a75cdc6c${_scopeId}><div class="text-[9px] font-bold text-base-content/40 uppercase mb-1" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(cat.label)}</div><div class="flex flex-wrap gap-0.5" data-v-a75cdc6c${_scopeId}><!--[-->`);
                ssrRenderList(cat.emojis, (e) => {
                  _push2(`<button type="button" class="w-8 h-8 rounded-lg hover:bg-base-200 border-0 bg-transparent cursor-pointer text-base flex items-center justify-center transition-colors active:scale-90" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(e)}</button>`);
                });
                _push2(`<!--]--></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="relative" data-v-a75cdc6c${_scopeId}><button type="button" class="${ssrRenderClass([showBulletPicker.value ? "bg-primary/15 text-primary" : "hover:bg-base-300 bg-base-100/80 text-base-content/60", "h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95"])}" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" data-v-a75cdc6c${_scopeId}></path><circle cx="2" cy="6" r="1" fill="currentColor" data-v-a75cdc6c${_scopeId}></circle><circle cx="2" cy="12" r="1" fill="currentColor" data-v-a75cdc6c${_scopeId}></circle><circle cx="2" cy="18" r="1" fill="currentColor" data-v-a75cdc6c${_scopeId}></circle></svg><svg class="w-2 h-2 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" data-v-a75cdc6c${_scopeId}></path></svg></button>`);
            if (showBulletPicker.value) {
              _push2(`<div class="fixed inset-0 z-10" data-v-a75cdc6c${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (showBulletPicker.value) {
              _push2(`<div class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-40 py-1" data-v-a75cdc6c${_scopeId}><!--[-->`);
              ssrRenderList(bulletStyles, (b) => {
                _push2(`<button type="button" class="w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2 transition-colors" data-v-a75cdc6c${_scopeId}><span class="w-5 text-center font-bold text-base-content font-mono" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(b.preview)}</span><span class="text-base-content/70" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(b.label)}</span></button>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="relative" data-v-a75cdc6c${_scopeId}><button type="button" class="${ssrRenderClass([showLinePicker.value ? "bg-primary/15 text-primary" : "hover:bg-base-300 bg-base-100/80 text-base-content/60", "h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95"])}" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" d="M3 12h18" data-v-a75cdc6c${_scopeId}></path></svg><svg class="w-2 h-2 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" data-v-a75cdc6c${_scopeId}></path></svg></button>`);
            if (showLinePicker.value) {
              _push2(`<div class="fixed inset-0 z-10" data-v-a75cdc6c${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (showLinePicker.value) {
              _push2(`<div class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-52 py-1" data-v-a75cdc6c${_scopeId}><!--[-->`);
              ssrRenderList(lineStyles, (l) => {
                _push2(`<button type="button" class="w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2 transition-colors" data-v-a75cdc6c${_scopeId}><span class="text-[10px] text-base-content/50 font-mono truncate w-20" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(l.preview)}</span><span class="text-base-content/70" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(l.label)}</span></button>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="w-px h-5 bg-base-300" data-v-a75cdc6c${_scopeId}></div><div class="flex items-center gap-0.5" data-v-a75cdc6c${_scopeId}><button type="button" title="ลดย่อหน้า" class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M3 8h18M9 12h12M9 16h12M3 12l4 2-4 2V12z" transform="scale(-1,1) translate(-24,0)" data-v-a75cdc6c${_scopeId}></path></svg></button><button type="button" title="เพิ่มย่อหน้า" class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M3 8h18M9 12h12M9 16h12M3 12l4 2-4 2V12z" data-v-a75cdc6c${_scopeId}></path></svg></button></div><div class="w-px h-5 bg-base-300" data-v-a75cdc6c${_scopeId}></div><div class="flex items-center gap-0.5" data-v-a75cdc6c${_scopeId}><button type="button" title="ชิดซ้าย" class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M3 10h12M3 14h18M3 18h12" data-v-a75cdc6c${_scopeId}></path></svg></button><button type="button" title="กึ่งกลาง" class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M6 10h12M3 14h18M6 18h12" data-v-a75cdc6c${_scopeId}></path></svg></button><button type="button" title="ชิดขวา" class="w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95" data-v-a75cdc6c${_scopeId}><svg class="w-3.5 h-3.5 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-a75cdc6c${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M9 10h12M3 14h18M9 18h12" data-v-a75cdc6c${_scopeId}></path></svg></button></div></div><textarea rows="5" class="textarea textarea-bordered textarea-sm w-full text-xs leading-relaxed font-mono" placeholder="เช่น
🏸 ลูกใช้ RSL เบอร์ 5
👟 ห้ามใส่รองเท้าตีนตุ๊กแก
⏰ มาก่อนเวลา 15 นาที
💰 จ่ายก่อนเล่น" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(form.value.notes)}</textarea><div class="flex justify-end" data-v-a75cdc6c${_scopeId}>`);
            if (!showSaveNoteTemplate.value) {
              _push2(`<button type="button"${ssrIncludeBooleanAttr(!((_a = form.value.notes) == null ? void 0 : _a.trim())) ? " disabled" : ""} class="text-[10px] font-medium text-primary/70 hover:text-primary border-0 bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors" data-v-a75cdc6c${_scopeId}> 💾 บันทึกเป็น Template </button>`);
            } else {
              _push2(`<div class="flex items-center gap-1.5 w-full sm:w-auto" data-v-a75cdc6c${_scopeId}><input type="text"${ssrRenderAttr("value", noteTemplateName.value)} placeholder="ตั้งชื่อ template..." class="input input-bordered input-xs text-xs flex-1 sm:w-40" data-v-a75cdc6c${_scopeId}><button type="button" class="text-[10px] px-2 py-1 rounded-lg bg-base-200 text-base-content/60 border-0 cursor-pointer hover:bg-base-300 transition-colors" data-v-a75cdc6c${_scopeId}>ยกเลิก</button><button type="button"${ssrIncludeBooleanAttr(!noteTemplateName.value.trim()) ? " disabled" : ""} class="text-[10px] px-2 py-1 rounded-lg bg-primary text-white border-0 cursor-pointer disabled:opacity-30 hover:bg-primary/80 transition-colors font-bold" data-v-a75cdc6c${_scopeId}>💾 บันทึก</button></div>`);
            }
            _push2(`</div></div>`);
            if (templateMembers.value.length > 0) {
              _push2(`<div class="border-t border-base-200 pt-3 space-y-2" data-v-a75cdc6c${_scopeId}><div class="flex items-center justify-between" data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60" data-v-a75cdc6c${_scopeId}>👥 เลือกผู้เล่นประจำ (${ssrInterpolate(templateSelectedCount.value)}/${ssrInterpolate(templateMembers.value.length)})</label><button type="button" class="text-[10px] text-primary font-semibold border-0 bg-transparent cursor-pointer" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(templateMembers.value.every((m) => m.selected) ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด")}</button></div><div class="space-y-1" data-v-a75cdc6c${_scopeId}><!--[-->`);
              ssrRenderList(templateMembers.value, (m) => {
                _push2(`<div class="${ssrRenderClass([m.selected ? "border-primary/40 bg-primary/5" : "border-base-300 bg-base-100 opacity-50", "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all"])}" data-v-a75cdc6c${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(m.selected) ? " checked" : ""} class="checkbox checkbox-primary checkbox-xs" data-v-a75cdc6c${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  src: m.avatar,
                  name: m.name,
                  size: "xs",
                  rounded: "full"
                }, null, _parent2, _scopeId));
                _push2(`<div class="flex-1 min-w-0" data-v-a75cdc6c${_scopeId}><span class="text-xs font-medium text-base-content truncate" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(m.name)}</span>`);
                if (m.role === "Host") {
                  _push2(`<span class="ml-1 text-[9px] text-primary font-bold" data-v-a75cdc6c${_scopeId}>HOST</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div><p class="text-[10px] text-base-content/40 m-0" data-v-a75cdc6c${_scopeId}>* ผู้เล่นที่เลือกจะถูกเพิ่มเข้าก๊วนอัตโนมัติ</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="border-t border-base-200 pt-3 space-y-3" data-v-a75cdc6c${_scopeId}><div class="flex gap-1.5" data-v-a75cdc6c${_scopeId}><button type="button" class="${ssrRenderClass([form.value.has_booking ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300", "flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"])}" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.hasBooking"))}</button><button type="button" class="${ssrRenderClass([!form.value.has_booking ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300", "flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"])}" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.noBooking"))}</button></div>`);
            if (!form.value.has_booking) {
              _push2(`<div class="grid grid-cols-2 gap-3" data-v-a75cdc6c${_scopeId}><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.startTime"))}</label><select class="${ssrRenderClass([{ "select-error": formErrors.value.start_time }, "select select-bordered select-sm w-full"])}" data-v-a75cdc6c${_scopeId}><!--[-->`);
              ssrRenderList(unref(timeOptions), (opt) => {
                _push2(`<option${ssrRenderAttr("value", opt.name)} data-v-a75cdc6c${ssrIncludeBooleanAttr(Array.isArray(form.value.start_time) ? ssrLooseContain(form.value.start_time, opt.name) : ssrLooseEqual(form.value.start_time, opt.name)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(opt.name)}</option>`);
              });
              _push2(`<!--]--></select>`);
              if (formErrors.value.start_time) {
                _push2(`<p class="text-[10px] text-error m-0 mt-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(formErrors.value.start_time)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div data-v-a75cdc6c${_scopeId}><label class="text-xs font-semibold text-base-content/60 mb-1 block" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.endTime"))}</label><select class="${ssrRenderClass([{ "select-error": formErrors.value.end_time }, "select select-bordered select-sm w-full"])}" data-v-a75cdc6c${_scopeId}><!--[-->`);
              ssrRenderList(unref(timeOptions), (opt) => {
                _push2(`<option${ssrRenderAttr("value", opt.name)} data-v-a75cdc6c${ssrIncludeBooleanAttr(Array.isArray(form.value.end_time) ? ssrLooseContain(form.value.end_time, opt.name) : ssrLooseEqual(form.value.end_time, opt.name)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(opt.name)}</option>`);
              });
              _push2(`<!--]--></select></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (form.value.has_booking) {
              _push2(`<!--[--><!--[-->`);
              ssrRenderList(form.value.court_bookings, (booking, index) => {
                _push2(`<div class="bg-base-200/50 rounded-xl p-3 space-y-2" data-v-a75cdc6c${_scopeId}><div class="flex items-center justify-between" data-v-a75cdc6c${_scopeId}><span class="text-[10px] font-bold text-base-content/40 uppercase" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.courtBookings"))} #${ssrInterpolate(index + 1)}</span>`);
                if (form.value.court_bookings.length > 1) {
                  _push2(`<button type="button" class="text-[10px] text-error font-semibold border-0 bg-transparent cursor-pointer hover:underline" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.removeCourt"))}</button>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="grid grid-cols-3 gap-2" data-v-a75cdc6c${_scopeId}><div data-v-a75cdc6c${_scopeId}><label class="text-[10px] text-base-content/50 block mb-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.courtNumber"))}</label><select class="${ssrRenderClass([{ "select-error": formErrors.value[`booking_${index}_court`] }, "select select-bordered select-xs w-full"])}" data-v-a75cdc6c${_scopeId}><option${ssrRenderAttr("value", null)} disabled data-v-a75cdc6c${ssrIncludeBooleanAttr(Array.isArray(booking.court_field_number) ? ssrLooseContain(booking.court_field_number, null) : ssrLooseEqual(booking.court_field_number, null)) ? " selected" : ""}${_scopeId}>เลือก</option><!--[-->`);
                ssrRenderList(12, (i) => {
                  _push2(`<option${ssrRenderAttr("value", i)}${ssrIncludeBooleanAttr(usedCourtNumbers.value.includes(i) && booking.court_field_number !== i) ? " disabled" : ""} data-v-a75cdc6c${ssrIncludeBooleanAttr(Array.isArray(booking.court_field_number) ? ssrLooseContain(booking.court_field_number, i) : ssrLooseEqual(booking.court_field_number, i)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(i)}</option>`);
                });
                _push2(`<!--]--></select>`);
                if (formErrors.value[`booking_${index}_court`]) {
                  _push2(`<p class="text-[9px] text-error m-0 mt-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(formErrors.value[`booking_${index}_court`])}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div data-v-a75cdc6c${_scopeId}><label class="text-[10px] text-base-content/50 block mb-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.startTime"))}</label><select class="${ssrRenderClass([{ "select-error": formErrors.value[`booking_${index}_start`] }, "select select-bordered select-xs w-full"])}" data-v-a75cdc6c${_scopeId}><!--[-->`);
                ssrRenderList(unref(timeOptions), (opt) => {
                  _push2(`<option${ssrRenderAttr("value", opt.name)} data-v-a75cdc6c${ssrIncludeBooleanAttr(Array.isArray(booking.start_time) ? ssrLooseContain(booking.start_time, opt.name) : ssrLooseEqual(booking.start_time, opt.name)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(opt.name)}</option>`);
                });
                _push2(`<!--]--></select>`);
                if (formErrors.value[`booking_${index}_start`]) {
                  _push2(`<p class="text-[9px] text-error m-0 mt-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(formErrors.value[`booking_${index}_start`])}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div data-v-a75cdc6c${_scopeId}><label class="text-[10px] text-base-content/50 block mb-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("createParty.endTime"))}</label><select class="${ssrRenderClass([{ "select-error": formErrors.value[`booking_${index}_end`] }, "select select-bordered select-xs w-full"])}" data-v-a75cdc6c${_scopeId}><!--[-->`);
                ssrRenderList(filteredEndTimeOptions(index), (opt) => {
                  _push2(`<option${ssrRenderAttr("value", opt.name)} data-v-a75cdc6c${ssrIncludeBooleanAttr(Array.isArray(booking.end_time) ? ssrLooseContain(booking.end_time, opt.name) : ssrLooseEqual(booking.end_time, opt.name)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(opt.name)}</option>`);
                });
                _push2(`<!--]--></select>`);
                if (formErrors.value[`booking_${index}_end`]) {
                  _push2(`<p class="text-[9px] text-error m-0 mt-0.5" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(formErrors.value[`booking_${index}_end`])}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div></div>`);
              });
              _push2(`<!--]--><button type="button" class="w-full py-1.5 rounded-lg border border-dashed border-base-300 bg-transparent text-xs font-medium text-base-content/40 cursor-pointer hover:border-primary/50 hover:text-primary transition-colors" data-v-a75cdc6c${_scopeId}> + ${ssrInterpolate(unref(t)("createParty.addCourt"))}</button>`);
              if (bookingSummary.value) {
                _push2(`<div class="bg-primary/5 rounded-xl p-3 mt-2 space-y-1.5" data-v-a75cdc6c${_scopeId}><div class="flex items-center justify-between" data-v-a75cdc6c${_scopeId}><span class="text-[10px] font-bold text-primary uppercase tracking-wider" data-v-a75cdc6c${_scopeId}>📋 สรุปการจอง</span><span class="text-xs font-bold text-base-content" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(bookingSummary.value.overallStart)} - ${ssrInterpolate(bookingSummary.value.overallEnd)}</span></div><!--[-->`);
                ssrRenderList(bookingSummary.value.slots, (slot, i) => {
                  _push2(`<div class="flex items-center justify-between bg-base-100/50 rounded-lg px-2.5 py-1.5" data-v-a75cdc6c${_scopeId}><span class="text-[11px] font-medium text-base-content/70" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(slot.time)}</span><div class="flex items-center gap-1.5" data-v-a75cdc6c${_scopeId}><span class="text-[11px] font-bold text-primary" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(slot.courtCount)} คอร์ท</span><span class="text-[10px] text-base-content/40" data-v-a75cdc6c${_scopeId}>(${ssrInterpolate(slot.courts.join(", "))})</span></div></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex gap-2 pt-2" data-v-a75cdc6c${_scopeId}><button type="button" class="flex-1 h-10 rounded-xl text-sm font-medium bg-base-200 text-base-content/80 border-0 cursor-pointer hover:bg-base-300 transition-colors" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(unref(t)("common.cancel"))}</button><button type="submit" class="flex-1 h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98]" data-v-a75cdc6c${_scopeId}>${ssrInterpolate(isEditing.value ? unref(t)("common.save") : unref(t)("createParty.title"))}</button></div></form></div><form method="dialog" class="modal-backdrop" data-v-a75cdc6c${_scopeId}><button data-v-a75cdc6c${_scopeId}>close</button></form></dialog></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-lg font-bold text-base-content m-0" }, toDisplayString(unref(t)("partyList.title")), 1),
                    createVNode("p", { class: "text-sm text-base-content/60 m-0 mt-0.5" }, toDisplayString(unref(t)("partyList.count", { count: filteredParties.value.length })), 1)
                  ]),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("button", {
                      onClick: ($event) => reloadPage(),
                      class: "w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer"
                    }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "w-4 h-4",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        })
                      ]))
                    ], 8, ["onClick"]),
                    createVNode("button", {
                      onClick: ($event) => openCreateDialog(),
                      class: "h-9 px-4 flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-medium border-0 cursor-pointer transition-colors active:scale-[0.98]"
                    }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "w-3 h-3",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        "stroke-width": "2"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M12 4v16m8-8H4"
                        })
                      ])),
                      createVNode("span", null, toDisplayString(unref(t)("partyList.createParty")), 1)
                    ], 8, ["onClick"])
                  ])
                ]),
                filteredParties.value.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(paginatedParties.value, (party) => {
                    var _a2, _b2, _c, _d;
                    return openBlock(), createBlock("div", {
                      key: party.id,
                      class: "badminton-card bg-base-100 rounded-xl border border-base-300 overflow-hidden"
                    }, [
                      createVNode("div", {
                        class: ["h-1", statusAccentColor(party.status)]
                      }, null, 2),
                      createVNode("div", { class: "flex" }, [
                        createVNode("div", { class: "w-20 shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center" }, [
                          createVNode("span", { class: "text-3xl" }, "🏸")
                        ]),
                        createVNode("div", { class: "flex-1 min-w-0 px-3 py-2" }, [
                          createVNode("div", { class: "flex items-center justify-between gap-1 mb-0.5" }, [
                            createVNode("div", { class: "flex-1 min-w-0 overflow-hidden" }, [
                              createVNode("h3", { class: "text-[12px] font-semibold text-base-content m-0 leading-tight whitespace-nowrap party-name-scroll" }, toDisplayString(party.name || ((_a2 = party.court) == null ? void 0 : _a2.name) || "Party"), 1)
                            ]),
                            createVNode("span", {
                              class: ["shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold", party.members_count >= party.max_players ? "bg-error/15 text-error" : "bg-success/15 text-success"]
                            }, toDisplayString(party.members_count) + "/" + toDisplayString(party.max_players), 3)
                          ]),
                          createVNode("div", { class: "flex items-center gap-3 text-[11px] text-base-content/60 mb-1.5" }, [
                            createVNode("span", { class: "flex items-center gap-0.5" }, "🏟️ " + toDisplayString(((_b2 = party.court) == null ? void 0 : _b2.name) || "-"), 1)
                          ]),
                          createVNode("div", { class: "flex items-center gap-3 text-[11px] text-base-content/60 mb-1.5" }, [
                            createVNode("span", { class: "flex items-center gap-0.5" }, "📅 " + toDisplayString(formatDisplayDate(party.play_date)), 1),
                            createVNode("span", { class: "flex items-center gap-0.5" }, "⏰ " + toDisplayString(formatTime(party.start_time)), 1),
                            createVNode("span", {
                              class: ["px-1 py-px rounded text-[10px] font-bold", party.default_game_type === "double" ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"]
                            }, toDisplayString(party.default_game_type === "double" ? "1v1" : "2v2"), 3),
                            party.is_private ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-base-content/40"
                            }, "🔒")) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex items-center justify-between" }, [
                            createVNode("div", { class: "flex items-center" }, [
                              createVNode("div", { class: "flex -space-x-1.5" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList((_c = party.members) == null ? void 0 : _c.slice(0, 5), (member) => {
                                  var _a3, _b3;
                                  return openBlock(), createBlock(_sfc_main$2, {
                                    key: member.id,
                                    src: (_a3 = member.user) == null ? void 0 : _a3.avatar,
                                    name: (_b3 = member.user) == null ? void 0 : _b3.name,
                                    size: "xs",
                                    rounded: "full",
                                    class: "border border-base-100"
                                  }, null, 8, ["src", "name"]);
                                }), 128))
                              ]),
                              ((_d = party.members) == null ? void 0 : _d.length) > 5 ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "ml-1 text-[9px] text-base-content/40"
                              }, "+" + toDisplayString(party.members.length - 5), 1)) : createCommentVNode("", true)
                            ]),
                            !isUserInParty(party.members) ? (openBlock(), createBlock("button", {
                              key: 0,
                              onClick: ($event) => joinParty(party.id),
                              class: "h-8 px-4 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-3.5 h-3.5",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                })
                              ])),
                              createTextVNode(" " + toDisplayString(unref(t)("common.join")), 1)
                            ], 8, ["onClick"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                              isOwner(party) ? (openBlock(), createBlock("button", {
                                key: 0,
                                onClick: withModifiers(($event) => openEditDialog(party), ["stop"]),
                                class: "h-6 px-2 rounded-md text-[10px] font-semibold border-0 cursor-pointer transition-all active:scale-[0.97] bg-base-200 text-base-content/60 hover:bg-base-300 flex items-center gap-0.5"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-2.5 h-2.5",
                                  fill: "none",
                                  stroke: "currentColor",
                                  "stroke-width": "2",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  })
                                ]))
                              ], 8, ["onClick"])) : createCommentVNode("", true),
                              createVNode("button", {
                                onClick: ($event) => enterParty(party.id),
                                class: "h-8 px-4 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary text-white hover:bg-primary/80 flex items-center gap-1"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-3.5 h-3.5",
                                  fill: "none",
                                  stroke: "currentColor",
                                  "stroke-width": "2",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                  })
                                ])),
                                createTextVNode(" " + toDisplayString(unref(t)("common.enter")), 1)
                              ], 8, ["onClick"])
                            ], 64))
                          ])
                        ])
                      ])
                    ]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center py-16"
                }, [
                  createVNode("div", { class: "w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4" }, [
                    createVNode("span", { class: "text-3xl" }, "🏸")
                  ]),
                  createVNode("h3", { class: "text-lg font-semibold text-base-content m-0" }, toDisplayString(unref(t)("partyList.noParties")), 1),
                  createVNode("p", { class: "text-sm text-base-content/60 mt-1 m-0" }, toDisplayString(unref(t)("partyList.createFirst")), 1),
                  createVNode("button", {
                    onClick: ($event) => openCreateDialog(),
                    class: "mt-4 h-10 px-6 rounded-xl bg-primary hover:bg-primary/80 text-white text-sm font-medium border-0 cursor-pointer transition-colors"
                  }, [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      class: "w-3 h-3 inline mr-2",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      "stroke-width": "2"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M12 4v16m8-8H4"
                      })
                    ])),
                    createTextVNode(" Create Party ")
                  ], 8, ["onClick"])
                ])),
                totalPages.value > 1 ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "flex items-center justify-center gap-2 pt-2 pb-4"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(totalPages.value, (p) => {
                    return openBlock(), createBlock("button", {
                      key: p,
                      onClick: ($event) => currentPage.value = p,
                      class: ["w-9 h-9 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors", currentPage.value === p ? "bg-primary text-white" : "bg-base-100 text-base-content/70 border border-base-300 hover:bg-base-200"]
                    }, toDisplayString(p), 11, ["onClick"]);
                  }), 128))
                ])) : createCommentVNode("", true),
                createVNode("dialog", {
                  class: ["modal", { "modal-open": showDialog.value }]
                }, [
                  createVNode("div", { class: "modal-box w-full max-w-lg p-0" }, [
                    createVNode("div", { class: "flex items-center justify-between px-5 pt-5 pb-3" }, [
                      createVNode("h3", { class: "text-base font-bold text-base-content m-0" }, "🏸 " + toDisplayString(isEditing.value ? unref(t)("createParty.editTitle") : unref(t)("createParty.title")), 1),
                      createVNode("button", {
                        onClick: ($event) => showDialog.value = false,
                        class: "w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors"
                      }, [
                        createVNode("span", { class: "text-base-content/60 text-sm" }, "✕")
                      ], 8, ["onClick"])
                    ]),
                    createVNode("form", {
                      onSubmit: withModifiers(createParty, ["prevent"]),
                      class: "px-5 pb-5 space-y-4 overflow-y-auto max-h-[75vh]"
                    }, [
                      !isEditing.value && myPastParties.value.length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1.5 block" }, "📋 ดึงจากก๊วนเก่า"),
                        createVNode("div", { class: "flex gap-1.5 overflow-x-auto pb-1" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(myPastParties.value, (pp) => {
                            var _a2;
                            return openBlock(), createBlock("button", {
                              key: pp.id,
                              type: "button",
                              onClick: ($event) => loadFromTemplate(pp),
                              class: "shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-base-300 bg-base-200 text-base-content/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary cursor-pointer transition-all whitespace-nowrap"
                            }, toDisplayString(pp.name || ((_a2 = pp.court) == null ? void 0 : _a2.name) || `#${pp.id}`), 9, ["onClick"]);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", { class: "grid grid-cols-3 gap-3" }, [
                          createVNode("div", { class: "col-span-2" }, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.partyName")), 1),
                            withDirectives(createVNode("input", {
                              type: "text",
                              "onUpdate:modelValue": ($event) => form.value.name = $event,
                              placeholder: unref(t)("createParty.partyNamePlaceholder"),
                              class: "input input-bordered input-sm w-full"
                            }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                              [vModelText, form.value.name]
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.gameType")), 1),
                            createVNode("div", { class: "flex gap-1 p-0.5 bg-base-200 rounded-lg" }, [
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => form.value.default_game_type = "double",
                                class: ["flex-1 py-1 rounded-md text-[10px] font-bold border-0 cursor-pointer transition-all text-center", form.value.default_game_type === "double" ? "bg-primary text-white" : "bg-transparent text-base-content/50"]
                              }, "1v1", 10, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => form.value.default_game_type = "quadruple",
                                class: ["flex-1 py-1 rounded-md text-[10px] font-bold border-0 cursor-pointer transition-all text-center", form.value.default_game_type === "quadruple" ? "bg-primary text-white" : "bg-transparent text-base-content/50"]
                              }, "2v2", 10, ["onClick"])
                            ])
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.playDate")), 1),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            withDirectives(createVNode("input", {
                              type: "date",
                              "onUpdate:modelValue": ($event) => form.value.play_date = $event,
                              class: ["input input-bordered input-sm flex-1", { "input-error": formErrors.value.play_date }]
                            }, null, 10, ["onUpdate:modelValue"]), [
                              [vModelText, form.value.play_date]
                            ]),
                            selectedDayOfWeek.value ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold"
                            }, toDisplayString(selectedDayOfWeek.value), 1)) : createCommentVNode("", true)
                          ]),
                          formErrors.value.play_date ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-[10px] text-error m-0 mt-0.5"
                          }, toDisplayString(formErrors.value.play_date), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.maxPlayers")), 1),
                            withDirectives(createVNode("input", {
                              type: "number",
                              "onUpdate:modelValue": ($event) => form.value.max_players = $event,
                              min: "2",
                              class: "input input-bordered input-sm w-full"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, form.value.max_players]
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.court")), 1),
                            withDirectives(createVNode("select", {
                              "onUpdate:modelValue": ($event) => form.value.court_id = $event,
                              class: ["select select-bordered select-sm w-full", { "select-error": formErrors.value.court_id }]
                            }, [
                              createVNode("option", {
                                value: null,
                                disabled: ""
                              }, toDisplayString(unref(t)("createParty.selectCourt")), 1),
                              (openBlock(true), createBlock(Fragment, null, renderList(courts.value, (court) => {
                                return openBlock(), createBlock("option", {
                                  key: court.id,
                                  value: court.id
                                }, toDisplayString(court.name), 9, ["value"]);
                              }), 128))
                            ], 10, ["onUpdate:modelValue"]), [
                              [vModelSelect, form.value.court_id]
                            ]),
                            formErrors.value.court_id ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-[10px] text-error m-0 mt-0.5"
                            }, toDisplayString(formErrors.value.court_id), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("label", { class: "flex items-center gap-2 cursor-pointer" }, [
                          withDirectives(createVNode("input", {
                            type: "checkbox",
                            "onUpdate:modelValue": ($event) => form.value.is_private = $event,
                            class: "checkbox checkbox-primary checkbox-sm"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelCheckbox, form.value.is_private]
                          ]),
                          createVNode("span", { class: "text-xs font-medium text-base-content/70" }, toDisplayString(unref(t)("createParty.private")), 1)
                        ]),
                        form.value.is_private ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center gap-2 pl-7"
                        }, [
                          createVNode("span", { class: "text-[10px] text-base-content/50" }, "🔢 รหัสเข้าร่วม"),
                          withDirectives(createVNode("input", {
                            type: "text",
                            "onUpdate:modelValue": ($event) => form.value.invite_passcode = $event,
                            maxlength: "4",
                            inputmode: "numeric",
                            pattern: "[0-9]*",
                            placeholder: "0000",
                            class: "input input-bordered input-xs w-20 text-center tracking-widest font-bold"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, form.value.invite_passcode]
                          ])
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "border-t border-base-200 pt-3 space-y-3" }, [
                        createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.costType")), 1),
                        createVNode("div", { class: "flex gap-1.5" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList([{ key: "per_person", label: unref(t)("createParty.costPerPerson") }, { key: "split_equal", label: unref(t)("createParty.costSplitEqual") }, { key: "free", label: unref(t)("createParty.costFree") }], (ct) => {
                            return openBlock(), createBlock("button", {
                              type: "button",
                              key: ct.key,
                              onClick: ($event) => form.value.cost_type = ct.key,
                              class: ["flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all", form.value.cost_type === ct.key ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300"]
                            }, toDisplayString(ct.label), 11, ["onClick"]);
                          }), 128))
                        ]),
                        form.value.cost_type === "per_person" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid grid-cols-2 gap-3"
                        }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.costPerPerson_amount")), 1),
                            withDirectives(createVNode("input", {
                              type: "number",
                              "onUpdate:modelValue": ($event) => form.value.cost_amount = $event,
                              min: "0",
                              step: "1",
                              class: "input input-bordered input-sm w-full",
                              placeholder: "0"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, form.value.cost_amount]
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.shuttlecockCost")), 1),
                            withDirectives(createVNode("input", {
                              type: "number",
                              "onUpdate:modelValue": ($event) => form.value.shuttlecock_cost = $event,
                              min: "0",
                              step: "1",
                              class: "input input-bordered input-sm w-full",
                              placeholder: "0"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, form.value.shuttlecock_cost]
                            ])
                          ])
                        ])) : createCommentVNode("", true),
                        form.value.cost_type === "split_equal" ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "grid grid-cols-2 gap-3"
                        }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.costAmount")), 1),
                            withDirectives(createVNode("input", {
                              type: "number",
                              "onUpdate:modelValue": ($event) => form.value.cost_amount = $event,
                              min: "0",
                              step: "1",
                              class: "input input-bordered input-sm w-full",
                              placeholder: "150"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, form.value.cost_amount]
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.shuttlecockCost")), 1),
                            withDirectives(createVNode("input", {
                              type: "number",
                              "onUpdate:modelValue": ($event) => form.value.shuttlecock_cost = $event,
                              min: "0",
                              step: "1",
                              class: "input input-bordered input-sm w-full",
                              placeholder: "80"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, form.value.shuttlecock_cost]
                            ])
                          ])
                        ])) : createCommentVNode("", true),
                        form.value.cost_type === "split_equal" && form.value.cost_amount && bookingSummary.value ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "bg-primary/5 rounded-lg p-2.5 text-[10px] text-base-content/70 space-y-0.5"
                        }, [
                          createVNode("div", { class: "font-bold text-base-content/80 text-xs mb-1" }, "💰 ตัวอย่างค่าใช้จ่าย"),
                          createVNode("div", null, [
                            createTextVNode("ค่าคอร์ท: " + toDisplayString(form.value.cost_amount) + " ฿/ชม. × " + toDisplayString(bookingSummary.value.totalHours) + " ชม. = ", 1),
                            createVNode("span", { class: "font-bold text-base-content" }, toDisplayString(form.value.cost_amount * bookingSummary.value.totalHours) + " ฿", 1)
                          ]),
                          form.value.shuttlecock_cost ? (openBlock(), createBlock("div", { key: 0 }, "ค่าลูกแบด: " + toDisplayString(form.value.shuttlecock_cost) + " ฿/ลูก × (จำนวนลูกที่ใช้จริง)", 1)) : createCommentVNode("", true),
                          createVNode("div", { class: "text-[9px] text-base-content/40 mt-1" }, "* ยอดรวมจะคำนวณหลังจบ party โดยรวมค่าคอร์ท + ลูกแบดที่ใช้จริง แล้วหารเท่าตามจำนวนผู้เล่น")
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "border-t border-base-200 pt-3 space-y-2" }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("label", { class: "text-xs font-semibold text-base-content/60" }, "📝 หมายเหตุ / กติกา"),
                          createVNode("div", { class: "relative" }, [
                            createVNode("button", {
                              type: "button",
                              onClick: ($event) => {
                                showNoteTemplateMenu.value = !showNoteTemplateMenu.value;
                                confirmingDeleteIdx.value = null;
                              },
                              class: "text-[10px] font-medium text-primary border border-primary/30 bg-primary/5 rounded-lg px-2 py-1 cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1"
                            }, [
                              createTextVNode(" 📋 Template "),
                              noteTemplates.value.length ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "bg-primary text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center font-bold"
                              }, toDisplayString(noteTemplates.value.length), 1)) : createCommentVNode("", true),
                              (openBlock(), createBlock("svg", {
                                class: ["w-3 h-3 transition-transform", { "rotate-180": showNoteTemplateMenu.value }],
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  d: "M19 9l-7 7-7-7"
                                })
                              ], 2))
                            ], 8, ["onClick"]),
                            showNoteTemplateMenu.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "fixed inset-0 z-10",
                              onClick: ($event) => {
                                showNoteTemplateMenu.value = false;
                                confirmingDeleteIdx.value = null;
                              }
                            }, null, 8, ["onClick"])) : createCommentVNode("", true),
                            showNoteTemplateMenu.value ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 py-1 max-h-60 overflow-y-auto"
                            }, [
                              noteTemplates.value.length === 0 ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "px-3 py-4 text-center"
                              }, [
                                createVNode("div", { class: "text-lg mb-1" }, "📋"),
                                createVNode("div", { class: "text-[10px] text-base-content/30" }, "ยังไม่มี template"),
                                createVNode("div", { class: "text-[9px] text-base-content/20 mt-0.5" }, "พิมพ์หมายเหตุแล้วกด 💾 ด้านล่าง")
                              ])) : createCommentVNode("", true),
                              noteTemplates.value.length > 0 ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                                createVNode("div", { class: "px-3 py-1.5 text-[9px] font-bold text-base-content/40 uppercase tracking-wider" }, "เลือก Template"),
                                (openBlock(true), createBlock(Fragment, null, renderList(noteTemplates.value, (tmpl, i) => {
                                  return openBlock(), createBlock("div", {
                                    key: i,
                                    class: "px-3 py-2 hover:bg-base-200 transition-colors"
                                  }, [
                                    confirmingDeleteIdx.value !== i ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "flex items-center gap-2"
                                    }, [
                                      createVNode("div", {
                                        onClick: ($event) => applyNoteTemplate(tmpl),
                                        class: "flex-1 min-w-0 cursor-pointer"
                                      }, [
                                        createVNode("div", { class: "text-xs font-medium text-base-content truncate" }, toDisplayString(tmpl.name), 1),
                                        createVNode("div", { class: "text-[9px] text-base-content/40 truncate leading-tight mt-0.5" }, toDisplayString(tmpl.content.substring(0, 50)) + toDisplayString(tmpl.content.length > 50 ? "..." : ""), 1)
                                      ], 8, ["onClick"]),
                                      createVNode("button", {
                                        type: "button",
                                        onClick: withModifiers(($event) => deleteNoteTemplate(i), ["stop"]),
                                        class: "shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] text-base-content/30 hover:text-error hover:bg-error/10 border-0 bg-transparent cursor-pointer transition-all"
                                      }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "w-3.5 h-3.5",
                                          fill: "none",
                                          stroke: "currentColor",
                                          "stroke-width": "2",
                                          viewBox: "0 0 24 24"
                                        }, [
                                          createVNode("path", {
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          })
                                        ]))
                                      ], 8, ["onClick"])
                                    ])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "flex items-center gap-2"
                                    }, [
                                      createVNode("div", { class: "flex-1 text-[10px] text-error font-medium" }, 'ลบ "' + toDisplayString(tmpl.name) + '" ?', 1),
                                      createVNode("button", {
                                        type: "button",
                                        onClick: withModifiers(($event) => confirmingDeleteIdx.value = null, ["stop"]),
                                        class: "px-2 py-1 text-[10px] rounded-md bg-base-200 text-base-content/60 border-0 cursor-pointer hover:bg-base-300 transition-colors"
                                      }, "ยกเลิก", 8, ["onClick"]),
                                      createVNode("button", {
                                        type: "button",
                                        onClick: withModifiers(($event) => deleteNoteTemplate(i), ["stop"]),
                                        class: "px-2 py-1 text-[10px] rounded-md bg-error text-white border-0 cursor-pointer hover:bg-error/80 transition-colors font-bold"
                                      }, "ลบ", 8, ["onClick"])
                                    ]))
                                  ]);
                                }), 128))
                              ], 64)) : createCommentVNode("", true)
                            ])) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "flex items-center gap-0.5 w-full bg-base-200/50 rounded-lg p-1" }, [
                          createVNode("div", { class: "flex items-center gap-0.5 flex-1" }, [
                            createVNode("div", { class: "relative" }, [
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => toggleToolbarPopup("emoji"),
                                class: ["h-7 w-8 rounded-md border-0 cursor-pointer text-sm flex items-center justify-center transition-colors active:scale-95", showEmojiPicker.value ? "bg-primary/15 text-primary" : "hover:bg-base-300 bg-base-100/80"]
                              }, " 😀 ", 10, ["onClick"]),
                              showEmojiPicker.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "fixed inset-0 z-10",
                                onClick: ($event) => showEmojiPicker.value = false
                              }, null, 8, ["onClick"])) : createCommentVNode("", true),
                              showEmojiPicker.value ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 max-h-52 overflow-y-auto p-2 space-y-2"
                              }, [
                                (openBlock(), createBlock(Fragment, null, renderList(emojiCategories, (cat) => {
                                  return createVNode("div", {
                                    key: cat.label
                                  }, [
                                    createVNode("div", { class: "text-[9px] font-bold text-base-content/40 uppercase mb-1" }, toDisplayString(cat.label), 1),
                                    createVNode("div", { class: "flex flex-wrap gap-0.5" }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(cat.emojis, (e) => {
                                        return openBlock(), createBlock("button", {
                                          type: "button",
                                          key: e,
                                          onClick: ($event) => {
                                            insertAtCursor(e + " ");
                                            showEmojiPicker.value = false;
                                          },
                                          class: "w-8 h-8 rounded-lg hover:bg-base-200 border-0 bg-transparent cursor-pointer text-base flex items-center justify-center transition-colors active:scale-90"
                                        }, toDisplayString(e), 9, ["onClick"]);
                                      }), 128))
                                    ])
                                  ]);
                                }), 64))
                              ])) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "relative" }, [
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => toggleToolbarPopup("bullet"),
                                class: ["h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95", showBulletPicker.value ? "bg-primary/15 text-primary" : "hover:bg-base-300 bg-base-100/80 text-base-content/60"]
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-3.5 h-3.5",
                                  fill: "none",
                                  stroke: "currentColor",
                                  "stroke-width": "2",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M4 6h16M4 12h16M4 18h16"
                                  }),
                                  createVNode("circle", {
                                    cx: "2",
                                    cy: "6",
                                    r: "1",
                                    fill: "currentColor"
                                  }),
                                  createVNode("circle", {
                                    cx: "2",
                                    cy: "12",
                                    r: "1",
                                    fill: "currentColor"
                                  }),
                                  createVNode("circle", {
                                    cx: "2",
                                    cy: "18",
                                    r: "1",
                                    fill: "currentColor"
                                  })
                                ])),
                                (openBlock(), createBlock("svg", {
                                  class: "w-2 h-2 text-base-content/30",
                                  fill: "none",
                                  stroke: "currentColor",
                                  "stroke-width": "2.5",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M19 9l-7 7-7-7"
                                  })
                                ]))
                              ], 10, ["onClick"]),
                              showBulletPicker.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "fixed inset-0 z-10",
                                onClick: ($event) => showBulletPicker.value = false
                              }, null, 8, ["onClick"])) : createCommentVNode("", true),
                              showBulletPicker.value ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-40 py-1"
                              }, [
                                (openBlock(), createBlock(Fragment, null, renderList(bulletStyles, (b) => {
                                  return createVNode("button", {
                                    type: "button",
                                    key: b.label,
                                    onClick: ($event) => insertBulletStyle(b),
                                    class: "w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2 transition-colors"
                                  }, [
                                    createVNode("span", { class: "w-5 text-center font-bold text-base-content font-mono" }, toDisplayString(b.preview), 1),
                                    createVNode("span", { class: "text-base-content/70" }, toDisplayString(b.label), 1)
                                  ], 8, ["onClick"]);
                                }), 64))
                              ])) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "relative" }, [
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => toggleToolbarPopup("line"),
                                class: ["h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95", showLinePicker.value ? "bg-primary/15 text-primary" : "hover:bg-base-300 bg-base-100/80 text-base-content/60"]
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-3.5 h-3.5",
                                  fill: "none",
                                  stroke: "currentColor",
                                  "stroke-width": "2",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    d: "M3 12h18"
                                  })
                                ])),
                                (openBlock(), createBlock("svg", {
                                  class: "w-2 h-2 text-base-content/30",
                                  fill: "none",
                                  stroke: "currentColor",
                                  "stroke-width": "2.5",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M19 9l-7 7-7-7"
                                  })
                                ]))
                              ], 10, ["onClick"]),
                              showLinePicker.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "fixed inset-0 z-10",
                                onClick: ($event) => showLinePicker.value = false
                              }, null, 8, ["onClick"])) : createCommentVNode("", true),
                              showLinePicker.value ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-52 py-1"
                              }, [
                                (openBlock(), createBlock(Fragment, null, renderList(lineStyles, (l) => {
                                  return createVNode("button", {
                                    type: "button",
                                    key: l.label,
                                    onClick: ($event) => insertLineStyle(l),
                                    class: "w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2 transition-colors"
                                  }, [
                                    createVNode("span", { class: "text-[10px] text-base-content/50 font-mono truncate w-20" }, toDisplayString(l.preview), 1),
                                    createVNode("span", { class: "text-base-content/70" }, toDisplayString(l.label), 1)
                                  ], 8, ["onClick"]);
                                }), 64))
                              ])) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("div", { class: "w-px h-5 bg-base-300" }),
                          createVNode("div", { class: "flex items-center gap-0.5" }, [
                            createVNode("button", {
                              type: "button",
                              onClick: outdentLines,
                              title: "ลดย่อหน้า",
                              class: "w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-3.5 h-3.5 text-base-content/60",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  d: "M3 4h18M3 8h18M9 12h12M9 16h12M3 12l4 2-4 2V12z",
                                  transform: "scale(-1,1) translate(-24,0)"
                                })
                              ]))
                            ]),
                            createVNode("button", {
                              type: "button",
                              onClick: indentLines,
                              title: "เพิ่มย่อหน้า",
                              class: "w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-3.5 h-3.5 text-base-content/60",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  d: "M3 4h18M3 8h18M9 12h12M9 16h12M3 12l4 2-4 2V12z"
                                })
                              ]))
                            ])
                          ]),
                          createVNode("div", { class: "w-px h-5 bg-base-300" }),
                          createVNode("div", { class: "flex items-center gap-0.5" }, [
                            createVNode("button", {
                              type: "button",
                              onClick: ($event) => alignLines("left"),
                              title: "ชิดซ้าย",
                              class: "w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-3.5 h-3.5 text-base-content/60",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  d: "M3 6h18M3 10h12M3 14h18M3 18h12"
                                })
                              ]))
                            ], 8, ["onClick"]),
                            createVNode("button", {
                              type: "button",
                              onClick: ($event) => alignLines("center"),
                              title: "กึ่งกลาง",
                              class: "w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-3.5 h-3.5 text-base-content/60",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  d: "M3 6h18M6 10h12M3 14h18M6 18h12"
                                })
                              ]))
                            ], 8, ["onClick"]),
                            createVNode("button", {
                              type: "button",
                              onClick: ($event) => alignLines("right"),
                              title: "ชิดขวา",
                              class: "w-7 h-7 rounded-md hover:bg-base-300 bg-base-100/80 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-3.5 h-3.5 text-base-content/60",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "2",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  d: "M3 6h18M9 10h12M3 14h18M9 18h12"
                                })
                              ]))
                            ], 8, ["onClick"])
                          ])
                        ]),
                        withDirectives(createVNode("textarea", {
                          ref_key: "notesTextarea",
                          ref: notesTextarea,
                          "onUpdate:modelValue": ($event) => form.value.notes = $event,
                          rows: "5",
                          class: "textarea textarea-bordered textarea-sm w-full text-xs leading-relaxed font-mono",
                          placeholder: "เช่น\n🏸 ลูกใช้ RSL เบอร์ 5\n👟 ห้ามใส่รองเท้าตีนตุ๊กแก\n⏰ มาก่อนเวลา 15 นาที\n💰 จ่ายก่อนเล่น"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, form.value.notes]
                        ]),
                        createVNode("div", { class: "flex justify-end" }, [
                          !showSaveNoteTemplate.value ? (openBlock(), createBlock("button", {
                            key: 0,
                            type: "button",
                            onClick: ($event) => showSaveNoteTemplate.value = true,
                            disabled: !((_b = form.value.notes) == null ? void 0 : _b.trim()),
                            class: "text-[10px] font-medium text-primary/70 hover:text-primary border-0 bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                          }, " 💾 บันทึกเป็น Template ", 8, ["onClick", "disabled"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex items-center gap-1.5 w-full sm:w-auto"
                          }, [
                            withDirectives(createVNode("input", {
                              type: "text",
                              "onUpdate:modelValue": ($event) => noteTemplateName.value = $event,
                              placeholder: "ตั้งชื่อ template...",
                              class: "input input-bordered input-xs text-xs flex-1 sm:w-40",
                              onKeyup: withKeys(saveCurrentAsNoteTemplate, ["enter"])
                            }, null, 40, ["onUpdate:modelValue"]), [
                              [vModelText, noteTemplateName.value]
                            ]),
                            createVNode("button", {
                              type: "button",
                              onClick: ($event) => {
                                showSaveNoteTemplate.value = false;
                                noteTemplateName.value = "";
                              },
                              class: "text-[10px] px-2 py-1 rounded-lg bg-base-200 text-base-content/60 border-0 cursor-pointer hover:bg-base-300 transition-colors"
                            }, "ยกเลิก", 8, ["onClick"]),
                            createVNode("button", {
                              type: "button",
                              onClick: saveCurrentAsNoteTemplate,
                              disabled: !noteTemplateName.value.trim(),
                              class: "text-[10px] px-2 py-1 rounded-lg bg-primary text-white border-0 cursor-pointer disabled:opacity-30 hover:bg-primary/80 transition-colors font-bold"
                            }, "💾 บันทึก", 8, ["disabled"])
                          ]))
                        ])
                      ]),
                      templateMembers.value.length > 0 ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "border-t border-base-200 pt-3 space-y-2"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("label", { class: "text-xs font-semibold text-base-content/60" }, "👥 เลือกผู้เล่นประจำ (" + toDisplayString(templateSelectedCount.value) + "/" + toDisplayString(templateMembers.value.length) + ")", 1),
                          createVNode("button", {
                            type: "button",
                            onClick: toggleAllTemplateMembers,
                            class: "text-[10px] text-primary font-semibold border-0 bg-transparent cursor-pointer"
                          }, toDisplayString(templateMembers.value.every((m) => m.selected) ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"), 1)
                        ]),
                        createVNode("div", { class: "space-y-1" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(templateMembers.value, (m) => {
                            return openBlock(), createBlock("div", {
                              key: m.user_id,
                              onClick: ($event) => m.selected = !m.selected,
                              class: ["flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all", m.selected ? "border-primary/40 bg-primary/5" : "border-base-300 bg-base-100 opacity-50"]
                            }, [
                              createVNode("input", {
                                type: "checkbox",
                                checked: m.selected,
                                class: "checkbox checkbox-primary checkbox-xs",
                                onClick: withModifiers(($event) => m.selected = !m.selected, ["stop"])
                              }, null, 8, ["checked", "onClick"]),
                              createVNode(_sfc_main$2, {
                                src: m.avatar,
                                name: m.name,
                                size: "xs",
                                rounded: "full"
                              }, null, 8, ["src", "name"]),
                              createVNode("div", { class: "flex-1 min-w-0" }, [
                                createVNode("span", { class: "text-xs font-medium text-base-content truncate" }, toDisplayString(m.name), 1),
                                m.role === "Host" ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "ml-1 text-[9px] text-primary font-bold"
                                }, "HOST")) : createCommentVNode("", true)
                              ])
                            ], 10, ["onClick"]);
                          }), 128))
                        ]),
                        createVNode("p", { class: "text-[10px] text-base-content/40 m-0" }, "* ผู้เล่นที่เลือกจะถูกเพิ่มเข้าก๊วนอัตโนมัติ")
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "border-t border-base-200 pt-3 space-y-3" }, [
                        createVNode("div", { class: "flex gap-1.5" }, [
                          createVNode("button", {
                            type: "button",
                            onClick: ($event) => form.value.has_booking = true,
                            class: ["flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all", form.value.has_booking ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300"]
                          }, toDisplayString(unref(t)("createParty.hasBooking")), 11, ["onClick"]),
                          createVNode("button", {
                            type: "button",
                            onClick: ($event) => form.value.has_booking = false,
                            class: ["flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all", !form.value.has_booking ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300"]
                          }, toDisplayString(unref(t)("createParty.noBooking")), 11, ["onClick"])
                        ]),
                        !form.value.has_booking ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid grid-cols-2 gap-3"
                        }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.startTime")), 1),
                            withDirectives(createVNode("select", {
                              "onUpdate:modelValue": ($event) => form.value.start_time = $event,
                              class: ["select select-bordered select-sm w-full", { "select-error": formErrors.value.start_time }]
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(timeOptions), (opt) => {
                                return openBlock(), createBlock("option", {
                                  key: opt.name,
                                  value: opt.name
                                }, toDisplayString(opt.name), 9, ["value"]);
                              }), 128))
                            ], 10, ["onUpdate:modelValue"]), [
                              [vModelSelect, form.value.start_time]
                            ]),
                            formErrors.value.start_time ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-[10px] text-error m-0 mt-0.5"
                            }, toDisplayString(formErrors.value.start_time), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "text-xs font-semibold text-base-content/60 mb-1 block" }, toDisplayString(unref(t)("createParty.endTime")), 1),
                            withDirectives(createVNode("select", {
                              "onUpdate:modelValue": ($event) => form.value.end_time = $event,
                              class: ["select select-bordered select-sm w-full", { "select-error": formErrors.value.end_time }]
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(timeOptions), (opt) => {
                                return openBlock(), createBlock("option", {
                                  key: opt.name,
                                  value: opt.name
                                }, toDisplayString(opt.name), 9, ["value"]);
                              }), 128))
                            ], 10, ["onUpdate:modelValue"]), [
                              [vModelSelect, form.value.end_time]
                            ])
                          ])
                        ])) : createCommentVNode("", true),
                        form.value.has_booking ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(form.value.court_bookings, (booking, index) => {
                            return openBlock(), createBlock("div", {
                              key: index,
                              class: "bg-base-200/50 rounded-xl p-3 space-y-2"
                            }, [
                              createVNode("div", { class: "flex items-center justify-between" }, [
                                createVNode("span", { class: "text-[10px] font-bold text-base-content/40 uppercase" }, toDisplayString(unref(t)("createParty.courtBookings")) + " #" + toDisplayString(index + 1), 1),
                                form.value.court_bookings.length > 1 ? (openBlock(), createBlock("button", {
                                  key: 0,
                                  type: "button",
                                  onClick: ($event) => removeCourtBooking(index),
                                  class: "text-[10px] text-error font-semibold border-0 bg-transparent cursor-pointer hover:underline"
                                }, toDisplayString(unref(t)("createParty.removeCourt")), 9, ["onClick"])) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                                createVNode("div", null, [
                                  createVNode("label", { class: "text-[10px] text-base-content/50 block mb-0.5" }, toDisplayString(unref(t)("createParty.courtNumber")), 1),
                                  withDirectives(createVNode("select", {
                                    "onUpdate:modelValue": ($event) => booking.court_field_number = $event,
                                    class: ["select select-bordered select-xs w-full", { "select-error": formErrors.value[`booking_${index}_court`] }]
                                  }, [
                                    createVNode("option", {
                                      value: null,
                                      disabled: ""
                                    }, "เลือก"),
                                    (openBlock(), createBlock(Fragment, null, renderList(12, (i) => {
                                      return createVNode("option", {
                                        key: i,
                                        value: i,
                                        disabled: usedCourtNumbers.value.includes(i) && booking.court_field_number !== i
                                      }, toDisplayString(i), 9, ["value", "disabled"]);
                                    }), 64))
                                  ], 10, ["onUpdate:modelValue"]), [
                                    [vModelSelect, booking.court_field_number]
                                  ]),
                                  formErrors.value[`booking_${index}_court`] ? (openBlock(), createBlock("p", {
                                    key: 0,
                                    class: "text-[9px] text-error m-0 mt-0.5"
                                  }, toDisplayString(formErrors.value[`booking_${index}_court`]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", { class: "text-[10px] text-base-content/50 block mb-0.5" }, toDisplayString(unref(t)("createParty.startTime")), 1),
                                  withDirectives(createVNode("select", {
                                    "onUpdate:modelValue": ($event) => booking.start_time = $event,
                                    class: ["select select-bordered select-xs w-full", { "select-error": formErrors.value[`booking_${index}_start`] }]
                                  }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(unref(timeOptions), (opt) => {
                                      return openBlock(), createBlock("option", {
                                        key: opt.name,
                                        value: opt.name
                                      }, toDisplayString(opt.name), 9, ["value"]);
                                    }), 128))
                                  ], 10, ["onUpdate:modelValue"]), [
                                    [vModelSelect, booking.start_time]
                                  ]),
                                  formErrors.value[`booking_${index}_start`] ? (openBlock(), createBlock("p", {
                                    key: 0,
                                    class: "text-[9px] text-error m-0 mt-0.5"
                                  }, toDisplayString(formErrors.value[`booking_${index}_start`]), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", null, [
                                  createVNode("label", { class: "text-[10px] text-base-content/50 block mb-0.5" }, toDisplayString(unref(t)("createParty.endTime")), 1),
                                  withDirectives(createVNode("select", {
                                    "onUpdate:modelValue": ($event) => booking.end_time = $event,
                                    class: ["select select-bordered select-xs w-full", { "select-error": formErrors.value[`booking_${index}_end`] }]
                                  }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(filteredEndTimeOptions(index), (opt) => {
                                      return openBlock(), createBlock("option", {
                                        key: opt.name,
                                        value: opt.name
                                      }, toDisplayString(opt.name), 9, ["value"]);
                                    }), 128))
                                  ], 10, ["onUpdate:modelValue"]), [
                                    [vModelSelect, booking.end_time]
                                  ]),
                                  formErrors.value[`booking_${index}_end`] ? (openBlock(), createBlock("p", {
                                    key: 0,
                                    class: "text-[9px] text-error m-0 mt-0.5"
                                  }, toDisplayString(formErrors.value[`booking_${index}_end`]), 1)) : createCommentVNode("", true)
                                ])
                              ])
                            ]);
                          }), 128)),
                          createVNode("button", {
                            type: "button",
                            onClick: addCourtBooking,
                            class: "w-full py-1.5 rounded-lg border border-dashed border-base-300 bg-transparent text-xs font-medium text-base-content/40 cursor-pointer hover:border-primary/50 hover:text-primary transition-colors"
                          }, " + " + toDisplayString(unref(t)("createParty.addCourt")), 1),
                          bookingSummary.value ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "bg-primary/5 rounded-xl p-3 mt-2 space-y-1.5"
                          }, [
                            createVNode("div", { class: "flex items-center justify-between" }, [
                              createVNode("span", { class: "text-[10px] font-bold text-primary uppercase tracking-wider" }, "📋 สรุปการจอง"),
                              createVNode("span", { class: "text-xs font-bold text-base-content" }, toDisplayString(bookingSummary.value.overallStart) + " - " + toDisplayString(bookingSummary.value.overallEnd), 1)
                            ]),
                            (openBlock(true), createBlock(Fragment, null, renderList(bookingSummary.value.slots, (slot, i) => {
                              return openBlock(), createBlock("div", {
                                key: i,
                                class: "flex items-center justify-between bg-base-100/50 rounded-lg px-2.5 py-1.5"
                              }, [
                                createVNode("span", { class: "text-[11px] font-medium text-base-content/70" }, toDisplayString(slot.time), 1),
                                createVNode("div", { class: "flex items-center gap-1.5" }, [
                                  createVNode("span", { class: "text-[11px] font-bold text-primary" }, toDisplayString(slot.courtCount) + " คอร์ท", 1),
                                  createVNode("span", { class: "text-[10px] text-base-content/40" }, "(" + toDisplayString(slot.courts.join(", ")) + ")", 1)
                                ])
                              ]);
                            }), 128))
                          ])) : createCommentVNode("", true)
                        ], 64)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex gap-2 pt-2" }, [
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => showDialog.value = false,
                          class: "flex-1 h-10 rounded-xl text-sm font-medium bg-base-200 text-base-content/80 border-0 cursor-pointer hover:bg-base-300 transition-colors"
                        }, toDisplayString(unref(t)("common.cancel")), 9, ["onClick"]),
                        createVNode("button", {
                          type: "submit",
                          class: "flex-1 h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98]"
                        }, toDisplayString(isEditing.value ? unref(t)("common.save") : unref(t)("createParty.title")), 1)
                      ])
                    ], 32)
                  ]),
                  createVNode("form", {
                    method: "dialog",
                    class: "modal-backdrop"
                  }, [
                    createVNode("button", {
                      onClick: ($event) => showDialog.value = false
                    }, "close", 8, ["onClick"])
                  ])
                ], 2)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PartyLists.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PartyLists = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a75cdc6c"]]);
export {
  PartyLists as default
};
