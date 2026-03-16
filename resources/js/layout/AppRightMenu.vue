<script setup>
import { useLayout } from "@/layout/composables/layout";

import asset_weather from "@/../assets/demo/images/rightpanel/asset-weather.png"

const { layoutState } = useLayout();

const rightDrawerId = 'right-menu-drawer';
</script>
<template>
  <!-- DaisyUI Drawer for Right Menu -->
  <div class="drawer drawer-end z-50" :class="{ 'pointer-events-none': !layoutState.rightMenuActive.value }">
    <input
      :id="rightDrawerId"
      type="checkbox"
      class="drawer-toggle"
      :checked="layoutState.rightMenuActive.value"
      @change="layoutState.rightMenuActive.value = $event.target.checked"
    />
    <div class="drawer-side" :class="{ 'pointer-events-auto': layoutState.rightMenuActive.value }">
      <label :for="rightDrawerId" class="drawer-overlay" @click="layoutState.rightMenuActive.value = false"></label>
      <div class="menu bg-base-100 text-base-content min-h-full w-full sm:w-96 p-4">
        <div class="flex justify-end mb-2">
          <button class="btn btn-sm btn-ghost btn-circle" @click="layoutState.rightMenuActive.value = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="p-0 py-3 weather-section">
          <div class="flex items-center justify-between mb-3">
            <h6 class="m-0">Today</h6>
          </div>
          <div
            class="weather flex items-center py-3 px-4 bg-center bg-no-repeat bg-cover rounded-lg"
            :style="`
              box-shadow: 0px 10px 40 rgba(#293241, 6%);
              background-image: url('${asset_weather}');
            `"
          >
            <img
              src="@/../assets/demo/images/rightpanel/icon-sun.svg"
              alt="freya-layout"
              style="height: 60px"
            />
            <div class="ml-3">
              <h6 class="m-0 mb-1" style="color: rgb(83 88 99)">Ankara, 22 May</h6>
              <h1 class="m-0" style="color: rgb(83 88 99)">24&#xBA;</h1>
            </div>
          </div>
        </div>

        <div class="rightpanel-section mt-4">
          <div class="flex items-center justify-between mb-3">
            <h6 class="m-0">My list</h6>
            <button
              type="button"
              class="btn btn-ghost btn-circle btn-sm"
            >
              <i class="pi pi-plus"></i>
            </button>
          </div>
          <ul class="list-none p-0 m-0 overflow-auto" style="max-height: 330px">
            <li
              class="p-3 rounded-lg bg-white mb-3 flex items-center justify-between"
            >
              <div>
                <h6 class="m-0 mb-2 text-base-content">Perform usability testing for P15 MVP</h6>
                <span class="text-gray-400 leading-normal block font-medium">-Public pages</span>
                <span class="text-gray-400 leading-normal block font-medium">-Product pages</span>
              </div>
            </li>
            <li
              class="p-3 rounded-lg bg-white mb-3 flex items-center justify-between"
            >
              <div>
                <h6 class="m-0 mb-2 text-base-content">Buy puzzle set from Amazon</h6>
                <span class="text-gray-400 leading-normal block font-medium"
                  >Ravensburger Seurat, 2000</span
                >
              </div>
            </li>
            <li
              class="opacity-50 p-3 rounded-lg bg-white mb-3 flex items-center justify-between"
            >
              <div>
                <h6 class="m-0 mb-2 text-base-content line-through">Morning Run</h6>
              </div>
              <i class="pi pi-check"></i>
            </li>
            <li
              class="opacity-50 p-3 rounded-lg bg-white mb-3 flex items-center justify-between"
            >
              <div>
                <h6 class="m-0 mb-2 text-base-content line-through">Morning Run</h6>
              </div>
              <i class="pi pi-check"></i>
            </li>
          </ul>
        </div>

        <div class="p-0 favorites-section mt-4">
          <div class="flex items-center justify-between mb-3">
            <h6 class="m-0">Favorites</h6>
          </div>
          <div class="favorite-items flex items-center flex-wrap" style="margin: -7px">
            <a
              href="#"
              class="favorite-item hover:bg-gray-50 bg-white flex items-center justify-center rounded-xl m-2 transition-all duration-200"
              style="
                width: 80px;
                height: 80px;
                box-shadow: 0px 0px 2px rgba(41, 50, 65, 0.3),
                  0px 1px 2px rgba(41, 50, 65, 0.2);
                background-color: rgba(41, 127, 255, 0.03);
              "
            >
              <img src="@/../assets/demo/images/rightpanel/github.svg" alt="freya-layout" />
            </a>
            <a
              href="#"
              class="favorite-item hover:bg-gray-50 bg-white flex items-center justify-center rounded-xl m-2 transition-all duration-200"
              style="
                width: 80px;
                height: 80px;
                box-shadow: 0px 0px 2px rgba(41, 50, 65, 0.3),
                  0px 1px 2px rgba(41, 50, 65, 0.2);
                background-color: rgba(41, 127, 255, 0.03);
              "
            >
              <img src="@/../assets/demo/images/rightpanel/slack.svg" alt="freya-layout" />
            </a>
            <a
              href="#"
              class="favorite-item hover:bg-gray-50 bg-white flex items-center justify-center rounded-xl m-2 transition-all duration-200"
              style="
                width: 80px;
                height: 80px;
                box-shadow: 0px 0px 2px rgba(41, 50, 65, 0.3),
                  0px 1px 2px rgba(41, 50, 65, 0.2);
                background-color: rgba(41, 127, 255, 0.03);
              "
            >
              <img src="@/../assets/demo/images/rightpanel/aws.svg" alt="freya-layout" />
            </a>
            <a
              href="#"
              class="favorite-item hover:bg-gray-50 bg-white flex items-center justify-center rounded-xl m-2 transition-all duration-200"
              style="
                width: 80px;
                height: 80px;
                box-shadow: 0px 0px 2px rgba(41, 50, 65, 0.3),
                  0px 1px 2px rgba(41, 50, 65, 0.2);
                background-color: rgba(41, 127, 255, 0.03);
              "
            >
              <img src="@/../assets/demo/images/rightpanel/jenkins.svg" alt="freya-layout" />
            </a>
            <a
              href="#"
              class="favorite-item hover:bg-gray-50 bg-white flex items-center justify-center rounded-xl m-2 transition-all duration-200"
              style="
                width: 80px;
                height: 80px;
                box-shadow: 0px 0px 2px rgba(41, 50, 65, 0.3),
                  0px 1px 2px rgba(41, 50, 65, 0.2);
                background-color: rgba(41, 127, 255, 0.03);
              "
            >
              <img src="@/../assets/demo/images/rightpanel/jira.svg" alt="freya-layout" />
            </a>
            <a
              href="#"
              class="favorite-item hover:bg-gray-50 bg-white flex items-center justify-center rounded-xl m-2 transition-all duration-200 border border-dashed border-gray-200"
              style="width: 80px; height: 80px; background-color: rgba(41, 127, 255, 0.03)"
            >
              <i class="pi pi-plus"></i>
            </a>
          </div>
        </div>

        <div class="p-0 py-3 chat-section chat"></div>
      </div>
    </div>
  </div>
</template>
