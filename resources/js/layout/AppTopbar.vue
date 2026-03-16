<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useLayout } from "@/layout/composables/layout";
import AppSidebar from "@/layout/AppSidebar.vue";
import { Link } from "@inertiajs/vue3";
import { useBadmintonLayout } from "@/layout/composables/badmintonLayout";

import avatar from "@/../assets/layout/images/avatar-m-1.jpg"

const { isHorizontal, onMenuToggle, showConfigSidebar, showSidebar } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const profileMenuOpen = ref(false);

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
        profileMenuOpen.value = false;
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
  if (!topbarMenuActive.value && !profileMenuOpen.value) return;

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

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value;
};

const { switchTemplate } = useBadmintonLayout();
const switchToBadminton = () => {
  switchTemplate('badminton');
};
</script>

<template>
  <div class="layout-topbar">
    <div class="topbar-start">
      <button
        ref="menubutton"
        type="button"
        class="topbar-menubutton duration-300"
        @click="onMenuButtonClick()"
      >
        <i class="pi pi-bars"></i>
      </button>
    </div>
    <div class="layout-topbar-menu-section">
      <AppSidebar></AppSidebar>
    </div>
    <div class="topbar-end">
      <ul class="topbar-menu">
        <li class="topbar-item">
          <button
            type="button"
            class="btn btn-ghost btn-sm shrink-0"
            title="Switch to Badminton Theme"
            @click="switchToBadminton()"
          >
            <i class="pi pi-palette"></i>
          </button>
        </li>
        <li class="topbar-item">
          <a
            class="cursor-pointer"
            @click="toggleProfileMenu()"
          >
            <img
              class="rounded-xl"
              :src="$page.props.auth.user.avatar"
              alt="Profile"
            />
          </a>
          <ul
            :class="[
              'topbar-menu active-topbar-menu p-4 w-60 z-5',
              { 'hidden': !profileMenuOpen }
            ]"
          >
            <li role="menuitem" class="m-0 mb-3">
              <a
                href="/profile"
                class="flex items-center hover:text-emerald-500 duration-200"
                @click="profileMenuOpen = false"
              >
                <i class="pi pi-fw pi-user mr-2"></i>
                <span>Profile</span>
              </a>
            </li>
            <li role="menuitem" class="m-0">
              <Link
                as="button"
                :href="route('logout')"
                method="post"
                class="flex items-center hover:text-emerald-500 duration-200"
                @click="profileMenuOpen = false"
              >
                <i class="pi pi-fw pi-sign-out mr-2"></i>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
