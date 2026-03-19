import { ref, computed, watch, onMounted, onUnmounted, unref, withCtx, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, createTextVNode, withDirectives, withKeys, vModelText, nextTick, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-DvUwNqCw.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, Head } from "@inertiajs/vue3";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
import { Realtime } from "ably";
import "./badmintonLayout-Bmnf0xqT.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./useToast-DyaFeJ92.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Chat",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    const page = usePage();
    const currentUserId = page.props.auth.user.id;
    const ablyKey = page.props.ably_key;
    const chatList = ref(page.props.chats || []);
    const selectedChatId = ref(page.props.selected_chat_id || null);
    const messages = ref([]);
    const newMessage = ref("");
    const messagesContainer = ref(null);
    const showSidebar = ref(true);
    const showNewChatModal = ref(false);
    const searchUser = ref("");
    const availableUsers = ref(page.props.users || []);
    const loadingMessages = ref(false);
    let ably = null;
    let currentChannel = null;
    const filteredUsers = computed(() => {
      if (!searchUser.value.trim()) return availableUsers.value;
      const q = searchUser.value.toLowerCase();
      return availableUsers.value.filter((u) => u.name.toLowerCase().includes(q));
    });
    const selectedChat = computed(() => chatList.value.find((c) => c.id === selectedChatId.value));
    const isMyMessage = (msg) => msg.sender_id === currentUserId;
    const showSenderName = (index) => {
      if (index === 0) return true;
      return messages.value[index - 1].sender_id !== messages.value[index].sender_id;
    };
    const formatTime = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      const now = /* @__PURE__ */ new Date();
      const diff = now - d;
      if (diff < 864e5) return formatTime(dateStr);
      if (diff < 1728e5) return t("chat.yesterday");
      return d.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
    };
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    };
    const fetchMessages = async (chatId) => {
      if (!chatId) return;
      loadingMessages.value = true;
      try {
        const response = await axios.post(`/chat/messages`, { chat_id: chatId });
        messages.value = response.data;
        scrollToBottom();
      } finally {
        loadingMessages.value = false;
      }
    };
    const subscribeToChat = (chatId) => {
      if (currentChannel) {
        currentChannel.unsubscribe();
        currentChannel.detach();
      }
      if (!ably || !chatId) return;
      currentChannel = ably.channels.get(`chat.${chatId}`);
      currentChannel.subscribe("message", (message) => {
        if (message.data.sender_id === currentUserId) return;
        messages.value.push(message.data);
        scrollToBottom();
        updateChatListLastMessage(chatId, message.data);
      });
    };
    const updateChatListLastMessage = (chatId, msg) => {
      var _a;
      const chat = chatList.value.find((c) => c.id === chatId);
      if (chat) {
        chat.last_message = msg.content;
        chat.last_message_at = msg.created_at;
        chat.last_sender_name = (_a = msg.sender) == null ? void 0 : _a.name;
      }
    };
    const selectChat = (chatId) => {
      selectedChatId.value = chatId;
      fetchMessages(chatId);
      subscribeToChat(chatId);
      markAsRead(chatId);
      const chat = chatList.value.find((c) => c.id === chatId);
      if (chat) chat.unread_count = 0;
      if (window.innerWidth < 768) {
        showSidebar.value = false;
      }
    };
    const markAsRead = async (chatId) => {
      try {
        await axios.post(`/chat/${chatId}/read`);
      } catch (e) {
      }
    };
    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedChatId.value) return;
      const content = newMessage.value;
      newMessage.value = "";
      const optimisticMsg = {
        id: Date.now(),
        chat_id: selectedChatId.value,
        sender_id: currentUserId,
        content,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        sender: page.props.auth.user
      };
      messages.value.push(optimisticMsg);
      scrollToBottom();
      updateChatListLastMessage(selectedChatId.value, optimisticMsg);
      try {
        await axios.post(`/chat/${selectedChatId.value}/send-message`, {
          sender_id: currentUserId,
          content
        });
      } catch (err) {
        messages.value = messages.value.filter((m) => m.id !== optimisticMsg.id);
      }
    };
    const startChatWith = async (user) => {
      try {
        const response = await axios.post("/chat/create", {
          user_ids: [currentUserId, user.id],
          is_group: false,
          name: null
        });
        const chatId = response.data.chat_id;
        showNewChatModal.value = false;
        searchUser.value = "";
        if (!chatList.value.find((c) => c.id === chatId)) {
          chatList.value.unshift({
            id: chatId,
            name: user.name,
            avatar: user.avatar,
            is_group: false,
            last_message: null,
            last_message_at: null,
            last_sender_name: null,
            participants_count: 2
          });
        }
        selectChat(chatId);
      } catch (err) {
        console.error("Failed to create chat:", err);
      }
    };
    const backToList = () => {
      showSidebar.value = true;
    };
    watch(messages, () => scrollToBottom(), { deep: true });
    onMounted(() => {
      ably = new Realtime({
        key: ablyKey,
        clientId: `${currentUserId}`
      });
      if (selectedChatId.value) {
        fetchMessages(selectedChatId.value);
        subscribeToChat(selectedChatId.value);
        if (window.innerWidth < 768) {
          showSidebar.value = false;
        }
      }
    });
    onUnmounted(() => {
      if (currentChannel) {
        currentChannel.unsubscribe();
        currentChannel.detach();
      }
      if (ably) {
        ably.close();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: unref(t)("chat.title")
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<div class="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] bg-base-100 rounded-2xl border border-base-300 shadow-xs overflow-hidden -mx-1 sm:mx-0"${_scopeId}><div class="${ssrRenderClass([showSidebar.value ? "w-full md:w-80" : "hidden md:flex md:w-80", "border-r border-base-300 flex flex-col shrink-0 bg-base-100"])}"${_scopeId}><div class="px-4 py-3 border-b border-base-300 flex items-center justify-between shrink-0"${_scopeId}><h2 class="text-base font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(unref(t)("chat.title"))}</h2><button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors text-sm"${_scopeId}>+</button></div><div class="flex-1 overflow-y-auto"${_scopeId}>`);
            if (chatList.value.length === 0) {
              _push2(`<div class="flex flex-col items-center justify-center h-full text-center px-4"${_scopeId}><span class="text-3xl mb-2"${_scopeId}>💬</span><p class="text-sm text-base-content/50 m-0"${_scopeId}>${ssrInterpolate(unref(t)("chat.noChats"))}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(chatList.value, (chat) => {
              var _a2;
              _push2(`<div class="${ssrRenderClass([selectedChatId.value === chat.id ? "bg-primary/5 border-l-2 border-l-primary" : "", "flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-base-200 transition-colors border-b border-base-200/50"])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: chat.avatar,
                name: chat.name,
                size: "md",
                rounded: "full",
                class: "shrink-0"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="text-sm font-semibold text-base-content truncate"${_scopeId}>${ssrInterpolate(chat.name)}</span><span class="text-[10px] text-base-content/40 shrink-0 ml-2"${_scopeId}>${ssrInterpolate(formatDate(chat.last_message_at))}</span></div><p class="text-xs text-base-content/50 m-0 mt-0.5 truncate"${_scopeId}>`);
              if (chat.last_message) {
                _push2(`<!--[-->`);
                if (chat.is_group) {
                  _push2(`<span class="text-base-content/60"${_scopeId}>${ssrInterpolate((_a2 = chat.last_sender_name) == null ? void 0 : _a2.split(" ")[0])}: </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(chat.last_message)}<!--]-->`);
              } else {
                _push2(`<span class="italic"${_scopeId}>${ssrInterpolate(unref(t)("chat.noMessages"))}</span>`);
              }
              _push2(`</p></div><div class="flex flex-col items-end gap-1 shrink-0"${_scopeId}>`);
              if (chat.is_group) {
                _push2(`<span class="badge badge-xs badge-ghost"${_scopeId}>${ssrInterpolate(chat.participants_count)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (chat.unread_count > 0) {
                _push2(`<span class="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold leading-none"${_scopeId}>${ssrInterpolate(chat.unread_count > 99 ? "99+" : chat.unread_count)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div></div><div class="${ssrRenderClass([showSidebar.value ? "hidden md:flex" : "flex", "flex-1 flex flex-col min-w-0"])}"${_scopeId}>`);
            if (!selectedChatId.value) {
              _push2(`<div class="flex-1 flex flex-col items-center justify-center text-center px-4"${_scopeId}><div class="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4"${_scopeId}><span class="text-4xl"${_scopeId}>💬</span></div><h3 class="text-lg font-bold text-base-content m-0 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("chat.selectChat"))}</h3><p class="text-sm text-base-content/50 m-0"${_scopeId}>${ssrInterpolate(unref(t)("chat.selectChatDesc"))}</p></div>`);
            } else {
              _push2(`<!--[--><div class="flex items-center gap-3 px-4 py-3 border-b border-base-300 shrink-0 bg-base-200/50"${_scopeId}><button class="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-base-200 border-0 cursor-pointer text-base-content/60 hover:bg-base-300 transition-colors"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"${_scopeId}></path></svg></button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: (_a = selectedChat.value) == null ? void 0 : _a.avatar,
                name: (_b = selectedChat.value) == null ? void 0 : _b.name,
                size: "md",
                rounded: "full",
                class: "shrink-0"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex-1 min-w-0"${_scopeId}><h3 class="text-sm font-bold text-base-content m-0 truncate"${_scopeId}>${ssrInterpolate((_c = selectedChat.value) == null ? void 0 : _c.name)}</h3><p class="text-[10px] text-base-content/50 m-0"${_scopeId}>${ssrInterpolate(messages.value.length)} ${ssrInterpolate(unref(t)("chat.messages"))}</p></div></div><div class="flex-1 overflow-y-auto py-4 px-4 space-y-3 min-h-0 bg-base-200/30"${_scopeId}>`);
              if (loadingMessages.value) {
                _push2(`<div class="flex items-center justify-center h-full"${_scopeId}><span class="loading loading-spinner loading-md text-primary"${_scopeId}></span></div>`);
              } else if (messages.value.length === 0) {
                _push2(`<div class="flex flex-col items-center justify-center h-full text-center"${_scopeId}><span class="text-3xl mb-2"${_scopeId}>👋</span><p class="text-sm text-base-content/50 m-0"${_scopeId}>${ssrInterpolate(unref(t)("chat.startChat"))}</p></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(messages.value, (msg, index) => {
                var _a2, _b2, _c2;
                _push2(`<div class="${ssrRenderClass([isMyMessage(msg) ? "flex-row-reverse" : "flex-row", "flex gap-2"])}"${_scopeId}>`);
                if (!isMyMessage(msg)) {
                  _push2(`<div class="shrink-0 self-end"${_scopeId}>`);
                  _push2(ssrRenderComponent(_sfc_main$2, {
                    src: (_a2 = msg.sender) == null ? void 0 : _a2.avatar,
                    name: (_b2 = msg.sender) == null ? void 0 : _b2.name,
                    size: "sm",
                    rounded: "full"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="max-w-[75%]"${_scopeId}>`);
                if (!isMyMessage(msg) && showSenderName(index)) {
                  _push2(`<p class="text-[10px] text-base-content/50 m-0 mb-0.5 ml-1"${_scopeId}>${ssrInterpolate(((_c2 = msg.sender) == null ? void 0 : _c2.name) || "Unknown")}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="${ssrRenderClass([isMyMessage(msg) ? "bg-primary text-white rounded-2xl rounded-br-md" : "bg-base-100 text-base-content border border-base-300 rounded-2xl rounded-bl-md", "px-3 py-2 text-sm leading-relaxed"])}"${_scopeId}>${ssrInterpolate(msg.content)}</div><p class="${ssrRenderClass([isMyMessage(msg) ? "text-right mr-1" : "ml-1", "text-[10px] text-base-content/40 m-0 mt-0.5"])}"${_scopeId}>${ssrInterpolate(formatTime(msg.created_at))}</p></div></div>`);
              });
              _push2(`<!--]--></div><div class="shrink-0 px-4 py-3 border-t border-base-300 bg-base-100"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><input${ssrRenderAttr("value", newMessage.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("chat.typePlaceholder"))} class="flex-1 px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden transition-all"${_scopeId}><button${ssrIncludeBooleanAttr(!newMessage.value.trim()) ? " disabled" : ""} class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/80 text-white border-0 cursor-pointer transition-colors shrink-0 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"${_scopeId}></path></svg></button></div></div><!--]-->`);
            }
            _push2(`</div></div><dialog class="${ssrRenderClass([{ "modal-open": showNewChatModal.value }, "modal"])}"${_scopeId}><div class="modal-box max-w-sm p-0"${_scopeId}><div class="flex items-center justify-between px-4 pt-4 pb-2"${_scopeId}><h3 class="text-base font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(unref(t)("chat.newChat"))}</h3><button class="w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors"${_scopeId}><span class="text-base-content/60 text-sm"${_scopeId}>✕</span></button></div><div class="px-4 pb-2"${_scopeId}><input${ssrRenderAttr("value", searchUser.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("chat.searchUser"))} class="w-full px-3 py-2 rounded-lg border border-base-300 bg-base-100 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-hidden"${_scopeId}></div><div class="max-h-80 overflow-y-auto px-2 pb-4"${_scopeId}>`);
            if (filteredUsers.value.length === 0) {
              _push2(`<div class="text-center py-6 text-sm text-base-content/50"${_scopeId}>${ssrInterpolate(unref(t)("chat.noUsers"))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(filteredUsers.value, (user) => {
              _push2(`<div class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: user.avatar,
                name: user.name,
                size: "sm",
                rounded: "full"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm font-medium text-base-content truncate"${_scopeId}>${ssrInterpolate(user.name)}</span></div>`);
            });
            _push2(`<!--]--></div></div><form method="dialog" class="modal-backdrop"${_scopeId}><button${_scopeId}>close</button></form></dialog>`);
          } else {
            return [
              createVNode("div", { class: "flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] bg-base-100 rounded-2xl border border-base-300 shadow-xs overflow-hidden -mx-1 sm:mx-0" }, [
                createVNode("div", {
                  class: ["border-r border-base-300 flex flex-col shrink-0 bg-base-100", showSidebar.value ? "w-full md:w-80" : "hidden md:flex md:w-80"]
                }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-300 flex items-center justify-between shrink-0" }, [
                    createVNode("h2", { class: "text-base font-bold text-base-content m-0" }, toDisplayString(unref(t)("chat.title")), 1),
                    createVNode("button", {
                      onClick: ($event) => showNewChatModal.value = true,
                      class: "w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors text-sm"
                    }, "+", 8, ["onClick"])
                  ]),
                  createVNode("div", { class: "flex-1 overflow-y-auto" }, [
                    chatList.value.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex flex-col items-center justify-center h-full text-center px-4"
                    }, [
                      createVNode("span", { class: "text-3xl mb-2" }, "💬"),
                      createVNode("p", { class: "text-sm text-base-content/50 m-0" }, toDisplayString(unref(t)("chat.noChats")), 1)
                    ])) : createCommentVNode("", true),
                    (openBlock(true), createBlock(Fragment, null, renderList(chatList.value, (chat) => {
                      var _a2;
                      return openBlock(), createBlock("div", {
                        key: chat.id,
                        class: ["flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-base-200 transition-colors border-b border-base-200/50", selectedChatId.value === chat.id ? "bg-primary/5 border-l-2 border-l-primary" : ""],
                        onClick: ($event) => selectChat(chat.id)
                      }, [
                        createVNode(_sfc_main$2, {
                          src: chat.avatar,
                          name: chat.name,
                          size: "md",
                          rounded: "full",
                          class: "shrink-0"
                        }, null, 8, ["src", "name"]),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "flex items-center justify-between" }, [
                            createVNode("span", { class: "text-sm font-semibold text-base-content truncate" }, toDisplayString(chat.name), 1),
                            createVNode("span", { class: "text-[10px] text-base-content/40 shrink-0 ml-2" }, toDisplayString(formatDate(chat.last_message_at)), 1)
                          ]),
                          createVNode("p", { class: "text-xs text-base-content/50 m-0 mt-0.5 truncate" }, [
                            chat.last_message ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              chat.is_group ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "text-base-content/60"
                              }, toDisplayString((_a2 = chat.last_sender_name) == null ? void 0 : _a2.split(" ")[0]) + ": ", 1)) : createCommentVNode("", true),
                              createTextVNode(" " + toDisplayString(chat.last_message), 1)
                            ], 64)) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "italic"
                            }, toDisplayString(unref(t)("chat.noMessages")), 1))
                          ])
                        ]),
                        createVNode("div", { class: "flex flex-col items-end gap-1 shrink-0" }, [
                          chat.is_group ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "badge badge-xs badge-ghost"
                          }, toDisplayString(chat.participants_count), 1)) : createCommentVNode("", true),
                          chat.unread_count > 0 ? (openBlock(), createBlock("span", {
                            key: 1,
                            class: "min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold leading-none"
                          }, toDisplayString(chat.unread_count > 99 ? "99+" : chat.unread_count), 1)) : createCommentVNode("", true)
                        ])
                      ], 10, ["onClick"]);
                    }), 128))
                  ])
                ], 2),
                createVNode("div", {
                  class: ["flex-1 flex flex-col min-w-0", showSidebar.value ? "hidden md:flex" : "flex"]
                }, [
                  !selectedChatId.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex-1 flex flex-col items-center justify-center text-center px-4"
                  }, [
                    createVNode("div", { class: "w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4" }, [
                      createVNode("span", { class: "text-4xl" }, "💬")
                    ]),
                    createVNode("h3", { class: "text-lg font-bold text-base-content m-0 mb-1" }, toDisplayString(unref(t)("chat.selectChat")), 1),
                    createVNode("p", { class: "text-sm text-base-content/50 m-0" }, toDisplayString(unref(t)("chat.selectChatDesc")), 1)
                  ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("div", { class: "flex items-center gap-3 px-4 py-3 border-b border-base-300 shrink-0 bg-base-200/50" }, [
                      createVNode("button", {
                        onClick: backToList,
                        class: "md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-base-200 border-0 cursor-pointer text-base-content/60 hover:bg-base-300 transition-colors"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M15 19l-7-7 7-7"
                          })
                        ]))
                      ]),
                      createVNode(_sfc_main$2, {
                        src: (_d = selectedChat.value) == null ? void 0 : _d.avatar,
                        name: (_e = selectedChat.value) == null ? void 0 : _e.name,
                        size: "md",
                        rounded: "full",
                        class: "shrink-0"
                      }, null, 8, ["src", "name"]),
                      createVNode("div", { class: "flex-1 min-w-0" }, [
                        createVNode("h3", { class: "text-sm font-bold text-base-content m-0 truncate" }, toDisplayString((_f = selectedChat.value) == null ? void 0 : _f.name), 1),
                        createVNode("p", { class: "text-[10px] text-base-content/50 m-0" }, toDisplayString(messages.value.length) + " " + toDisplayString(unref(t)("chat.messages")), 1)
                      ])
                    ]),
                    createVNode("div", {
                      ref_key: "messagesContainer",
                      ref: messagesContainer,
                      class: "flex-1 overflow-y-auto py-4 px-4 space-y-3 min-h-0 bg-base-200/30"
                    }, [
                      loadingMessages.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-center h-full"
                      }, [
                        createVNode("span", { class: "loading loading-spinner loading-md text-primary" })
                      ])) : messages.value.length === 0 ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex flex-col items-center justify-center h-full text-center"
                      }, [
                        createVNode("span", { class: "text-3xl mb-2" }, "👋"),
                        createVNode("p", { class: "text-sm text-base-content/50 m-0" }, toDisplayString(unref(t)("chat.startChat")), 1)
                      ])) : createCommentVNode("", true),
                      (openBlock(true), createBlock(Fragment, null, renderList(messages.value, (msg, index) => {
                        var _a2, _b2, _c2;
                        return openBlock(), createBlock("div", {
                          key: msg.id || index,
                          class: ["flex gap-2", isMyMessage(msg) ? "flex-row-reverse" : "flex-row"]
                        }, [
                          !isMyMessage(msg) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "shrink-0 self-end"
                          }, [
                            createVNode(_sfc_main$2, {
                              src: (_a2 = msg.sender) == null ? void 0 : _a2.avatar,
                              name: (_b2 = msg.sender) == null ? void 0 : _b2.name,
                              size: "sm",
                              rounded: "full"
                            }, null, 8, ["src", "name"])
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "max-w-[75%]" }, [
                            !isMyMessage(msg) && showSenderName(index) ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-[10px] text-base-content/50 m-0 mb-0.5 ml-1"
                            }, toDisplayString(((_c2 = msg.sender) == null ? void 0 : _c2.name) || "Unknown"), 1)) : createCommentVNode("", true),
                            createVNode("div", {
                              class: ["px-3 py-2 text-sm leading-relaxed", isMyMessage(msg) ? "bg-primary text-white rounded-2xl rounded-br-md" : "bg-base-100 text-base-content border border-base-300 rounded-2xl rounded-bl-md"]
                            }, toDisplayString(msg.content), 3),
                            createVNode("p", {
                              class: ["text-[10px] text-base-content/40 m-0 mt-0.5", isMyMessage(msg) ? "text-right mr-1" : "ml-1"]
                            }, toDisplayString(formatTime(msg.created_at)), 3)
                          ])
                        ], 2);
                      }), 128))
                    ], 512),
                    createVNode("div", { class: "shrink-0 px-4 py-3 border-t border-base-300 bg-base-100" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => newMessage.value = $event,
                          onKeyup: withKeys(sendMessage, ["enter"]),
                          type: "text",
                          placeholder: unref(t)("chat.typePlaceholder"),
                          class: "flex-1 px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden transition-all"
                        }, null, 40, ["onUpdate:modelValue", "placeholder"]), [
                          [vModelText, newMessage.value]
                        ]),
                        createVNode("button", {
                          onClick: sendMessage,
                          disabled: !newMessage.value.trim(),
                          class: "w-10 h-10 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/80 text-white border-0 cursor-pointer transition-colors shrink-0 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4",
                            fill: "none",
                            stroke: "currentColor",
                            "stroke-width": "2",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                            })
                          ]))
                        ], 8, ["disabled"])
                      ])
                    ])
                  ], 64))
                ], 2)
              ]),
              createVNode("dialog", {
                class: ["modal", { "modal-open": showNewChatModal.value }]
              }, [
                createVNode("div", { class: "modal-box max-w-sm p-0" }, [
                  createVNode("div", { class: "flex items-center justify-between px-4 pt-4 pb-2" }, [
                    createVNode("h3", { class: "text-base font-bold text-base-content m-0" }, toDisplayString(unref(t)("chat.newChat")), 1),
                    createVNode("button", {
                      onClick: ($event) => {
                        showNewChatModal.value = false;
                        searchUser.value = "";
                      },
                      class: "w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors"
                    }, [
                      createVNode("span", { class: "text-base-content/60 text-sm" }, "✕")
                    ], 8, ["onClick"])
                  ]),
                  createVNode("div", { class: "px-4 pb-2" }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => searchUser.value = $event,
                      type: "text",
                      placeholder: unref(t)("chat.searchUser"),
                      class: "w-full px-3 py-2 rounded-lg border border-base-300 bg-base-100 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-hidden"
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, searchUser.value]
                    ])
                  ]),
                  createVNode("div", { class: "max-h-80 overflow-y-auto px-2 pb-4" }, [
                    filteredUsers.value.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-center py-6 text-sm text-base-content/50"
                    }, toDisplayString(unref(t)("chat.noUsers")), 1)) : createCommentVNode("", true),
                    (openBlock(true), createBlock(Fragment, null, renderList(filteredUsers.value, (user) => {
                      return openBlock(), createBlock("div", {
                        key: user.id,
                        class: "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-base-200 transition-colors",
                        onClick: ($event) => startChatWith(user)
                      }, [
                        createVNode(_sfc_main$2, {
                          src: user.avatar,
                          name: user.name,
                          size: "sm",
                          rounded: "full"
                        }, null, 8, ["src", "name"]),
                        createVNode("span", { class: "text-sm font-medium text-base-content truncate" }, toDisplayString(user.name), 1)
                      ], 8, ["onClick"]);
                    }), 128))
                  ])
                ]),
                createVNode("form", {
                  method: "dialog",
                  class: "modal-backdrop"
                }, [
                  createVNode("button", {
                    onClick: ($event) => {
                      showNewChatModal.value = false;
                      searchUser.value = "";
                    }
                  }, "close", 8, ["onClick"])
                ])
              ], 2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Chat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
