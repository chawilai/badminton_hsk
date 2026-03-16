<script setup>
import { ref, watch, computed } from "vue";
import { useLayout } from "@/layout/composables/layout";

const {
  setScale,
  layoutConfig,
  layoutState,
  onConfigSidebarToggle,
  isHorizontal,
} = useLayout();

defineProps({
  simple: {
    type: Boolean,
    default: false,
  },
});

const themes = ref([
  { name: "avocado", color: "#AEC523" },
  { name: "blue", color: "#5297FF" },
  { name: "purple", color: "#464DF2" },
  { name: "teal", color: "#14B8A6" },
  { name: "green", color: "#34B56F" },
  { name: "indigo", color: "#6366F1" },
  { name: "orange", color: "#FF810E" },
  { name: "red", color: "#FF9B7B" },
  { name: "turquoise", color: "#58AED3" },
  { name: "yellow", color: "#FFB340" },
]);

const scales = ref([12, 13, 14, 15, 16]);

watch(layoutConfig.menuMode, (newVal) => {
  if (newVal === "static") {
    layoutState.staticMenuDesktopInactive.value = false;
  }
});

const colorScheme = ref(layoutConfig.colorScheme.value);

const changeColorScheme = (scheme) => {
  const themeLink = document.getElementById("theme-link");
  const themeLinkHref = themeLink.getAttribute("href");
  const currentColorScheme = "theme-" + layoutConfig.colorScheme.value.toString();
  const newColorScheme = "theme-" + scheme;
  const newHref = themeLinkHref.replace(currentColorScheme, newColorScheme);

  replaceLink(themeLink, newHref, () => {
    layoutConfig.colorScheme.value = scheme;
    layoutConfig.menuTheme.value = scheme;
  });
};

const changeTheme = (theme) => {
  const themeLink = document.getElementById("theme-link");
  const themeHref = themeLink.getAttribute("href");
  const newHref = themeHref.replace(layoutConfig.theme.value, theme);

  replaceLink(themeLink, newHref, () => {
    layoutConfig.theme.value = theme;
  });
};

const replaceLink = (linkElement, href, onComplete) => {
  if (!linkElement || !href) {
    return;
  }

  const id = linkElement.getAttribute("id");
  const cloneLinkElement = linkElement.cloneNode(true);

  cloneLinkElement.setAttribute("href", href);
  cloneLinkElement.setAttribute("id", id + "-clone");

  linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

  cloneLinkElement.addEventListener("load", () => {
    linkElement.remove();

    const element = document.getElementById(id);
    element && element.remove();

    cloneLinkElement.setAttribute("id", id);
    onComplete && onComplete();
  });
};
const decrementScale = () => {
  setScale(layoutConfig.scale.value - 1);
  applyScale();
};
const incrementScale = () => {
  setScale(layoutConfig.scale.value + 1);
  applyScale();
};

const applyScale = () => {
  document.documentElement.style.fontSize = layoutConfig.scale.value + "px";
};

// Drawer ID for DaisyUI
const configDrawerId = 'config-sidebar-drawer';
</script>

