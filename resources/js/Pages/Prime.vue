<template>
    <Head title="UI Components" />

    <AppLayout>
        <div class="space-y-6">
            <!-- Product Card Demo -->
            <div class="card bg-base-100 shadow p-4 max-w-sm animate-border rounded-md">
                <div class="bg-base-200 mb-4 w-full text-center p-5 rounded-lg">
                    <img
                        src="https://primefaces.org/cdn/primevue/images/landing/air-jordan.png"
                        alt="Sneaker"
                        class="w-40 mx-auto"
                    />
                </div>
                <div class="flex items-center mb-4">
                    <div class="flex flex-col">
                        <span class="block font-semibold mb-1">Sneaker</span>
                        <span class="text-gray-500 text-sm">Premium Quality</span>
                    </div>
                    <span class="font-medium text-xl ml-auto">$990</span>
                </div>
                <button class="btn btn-outline btn-primary w-full">
                    Add to Cart
                </button>
            </div>

            <!-- Chips + Toggle Demo -->
            <div class="card bg-base-100 shadow p-4 max-w-sm animate-border rounded-md">
                <div class="flex items-center">
                    <div class="badge badge-outline mr-2">Vue</div>
                    <div class="badge badge-outline mr-2">Typescript</div>
                    <input type="checkbox" class="toggle toggle-primary ml-auto" checked />
                </div>
                <div class="mt-5 flex justify-center">
                    <div class="join">
                        <input class="join-item btn" type="radio" name="style-options" aria-label="Styled" />
                        <input class="join-item btn" type="radio" name="style-options" aria-label="Unstyled" checked />
                    </div>
                </div>
                <div class="mt-5 pt-1 pb-2">
                    <input type="range" min="0" max="100" value="50" class="range range-primary range-sm" />
                </div>
            </div>

            <!-- Toolbar + Button Showcase -->
            <div class="card bg-base-100 shadow p-4 animate-border">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-secondary">+</button>
                        <button class="btn btn-sm btn-secondary">Print</button>
                        <button class="btn btn-sm btn-secondary">Upload</button>
                    </div>
                    <div class="relative">
                        <input type="text" placeholder="Search" class="input input-bordered input-sm w-40" />
                    </div>
                    <div class="dropdown dropdown-end">
                        <button class="btn btn-sm btn-primary">Save</button>
                    </div>
                </div>

                <div class="divider"></div>

                <h6 class="font-bold mb-2">Filled Buttons</h6>
                <div class="flex flex-wrap gap-2 mb-4">
                    <button class="btn btn-primary btn-sm">Primary</button>
                    <button class="btn btn-secondary btn-sm">Secondary</button>
                    <button class="btn btn-success btn-sm">Success</button>
                    <button class="btn btn-info btn-sm">Info</button>
                    <button class="btn btn-warning btn-sm">Warning</button>
                    <button class="btn btn-error btn-sm">Danger</button>
                    <button class="btn btn-neutral btn-sm">Neutral</button>
                </div>

                <div class="divider"></div>

                <h6 class="font-bold mb-2">Outline Buttons</h6>
                <div class="flex flex-wrap gap-2 mb-4">
                    <button class="btn btn-outline btn-primary btn-sm">Primary</button>
                    <button class="btn btn-outline btn-secondary btn-sm">Secondary</button>
                    <button class="btn btn-outline btn-success btn-sm">Success</button>
                    <button class="btn btn-outline btn-info btn-sm">Info</button>
                    <button class="btn btn-outline btn-warning btn-sm">Warning</button>
                    <button class="btn btn-outline btn-error btn-sm">Danger</button>
                </div>

                <div class="divider"></div>

                <h6 class="font-bold mb-2">Button Group</h6>
                <div class="join">
                    <button class="btn btn-info btn-sm join-item">Save</button>
                    <button class="btn btn-error btn-sm join-item">Delete</button>
                    <button class="btn btn-sm join-item">Cancel</button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from "vue";
import AppLayout from "@/layout/AppLayout.vue";
import { Head, Link, router } from "@inertiajs/vue3";
</script>
