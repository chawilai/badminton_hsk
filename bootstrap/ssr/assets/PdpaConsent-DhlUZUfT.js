import { ref, computed, unref, withCtx, createVNode, createBlock, toDisplayString, openBlock, Fragment, renderList, withDirectives, vModelCheckbox, createCommentVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AppLayout-BqVs4mIv.js";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./useToast-DyaFeJ92.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "PdpaConsent",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, toggleLocale } = useLocale();
    const agreed = ref(false);
    const isSubmitting = ref(false);
    const content = computed(() => {
      if (locale.value === "en") {
        return {
          title: "Privacy Policy & Data Protection",
          subtitle: "Personal Data Protection Act (PDPA)",
          intro: "Badminton Party values your privacy. Before using our service, please review and accept our data protection policy.",
          aboutTitle: "About Badminton Party",
          aboutDesc: "Badminton Party is a badminton session management platform where you can create parties, invite players, manage games with team assignments, track scores, and monitor shuttlecock usage.",
          sections: [
            {
              icon: "📋",
              title: "Data We Collect",
              items: [
                { label: "Account Information", desc: "Name, email, profile picture (from LINE, Google, or Apple login)" },
                { label: "Profile Data", desc: "Gender, date of birth, phone number, address (subdistrict/district/province)" },
                { label: "Game Data", desc: "Match history, scores, win/loss records, MMR rating, skill assessments" },
                { label: "Communication Data", desc: "Chat messages within parties, feedback submissions" },
                { label: "Usage Data", desc: "Play time, party participation, court visit history" }
              ]
            },
            {
              icon: "🎯",
              title: "Purpose of Data Collection",
              items: [
                { label: "Service Operation", desc: "To create and manage badminton parties, games, and player matching" },
                { label: "Skill Assessment", desc: "To calculate MMR ratings and provide skill analysis via radar charts" },
                { label: "Statistics", desc: "To display play history, win rates, calories burned, and performance trends" },
                { label: "Communication", desc: "To send notifications via LINE OA about party updates and invitations" },
                { label: "Service Improvement", desc: "To analyze usage patterns and improve the platform experience" }
              ]
            },
            {
              icon: "🔒",
              title: "Data Protection",
              items: [
                { label: "Security", desc: "Your data is encrypted and stored securely on protected servers" },
                { label: "No Sale of Data", desc: "We never sell or share your personal data with third parties for marketing" },
                { label: "Third-Party Login", desc: "We only receive basic profile data from LINE, Google, or Apple — we do not access your private messages or contacts" },
                { label: "SMS/Email Verification", desc: "Phone numbers and emails are used solely for identity verification" }
              ]
            },
            {
              icon: "⚖️",
              title: "Your Rights",
              items: [
                { label: "Access", desc: "You can view all your personal data through your profile page" },
                { label: "Correction", desc: "You can update or correct your personal information at any time" },
                { label: "Deletion", desc: "You can request deletion of your account and associated data" },
                { label: "Withdrawal", desc: "You can withdraw consent at any time by contacting the administrator" }
              ]
            }
          ],
          contactTitle: "Contact Us",
          contactDesc: "If you have questions about data protection or wish to exercise your rights, please contact us through the feedback section in the app.",
          checkboxLabel: "I have read and agree to the Privacy Policy and consent to the collection and use of my personal data as described above.",
          acceptBtn: "Accept & Continue"
        };
      }
      return {
        title: "นโยบายคุ้มครองข้อมูลส่วนบุคคล",
        subtitle: "พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
        intro: "Badminton Party ให้ความสำคัญกับความเป็นส่วนตัวของคุณ กรุณาอ่านและยอมรับนโยบายคุ้มครองข้อมูลก่อนเริ่มใช้งาน",
        aboutTitle: "เกี่ยวกับ Badminton Party",
        aboutDesc: "Badminton Party เป็นแพลตฟอร์มจัดการก๊วนแบดมินตัน สร้างปาร์ตี้ เชิญผู้เล่น จัดเกมแบ่งทีม บันทึกคะแนน และติดตามการใช้ลูกขนไก่",
        sections: [
          {
            icon: "📋",
            title: "ข้อมูลที่เราเก็บรวบรวม",
            items: [
              { label: "ข้อมูลบัญชี", desc: "ชื่อ, อีเมล, รูปโปรไฟล์ (จากการเข้าสู่ระบบผ่าน LINE, Google หรือ Apple)" },
              { label: "ข้อมูลโปรไฟล์", desc: "เพศ, วันเกิด, เบอร์โทรศัพท์, ที่อยู่ (ตำบล/อำเภอ/จังหวัด)" },
              { label: "ข้อมูลเกม", desc: "ประวัติการแข่ง, คะแนน, สถิติชนะ/แพ้, คะแนน MMR, ผลประเมินทักษะ" },
              { label: "ข้อมูลการสื่อสาร", desc: "ข้อความแชทในปาร์ตี้, ข้อเสนอแนะ/แจ้งปัญหา" },
              { label: "ข้อมูลการใช้งาน", desc: "เวลาเล่น, การเข้าร่วมปาร์ตี้, ประวัติการใช้สนาม" }
            ]
          },
          {
            icon: "🎯",
            title: "วัตถุประสงค์ในการเก็บข้อมูล",
            items: [
              { label: "การให้บริการ", desc: "เพื่อสร้างและจัดการปาร์ตี้แบดมินตัน, เกม และการจับคู่ผู้เล่น" },
              { label: "ประเมินทักษะ", desc: "เพื่อคำนวณคะแนน MMR และแสดงผลวิเคราะห์ทักษะเป็นกราฟเรดาร์" },
              { label: "สถิติ", desc: "เพื่อแสดงประวัติการเล่น, อัตราชนะ, แคลอรี่ที่เผาผลาญ และแนวโน้มผลงาน" },
              { label: "การสื่อสาร", desc: "เพื่อส่งแจ้งเตือนผ่าน LINE OA เกี่ยวกับอัปเดตปาร์ตี้และคำเชิญ" },
              { label: "ปรับปรุงบริการ", desc: "เพื่อวิเคราะห์รูปแบบการใช้งานและปรับปรุงแพลตฟอร์ม" }
            ]
          },
          {
            icon: "🔒",
            title: "การคุ้มครองข้อมูล",
            items: [
              { label: "ความปลอดภัย", desc: "ข้อมูลของคุณถูกเข้ารหัสและจัดเก็บอย่างปลอดภัยบนเซิร์ฟเวอร์ที่ได้รับการป้องกัน" },
              { label: "ไม่ขายข้อมูล", desc: "เราไม่เคยขายหรือแบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลภายนอกเพื่อการตลาด" },
              { label: "การเข้าสู่ระบบผ่านบุคคลที่สาม", desc: "เรารับเฉพาะข้อมูลโปรไฟล์พื้นฐานจาก LINE, Google หรือ Apple — เราไม่เข้าถึงข้อความส่วนตัวหรือรายชื่อผู้ติดต่อของคุณ" },
              { label: "การยืนยัน SMS/อีเมล", desc: "เบอร์โทรศัพท์และอีเมลใช้เพื่อการยืนยันตัวตนเท่านั้น" }
            ]
          },
          {
            icon: "⚖️",
            title: "สิทธิ์ของคุณ",
            items: [
              { label: "เข้าถึง", desc: "คุณสามารถดูข้อมูลส่วนบุคคลทั้งหมดผ่านหน้าโปรไฟล์" },
              { label: "แก้ไข", desc: "คุณสามารถอัปเดตหรือแก้ไขข้อมูลส่วนบุคคลได้ตลอดเวลา" },
              { label: "ลบข้อมูล", desc: "คุณสามารถขอลบบัญชีและข้อมูลที่เกี่ยวข้องได้" },
              { label: "ถอนความยินยอม", desc: "คุณสามารถถอนความยินยอมได้ตลอดเวลาโดยติดต่อผู้ดูแลระบบ" }
            ]
          }
        ],
        contactTitle: "ติดต่อเรา",
        contactDesc: "หากมีคำถามเกี่ยวกับการคุ้มครองข้อมูลหรือต้องการใช้สิทธิ์ของคุณ กรุณาติดต่อผ่านส่วนแจ้งปัญหา/ข้อเสนอแนะในแอป",
        checkboxLabel: "ข้าพเจ้าได้อ่านและยอมรับนโยบายคุ้มครองข้อมูลส่วนบุคคล และยินยอมให้เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลตามที่ระบุข้างต้น",
        acceptBtn: "ยอมรับและดำเนินการต่อ"
      };
    });
    const submit = () => {
      if (!agreed.value || isSubmitting.value) return;
      isSubmitting.value = true;
      router.post("/pdpa-consent", {}, {
        onFinish: () => {
          isSubmitting.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: content.value.title
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center"${_scopeId}><div class="text-4xl mb-2"${_scopeId}>🛡️</div><h1 class="text-lg font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(content.value.title)}</h1><p class="text-xs text-base-content/50 mt-1 m-0"${_scopeId}>${ssrInterpolate(content.value.subtitle)}</p><button class="mt-2 px-3 py-1 rounded-lg bg-base-content/10 text-[11px] text-base-content/60 border-0 cursor-pointer hover:bg-base-content/20 transition-colors"${_scopeId}>${ssrInterpolate(unref(locale) === "th" ? "🇬🇧 English" : "🇹🇭 ภาษาไทย")}</button></div><div class="bg-base-100 rounded-2xl border border-base-300 p-4"${_scopeId}><p class="text-sm text-base-content/70 m-0 leading-relaxed"${_scopeId}>${ssrInterpolate(content.value.intro)}</p></div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center gap-2"${_scopeId}><span class="text-base"${_scopeId}>🏸</span><div class="text-sm font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(content.value.aboutTitle)}</div></div><div class="p-4"${_scopeId}><p class="text-sm text-base-content/70 m-0 leading-relaxed"${_scopeId}>${ssrInterpolate(content.value.aboutDesc)}</p></div></div><!--[-->`);
            ssrRenderList(content.value.sections, (section, si) => {
              _push2(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center gap-2"${_scopeId}><span class="text-base"${_scopeId}>${ssrInterpolate(section.icon)}</span><div class="text-sm font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(section.title)}</div></div><div class="p-4 space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(section.items, (item, ii) => {
                _push2(`<div class="flex gap-3"${_scopeId}><div class="w-1.5 rounded-full bg-primary/30 shrink-0 mt-1"${_scopeId}></div><div${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>${ssrInterpolate(item.label)}</div><div class="text-sm text-base-content/60 mt-0.5 leading-relaxed"${_scopeId}>${ssrInterpolate(item.desc)}</div></div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            });
            _push2(`<!--]--><div class="bg-base-100 rounded-2xl border border-base-300 p-4 flex items-start gap-3"${_scopeId}><span class="text-base"${_scopeId}>📧</span><div${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>${ssrInterpolate(content.value.contactTitle)}</div><div class="text-sm text-base-content/60 mt-0.5 leading-relaxed"${_scopeId}>${ssrInterpolate(content.value.contactDesc)}</div></div></div><div class="bg-base-100 rounded-2xl border-2 border-primary/30 p-4 space-y-4"${_scopeId}><label class="flex items-start gap-3 cursor-pointer"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(agreed.value) ? ssrLooseContain(agreed.value, null) : agreed.value) ? " checked" : ""} type="checkbox" class="checkbox checkbox-primary mt-0.5 shrink-0"${_scopeId}><span class="text-sm text-base-content leading-relaxed font-medium"${_scopeId}>${ssrInterpolate(content.value.checkboxLabel)}</span></label><button${ssrIncludeBooleanAttr(!agreed.value || isSubmitting.value) ? " disabled" : ""} class="${ssrRenderClass([agreed.value ? "bg-primary text-primary-content hover:bg-primary/80" : "bg-base-300 text-base-content/40", "w-full py-3 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"])}"${_scopeId}>`);
            if (isSubmitting.value) {
              _push2(`<span class="loading loading-spinner loading-xs mr-1"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(content.value.acceptBtn)}</button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center" }, [
                  createVNode("div", { class: "text-4xl mb-2" }, "🛡️"),
                  createVNode("h1", { class: "text-lg font-bold text-base-content m-0" }, toDisplayString(content.value.title), 1),
                  createVNode("p", { class: "text-xs text-base-content/50 mt-1 m-0" }, toDisplayString(content.value.subtitle), 1),
                  createVNode("button", {
                    onClick: unref(toggleLocale),
                    class: "mt-2 px-3 py-1 rounded-lg bg-base-content/10 text-[11px] text-base-content/60 border-0 cursor-pointer hover:bg-base-content/20 transition-colors"
                  }, toDisplayString(unref(locale) === "th" ? "🇬🇧 English" : "🇹🇭 ภาษาไทย"), 9, ["onClick"])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 p-4" }, [
                  createVNode("p", { class: "text-sm text-base-content/70 m-0 leading-relaxed" }, toDisplayString(content.value.intro), 1)
                ]),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center gap-2" }, [
                    createVNode("span", { class: "text-base" }, "🏸"),
                    createVNode("div", { class: "text-sm font-bold text-base-content m-0" }, toDisplayString(content.value.aboutTitle), 1)
                  ]),
                  createVNode("div", { class: "p-4" }, [
                    createVNode("p", { class: "text-sm text-base-content/70 m-0 leading-relaxed" }, toDisplayString(content.value.aboutDesc), 1)
                  ])
                ]),
                (openBlock(true), createBlock(Fragment, null, renderList(content.value.sections, (section, si) => {
                  return openBlock(), createBlock("div", {
                    key: si,
                    class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden"
                  }, [
                    createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center gap-2" }, [
                      createVNode("span", { class: "text-base" }, toDisplayString(section.icon), 1),
                      createVNode("div", { class: "text-sm font-bold text-base-content m-0" }, toDisplayString(section.title), 1)
                    ]),
                    createVNode("div", { class: "p-4 space-y-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(section.items, (item, ii) => {
                        return openBlock(), createBlock("div", {
                          key: ii,
                          class: "flex gap-3"
                        }, [
                          createVNode("div", { class: "w-1.5 rounded-full bg-primary/30 shrink-0 mt-1" }),
                          createVNode("div", null, [
                            createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(item.label), 1),
                            createVNode("div", { class: "text-sm text-base-content/60 mt-0.5 leading-relaxed" }, toDisplayString(item.desc), 1)
                          ])
                        ]);
                      }), 128))
                    ])
                  ]);
                }), 128)),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 p-4 flex items-start gap-3" }, [
                  createVNode("span", { class: "text-base" }, "📧"),
                  createVNode("div", null, [
                    createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(content.value.contactTitle), 1),
                    createVNode("div", { class: "text-sm text-base-content/60 mt-0.5 leading-relaxed" }, toDisplayString(content.value.contactDesc), 1)
                  ])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-2xl border-2 border-primary/30 p-4 space-y-4" }, [
                  createVNode("label", { class: "flex items-start gap-3 cursor-pointer" }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => agreed.value = $event,
                      type: "checkbox",
                      class: "checkbox checkbox-primary mt-0.5 shrink-0"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelCheckbox, agreed.value]
                    ]),
                    createVNode("span", { class: "text-sm text-base-content leading-relaxed font-medium" }, toDisplayString(content.value.checkboxLabel), 1)
                  ]),
                  createVNode("button", {
                    onClick: submit,
                    disabled: !agreed.value || isSubmitting.value,
                    class: ["w-full py-3 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed", agreed.value ? "bg-primary text-primary-content hover:bg-primary/80" : "bg-base-300 text-base-content/40"]
                  }, [
                    isSubmitting.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "loading loading-spinner loading-xs mr-1"
                    })) : createCommentVNode("", true),
                    createTextVNode(" " + toDisplayString(content.value.acceptBtn), 1)
                  ], 10, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PdpaConsent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