<template>
  <button
    class="layout-config-button config-link"
    @click="onConfigSidebarToggle()"
    style="cursor: pointer"
  >
    <i class="pi pi-cog"></i>
  </button>

  <!-- DaisyUI Drawer for Config Sidebar -->
  <div class="drawer drawer-end z-50" :class="{ 'pointer-events-none': !layoutState.configSidebarVisible.value }">
    <input
      :id="configDrawerId"
      type="checkbox"
      class="drawer-toggle"
      :checked="layoutState.configSidebarVisible.value"
      @change="layoutState.configSidebarVisible.value = $event.target.checked"
    />
    <div class="drawer-side" :class="{ 'pointer-events-auto': layoutState.configSidebarVisible.value }">
      <label :for="configDrawerId" class="drawer-overlay" @click="layoutState.configSidebarVisible.value = false"></label>
      <div class="menu bg-base-100 text-base-content min-h-full w-72 p-4">
        <div class="flex justify-end mb-2">
          <button class="btn btn-sm btn-ghost btn-circle" @click="layoutState.configSidebarVisible.value = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <h5>Color Scheme</h5>
        <div class="flex flex-wrap gap-y-3">
          <div class="flex items-center gap-2 w-1/2">
            <input
              type="radio"
              name="colorScheme"
              value="light"
              class="radio radio-primary"
              :checked="colorScheme === 'light'"
              id="theme3"
              @change="colorScheme = 'light'; changeColorScheme('light')"
            />
            <label for="theme3">Light</label>
          </div>

          <div class="flex items-center gap-2 w-1/2 pl-2">
            <input
              type="radio"
              name="colorScheme"
              value="dark"
              class="radio radio-primary"
              :checked="colorScheme === 'dark'"
              id="theme1"
              @change="colorScheme = 'dark'; changeColorScheme('dark')"
            />
            <label for="theme1">Dark</label>
          </div>
        </div>

        <h5>Themes</h5>
        <div class="flex flex-wrap gap-y-3">
          <div v-for="(theme, i) in themes" :key="i" class="w-1/4">
            <button
              class="cursor-pointer w-8 h-8 rounded-full shrink-0 flex items-center justify-center p-0 border-0"
              @click="() => changeTheme(theme.name)"
              :style="{ 'background-color': theme.color, 'border-color': theme.color }"
            >
              <i
                v-if="theme.name === layoutConfig.theme.value"
                class="pi pi-check text-white"
              ></i>
            </button>
          </div>
        </div>

        <h5>Scale</h5>
        <div class="flex items-center">
          <button
            type="button"
            class="btn btn-ghost btn-circle btn-sm mr-2"
            @click="decrementScale()"
            :disabled="layoutConfig.scale.value === scales[0]"
          >
            <i class="pi pi-minus"></i>
          </button>
          <div class="flex gap-2 items-center">
            <i
              class="pi pi-circle-fill text-gray-300"
              v-for="s in scales"
              :key="s"
              :class="{ 'text-emerald-500': s === layoutConfig.scale.value }"
            ></i>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-circle btn-sm ml-2"
            @click="incrementScale()"
            :disabled="layoutConfig.scale.value === scales[scales.length - 1]"
          >
            <i class="pi pi-plus"></i>
          </button>
        </div>

        <template v-if="!simple">
          <h5>Menu Type</h5>
          <div class="flex flex-wrap gap-y-3">
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="menuMode"
                value="static"
                class="radio radio-primary"
                v-model="layoutConfig.menuMode.value"
                id="mode1"
              />
              <label for="mode1">Static</label>
            </div>

            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="menuMode"
                value="overlay"
                class="radio radio-primary"
                v-model="layoutConfig.menuMode.value"
                id="mode2"
              />
              <label for="mode2">Overlay</label>
            </div>
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="menuMode"
                value="slim"
                class="radio radio-primary"
                v-model="layoutConfig.menuMode.value"
                id="mode3"
              />
              <label for="mode3">Slim</label>
            </div>
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="menuMode"
                value="slim-plus"
                class="radio radio-primary"
                v-model="layoutConfig.menuMode.value"
                id="mode4"
              />
              <label for="mode4">Slim+</label>
            </div>
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="menuMode"
                value="reveal"
                class="radio radio-primary"
                v-model="layoutConfig.menuMode.value"
                id="mode5"
              />
              <label for="mode5">Reveal</label>
            </div>
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="menuMode"
                value="drawer"
                class="radio radio-primary"
                v-model="layoutConfig.menuMode.value"
                id="mode6"
              />
              <label for="mode6">Drawer</label>
            </div>
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="menuMode"
                value="horizontal"
                class="radio radio-primary"
                v-model="layoutConfig.menuMode.value"
                id="mode7"
              />
              <label for="mode7">Horizontal</label>
            </div>
          </div>

          <h5>Menu Theme</h5>
          <div class="flex flex-wrap gap-y-3">
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="menuTheme"
                value="light"
                class="radio radio-primary"
                v-model="layoutConfig.menuTheme.value"
                :disabled="layoutConfig.colorScheme.value == 'dark' || isHorizontal.value"
                id="menutheme-light"
              />
              <label for="menutheme-light">Light</label>
            </div>
            <div class="flex items-center gap-2 w-1/2 pl-2">
              <input
                type="radio"
                name="menuTheme"
                value="dark"
                class="radio radio-primary"
                v-model="layoutConfig.menuTheme.value"
                :disabled="layoutConfig.colorScheme == 'dark' || isHorizontal.value"
                id="menutheme-dark"
              />
              <label for="menutheme-dark">Dark</label>
            </div>
          </div>

          <h5>Topbar Theme</h5>
          <div class="flex flex-wrap gap-y-3">
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="topbarTheme"
                value="light"
                class="radio radio-primary"
                v-model="layoutConfig.topbarTheme.value"
                :disabled="layoutConfig.colorScheme.value == 'dark'"
                id="topbartheme-light"
              />
              <label for="topbartheme-light">Light</label>
            </div>
            <div class="flex items-center gap-2 w-1/2 pl-2">
              <input
                type="radio"
                name="topbarTheme"
                value="dark"
                class="radio radio-primary"
                v-model="layoutConfig.topbarTheme.value"
                id="topbartheme-dark"
              />
              <label for="topbartheme-dark">Dark</label>
            </div>
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="topbarTheme"
                value="transparent"
                class="radio radio-primary"
                v-model="layoutConfig.topbarTheme.value"
                id="topbartheme-transparent"
              />
              <label for="topbartheme-transparent">Transparent</label>
            </div>
          </div>
        </template>

        <template v-if="!simple">
          <h5>Input Style</h5>
          <div class="flex flex-wrap gap-y-3">
            <div class="flex items-center gap-2 w-1/2">
              <input
                type="radio"
                name="inputStyle"
                value="outlined"
                class="radio radio-primary"
                id="outlined_input"
                checked
              />
              <label for="outlined_input">Outlined</label>
            </div>
            <div class="flex items-center gap-2 w-1/2 pl-2">
              <input
                type="radio"
                name="inputStyle"
                value="filled"
                class="radio radio-primary"
                id="filled_input"
              />
              <label for="filled_input">Filled</label>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
