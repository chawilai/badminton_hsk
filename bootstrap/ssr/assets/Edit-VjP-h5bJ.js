import { computed, ref, watch, unref, withCtx, createVNode, createBlock, toDisplayString, openBlock, Fragment, renderList, createTextVNode, withModifiers, createCommentVNode, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-BqVs4mIv.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, useForm, Head, router } from "@inertiajs/vue3";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./useLocale-QwrDLuQY.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    profileData: Object,
    linkedAccounts: { type: Array, default: () => [] }
  },
  setup(__props) {
    const toast = useToast();
    const page = usePage();
    const props = __props;
    const user = computed(() => page.props.auth.user);
    const profileMissingFields = computed(() => page.props.profileMissingFields || []);
    const profileCompleteness = computed(() => page.props.profileCompleteness ?? 100);
    const missingFieldLabels = {
      gender: "เพศ",
      date_of_birth: "วันเกิด",
      phone: "เบอร์โทรศัพท์",
      email: "อีเมล",
      address: "ที่อยู่"
    };
    const completenessColor = computed(() => {
      if (profileCompleteness.value >= 100) return "text-success";
      if (profileCompleteness.value >= 60) return "text-warning";
      return "text-error";
    });
    const completenessBarColor = computed(() => {
      if (profileCompleteness.value >= 100) return "bg-success";
      if (profileCompleteness.value >= 60) return "bg-warning";
      return "bg-error";
    });
    const form = useForm({
      name: props.profileData.name || "",
      gender: props.profileData.gender || "",
      date_of_birth: props.profileData.date_of_birth || "",
      subdistrict: props.profileData.subdistrict || "",
      district: props.profileData.district || "",
      province: props.profileData.province || ""
    });
    const profileSaved = ref(!!props.profileData.name && !!props.profileData.gender);
    const profileEditing = ref(!profileSaved.value);
    const saveProfile = () => {
      form.patch(route("profile.update"), {
        onSuccess: () => {
          profileSaved.value = true;
          profileEditing.value = false;
        }
      });
    };
    const enableProfileEdit = () => {
      profileEditing.value = true;
    };
    const phoneNumber = ref(props.profileData.phone || "");
    const phoneVerified = ref(!!props.profileData.phone_verified_at);
    const phoneOtp = ref("");
    const phoneStep = ref(phoneVerified.value ? "verified" : "input");
    const phoneSending = ref(false);
    const phoneVerifying = ref(false);
    const phoneCooldown = ref(0);
    let phoneCooldownTimer = null;
    const startPhoneCooldown = () => {
      phoneCooldown.value = 60;
      phoneCooldownTimer = setInterval(() => {
        phoneCooldown.value--;
        if (phoneCooldown.value <= 0) clearInterval(phoneCooldownTimer);
      }, 1e3);
    };
    const sendPhoneOtp = async () => {
      var _a;
      phoneSending.value = true;
      try {
        const res = await fetch(route("verify.phone.send"), {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content) },
          body: JSON.stringify({ phone: phoneNumber.value })
        });
        const data = await res.json();
        if (res.ok) {
          phoneStep.value = "otp";
          startPhoneCooldown();
          toast.add({ severity: "success", summary: data.message, life: 3e3 });
        } else {
          toast.add({ severity: "error", summary: data.message, life: 4e3 });
        }
      } catch {
        toast.add({ severity: "error", summary: "เกิดข้อผิดพลาด", life: 3e3 });
      }
      phoneSending.value = false;
    };
    const verifyPhoneOtp = async () => {
      var _a;
      phoneVerifying.value = true;
      try {
        const res = await fetch(route("verify.phone.check"), {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content) },
          body: JSON.stringify({ phone: phoneNumber.value, code: phoneOtp.value })
        });
        const data = await res.json();
        if (res.ok) {
          phoneStep.value = "verified";
          phoneVerified.value = true;
          toast.add({ severity: "success", summary: data.message, life: 3e3 });
        } else {
          toast.add({ severity: "error", summary: data.message, life: 4e3 });
        }
      } catch {
        toast.add({ severity: "error", summary: "เกิดข้อผิดพลาด", life: 3e3 });
      }
      phoneVerifying.value = false;
    };
    const isRandomEmail = (email) => !email || email.endsWith("@example.com");
    const emailAddress = ref(isRandomEmail(props.profileData.email) ? "" : props.profileData.email);
    const emailVerified = ref(!!props.profileData.email_verified_at && !isRandomEmail(props.profileData.email));
    const emailCode = ref("");
    const emailStep = ref(emailVerified.value ? "verified" : "input");
    const emailSending = ref(false);
    const emailVerifying = ref(false);
    const emailCooldown = ref(0);
    let emailCooldownTimer = null;
    const startEmailCooldown = () => {
      emailCooldown.value = 60;
      emailCooldownTimer = setInterval(() => {
        emailCooldown.value--;
        if (emailCooldown.value <= 0) clearInterval(emailCooldownTimer);
      }, 1e3);
    };
    const sendEmailCode = async () => {
      var _a;
      emailSending.value = true;
      try {
        const res = await fetch(route("verify.email.send"), {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content) },
          body: JSON.stringify({ email: emailAddress.value })
        });
        const data = await res.json();
        if (res.ok) {
          emailStep.value = "code";
          startEmailCooldown();
          toast.add({ severity: "success", summary: data.message, life: 3e3 });
        } else {
          toast.add({ severity: "error", summary: data.message, life: 4e3 });
        }
      } catch {
        toast.add({ severity: "error", summary: "เกิดข้อผิดพลาด", life: 3e3 });
      }
      emailSending.value = false;
    };
    const verifyEmailCode = async () => {
      var _a;
      emailVerifying.value = true;
      try {
        const res = await fetch(route("verify.email.check"), {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content) },
          body: JSON.stringify({ email: emailAddress.value, code: emailCode.value })
        });
        const data = await res.json();
        if (res.ok) {
          emailStep.value = "verified";
          emailVerified.value = true;
          toast.add({ severity: "success", summary: data.message, life: 3e3 });
        } else {
          toast.add({ severity: "error", summary: data.message, life: 4e3 });
        }
      } catch {
        toast.add({ severity: "error", summary: "เกิดข้อผิดพลาด", life: 3e3 });
      }
      emailVerifying.value = false;
    };
    const addressQuery = ref("");
    const addressResults = ref([]);
    const showAddressDropdown = ref(false);
    let addressTimeout = null;
    const searchAddress = (val) => {
      clearTimeout(addressTimeout);
      if (val.length < 2) {
        addressResults.value = [];
        return;
      }
      addressTimeout = setTimeout(async () => {
        try {
          const res = await fetch(`/api/thai-address?q=${encodeURIComponent(val)}`);
          addressResults.value = await res.json();
          showAddressDropdown.value = addressResults.value.length > 0;
        } catch {
          addressResults.value = [];
        }
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
    computed(() => {
      const parts = [form.subdistrict, form.district, form.province].filter(Boolean);
      return parts.join(", ");
    });
    if (props.profileData.subdistrict) {
      addressQuery.value = [props.profileData.subdistrict, props.profileData.district, props.profileData.province].filter(Boolean).join(", ");
    }
    const providers = [
      { key: "line", label: "LINE", color: "bg-[#06C755]/10 text-[#06C755]" },
      { key: "google", label: "Google", color: "bg-blue-500/10 text-blue-600" },
      { key: "apple", label: "Apple", color: "bg-gray-800/10 text-gray-800 dark:bg-gray-200/10 dark:text-gray-200" }
    ];
    const isLinked = (provider) => props.linkedAccounts.some((la) => la.provider === provider);
    const linkedName = (provider) => {
      var _a;
      return (_a = props.linkedAccounts.find((la) => la.provider === provider)) == null ? void 0 : _a.provider_name;
    };
    const unlinkingProvider = ref(null);
    const unlinkAccount = (provider) => {
      if (!confirm(`ยืนยันยกเลิกการเชื่อมต่อ ${provider.toUpperCase()} ?`)) return;
      unlinkingProvider.value = provider;
      router.delete(route("linked-accounts.unlink", provider), {
        onSuccess: () => {
          toast.add({ severity: "success", summary: `ยกเลิกการเชื่อมต่อ ${provider} แล้ว`, life: 3e3 });
          unlinkingProvider.value = null;
        },
        onError: () => {
          toast.add({ severity: "error", summary: "ไม่สามารถยกเลิกได้", life: 3e3 });
          unlinkingProvider.value = null;
        }
      });
    };
    const changePhone = () => {
      phoneStep.value = "input";
      phoneVerified.value = false;
      phoneOtp.value = "";
    };
    const changeEmail = () => {
      emailStep.value = "input";
      emailVerified.value = false;
      emailCode.value = "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "แก้ไขโปรไฟล์" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4" data-v-07257cd4${_scopeId}><div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center" data-v-07257cd4${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              src: user.value.avatar,
              name: user.value.name,
              size: "2xl",
              rounded: "full",
              class: "mx-auto border-4 border-base-100 shadow-lg mb-3"
            }, null, _parent2, _scopeId));
            _push2(`<h1 class="text-lg font-bold text-base-content m-0" data-v-07257cd4${_scopeId}>แก้ไขโปรไฟล์</h1><p class="text-xs text-base-content/50 mt-1 m-0" data-v-07257cd4${_scopeId}>จัดการข้อมูลส่วนตัวและการยืนยันตัวตน</p></div><div class="${ssrRenderClass([profileCompleteness.value >= 100 ? "border-success/40" : "border-warning/40", "bg-base-100 rounded-2xl border overflow-hidden"])}" data-v-07257cd4${_scopeId}><div class="p-4" data-v-07257cd4${_scopeId}><div class="flex items-center justify-between mb-2" data-v-07257cd4${_scopeId}><span class="text-sm font-bold text-base-content" data-v-07257cd4${_scopeId}>ความสมบูรณ์ของโปรไฟล์</span><span class="${ssrRenderClass([completenessColor.value, "text-lg font-extrabold"])}" data-v-07257cd4${_scopeId}>${ssrInterpolate(profileCompleteness.value)}%</span></div><div class="w-full h-2.5 bg-base-200 rounded-full overflow-hidden" data-v-07257cd4${_scopeId}><div class="${ssrRenderClass([completenessBarColor.value, "h-full rounded-full transition-all duration-500"])}" style="${ssrRenderStyle({ width: profileCompleteness.value + "%" })}" data-v-07257cd4${_scopeId}></div></div>`);
            if (profileMissingFields.value.length > 0) {
              _push2(`<div class="mt-3 flex flex-wrap gap-1.5" data-v-07257cd4${_scopeId}><!--[-->`);
              ssrRenderList(profileMissingFields.value, (field) => {
                _push2(`<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-error/10 text-error text-[11px] font-semibold" data-v-07257cd4${_scopeId}><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" data-v-07257cd4${_scopeId}><circle cx="12" cy="12" r="10" data-v-07257cd4${_scopeId}></circle><path d="M15 9l-6 6M9 9l6 6" data-v-07257cd4${_scopeId}></path></svg> ${ssrInterpolate(missingFieldLabels[field] || field)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="mt-2 flex items-center gap-1.5 text-success text-xs font-semibold" data-v-07257cd4${_scopeId}><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" data-v-07257cd4${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-07257cd4${_scopeId}></path></svg> โปรไฟล์สมบูรณ์แล้ว! </div>`);
            }
            _push2(`</div></div><form class="${ssrRenderClass([profileMissingFields.value.some((f) => ["gender", "date_of_birth", "address"].includes(f)) ? "border-error/40" : "border-base-300", "bg-base-100 rounded-2xl border overflow-hidden"])}" data-v-07257cd4${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center justify-between" data-v-07257cd4${_scopeId}><h2 class="text-sm font-bold text-base-content m-0" data-v-07257cd4${_scopeId}>ข้อมูลส่วนตัว</h2>`);
            if (profileSaved.value && !profileEditing.value) {
              _push2(`<button type="button" class="btn btn-outline btn-primary btn-xs" data-v-07257cd4${_scopeId}>แก้ไข</button>`);
            } else {
              _push2(`<!---->`);
            }
            if (profileSaved.value && !profileEditing.value) {
              _push2(`<span class="badge badge-success badge-sm gap-1" data-v-07257cd4${_scopeId}><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" data-v-07257cd4${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-07257cd4${_scopeId}></path></svg> บันทึกแล้ว </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-4 space-y-4" data-v-07257cd4${_scopeId}><div data-v-07257cd4${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-07257cd4${_scopeId}>ชื่อที่แสดง</label><input${ssrRenderAttr("value", unref(form).name)} type="text" required${ssrIncludeBooleanAttr(!profileEditing.value) ? " disabled" : ""} class="${ssrRenderClass([!profileEditing.value && "opacity-70", "input input-bordered w-full"])}" placeholder="ชื่อของคุณ" data-v-07257cd4${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<p class="text-xs text-error mt-1" data-v-07257cd4${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-07257cd4${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-07257cd4${_scopeId}> เพศ `);
            if (profileMissingFields.value.includes("gender")) {
              _push2(`<span class="text-error ml-1" data-v-07257cd4${_scopeId}>*</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><div class="flex gap-2" data-v-07257cd4${_scopeId}><!--[-->`);
            ssrRenderList([{ key: "male", label: "ชาย", icon: "👨" }, { key: "female", label: "หญิง", icon: "👩" }, { key: "other", label: "อื่นๆ", icon: "🧑" }], (g) => {
              _push2(`<button type="button" class="${ssrRenderClass([[
                unref(form).gender === g.key ? "bg-primary/10 border-primary text-primary" : "bg-base-100 border-base-300 text-base-content/60",
                profileEditing.value ? "cursor-pointer hover:border-primary/50" : "cursor-default opacity-70"
              ], "flex-1 py-2.5 rounded-xl border text-center transition-all text-sm font-semibold"])}" data-v-07257cd4${_scopeId}>${ssrInterpolate(g.icon)} ${ssrInterpolate(g.label)}</button>`);
            });
            _push2(`<!--]--></div>`);
            if (unref(form).errors.gender) {
              _push2(`<p class="text-xs text-error mt-1" data-v-07257cd4${_scopeId}>${ssrInterpolate(unref(form).errors.gender)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-07257cd4${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-07257cd4${_scopeId}> วันเกิด `);
            if (profileMissingFields.value.includes("date_of_birth")) {
              _push2(`<span class="text-error ml-1" data-v-07257cd4${_scopeId}>*</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><input${ssrRenderAttr("value", unref(form).date_of_birth)} type="date"${ssrIncludeBooleanAttr(!profileEditing.value) ? " disabled" : ""} class="${ssrRenderClass([!profileEditing.value && "opacity-70", "input input-bordered w-full"])}" data-v-07257cd4${_scopeId}>`);
            if (unref(form).errors.date_of_birth) {
              _push2(`<p class="text-xs text-error mt-1" data-v-07257cd4${_scopeId}>${ssrInterpolate(unref(form).errors.date_of_birth)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-07257cd4${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-07257cd4${_scopeId}> ที่อยู่ (ตำบล/อำเภอ/จังหวัด) `);
            if (profileMissingFields.value.includes("address")) {
              _push2(`<span class="text-error ml-1" data-v-07257cd4${_scopeId}>*</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><p class="text-[10px] text-base-content/40 mb-1.5" data-v-07257cd4${_scopeId}>ใช้ประเมินความหนาแน่นของนักแบดมินตันในพื้นที่</p><div class="relative" data-v-07257cd4${_scopeId}><input${ssrRenderAttr("value", addressQuery.value)} type="text"${ssrIncludeBooleanAttr(!profileEditing.value) ? " disabled" : ""} class="${ssrRenderClass([!profileEditing.value && "opacity-70", "input input-bordered w-full"])}" placeholder="พิมพ์ชื่อตำบล อำเภอ หรือจังหวัด..." data-v-07257cd4${_scopeId}>`);
            if (showAddressDropdown.value) {
              _push2(`<div class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg max-h-48 overflow-y-auto" data-v-07257cd4${_scopeId}><!--[-->`);
              ssrRenderList(addressResults.value, (addr, i) => {
                _push2(`<button type="button" class="w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 cursor-pointer border-0 bg-transparent transition-colors" data-v-07257cd4${_scopeId}><span class="font-semibold text-base-content" data-v-07257cd4${_scopeId}>${ssrInterpolate(addr.district)}</span><span class="text-base-content/50" data-v-07257cd4${_scopeId}> &gt; ${ssrInterpolate(addr.amphoe)} &gt; ${ssrInterpolate(addr.province)}</span><span class="text-base-content/30 text-xs ml-1" data-v-07257cd4${_scopeId}>${ssrInterpolate(addr.zipcode)}</span></button>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(form).subdistrict) {
              _push2(`<div class="mt-1.5 flex items-center gap-1.5" data-v-07257cd4${_scopeId}><span class="badge badge-primary badge-sm gap-1" data-v-07257cd4${_scopeId}><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-07257cd4${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-v-07257cd4${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-v-07257cd4${_scopeId}></path></svg> ${ssrInterpolate(unref(form).subdistrict)}, ${ssrInterpolate(unref(form).district)}, ${ssrInterpolate(unref(form).province)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (profileEditing.value) {
              _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50" data-v-07257cd4${_scopeId}>`);
              if (unref(form).processing) {
                _push2(`<span class="loading loading-spinner loading-xs mr-1" data-v-07257cd4${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` บันทึกข้อมูล </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></form><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden" data-v-07257cd4${_scopeId}><div class="px-4 py-3 border-b border-base-200" data-v-07257cd4${_scopeId}><h2 class="text-sm font-bold text-base-content m-0" data-v-07257cd4${_scopeId}>บัญชีที่เชื่อมต่อ</h2><p class="text-[10px] text-base-content/40 mt-0.5 m-0" data-v-07257cd4${_scopeId}>เชื่อมต่อเพื่อ login ได้หลายช่องทาง</p></div><div class="p-4 space-y-3" data-v-07257cd4${_scopeId}><!--[-->`);
            ssrRenderList(providers, (p) => {
              _push2(`<div class="flex items-center gap-3" data-v-07257cd4${_scopeId}><div class="${ssrRenderClass([p.color, "w-9 h-9 rounded-lg flex items-center justify-center"])}" data-v-07257cd4${_scopeId}>`);
              if (p.key === "line") {
                _push2(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" data-v-07257cd4${_scopeId}><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" data-v-07257cd4${_scopeId}></path></svg>`);
              } else if (p.key === "google") {
                _push2(`<svg class="w-5 h-5" viewBox="0 0 24 24" data-v-07257cd4${_scopeId}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" data-v-07257cd4${_scopeId}></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" data-v-07257cd4${_scopeId}></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" data-v-07257cd4${_scopeId}></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" data-v-07257cd4${_scopeId}></path></svg>`);
              } else {
                _push2(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" data-v-07257cd4${_scopeId}><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" data-v-07257cd4${_scopeId}></path></svg>`);
              }
              _push2(`</div><div class="flex-1 min-w-0" data-v-07257cd4${_scopeId}><div class="text-sm font-semibold text-base-content" data-v-07257cd4${_scopeId}>${ssrInterpolate(p.label)}</div>`);
              if (isLinked(p.key)) {
                _push2(`<div class="text-[10px] text-success truncate" data-v-07257cd4${_scopeId}> เชื่อมต่อแล้ว${ssrInterpolate(linkedName(p.key) ? " — " + linkedName(p.key) : "")}</div>`);
              } else {
                _push2(`<div class="text-[10px] text-base-content/40" data-v-07257cd4${_scopeId}>ยังไม่ได้เชื่อมต่อ</div>`);
              }
              _push2(`</div>`);
              if (!isLinked(p.key)) {
                _push2(`<a${ssrRenderAttr("href", _ctx.route("linked-accounts.link", p.key))} class="btn btn-primary btn-xs no-underline" data-v-07257cd4${_scopeId}>เชื่อมต่อ</a>`);
              } else {
                _push2(`<button${ssrIncludeBooleanAttr(__props.linkedAccounts.length <= 1 || unlinkingProvider.value === p.key) ? " disabled" : ""} class="btn btn-outline btn-error btn-xs" data-v-07257cd4${_scopeId}>`);
                if (unlinkingProvider.value === p.key) {
                  _push2(`<span class="loading loading-spinner loading-xs" data-v-07257cd4${_scopeId}></span>`);
                } else {
                  _push2(`<span data-v-07257cd4${_scopeId}>ยกเลิก</span>`);
                }
                _push2(`</button>`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]--></div></div><div class="${ssrRenderClass([profileMissingFields.value.includes("phone") ? "border-error/40" : "border-base-300", "bg-base-100 rounded-2xl border overflow-hidden"])}" data-v-07257cd4${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center justify-between" data-v-07257cd4${_scopeId}><h2 class="text-sm font-bold text-base-content m-0" data-v-07257cd4${_scopeId}> เบอร์โทรศัพท์ `);
            if (profileMissingFields.value.includes("phone")) {
              _push2(`<span class="text-error ml-1" data-v-07257cd4${_scopeId}>*</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</h2>`);
            if (phoneVerified.value) {
              _push2(`<span class="badge badge-success badge-sm gap-1" data-v-07257cd4${_scopeId}><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" data-v-07257cd4${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-07257cd4${_scopeId}></path></svg> ยืนยันแล้ว </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-4 space-y-3" data-v-07257cd4${_scopeId}>`);
            if (phoneStep.value === "verified") {
              _push2(`<div class="flex items-center gap-3" data-v-07257cd4${_scopeId}><div class="flex-1" data-v-07257cd4${_scopeId}><div class="text-sm font-semibold text-base-content" data-v-07257cd4${_scopeId}>${ssrInterpolate(phoneNumber.value)}</div><div class="text-[10px] text-success" data-v-07257cd4${_scopeId}>ยืนยันแล้ว</div></div><button type="button" class="btn btn-outline btn-primary btn-xs" data-v-07257cd4${_scopeId}>เปลี่ยน</button></div>`);
            } else if (phoneStep.value === "input") {
              _push2(`<div data-v-07257cd4${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-07257cd4${_scopeId}>เบอร์โทร</label><div class="flex gap-2" data-v-07257cd4${_scopeId}><input${ssrRenderAttr("value", phoneNumber.value)} type="tel" placeholder="08x-xxx-xxxx" maxlength="10" class="input input-bordered flex-1" data-v-07257cd4${_scopeId}><button${ssrIncludeBooleanAttr(phoneSending.value || !phoneNumber.value || phoneNumber.value.length < 9) ? " disabled" : ""} class="btn btn-primary btn-sm px-4" type="button" data-v-07257cd4${_scopeId}>`);
              if (phoneSending.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-07257cd4${_scopeId}></span>`);
              } else {
                _push2(`<span data-v-07257cd4${_scopeId}>ส่ง OTP</span>`);
              }
              _push2(`</button></div></div>`);
            } else if (phoneStep.value === "otp") {
              _push2(`<!--[--><p class="text-xs text-base-content/60 m-0" data-v-07257cd4${_scopeId}>ส่งรหัส OTP ไปที่ <strong data-v-07257cd4${_scopeId}>${ssrInterpolate(phoneNumber.value)}</strong></p><div class="flex gap-2" data-v-07257cd4${_scopeId}><input${ssrRenderAttr("value", phoneOtp.value)} type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="กรอกรหัส 6 หลัก" maxlength="6" class="input input-bordered flex-1 text-center text-lg font-mono otp-input" data-v-07257cd4${_scopeId}><button${ssrIncludeBooleanAttr(phoneVerifying.value || phoneOtp.value.length !== 6) ? " disabled" : ""} class="btn btn-primary btn-sm px-4" type="button" data-v-07257cd4${_scopeId}>`);
              if (phoneVerifying.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-07257cd4${_scopeId}></span>`);
              } else {
                _push2(`<span data-v-07257cd4${_scopeId}>ยืนยัน</span>`);
              }
              _push2(`</button></div><div class="flex items-center justify-between mt-1" data-v-07257cd4${_scopeId}><button type="button" class="btn btn-outline btn-xs" data-v-07257cd4${_scopeId}>เปลี่ยนเบอร์</button><button${ssrIncludeBooleanAttr(phoneCooldown.value > 0 || phoneSending.value) ? " disabled" : ""} type="button" class="${ssrRenderClass([phoneCooldown.value > 0 ? "btn-disabled bg-base-200 text-base-content/40" : "btn-outline btn-primary", "btn btn-sm"])}" data-v-07257cd4${_scopeId}>`);
              if (phoneSending.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-07257cd4${_scopeId}></span>`);
              } else if (phoneCooldown.value > 0) {
                _push2(`<!--[--><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-07257cd4${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-07257cd4${_scopeId}></path></svg> ส่งอีกครั้งใน ${ssrInterpolate(phoneCooldown.value)}s <!--]-->`);
              } else {
                _push2(`<!--[-->ส่งรหัสอีกครั้ง<!--]-->`);
              }
              _push2(`</button></div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="${ssrRenderClass([profileMissingFields.value.includes("email") ? "border-error/40" : "border-base-300", "bg-base-100 rounded-2xl border overflow-hidden"])}" data-v-07257cd4${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center justify-between" data-v-07257cd4${_scopeId}><h2 class="text-sm font-bold text-base-content m-0" data-v-07257cd4${_scopeId}> อีเมล `);
            if (profileMissingFields.value.includes("email")) {
              _push2(`<span class="text-error ml-1" data-v-07257cd4${_scopeId}>*</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</h2>`);
            if (emailVerified.value) {
              _push2(`<span class="badge badge-success badge-sm gap-1" data-v-07257cd4${_scopeId}><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" data-v-07257cd4${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-07257cd4${_scopeId}></path></svg> ยืนยันแล้ว </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-4 space-y-3" data-v-07257cd4${_scopeId}>`);
            if (emailStep.value === "verified") {
              _push2(`<div class="flex items-center gap-3" data-v-07257cd4${_scopeId}><div class="flex-1" data-v-07257cd4${_scopeId}><div class="text-sm font-semibold text-base-content" data-v-07257cd4${_scopeId}>${ssrInterpolate(emailAddress.value)}</div><div class="text-[10px] text-success" data-v-07257cd4${_scopeId}>ยืนยันแล้ว</div></div><button type="button" class="btn btn-outline btn-primary btn-xs" data-v-07257cd4${_scopeId}>เปลี่ยน</button></div>`);
            } else if (emailStep.value === "input") {
              _push2(`<div data-v-07257cd4${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-07257cd4${_scopeId}>อีเมล</label><div class="flex gap-2" data-v-07257cd4${_scopeId}><input${ssrRenderAttr("value", emailAddress.value)} type="email" placeholder="you@example.com" class="input input-bordered flex-1" data-v-07257cd4${_scopeId}><button${ssrIncludeBooleanAttr(emailSending.value || !emailAddress.value) ? " disabled" : ""} class="btn btn-primary btn-sm px-4" type="button" data-v-07257cd4${_scopeId}>`);
              if (emailSending.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-07257cd4${_scopeId}></span>`);
              } else {
                _push2(`<span data-v-07257cd4${_scopeId}>ส่งรหัส</span>`);
              }
              _push2(`</button></div></div>`);
            } else if (emailStep.value === "code") {
              _push2(`<!--[--><p class="text-xs text-base-content/60 m-0" data-v-07257cd4${_scopeId}>ส่งรหัสยืนยันไปที่ <strong data-v-07257cd4${_scopeId}>${ssrInterpolate(emailAddress.value)}</strong></p><div class="flex gap-2" data-v-07257cd4${_scopeId}><input${ssrRenderAttr("value", emailCode.value)} type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="กรอกรหัส 6 หลัก" maxlength="6" class="input input-bordered flex-1 text-center text-lg font-mono otp-input" data-v-07257cd4${_scopeId}><button${ssrIncludeBooleanAttr(emailVerifying.value || emailCode.value.length !== 6) ? " disabled" : ""} class="btn btn-primary btn-sm px-4" type="button" data-v-07257cd4${_scopeId}>`);
              if (emailVerifying.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-07257cd4${_scopeId}></span>`);
              } else {
                _push2(`<span data-v-07257cd4${_scopeId}>ยืนยัน</span>`);
              }
              _push2(`</button></div><div class="flex items-center justify-between mt-1" data-v-07257cd4${_scopeId}><button type="button" class="btn btn-outline btn-xs" data-v-07257cd4${_scopeId}>เปลี่ยนอีเมล</button><button${ssrIncludeBooleanAttr(emailCooldown.value > 0 || emailSending.value) ? " disabled" : ""} type="button" class="${ssrRenderClass([emailCooldown.value > 0 ? "btn-disabled bg-base-200 text-base-content/40" : "btn-outline btn-primary", "btn btn-sm"])}" data-v-07257cd4${_scopeId}>`);
              if (emailSending.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-07257cd4${_scopeId}></span>`);
              } else if (emailCooldown.value > 0) {
                _push2(`<!--[--><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-07257cd4${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-07257cd4${_scopeId}></path></svg> ส่งอีกครั้งใน ${ssrInterpolate(emailCooldown.value)}s <!--]-->`);
              } else {
                _push2(`<!--[-->ส่งรหัสอีกครั้ง<!--]-->`);
              }
              _push2(`</button></div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center" }, [
                  createVNode(_sfc_main$2, {
                    src: user.value.avatar,
                    name: user.value.name,
                    size: "2xl",
                    rounded: "full",
                    class: "mx-auto border-4 border-base-100 shadow-lg mb-3"
                  }, null, 8, ["src", "name"]),
                  createVNode("h1", { class: "text-lg font-bold text-base-content m-0" }, "แก้ไขโปรไฟล์"),
                  createVNode("p", { class: "text-xs text-base-content/50 mt-1 m-0" }, "จัดการข้อมูลส่วนตัวและการยืนยันตัวตน")
                ]),
                createVNode("div", {
                  class: ["bg-base-100 rounded-2xl border overflow-hidden", profileCompleteness.value >= 100 ? "border-success/40" : "border-warning/40"]
                }, [
                  createVNode("div", { class: "p-4" }, [
                    createVNode("div", { class: "flex items-center justify-between mb-2" }, [
                      createVNode("span", { class: "text-sm font-bold text-base-content" }, "ความสมบูรณ์ของโปรไฟล์"),
                      createVNode("span", {
                        class: ["text-lg font-extrabold", completenessColor.value]
                      }, toDisplayString(profileCompleteness.value) + "%", 3)
                    ]),
                    createVNode("div", { class: "w-full h-2.5 bg-base-200 rounded-full overflow-hidden" }, [
                      createVNode("div", {
                        class: ["h-full rounded-full transition-all duration-500", completenessBarColor.value],
                        style: { width: profileCompleteness.value + "%" }
                      }, null, 6)
                    ]),
                    profileMissingFields.value.length > 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-3 flex flex-wrap gap-1.5"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(profileMissingFields.value, (field) => {
                        return openBlock(), createBlock("span", {
                          key: field,
                          class: "inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-error/10 text-error text-[11px] font-semibold"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-3 h-3",
                            fill: "none",
                            stroke: "currentColor",
                            "stroke-width": "2.5",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("circle", {
                              cx: "12",
                              cy: "12",
                              r: "10"
                            }),
                            createVNode("path", { d: "M15 9l-6 6M9 9l6 6" })
                          ])),
                          createTextVNode(" " + toDisplayString(missingFieldLabels[field] || field), 1)
                        ]);
                      }), 128))
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "mt-2 flex items-center gap-1.5 text-success text-xs font-semibold"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "currentColor",
                        viewBox: "0 0 20 20"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                          "clip-rule": "evenodd"
                        })
                      ])),
                      createTextVNode(" โปรไฟล์สมบูรณ์แล้ว! ")
                    ]))
                  ])
                ], 2),
                createVNode("form", {
                  onSubmit: withModifiers(saveProfile, ["prevent"]),
                  class: ["bg-base-100 rounded-2xl border overflow-hidden", profileMissingFields.value.some((f) => ["gender", "date_of_birth", "address"].includes(f)) ? "border-error/40" : "border-base-300"]
                }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center justify-between" }, [
                    createVNode("h2", { class: "text-sm font-bold text-base-content m-0" }, "ข้อมูลส่วนตัว"),
                    profileSaved.value && !profileEditing.value ? (openBlock(), createBlock("button", {
                      key: 0,
                      onClick: enableProfileEdit,
                      type: "button",
                      class: "btn btn-outline btn-primary btn-xs"
                    }, "แก้ไข")) : createCommentVNode("", true),
                    profileSaved.value && !profileEditing.value ? (openBlock(), createBlock("span", {
                      key: 1,
                      class: "badge badge-success badge-sm gap-1"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-3 h-3",
                        fill: "currentColor",
                        viewBox: "0 0 20 20"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                          "clip-rule": "evenodd"
                        })
                      ])),
                      createTextVNode(" บันทึกแล้ว ")
                    ])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "p-4 space-y-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-1 block" }, "ชื่อที่แสดง"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        type: "text",
                        required: "",
                        disabled: !profileEditing.value,
                        class: ["input input-bordered w-full", !profileEditing.value && "opacity-70"],
                        placeholder: "ชื่อของคุณ"
                      }, null, 10, ["onUpdate:modelValue", "disabled"]), [
                        [vModelText, unref(form).name]
                      ]),
                      unref(form).errors.name ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-error mt-1"
                      }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-1 block" }, [
                        createTextVNode(" เพศ "),
                        profileMissingFields.value.includes("gender") ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-error ml-1"
                        }, "*")) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex gap-2" }, [
                        (openBlock(), createBlock(Fragment, null, renderList([{ key: "male", label: "ชาย", icon: "👨" }, { key: "female", label: "หญิง", icon: "👩" }, { key: "other", label: "อื่นๆ", icon: "🧑" }], (g) => {
                          return createVNode("button", {
                            type: "button",
                            key: g.key,
                            onClick: ($event) => profileEditing.value && (unref(form).gender = g.key),
                            class: ["flex-1 py-2.5 rounded-xl border text-center transition-all text-sm font-semibold", [
                              unref(form).gender === g.key ? "bg-primary/10 border-primary text-primary" : "bg-base-100 border-base-300 text-base-content/60",
                              profileEditing.value ? "cursor-pointer hover:border-primary/50" : "cursor-default opacity-70"
                            ]]
                          }, toDisplayString(g.icon) + " " + toDisplayString(g.label), 11, ["onClick"]);
                        }), 64))
                      ]),
                      unref(form).errors.gender ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-error mt-1"
                      }, toDisplayString(unref(form).errors.gender), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-1 block" }, [
                        createTextVNode(" วันเกิด "),
                        profileMissingFields.value.includes("date_of_birth") ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-error ml-1"
                        }, "*")) : createCommentVNode("", true)
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).date_of_birth = $event,
                        type: "date",
                        disabled: !profileEditing.value,
                        class: ["input input-bordered w-full", !profileEditing.value && "opacity-70"]
                      }, null, 10, ["onUpdate:modelValue", "disabled"]), [
                        [vModelText, unref(form).date_of_birth]
                      ]),
                      unref(form).errors.date_of_birth ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-error mt-1"
                      }, toDisplayString(unref(form).errors.date_of_birth), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-1 block" }, [
                        createTextVNode(" ที่อยู่ (ตำบล/อำเภอ/จังหวัด) "),
                        profileMissingFields.value.includes("address") ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-error ml-1"
                        }, "*")) : createCommentVNode("", true)
                      ]),
                      createVNode("p", { class: "text-[10px] text-base-content/40 mb-1.5" }, "ใช้ประเมินความหนาแน่นของนักแบดมินตันในพื้นที่"),
                      createVNode("div", { class: "relative" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => addressQuery.value = $event,
                          type: "text",
                          disabled: !profileEditing.value,
                          class: ["input input-bordered w-full", !profileEditing.value && "opacity-70"],
                          placeholder: "พิมพ์ชื่อตำบล อำเภอ หรือจังหวัด...",
                          onFocus: ($event) => profileEditing.value && (showAddressDropdown.value = addressResults.value.length > 0),
                          onBlur: ($event) => _ctx.setTimeout(() => showAddressDropdown.value = false, 200)
                        }, null, 42, ["onUpdate:modelValue", "disabled", "onFocus", "onBlur"]), [
                          [vModelText, addressQuery.value]
                        ]),
                        showAddressDropdown.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(addressResults.value, (addr, i) => {
                            return openBlock(), createBlock("button", {
                              key: i,
                              type: "button",
                              onMousedown: withModifiers(($event) => selectAddress(addr), ["prevent"]),
                              class: "w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 cursor-pointer border-0 bg-transparent transition-colors"
                            }, [
                              createVNode("span", { class: "font-semibold text-base-content" }, toDisplayString(addr.district), 1),
                              createVNode("span", { class: "text-base-content/50" }, " > " + toDisplayString(addr.amphoe) + " > " + toDisplayString(addr.province), 1),
                              createVNode("span", { class: "text-base-content/30 text-xs ml-1" }, toDisplayString(addr.zipcode), 1)
                            ], 40, ["onMousedown"]);
                          }), 128))
                        ])) : createCommentVNode("", true)
                      ]),
                      unref(form).subdistrict ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mt-1.5 flex items-center gap-1.5"
                      }, [
                        createVNode("span", { class: "badge badge-primary badge-sm gap-1" }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-3 h-3",
                            fill: "none",
                            stroke: "currentColor",
                            "stroke-width": "2",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            }),
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            })
                          ])),
                          createTextVNode(" " + toDisplayString(unref(form).subdistrict) + ", " + toDisplayString(unref(form).district) + ", " + toDisplayString(unref(form).province), 1)
                        ])
                      ])) : createCommentVNode("", true)
                    ]),
                    profileEditing.value ? (openBlock(), createBlock("button", {
                      key: 0,
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "w-full py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50"
                    }, [
                      unref(form).processing ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "loading loading-spinner loading-xs mr-1"
                      })) : createCommentVNode("", true),
                      createTextVNode(" บันทึกข้อมูล ")
                    ], 8, ["disabled"])) : createCommentVNode("", true)
                  ])
                ], 34),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200" }, [
                    createVNode("h2", { class: "text-sm font-bold text-base-content m-0" }, "บัญชีที่เชื่อมต่อ"),
                    createVNode("p", { class: "text-[10px] text-base-content/40 mt-0.5 m-0" }, "เชื่อมต่อเพื่อ login ได้หลายช่องทาง")
                  ]),
                  createVNode("div", { class: "p-4 space-y-3" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(providers, (p) => {
                      return createVNode("div", {
                        key: p.key,
                        class: "flex items-center gap-3"
                      }, [
                        createVNode("div", {
                          class: ["w-9 h-9 rounded-lg flex items-center justify-center", p.color]
                        }, [
                          p.key === "line" ? (openBlock(), createBlock("svg", {
                            key: 0,
                            class: "w-5 h-5",
                            fill: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", { d: "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" })
                          ])) : p.key === "google" ? (openBlock(), createBlock("svg", {
                            key: 1,
                            class: "w-5 h-5",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
                              fill: "#4285F4"
                            }),
                            createVNode("path", {
                              d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                              fill: "#34A853"
                            }),
                            createVNode("path", {
                              d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                              fill: "#FBBC05"
                            }),
                            createVNode("path", {
                              d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                              fill: "#EA4335"
                            })
                          ])) : (openBlock(), createBlock("svg", {
                            key: 2,
                            class: "w-5 h-5",
                            fill: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", { d: "M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" })
                          ]))
                        ], 2),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "text-sm font-semibold text-base-content" }, toDisplayString(p.label), 1),
                          isLinked(p.key) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-[10px] text-success truncate"
                          }, " เชื่อมต่อแล้ว" + toDisplayString(linkedName(p.key) ? " — " + linkedName(p.key) : ""), 1)) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "text-[10px] text-base-content/40"
                          }, "ยังไม่ได้เชื่อมต่อ"))
                        ]),
                        !isLinked(p.key) ? (openBlock(), createBlock("a", {
                          key: 0,
                          href: _ctx.route("linked-accounts.link", p.key),
                          class: "btn btn-primary btn-xs no-underline"
                        }, "เชื่อมต่อ", 8, ["href"])) : (openBlock(), createBlock("button", {
                          key: 1,
                          onClick: ($event) => unlinkAccount(p.key),
                          disabled: __props.linkedAccounts.length <= 1 || unlinkingProvider.value === p.key,
                          class: "btn btn-outline btn-error btn-xs"
                        }, [
                          unlinkingProvider.value === p.key ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "loading loading-spinner loading-xs"
                          })) : (openBlock(), createBlock("span", { key: 1 }, "ยกเลิก"))
                        ], 8, ["onClick", "disabled"]))
                      ]);
                    }), 64))
                  ])
                ]),
                createVNode("div", {
                  class: ["bg-base-100 rounded-2xl border overflow-hidden", profileMissingFields.value.includes("phone") ? "border-error/40" : "border-base-300"]
                }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center justify-between" }, [
                    createVNode("h2", { class: "text-sm font-bold text-base-content m-0" }, [
                      createTextVNode(" เบอร์โทรศัพท์ "),
                      profileMissingFields.value.includes("phone") ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-error ml-1"
                      }, "*")) : createCommentVNode("", true)
                    ]),
                    phoneVerified.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "badge badge-success badge-sm gap-1"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-3 h-3",
                        fill: "currentColor",
                        viewBox: "0 0 20 20"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                          "clip-rule": "evenodd"
                        })
                      ])),
                      createTextVNode(" ยืนยันแล้ว ")
                    ])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "p-4 space-y-3" }, [
                    phoneStep.value === "verified" ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-3"
                    }, [
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("div", { class: "text-sm font-semibold text-base-content" }, toDisplayString(phoneNumber.value), 1),
                        createVNode("div", { class: "text-[10px] text-success" }, "ยืนยันแล้ว")
                      ]),
                      createVNode("button", {
                        onClick: changePhone,
                        type: "button",
                        class: "btn btn-outline btn-primary btn-xs"
                      }, "เปลี่ยน")
                    ])) : phoneStep.value === "input" ? (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-1 block" }, "เบอร์โทร"),
                      createVNode("div", { class: "flex gap-2" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => phoneNumber.value = $event,
                          type: "tel",
                          placeholder: "08x-xxx-xxxx",
                          maxlength: "10",
                          class: "input input-bordered flex-1"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, phoneNumber.value]
                        ]),
                        createVNode("button", {
                          onClick: sendPhoneOtp,
                          disabled: phoneSending.value || !phoneNumber.value || phoneNumber.value.length < 9,
                          class: "btn btn-primary btn-sm px-4",
                          type: "button"
                        }, [
                          phoneSending.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "loading loading-spinner loading-xs"
                          })) : (openBlock(), createBlock("span", { key: 1 }, "ส่ง OTP"))
                        ], 8, ["disabled"])
                      ])
                    ])) : phoneStep.value === "otp" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                      createVNode("p", { class: "text-xs text-base-content/60 m-0" }, [
                        createTextVNode("ส่งรหัส OTP ไปที่ "),
                        createVNode("strong", null, toDisplayString(phoneNumber.value), 1)
                      ]),
                      createVNode("div", { class: "flex gap-2" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => phoneOtp.value = $event,
                          type: "tel",
                          inputmode: "numeric",
                          pattern: "[0-9]*",
                          placeholder: "กรอกรหัส 6 หลัก",
                          maxlength: "6",
                          class: "input input-bordered flex-1 text-center text-lg font-mono otp-input"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, phoneOtp.value]
                        ]),
                        createVNode("button", {
                          onClick: verifyPhoneOtp,
                          disabled: phoneVerifying.value || phoneOtp.value.length !== 6,
                          class: "btn btn-primary btn-sm px-4",
                          type: "button"
                        }, [
                          phoneVerifying.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "loading loading-spinner loading-xs"
                          })) : (openBlock(), createBlock("span", { key: 1 }, "ยืนยัน"))
                        ], 8, ["disabled"])
                      ]),
                      createVNode("div", { class: "flex items-center justify-between mt-1" }, [
                        createVNode("button", {
                          onClick: ($event) => phoneStep.value = "input",
                          type: "button",
                          class: "btn btn-outline btn-xs"
                        }, "เปลี่ยนเบอร์", 8, ["onClick"]),
                        createVNode("button", {
                          onClick: sendPhoneOtp,
                          disabled: phoneCooldown.value > 0 || phoneSending.value,
                          type: "button",
                          class: ["btn btn-sm", phoneCooldown.value > 0 ? "btn-disabled bg-base-200 text-base-content/40" : "btn-outline btn-primary"]
                        }, [
                          phoneSending.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "loading loading-spinner loading-xs"
                          })) : phoneCooldown.value > 0 ? (openBlock(), createBlock(Fragment, { key: 1 }, [
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
                                d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              })
                            ])),
                            createTextVNode(" ส่งอีกครั้งใน " + toDisplayString(phoneCooldown.value) + "s ", 1)
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                            createTextVNode("ส่งรหัสอีกครั้ง")
                          ], 64))
                        ], 10, ["disabled"])
                      ])
                    ], 64)) : createCommentVNode("", true)
                  ])
                ], 2),
                createVNode("div", {
                  class: ["bg-base-100 rounded-2xl border overflow-hidden", profileMissingFields.value.includes("email") ? "border-error/40" : "border-base-300"]
                }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center justify-between" }, [
                    createVNode("h2", { class: "text-sm font-bold text-base-content m-0" }, [
                      createTextVNode(" อีเมล "),
                      profileMissingFields.value.includes("email") ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-error ml-1"
                      }, "*")) : createCommentVNode("", true)
                    ]),
                    emailVerified.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "badge badge-success badge-sm gap-1"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-3 h-3",
                        fill: "currentColor",
                        viewBox: "0 0 20 20"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                          "clip-rule": "evenodd"
                        })
                      ])),
                      createTextVNode(" ยืนยันแล้ว ")
                    ])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "p-4 space-y-3" }, [
                    emailStep.value === "verified" ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-3"
                    }, [
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("div", { class: "text-sm font-semibold text-base-content" }, toDisplayString(emailAddress.value), 1),
                        createVNode("div", { class: "text-[10px] text-success" }, "ยืนยันแล้ว")
                      ]),
                      createVNode("button", {
                        onClick: changeEmail,
                        type: "button",
                        class: "btn btn-outline btn-primary btn-xs"
                      }, "เปลี่ยน")
                    ])) : emailStep.value === "input" ? (openBlock(), createBlock("div", { key: 1 }, [
                      createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-1 block" }, "อีเมล"),
                      createVNode("div", { class: "flex gap-2" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => emailAddress.value = $event,
                          type: "email",
                          placeholder: "you@example.com",
                          class: "input input-bordered flex-1"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, emailAddress.value]
                        ]),
                        createVNode("button", {
                          onClick: sendEmailCode,
                          disabled: emailSending.value || !emailAddress.value,
                          class: "btn btn-primary btn-sm px-4",
                          type: "button"
                        }, [
                          emailSending.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "loading loading-spinner loading-xs"
                          })) : (openBlock(), createBlock("span", { key: 1 }, "ส่งรหัส"))
                        ], 8, ["disabled"])
                      ])
                    ])) : emailStep.value === "code" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                      createVNode("p", { class: "text-xs text-base-content/60 m-0" }, [
                        createTextVNode("ส่งรหัสยืนยันไปที่ "),
                        createVNode("strong", null, toDisplayString(emailAddress.value), 1)
                      ]),
                      createVNode("div", { class: "flex gap-2" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => emailCode.value = $event,
                          type: "tel",
                          inputmode: "numeric",
                          pattern: "[0-9]*",
                          placeholder: "กรอกรหัส 6 หลัก",
                          maxlength: "6",
                          class: "input input-bordered flex-1 text-center text-lg font-mono otp-input"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, emailCode.value]
                        ]),
                        createVNode("button", {
                          onClick: verifyEmailCode,
                          disabled: emailVerifying.value || emailCode.value.length !== 6,
                          class: "btn btn-primary btn-sm px-4",
                          type: "button"
                        }, [
                          emailVerifying.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "loading loading-spinner loading-xs"
                          })) : (openBlock(), createBlock("span", { key: 1 }, "ยืนยัน"))
                        ], 8, ["disabled"])
                      ]),
                      createVNode("div", { class: "flex items-center justify-between mt-1" }, [
                        createVNode("button", {
                          onClick: ($event) => emailStep.value = "input",
                          type: "button",
                          class: "btn btn-outline btn-xs"
                        }, "เปลี่ยนอีเมล", 8, ["onClick"]),
                        createVNode("button", {
                          onClick: sendEmailCode,
                          disabled: emailCooldown.value > 0 || emailSending.value,
                          type: "button",
                          class: ["btn btn-sm", emailCooldown.value > 0 ? "btn-disabled bg-base-200 text-base-content/40" : "btn-outline btn-primary"]
                        }, [
                          emailSending.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "loading loading-spinner loading-xs"
                          })) : emailCooldown.value > 0 ? (openBlock(), createBlock(Fragment, { key: 1 }, [
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
                                d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              })
                            ])),
                            createTextVNode(" ส่งอีกครั้งใน " + toDisplayString(emailCooldown.value) + "s ", 1)
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                            createTextVNode("ส่งรหัสอีกครั้ง")
                          ], 64))
                        ], 10, ["disabled"])
                      ])
                    ], 64)) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Edit = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-07257cd4"]]);
export {
  Edit as default
};
