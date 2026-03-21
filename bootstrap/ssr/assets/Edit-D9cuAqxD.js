import { computed, ref, watch, unref, withCtx, createVNode, withModifiers, createBlock, createCommentVNode, openBlock, createTextVNode, withDirectives, vModelText, toDisplayString, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-C4Zuyavh.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, useForm, Head } from "@inertiajs/vue3";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./useLocale-BkZfXvwr.js";
import "./LocaleSwitcher-41-e_7Js.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    profileData: Object
  },
  setup(__props) {
    const toast = useToast();
    const page = usePage();
    const props = __props;
    const user = computed(() => page.props.auth.user);
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
          toast.add({ severity: "success", summary: "บันทึกโปรไฟล์เรียบร้อย", life: 3e3 });
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
    const emailAddress = ref(props.profileData.email || "");
    const emailVerified = ref(!!props.profileData.email_verified_at);
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
            _push2(`<div class="space-y-4 pb-4" data-v-efcccecf${_scopeId}><div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center" data-v-efcccecf${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              src: user.value.avatar,
              name: user.value.name,
              size: "2xl",
              rounded: "full",
              class: "mx-auto border-4 border-base-100 shadow-lg mb-3"
            }, null, _parent2, _scopeId));
            _push2(`<h1 class="text-lg font-bold text-base-content m-0" data-v-efcccecf${_scopeId}>แก้ไขโปรไฟล์</h1><p class="text-xs text-base-content/50 mt-1 m-0" data-v-efcccecf${_scopeId}>จัดการข้อมูลส่วนตัวและการยืนยันตัวตน</p></div><form class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden" data-v-efcccecf${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center justify-between" data-v-efcccecf${_scopeId}><h2 class="text-sm font-bold text-base-content m-0" data-v-efcccecf${_scopeId}>ข้อมูลส่วนตัว</h2>`);
            if (profileSaved.value && !profileEditing.value) {
              _push2(`<button type="button" class="btn btn-outline btn-primary btn-xs" data-v-efcccecf${_scopeId}>แก้ไข</button>`);
            } else {
              _push2(`<!---->`);
            }
            if (profileSaved.value && !profileEditing.value) {
              _push2(`<span class="badge badge-success badge-sm gap-1" data-v-efcccecf${_scopeId}><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" data-v-efcccecf${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-efcccecf${_scopeId}></path></svg> บันทึกแล้ว </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-4 space-y-4" data-v-efcccecf${_scopeId}><div data-v-efcccecf${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-efcccecf${_scopeId}>ชื่อที่แสดง</label><input${ssrRenderAttr("value", unref(form).name)} type="text" required${ssrIncludeBooleanAttr(!profileEditing.value) ? " disabled" : ""} class="${ssrRenderClass([!profileEditing.value && "opacity-70", "input input-bordered w-full"])}" placeholder="ชื่อของคุณ" data-v-efcccecf${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<p class="text-xs text-error mt-1" data-v-efcccecf${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-efcccecf${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-efcccecf${_scopeId}>เพศ</label><div class="flex gap-2" data-v-efcccecf${_scopeId}><!--[-->`);
            ssrRenderList([{ key: "male", label: "ชาย", icon: "👨" }, { key: "female", label: "หญิง", icon: "👩" }, { key: "other", label: "อื่นๆ", icon: "🧑" }], (g) => {
              _push2(`<button type="button" class="${ssrRenderClass([[
                unref(form).gender === g.key ? "bg-primary/10 border-primary text-primary" : "bg-base-100 border-base-300 text-base-content/60",
                profileEditing.value ? "cursor-pointer hover:border-primary/50" : "cursor-default opacity-70"
              ], "flex-1 py-2.5 rounded-xl border text-center transition-all text-sm font-semibold"])}" data-v-efcccecf${_scopeId}>${ssrInterpolate(g.icon)} ${ssrInterpolate(g.label)}</button>`);
            });
            _push2(`<!--]--></div>`);
            if (unref(form).errors.gender) {
              _push2(`<p class="text-xs text-error mt-1" data-v-efcccecf${_scopeId}>${ssrInterpolate(unref(form).errors.gender)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-efcccecf${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-efcccecf${_scopeId}>วันเกิด</label><input${ssrRenderAttr("value", unref(form).date_of_birth)} type="date"${ssrIncludeBooleanAttr(!profileEditing.value) ? " disabled" : ""} class="${ssrRenderClass([!profileEditing.value && "opacity-70", "input input-bordered w-full"])}" data-v-efcccecf${_scopeId}>`);
            if (unref(form).errors.date_of_birth) {
              _push2(`<p class="text-xs text-error mt-1" data-v-efcccecf${_scopeId}>${ssrInterpolate(unref(form).errors.date_of_birth)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-efcccecf${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-efcccecf${_scopeId}>ที่อยู่ (ตำบล/อำเภอ/จังหวัด)</label><p class="text-[10px] text-base-content/40 mb-1.5" data-v-efcccecf${_scopeId}>ใช้ประเมินความหนาแน่นของนักแบดมินตันในพื้นที่</p><div class="relative" data-v-efcccecf${_scopeId}><input${ssrRenderAttr("value", addressQuery.value)} type="text"${ssrIncludeBooleanAttr(!profileEditing.value) ? " disabled" : ""} class="${ssrRenderClass([!profileEditing.value && "opacity-70", "input input-bordered w-full"])}" placeholder="พิมพ์ชื่อตำบล อำเภอ หรือจังหวัด..." data-v-efcccecf${_scopeId}>`);
            if (showAddressDropdown.value) {
              _push2(`<div class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg max-h-48 overflow-y-auto" data-v-efcccecf${_scopeId}><!--[-->`);
              ssrRenderList(addressResults.value, (addr, i) => {
                _push2(`<button type="button" class="w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 cursor-pointer border-0 bg-transparent transition-colors" data-v-efcccecf${_scopeId}><span class="font-semibold text-base-content" data-v-efcccecf${_scopeId}>${ssrInterpolate(addr.district)}</span><span class="text-base-content/50" data-v-efcccecf${_scopeId}> &gt; ${ssrInterpolate(addr.amphoe)} &gt; ${ssrInterpolate(addr.province)}</span><span class="text-base-content/30 text-xs ml-1" data-v-efcccecf${_scopeId}>${ssrInterpolate(addr.zipcode)}</span></button>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(form).subdistrict) {
              _push2(`<div class="mt-1.5 flex items-center gap-1.5" data-v-efcccecf${_scopeId}><span class="badge badge-primary badge-sm gap-1" data-v-efcccecf${_scopeId}><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-efcccecf${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-v-efcccecf${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-v-efcccecf${_scopeId}></path></svg> ${ssrInterpolate(unref(form).subdistrict)}, ${ssrInterpolate(unref(form).district)}, ${ssrInterpolate(unref(form).province)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (profileEditing.value) {
              _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50" data-v-efcccecf${_scopeId}>`);
              if (unref(form).processing) {
                _push2(`<span class="loading loading-spinner loading-xs mr-1" data-v-efcccecf${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` บันทึกข้อมูล </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></form><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden" data-v-efcccecf${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center justify-between" data-v-efcccecf${_scopeId}><h2 class="text-sm font-bold text-base-content m-0" data-v-efcccecf${_scopeId}>เบอร์โทรศัพท์</h2>`);
            if (phoneVerified.value) {
              _push2(`<span class="badge badge-success badge-sm gap-1" data-v-efcccecf${_scopeId}><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" data-v-efcccecf${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-efcccecf${_scopeId}></path></svg> ยืนยันแล้ว </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-4 space-y-3" data-v-efcccecf${_scopeId}>`);
            if (phoneStep.value === "verified") {
              _push2(`<div class="flex items-center gap-3" data-v-efcccecf${_scopeId}><div class="flex-1" data-v-efcccecf${_scopeId}><div class="text-sm font-semibold text-base-content" data-v-efcccecf${_scopeId}>${ssrInterpolate(phoneNumber.value)}</div><div class="text-[10px] text-success" data-v-efcccecf${_scopeId}>ยืนยันแล้ว</div></div><button type="button" class="btn btn-outline btn-primary btn-xs" data-v-efcccecf${_scopeId}>เปลี่ยน</button></div>`);
            } else if (phoneStep.value === "input") {
              _push2(`<div data-v-efcccecf${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-efcccecf${_scopeId}>เบอร์โทร</label><div class="flex gap-2" data-v-efcccecf${_scopeId}><input${ssrRenderAttr("value", phoneNumber.value)} type="tel" placeholder="08x-xxx-xxxx" maxlength="10" class="input input-bordered flex-1" data-v-efcccecf${_scopeId}><button${ssrIncludeBooleanAttr(phoneSending.value || !phoneNumber.value || phoneNumber.value.length < 9) ? " disabled" : ""} class="btn btn-primary btn-sm px-4" type="button" data-v-efcccecf${_scopeId}>`);
              if (phoneSending.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-efcccecf${_scopeId}></span>`);
              } else {
                _push2(`<span data-v-efcccecf${_scopeId}>ส่ง OTP</span>`);
              }
              _push2(`</button></div></div>`);
            } else if (phoneStep.value === "otp") {
              _push2(`<!--[--><p class="text-xs text-base-content/60 m-0" data-v-efcccecf${_scopeId}>ส่งรหัส OTP ไปที่ <strong data-v-efcccecf${_scopeId}>${ssrInterpolate(phoneNumber.value)}</strong></p><div class="flex gap-2" data-v-efcccecf${_scopeId}><input${ssrRenderAttr("value", phoneOtp.value)} type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="กรอกรหัส 6 หลัก" maxlength="6" class="input input-bordered flex-1 text-center text-lg font-mono otp-input" data-v-efcccecf${_scopeId}><button${ssrIncludeBooleanAttr(phoneVerifying.value || phoneOtp.value.length !== 6) ? " disabled" : ""} class="btn btn-primary btn-sm px-4" type="button" data-v-efcccecf${_scopeId}>`);
              if (phoneVerifying.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-efcccecf${_scopeId}></span>`);
              } else {
                _push2(`<span data-v-efcccecf${_scopeId}>ยืนยัน</span>`);
              }
              _push2(`</button></div><div class="flex items-center justify-between mt-1" data-v-efcccecf${_scopeId}><button type="button" class="btn btn-outline btn-xs" data-v-efcccecf${_scopeId}>เปลี่ยนเบอร์</button><button${ssrIncludeBooleanAttr(phoneCooldown.value > 0 || phoneSending.value) ? " disabled" : ""} type="button" class="${ssrRenderClass([phoneCooldown.value > 0 ? "btn-disabled bg-base-200 text-base-content/40" : "btn-outline btn-primary", "btn btn-sm"])}" data-v-efcccecf${_scopeId}>`);
              if (phoneSending.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-efcccecf${_scopeId}></span>`);
              } else if (phoneCooldown.value > 0) {
                _push2(`<!--[--><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-efcccecf${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-efcccecf${_scopeId}></path></svg> ส่งอีกครั้งใน ${ssrInterpolate(phoneCooldown.value)}s <!--]-->`);
              } else {
                _push2(`<!--[-->ส่งรหัสอีกครั้ง<!--]-->`);
              }
              _push2(`</button></div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden" data-v-efcccecf${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center justify-between" data-v-efcccecf${_scopeId}><h2 class="text-sm font-bold text-base-content m-0" data-v-efcccecf${_scopeId}>อีเมล</h2>`);
            if (emailVerified.value) {
              _push2(`<span class="badge badge-success badge-sm gap-1" data-v-efcccecf${_scopeId}><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" data-v-efcccecf${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-v-efcccecf${_scopeId}></path></svg> ยืนยันแล้ว </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-4 space-y-3" data-v-efcccecf${_scopeId}>`);
            if (emailStep.value === "verified") {
              _push2(`<div class="flex items-center gap-3" data-v-efcccecf${_scopeId}><div class="flex-1" data-v-efcccecf${_scopeId}><div class="text-sm font-semibold text-base-content" data-v-efcccecf${_scopeId}>${ssrInterpolate(emailAddress.value)}</div><div class="text-[10px] text-success" data-v-efcccecf${_scopeId}>ยืนยันแล้ว</div></div><button type="button" class="btn btn-outline btn-primary btn-xs" data-v-efcccecf${_scopeId}>เปลี่ยน</button></div>`);
            } else if (emailStep.value === "input") {
              _push2(`<div data-v-efcccecf${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-1 block" data-v-efcccecf${_scopeId}>อีเมล</label><div class="flex gap-2" data-v-efcccecf${_scopeId}><input${ssrRenderAttr("value", emailAddress.value)} type="email" placeholder="you@example.com" class="input input-bordered flex-1" data-v-efcccecf${_scopeId}><button${ssrIncludeBooleanAttr(emailSending.value || !emailAddress.value) ? " disabled" : ""} class="btn btn-primary btn-sm px-4" type="button" data-v-efcccecf${_scopeId}>`);
              if (emailSending.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-efcccecf${_scopeId}></span>`);
              } else {
                _push2(`<span data-v-efcccecf${_scopeId}>ส่งรหัส</span>`);
              }
              _push2(`</button></div></div>`);
            } else if (emailStep.value === "code") {
              _push2(`<!--[--><p class="text-xs text-base-content/60 m-0" data-v-efcccecf${_scopeId}>ส่งรหัสยืนยันไปที่ <strong data-v-efcccecf${_scopeId}>${ssrInterpolate(emailAddress.value)}</strong></p><div class="flex gap-2" data-v-efcccecf${_scopeId}><input${ssrRenderAttr("value", emailCode.value)} type="tel" inputmode="numeric" pattern="[0-9]*" placeholder="กรอกรหัส 6 หลัก" maxlength="6" class="input input-bordered flex-1 text-center text-lg font-mono otp-input" data-v-efcccecf${_scopeId}><button${ssrIncludeBooleanAttr(emailVerifying.value || emailCode.value.length !== 6) ? " disabled" : ""} class="btn btn-primary btn-sm px-4" type="button" data-v-efcccecf${_scopeId}>`);
              if (emailVerifying.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-efcccecf${_scopeId}></span>`);
              } else {
                _push2(`<span data-v-efcccecf${_scopeId}>ยืนยัน</span>`);
              }
              _push2(`</button></div><div class="flex items-center justify-between mt-1" data-v-efcccecf${_scopeId}><button type="button" class="btn btn-outline btn-xs" data-v-efcccecf${_scopeId}>เปลี่ยนอีเมล</button><button${ssrIncludeBooleanAttr(emailCooldown.value > 0 || emailSending.value) ? " disabled" : ""} type="button" class="${ssrRenderClass([emailCooldown.value > 0 ? "btn-disabled bg-base-200 text-base-content/40" : "btn-outline btn-primary", "btn btn-sm"])}" data-v-efcccecf${_scopeId}>`);
              if (emailSending.value) {
                _push2(`<span class="loading loading-spinner loading-xs" data-v-efcccecf${_scopeId}></span>`);
              } else if (emailCooldown.value > 0) {
                _push2(`<!--[--><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-efcccecf${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-v-efcccecf${_scopeId}></path></svg> ส่งอีกครั้งใน ${ssrInterpolate(emailCooldown.value)}s <!--]-->`);
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
                createVNode("form", {
                  onSubmit: withModifiers(saveProfile, ["prevent"]),
                  class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden"
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
                      createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-1 block" }, "เพศ"),
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
                      createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-1 block" }, "วันเกิด"),
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
                      createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-1 block" }, "ที่อยู่ (ตำบล/อำเภอ/จังหวัด)"),
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
                ], 32),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center justify-between" }, [
                    createVNode("h2", { class: "text-sm font-bold text-base-content m-0" }, "เบอร์โทรศัพท์"),
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
                ]),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center justify-between" }, [
                    createVNode("h2", { class: "text-sm font-bold text-base-content m-0" }, "อีเมล"),
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
                ])
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
const Edit = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-efcccecf"]]);
export {
  Edit as default
};
