<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useLayout } from "@/layout/composables/layout";
import AppSidebar from "@/layout/AppSidebar.vue";
import { usePrimeVue } from "primevue/config";
import { Link } from "@inertiajs/vue3";

import avatar from "@/../assets/layout/images/avatar-m-1.jpg"

const $primevue = usePrimeVue();

defineExpose({
  $primevue,
});
const { isHorizontal, onMenuToggle, showConfigSidebar, showSidebar } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);

onMounted(() => {
  bindOutsideClickListener();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener("click", outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector(".layout-topbar-menu");
  const topbarEl = document.querySelector(".layout-topbar-menu-button");

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};
const onMenuButtonClick = () => {
  onMenuToggle();
};

const onConfigButtonClick = () => {
  showConfigSidebar();
};
const onSidebarButtonClick = () => {
  showSidebar();
};
</script>

<template>
  <div class="layout-topbar">
    <div class="topbar-start">
      <Button
        ref="menubutton"
        type="button"
        class="topbar-menubutton p-link p-trigger transition-duration-300"
        @click="onMenuButtonClick()"
      >
        <i class="pi pi-bars"></i>
      </Button>
    </div>
    <div class="layout-topbar-menu-section">
      <AppSidebar></AppSidebar>
    </div>
    <div class="topbar-end">
      <ul class="topbar-menu">
        <li
          :class="isHorizontal ? 'topbar-search hidden' : 'topbar-search hidden sm:block'"
        >
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText type="text" placeholder="Search" class="w-12rem sm:w-full" />
          </IconField>
        </li>
        <li :class="isHorizontal ? 'block topbar-item' : 'block sm:hidden topbar-item'">
          <a
            v-styleclass="{
              selector: '@next',
              enterClass: 'hidden',
              enterActiveClass: 'px-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'px-fadeout',
              hideOnOutsideClick: 'true',
            }"
            v-ripple
          >
            <Button type="button" icon="pi pi-search" text severity="secondary"></Button>
          </a>
          <ul
            :class="'hidden topbar-menu active-topbar-menu p-3 w-15rem  z-5'"
            style="bottom: -5.8rem"
          >
            <IconField iconPosition="left" class="w-full">
              <InputIcon class="pi pi-search" />
              <InputText type="text" placeholder="Search" class="w-full" />
            </IconField>
          </ul>
        </li>
        <li class="topbar-item">
          <a
            v-styleclass="{
              selector: '@next',
              enterClass: 'hidden',
              enterActiveClass: 'px-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'px-fadeout',
              hideOnOutsideClick: 'true',
            }"
            v-ripple
            class="cursor-pointer"
          >
            <img
              class="border-round-xl"
              :src="avatar"
              alt="Profile"
            />
          </a>
          <ul :class="'topbar-menu active-topbar-menu p-4 w-15rem z-5 hidden'">
            <li role="menuitem" class="m-0 mb-3">
              <a
                href="#"
                class="flex align-items-center hover:text-primary-500 transition-duration-200"
                v-styleclass="{
                  selector: '@grandparent',
                  enterClass: 'hidden',
                  enterActiveClass: 'px-scalein',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'px-fadeout',
                  hideOnOutsideClick: 'true',
                }"
              >
                <i class="pi pi-fw pi-lock mr-2"></i>
                <span>Privacy</span>
              </a>
            </li>
            <li role="menuitem" class="m-0 mb-3">
              <a
                href="#"
                class="flex align-items-center hover:text-primary-500 transition-duration-200"
                v-styleclass="{
                  selector: '@grandparent',
                  enterClass: 'hidden',
                  enterActiveClass: 'px-scalein',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'px-fadeout',
                  hideOnOutsideClick: 'true',
                }"
              >
                <i class="pi pi-fw pi-cog mr-2"></i>
                <span>Settings</span>
              </a>
            </li>
            <li role="menuitem" class="m-0">
              <Link
                href="/logout"
                method="post"
                as="button"
                :data="{ '_token': '{{ csrf_token() }}' }"
                class="flex align-items-center hover:text-primary-500 transition-duration-200"
                v-styleclass="{
                  selector: '@grandparent',
                  enterClass: 'hidden',
                  enterActiveClass: 'px-scalein',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'px-fadeout',
                  hideOnOutsideClick: 'true',
                }"
              >
                <i class="pi pi-fw pi-sign-out mr-2"></i>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Button
            type="button"
            icon="pi pi-cog"
            class="flex-shrink-0"
            text
            severity="secondary"
            @click="onConfigButtonClick()"
          ></Button>
        </li>
        <li>
          <Button
            type="button"
            icon="pi pi-arrow-left"
            class="flex-shrink-0"
            text
            severity="secondary"
            @click="onSidebarButtonClick()"
          ></Button>
        </li>
      </ul>
    </div>
  </div>
</template>
