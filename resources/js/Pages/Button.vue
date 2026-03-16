<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { ref } from "vue";
import { useToast } from "@/composables/useToast";
import { Head, Link, router } from "@inertiajs/vue3";

const toast = useToast();

const visible = ref(false);

const items = ref([
    {
        label: "Add",
        command: () => {
            toast.add({ severity: "info", summary: "Add", detail: "Data Added" });
        },
    },
    {
        label: "Update",
        command: () => {
            toast.add({ severity: "success", summary: "Update", detail: "Data Updated" });
        },
    },
    {
        label: "Delete",
        command: () => {
            toast.add({ severity: "error", summary: "Delete", detail: "Data Deleted" });
        },
    },
]);
</script>

<template>
    <Head title="Buttons" />

    <AppLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                DaisyUI Button Showcase
            </h2>
        </template>

        <div class="space-y-6">
            <!-- Filled Buttons -->
            <div class="card bg-base-100 shadow p-6">
                <h5 class="text-lg font-bold mb-4">Filled Buttons</h5>
                <div class="flex flex-wrap gap-2">
                    <button class="btn btn-primary">Primary</button>
                    <button class="btn btn-secondary">Secondary</button>
                    <button class="btn btn-success">Success</button>
                    <button class="btn btn-info">Info</button>
                    <button class="btn btn-warning">Warning</button>
                    <button class="btn btn-error">Danger</button>
                    <button class="btn btn-neutral">Neutral</button>
                    <button class="btn btn-accent">Accent</button>
                </div>
            </div>

            <!-- Outline Buttons -->
            <div class="card bg-base-100 shadow p-6">
                <h5 class="text-lg font-bold mb-4">Outline Buttons</h5>
                <div class="flex flex-wrap gap-2">
                    <button class="btn btn-outline btn-primary">Primary</button>
                    <button class="btn btn-outline btn-secondary">Secondary</button>
                    <button class="btn btn-outline btn-success">Success</button>
                    <button class="btn btn-outline btn-info">Info</button>
                    <button class="btn btn-outline btn-warning">Warning</button>
                    <button class="btn btn-outline btn-error">Danger</button>
                </div>
            </div>

            <!-- Ghost Buttons -->
            <div class="card bg-base-100 shadow p-6">
                <h5 class="text-lg font-bold mb-4">Ghost & Soft Buttons</h5>
                <div class="flex flex-wrap gap-2">
                    <button class="btn btn-ghost">Ghost</button>
                    <button class="btn btn-link">Link</button>
                    <button class="btn glass">Glass</button>
                </div>
            </div>

            <!-- Sizes -->
            <div class="card bg-base-100 shadow p-6">
                <h5 class="text-lg font-bold mb-4">Button Sizes</h5>
                <div class="flex flex-wrap gap-2 items-center">
                    <button class="btn btn-primary btn-lg">Large</button>
                    <button class="btn btn-primary">Normal</button>
                    <button class="btn btn-primary btn-sm">Small</button>
                    <button class="btn btn-primary btn-xs">Tiny</button>
                </div>
            </div>

            <!-- Button Group -->
            <div class="card bg-base-100 shadow p-6">
                <h5 class="text-lg font-bold mb-4">Button Group</h5>
                <div class="join">
                    <button class="btn btn-primary join-item">Save</button>
                    <button class="btn btn-error join-item">Delete</button>
                    <button class="btn join-item">Cancel</button>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="card bg-base-100 shadow p-6">
                <h5 class="text-lg font-bold mb-4">Action Buttons</h5>
                <div class="flex flex-wrap gap-2">
                    <button v-for="item in items" :key="item.label" class="btn btn-primary btn-sm" @click="item.command">
                        {{ item.label }}
                    </button>
                </div>
            </div>

            <!-- Drawer Demo -->
            <div class="card bg-base-100 shadow p-6">
                <h5 class="text-lg font-bold mb-4">Drawer Demo</h5>
                <button class="btn btn-primary" @click="visible = true">Open Drawer</button>

                <div v-if="visible" class="fixed inset-0 z-50 flex" @click.self="visible = false">
                    <div class="bg-black/50 absolute inset-0" @click="visible = false"></div>
                    <div class="relative z-10 bg-base-100 w-80 h-full shadow-xl overflow-y-auto">
                        <div class="flex items-center justify-between px-4 pt-4">
                            <span class="font-semibold text-2xl text-emerald-600">Your Logo</span>
                            <button class="btn btn-sm btn-circle btn-ghost" @click="visible = false">✕</button>
                        </div>
                        <ul class="menu p-4">
                            <li><a>Dashboard</a></li>
                            <li><a>Bookmarks</a></li>
                            <li>
                                <details>
                                    <summary>Reports</summary>
                                    <ul>
                                        <li><a>Revenue</a></li>
                                        <li><a>Expenses</a></li>
                                    </ul>
                                </details>
                            </li>
                            <li><a>Team</a></li>
                            <li><a>Messages <span class="badge badge-primary badge-sm">3</span></a></li>
                            <li><a>Calendar</a></li>
                            <li><a>Settings</a></li>
                        </ul>
                        <div class="mt-auto border-t border-base-300 p-4">
                            <div class="flex items-center gap-2">
                                <div class="avatar placeholder">
                                    <div class="bg-neutral text-neutral-content rounded-full w-10">
                                        <span>AE</span>
                                    </div>
                                </div>
                                <span class="font-bold">Amy Elsner</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
