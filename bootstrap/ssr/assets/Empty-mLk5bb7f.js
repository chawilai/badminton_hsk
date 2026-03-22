import { ref, unref, withCtx, createVNode, withDirectives, vModelCheckbox, createBlock, openBlock, vShow, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-BqVs4mIv.js";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import { router, Head } from "@inertiajs/vue3";
import "./badmintonLayout-C3Xd2fBf.js";
import "./useLocale-QwrDLuQY.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Empty",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const visible = ref(false);
    ref([
      {
        label: "Add",
        icon: "pencil",
        command: () => {
          toast.add({
            severity: "info",
            summary: "Add",
            detail: "Data Added"
          });
        }
      },
      {
        label: "Update",
        icon: "refresh",
        command: () => {
          toast.add({
            severity: "success",
            summary: "Update",
            detail: "Data Updated"
          });
        }
      },
      {
        label: "Delete",
        icon: "trash",
        command: () => {
          toast.add({
            severity: "error",
            summary: "Delete",
            detail: "Data Deleted"
          });
        }
      },
      {
        label: "Upload",
        icon: "upload",
        command: () => {
          router.visit("/fileupload");
        }
      },
      {
        label: "Vue Website",
        icon: "external-link",
        command: () => {
          window.location.href = "https://vuejs.org/";
        }
      }
    ]);
    const sidebarSections = ref({
      favorites: true,
      application: true,
      reportsExpanded: false,
      revenueExpanded: false
    });
    const toggleSection = (section) => {
      sidebarSections.value[section] = !sidebarSections.value[section];
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Welcome" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="font-semibold text-xl text-gray-800 leading-tight"${_scopeId}> First Setup </h2>`);
          } else {
            return [
              createVNode("h2", { class: "font-semibold text-xl text-gray-800 leading-tight" }, " First Setup ")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-12 gap-4"${_scopeId}><div class="col-span-12"${_scopeId}><div class="card p-4"${_scopeId}><h5 class="text-lg font-semibold"${_scopeId}>Empty Page</h5><p${_scopeId}> Use this page to start from scratch and place your custom content. </p></div></div><div class="card p-4"${_scopeId}></div><div class="card w-full p-4"${_scopeId}><div class="drawer"${_scopeId}><input id="sidebar-drawer" type="checkbox" class="drawer-toggle"${ssrIncludeBooleanAttr(Array.isArray(visible.value) ? ssrLooseContain(visible.value, null) : visible.value) ? " checked" : ""}${_scopeId}><div class="drawer-content"${_scopeId}><button class="btn btn-ghost"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"${_scopeId}></path></svg></button></div><div class="drawer-side z-50"${_scopeId}><label for="sidebar-drawer" aria-label="close sidebar" class="drawer-overlay"${_scopeId}></label><div class="menu bg-base-100 text-base-content min-h-full w-80 p-0 flex flex-col h-full"${_scopeId}><div class="flex items-center justify-between px-4 pt-3 shrink-0"${_scopeId}><span class="inline-flex items-center gap-2"${_scopeId}><svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z" fill="currentColor"${_scopeId}></path><path d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z" fill="currentColor"${_scopeId}></path></svg><span class="font-semibold text-2xl text-primary"${_scopeId}>Your Logo</span></span><span${_scopeId}><button type="button" class="btn btn-sm btn-circle btn-outline"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg></button></span></div><div class="overflow-y-auto"${_scopeId}><ul class="list-none p-3 m-0"${_scopeId}><li${_scopeId}><div class="p-3 flex items-center justify-between text-gray-600 cursor-pointer hover:bg-base-200 rounded-lg"${_scopeId}><span class="font-medium"${_scopeId}>FAVORITES</span><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([{ "rotate-180": sidebarSections.value.favorites }, "w-4 h-4 transition-transform"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"${_scopeId}></path></svg></div><ul style="${ssrRenderStyle(sidebarSections.value.favorites ? null : { display: "none" })}" class="list-none p-0 m-0 overflow-hidden"${_scopeId}><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Dashboard</span></a></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Bookmarks</span></a></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Reports</span><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([{ "rotate-180": sidebarSections.value.reportsExpanded }, "w-4 h-4 ml-auto transition-transform"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"${_scopeId}></path></svg></a><ul style="${ssrRenderStyle(sidebarSections.value.reportsExpanded ? null : { display: "none" })}" class="list-none py-0 pl-3 pr-0 m-0 overflow-y-hidden"${_scopeId}><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Revenue</span><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([{ "rotate-180": sidebarSections.value.revenueExpanded }, "w-4 h-4 ml-auto transition-transform"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"${_scopeId}></path></svg></a><ul style="${ssrRenderStyle(sidebarSections.value.revenueExpanded ? null : { display: "none" })}" class="list-none py-0 pl-3 pr-0 m-0 overflow-y-hidden"${_scopeId}><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>View</span></a></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Search</span></a></li></ul></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Expenses</span></a></li></ul></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Team</span></a></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Messages</span><span class="inline-flex items-center justify-center ml-auto bg-primary text-primary-content rounded-full" style="${ssrRenderStyle({ "min-width": "1.5rem", "height": "1.5rem" })}"${_scopeId}>3</span></a></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Calendar</span></a></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Settings</span></a></li></ul></li></ul><ul class="list-none p-3 m-0"${_scopeId}><li${_scopeId}><div class="p-3 flex items-center justify-between text-gray-600 cursor-pointer hover:bg-base-200 rounded-lg"${_scopeId}><span class="font-medium"${_scopeId}>APPLICATION</span><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([{ "rotate-180": sidebarSections.value.application }, "w-4 h-4 transition-transform"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"${_scopeId}></path></svg></div><ul style="${ssrRenderStyle(sidebarSections.value.application ? null : { display: "none" })}" class="list-none p-0 m-0 overflow-hidden"${_scopeId}><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Projects</span></a></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Performance</span></a></li><li${_scopeId}><a class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>Settings</span></a></li></ul></li></ul></div><div class="mt-auto"${_scopeId}><hr class="mb-3 mx-3 border-t border-base-300"${_scopeId}><a class="m-3 flex items-center cursor-pointer p-3 gap-2 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"${_scopeId}><div class="avatar"${_scopeId}><div class="w-10 rounded-full"${_scopeId}><img src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" alt="Amy Elsner"${_scopeId}></div></div><span class="font-bold"${_scopeId}>Amy Elsner</span></a></div></div></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-12 gap-4" }, [
                createVNode("div", { class: "col-span-12" }, [
                  createVNode("div", { class: "card p-4" }, [
                    createVNode("h5", { class: "text-lg font-semibold" }, "Empty Page"),
                    createVNode("p", null, " Use this page to start from scratch and place your custom content. ")
                  ])
                ]),
                createVNode("div", { class: "card p-4" }),
                createVNode("div", { class: "card w-full p-4" }, [
                  createVNode("div", { class: "drawer" }, [
                    withDirectives(createVNode("input", {
                      id: "sidebar-drawer",
                      type: "checkbox",
                      class: "drawer-toggle",
                      "onUpdate:modelValue": ($event) => visible.value = $event
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelCheckbox, visible.value]
                    ]),
                    createVNode("div", { class: "drawer-content" }, [
                      createVNode("button", {
                        class: "btn btn-ghost",
                        onClick: ($event) => visible.value = true
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          class: "w-5 h-5",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          "stroke-width": "2"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M4 6h16M4 12h16M4 18h16"
                          })
                        ]))
                      ], 8, ["onClick"])
                    ]),
                    createVNode("div", { class: "drawer-side z-50" }, [
                      createVNode("label", {
                        for: "sidebar-drawer",
                        "aria-label": "close sidebar",
                        class: "drawer-overlay"
                      }),
                      createVNode("div", { class: "menu bg-base-100 text-base-content min-h-full w-80 p-0 flex flex-col h-full" }, [
                        createVNode("div", { class: "flex items-center justify-between px-4 pt-3 shrink-0" }, [
                          createVNode("span", { class: "inline-flex items-center gap-2" }, [
                            (openBlock(), createBlock("svg", {
                              width: "35",
                              height: "40",
                              viewBox: "0 0 35 40",
                              fill: "none",
                              xmlns: "http://www.w3.org/2000/svg"
                            }, [
                              createVNode("path", {
                                d: "M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z",
                                fill: "currentColor"
                              }),
                              createVNode("path", {
                                d: "M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z",
                                fill: "currentColor"
                              })
                            ])),
                            createVNode("span", { class: "font-semibold text-2xl text-primary" }, "Your Logo")
                          ]),
                          createVNode("span", null, [
                            createVNode("button", {
                              type: "button",
                              onClick: ($event) => visible.value = false,
                              class: "btn btn-sm btn-circle btn-outline"
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
                                  d: "M6 18L18 6M6 6l12 12"
                                })
                              ]))
                            ], 8, ["onClick"])
                          ])
                        ]),
                        createVNode("div", { class: "overflow-y-auto" }, [
                          createVNode("ul", { class: "list-none p-3 m-0" }, [
                            createVNode("li", null, [
                              createVNode("div", {
                                onClick: ($event) => toggleSection("favorites"),
                                class: "p-3 flex items-center justify-between text-gray-600 cursor-pointer hover:bg-base-200 rounded-lg"
                              }, [
                                createVNode("span", { class: "font-medium" }, "FAVORITES"),
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  class: ["w-4 h-4 transition-transform", { "rotate-180": sidebarSections.value.favorites }],
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  stroke: "currentColor",
                                  "stroke-width": "2"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M19 9l-7 7-7-7"
                                  })
                                ], 2))
                              ], 8, ["onClick"]),
                              withDirectives(createVNode("ul", { class: "list-none p-0 m-0 overflow-hidden" }, [
                                createVNode("li", null, [
                                  createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Dashboard")
                                  ])
                                ]),
                                createVNode("li", null, [
                                  createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Bookmarks")
                                  ])
                                ]),
                                createVNode("li", null, [
                                  createVNode("a", {
                                    onClick: ($event) => toggleSection("reportsExpanded"),
                                    class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Reports"),
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: ["w-4 h-4 ml-auto transition-transform", { "rotate-180": sidebarSections.value.reportsExpanded }],
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M19 9l-7 7-7-7"
                                      })
                                    ], 2))
                                  ], 8, ["onClick"]),
                                  withDirectives(createVNode("ul", { class: "list-none py-0 pl-3 pr-0 m-0 overflow-y-hidden" }, [
                                    createVNode("li", null, [
                                      createVNode("a", {
                                        onClick: ($event) => toggleSection("revenueExpanded"),
                                        class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                      }, [
                                        (openBlock(), createBlock("svg", {
                                          xmlns: "http://www.w3.org/2000/svg",
                                          class: "w-4 h-4 mr-2",
                                          fill: "none",
                                          viewBox: "0 0 24 24",
                                          stroke: "currentColor",
                                          "stroke-width": "2"
                                        }, [
                                          createVNode("path", {
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                            d: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                          })
                                        ])),
                                        createVNode("span", { class: "font-medium" }, "Revenue"),
                                        (openBlock(), createBlock("svg", {
                                          xmlns: "http://www.w3.org/2000/svg",
                                          class: ["w-4 h-4 ml-auto transition-transform", { "rotate-180": sidebarSections.value.revenueExpanded }],
                                          fill: "none",
                                          viewBox: "0 0 24 24",
                                          stroke: "currentColor",
                                          "stroke-width": "2"
                                        }, [
                                          createVNode("path", {
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                            d: "M19 9l-7 7-7-7"
                                          })
                                        ], 2))
                                      ], 8, ["onClick"]),
                                      withDirectives(createVNode("ul", { class: "list-none py-0 pl-3 pr-0 m-0 overflow-y-hidden" }, [
                                        createVNode("li", null, [
                                          createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                            (openBlock(), createBlock("svg", {
                                              xmlns: "http://www.w3.org/2000/svg",
                                              class: "w-4 h-4 mr-2",
                                              fill: "none",
                                              viewBox: "0 0 24 24",
                                              stroke: "currentColor",
                                              "stroke-width": "2"
                                            }, [
                                              createVNode("path", {
                                                "stroke-linecap": "round",
                                                "stroke-linejoin": "round",
                                                d: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                              })
                                            ])),
                                            createVNode("span", { class: "font-medium" }, "View")
                                          ])
                                        ]),
                                        createVNode("li", null, [
                                          createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                            (openBlock(), createBlock("svg", {
                                              xmlns: "http://www.w3.org/2000/svg",
                                              class: "w-4 h-4 mr-2",
                                              fill: "none",
                                              viewBox: "0 0 24 24",
                                              stroke: "currentColor",
                                              "stroke-width": "2"
                                            }, [
                                              createVNode("path", {
                                                "stroke-linecap": "round",
                                                "stroke-linejoin": "round",
                                                d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                              })
                                            ])),
                                            createVNode("span", { class: "font-medium" }, "Search")
                                          ])
                                        ])
                                      ], 512), [
                                        [vShow, sidebarSections.value.revenueExpanded]
                                      ])
                                    ]),
                                    createVNode("li", null, [
                                      createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                        (openBlock(), createBlock("svg", {
                                          xmlns: "http://www.w3.org/2000/svg",
                                          class: "w-4 h-4 mr-2",
                                          fill: "none",
                                          viewBox: "0 0 24 24",
                                          stroke: "currentColor",
                                          "stroke-width": "2"
                                        }, [
                                          createVNode("path", {
                                            "stroke-linecap": "round",
                                            "stroke-linejoin": "round",
                                            d: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                          })
                                        ])),
                                        createVNode("span", { class: "font-medium" }, "Expenses")
                                      ])
                                    ])
                                  ], 512), [
                                    [vShow, sidebarSections.value.reportsExpanded]
                                  ])
                                ]),
                                createVNode("li", null, [
                                  createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Team")
                                  ])
                                ]),
                                createVNode("li", null, [
                                  createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Messages"),
                                    createVNode("span", {
                                      class: "inline-flex items-center justify-center ml-auto bg-primary text-primary-content rounded-full",
                                      style: { "min-width": "1.5rem", "height": "1.5rem" }
                                    }, "3")
                                  ])
                                ]),
                                createVNode("li", null, [
                                  createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Calendar")
                                  ])
                                ]),
                                createVNode("li", null, [
                                  createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                      }),
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Settings")
                                  ])
                                ])
                              ], 512), [
                                [vShow, sidebarSections.value.favorites]
                              ])
                            ])
                          ]),
                          createVNode("ul", { class: "list-none p-3 m-0" }, [
                            createVNode("li", null, [
                              createVNode("div", {
                                onClick: ($event) => toggleSection("application"),
                                class: "p-3 flex items-center justify-between text-gray-600 cursor-pointer hover:bg-base-200 rounded-lg"
                              }, [
                                createVNode("span", { class: "font-medium" }, "APPLICATION"),
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  class: ["w-4 h-4 transition-transform", { "rotate-180": sidebarSections.value.application }],
                                  fill: "none",
                                  viewBox: "0 0 24 24",
                                  stroke: "currentColor",
                                  "stroke-width": "2"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    d: "M19 9l-7 7-7-7"
                                  })
                                ], 2))
                              ], 8, ["onClick"]),
                              withDirectives(createVNode("ul", { class: "list-none p-0 m-0 overflow-hidden" }, [
                                createVNode("li", null, [
                                  createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Projects")
                                  ])
                                ]),
                                createVNode("li", null, [
                                  createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Performance")
                                  ])
                                ]),
                                createVNode("li", null, [
                                  createVNode("a", { class: "flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                                    (openBlock(), createBlock("svg", {
                                      xmlns: "http://www.w3.org/2000/svg",
                                      class: "w-4 h-4 mr-2",
                                      fill: "none",
                                      viewBox: "0 0 24 24",
                                      stroke: "currentColor",
                                      "stroke-width": "2"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                      }),
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      })
                                    ])),
                                    createVNode("span", { class: "font-medium" }, "Settings")
                                  ])
                                ])
                              ], 512), [
                                [vShow, sidebarSections.value.application]
                              ])
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "mt-auto" }, [
                          createVNode("hr", { class: "mb-3 mx-3 border-t border-base-300" }),
                          createVNode("a", { class: "m-3 flex items-center cursor-pointer p-3 gap-2 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150" }, [
                            createVNode("div", { class: "avatar" }, [
                              createVNode("div", { class: "w-10 rounded-full" }, [
                                createVNode("img", {
                                  src: "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png",
                                  alt: "Amy Elsner"
                                })
                              ])
                            ]),
                            createVNode("span", { class: "font-bold" }, "Amy Elsner")
                          ])
                        ])
                      ])
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Empty.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
