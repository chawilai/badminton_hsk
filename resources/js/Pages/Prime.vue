<template>
    <Head title="Welcome" />

    <AppLayout>
        <div
            class="box p-4 mb-4 w-full max-w-23rem fadein animation-duration-500 box-shadow animate-border border-round-md"
        >
            <div
                class="surface-card mb-4 w-full text-center p-5"
                style="border-radius: '10px'"
            >
                <img
                    src="https://primefaces.org/cdn/primevue/images/landing/air-jordan.png"
                    alt="Watch"
                    class="w-10rem"
                />
            </div>
            <div class="flex align-items-center mb-4">
                <div class="flex flex-column">
                    <span class="block font-semibold mb-1">Sneaker</span
                    ><span class="text-secondary text-sm">Premium Quality</span>
                </div>
                <span class="font-medium text-xl ml-auto">$990</span>
            </div>
            <button
                class="p-button p-component p-button-outlined w-full"
                type="button"
                aria-label="Add to Cart"
                data-pc-name="button"
                data-pc-section="root"
                data-pd-ripple="true"
            >
                <!--[--><!--[--><span
                    class="p-button-icon p-button-icon-left pi pi-shopping-cart"
                    data-pc-section="icon"
                ></span
                ><!--]--><span class="p-button-label" data-pc-section="label"
                    >Add to Cart</span
                ><!----><!--]--><span
                    role="presentation"
                    aria-hidden="true"
                    data-p-ink="true"
                    data-p-ink-active="false"
                    class="p-ink"
                    data-pc-name="ripple"
                    data-pc-section="root"
                ></span>
            </button>
        </div>
        <div
            class="box p-4 mb-4 w-full max-w-23rem fadein animation-duration-500 box-shadow animate-border border-round-md"
        >
            <div class="flex align-items-center">
                <div
                    class="p-chip p-component mr-2 font-medium"
                    aria-label="Vue"
                    data-pc-name="chip"
                    data-pc-section="root"
                >
                    <!--[--><!---->
                    <div class="p-chip-text" data-pc-section="label">Vue</div>
                    <!--]--><!---->
                </div>
                <div
                    class="p-chip p-component mr-2 font-medium"
                    aria-label="Typescript"
                    data-pc-name="chip"
                    data-pc-section="root"
                >
                    <!--[--><!---->
                    <div class="p-chip-text" data-pc-section="label">
                        Typescript
                    </div>
                    <!--]--><!---->
                </div>
                <div
                    class="p-inputswitch p-component p-highlight ml-auto"
                    style="position: relative"
                    data-pc-name="inputswitch"
                    data-pc-section="root"
                    data-p-highlight="true"
                    data-p-disabled="false"
                >
                    <input
                        type="checkbox"
                        role="switch"
                        class="p-inputswitch-input"
                        style=""
                        checked=""
                        aria-checked="true"
                        data-pc-section="input"
                    /><span
                        class="p-inputswitch-slider"
                        data-pc-section="slider"
                    ></span>
                </div>
            </div>
            <div class="mt-5 flex justify-content-center">
                <div
                    class="p-selectbutton p-button-group p-component"
                    role="group"
                    data-pc-name="selectbutton"
                    data-pc-section="root"
                >
                    <!--[-->
                    <div
                        tabindex="-1"
                        aria-label="Styled"
                        role="radio"
                        aria-checked="false"
                        aria-disabled="false"
                        class="p-button p-component"
                        data-pc-section="button"
                        data-p-highlight="false"
                        data-p-disabled="false"
                        data-pd-ripple="true"
                    >
                        <!--[--><span
                            class="p-button-label"
                            data-pc-section="label"
                            >Styled</span
                        ><!--]--><span
                            role="presentation"
                            aria-hidden="true"
                            data-p-ink="true"
                            data-p-ink-active="false"
                            class="p-ink"
                            data-pc-name="ripple"
                            data-pc-section="root"
                        ></span>
                    </div>
                    <div
                        tabindex="0"
                        aria-label="Unstyled"
                        role="radio"
                        aria-checked="true"
                        aria-disabled="false"
                        class="p-button p-component p-highlight"
                        data-pc-section="button"
                        data-p-highlight="true"
                        data-p-disabled="false"
                        data-pd-ripple="true"
                    >
                        <!--[--><span
                            class="p-button-label"
                            data-pc-section="label"
                            >Unstyled</span
                        ><!--]--><span
                            role="presentation"
                            aria-hidden="true"
                            data-p-ink="true"
                            data-p-ink-active="false"
                            class="p-ink"
                            data-pc-name="ripple"
                            data-pc-section="root"
                            style="
                                height: 90px;
                                width: 90px;
                                top: -32.5px;
                                left: -16.5312px;
                            "
                        ></span>
                    </div>
                    <!--]-->
                </div>
            </div>
            <div class="mt-5 pt-1 pb-2">
                <div
                    class="p-slider p-component p-slider-horizontal w-full"
                    data-pc-name="slider"
                    data-pc-section="root"
                    data-p-sliding="false"
                >
                    <span
                        class="p-slider-range"
                        style="position: absolute; left: 30%; width: 50%"
                        data-pc-section="range"
                    ></span
                    ><!----><span
                        class="p-slider-handle"
                        style="position: absolute; left: 30%"
                        tabindex="0"
                        role="slider"
                        aria-valuemin="0"
                        aria-valuenow="30"
                        aria-valuemax="100"
                        aria-orientation="horizontal"
                        data-pc-section="starthandler"
                    ></span
                    ><span
                        class="p-slider-handle"
                        style="position: absolute; left: 80%"
                        tabindex="0"
                        role="slider"
                        aria-valuemin="0"
                        aria-valuenow="80"
                        aria-valuemax="100"
                        aria-orientation="horizontal"
                        data-pc-section="endhandler"
                    ></span>
                </div>
            </div>
        </div>
        <div class="card animate-border fadein animation-duration-500">
            <Toolbar>
                <template #start>
                    <Button
                        icon="pi pi-plus"
                        class="mr-2"
                        severity="secondary"
                    />
                    <Button
                        icon="pi pi-print"
                        class="mr-2"
                        severity="secondary"
                    />
                    <Button icon="pi pi-upload" severity="secondary" />
                </template>

                <template #center>
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Search" />
                    </IconField>
                </template>

                <template #end>
                    <SplitButton label="Save" :model="items"></SplitButton
                ></template>
            </Toolbar>

            <hr />

            <Button class="fadein animation-duration-500" label="Primary" raised />
            <Button class="fadein animation-duration-500" label="Secondary" severity="secondary" raised />
            <Button class="fadein animation-duration-500" label="Success" severity="success" raised />
            <Button class="fadein animation-duration-500" label="Info" severity="info" raised />
            <Button class="fadein animation-duration-500" label="Warning" severity="warning" raised />
            <Button class="fadein animation-duration-500" label="Help" severity="help" raised />
            <Button class="fadein animation-duration-500" label="Danger" severity="danger" raised />
            <Button class="fadein animation-duration-500" label="Contrast" severity="contrast" raised />

            <hr />

            <Button class="fadein animation-duration-500" label="Primary" text raised />
            <Button class="fadein animation-duration-500" label="Secondary" severity="secondary" text raised />
            <Button class="fadein animation-duration-500" label="Success" severity="success" text raised />
            <Button class="fadein animation-duration-500" label="Info" severity="info" text raised />
            <Button class="fadein animation-duration-500" label="Warning" severity="warning" text raised />
            <Button class="fadein animation-duration-500" label="Help" severity="help" text raised />
            <Button class="fadein animation-duration-500" label="Danger" severity="danger" text raised />
            <Button class="fadein animation-duration-500" label="Plain" plain text raised />

            <hr />

            <Button class="fadein animation-duration-500" label="Primary" outlined />
            <Button class="fadein animation-duration-500" label="Secondary" severity="secondary" outlined />
            <Button class="fadein animation-duration-500" label="Success" severity="success" outlined />
            <Button class="fadein animation-duration-500" label="Info" severity="info" outlined />
            <Button class="fadein animation-duration-500" label="Warning" severity="warning" outlined />
            <Button class="fadein animation-duration-500" label="Help" severity="help" outlined />
            <Button class="fadein animation-duration-500" label="Danger" severity="danger" outlined />
            <Button class="fadein animation-duration-500" label="Contrast" severity="contrast" outlined />

            <hr />

            <Button class="fadein animation-duration-500" icon="pi pi-check" aria-label="Filter" />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bookmark"
                severity="secondary"
                aria-label="Bookmark"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-search"
                severity="success"
                aria-label="Search"
            />
            <Button class="fadein animation-duration-500" icon="pi pi-user" severity="info" aria-label="User" />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bell"
                severity="warning"
                aria-label="Notification"
            />
            <Button class="fadein animation-duration-500" icon="pi pi-heart" severity="help" aria-label="Favorite" />
            <Button class="fadein animation-duration-500" icon="pi pi-times" severity="danger" aria-label="Cancel" />

            <Button class="fadein animation-duration-500" icon="pi pi-check" rounded aria-label="Filter" />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bookmark"
                severity="secondary"
                rounded
                aria-label="Bookmark"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-search"
                severity="success"
                rounded
                aria-label="Search"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-user"
                severity="info"
                rounded
                aria-label="User"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bell"
                severity="warning"
                rounded
                aria-label="Notification"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-heart"
                severity="help"
                rounded
                aria-label="Favorite"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-times"
                severity="danger"
                rounded
                aria-label="Cancel"
            />

            <Button class="fadein animation-duration-500" icon="pi pi-check" rounded outlined aria-label="Filter" />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bookmark"
                severity="secondary"
                rounded
                outlined
                aria-label="Bookmark"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-search"
                severity="success"
                rounded
                outlined
                aria-label="Search"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-user"
                severity="info"
                rounded
                outlined
                aria-label="User"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bell"
                severity="warning"
                rounded
                outlined
                aria-label="Notification"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-heart"
                severity="help"
                rounded
                outlined
                aria-label="Favorite"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-times"
                severity="danger"
                rounded
                outlined
                aria-label="Cancel"
            />

            <Button class="fadein animation-duration-500"
                icon="pi pi-check"
                text
                raised
                rounded
                aria-label="Filter"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bookmark"
                severity="secondary"
                text
                raised
                rounded
                aria-label="Bookmark"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-search"
                severity="success"
                text
                raised
                rounded
                aria-label="Search"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-user"
                severity="info"
                text
                raised
                rounded
                aria-label="User"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bell"
                severity="warning"
                text
                raised
                rounded
                aria-label="Notification"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-heart"
                severity="help"
                text
                raised
                rounded
                aria-label="Favorite"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-times"
                severity="danger"
                text
                raised
                rounded
                aria-label="Cancel"
            />

            <Button class="fadein animation-duration-500" icon="pi pi-check" text rounded aria-label="Filter" />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bookmark"
                severity="secondary"
                text
                rounded
                aria-label="Bookmark"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-search"
                severity="success"
                text
                rounded
                aria-label="Search"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-user"
                severity="info"
                text
                rounded
                aria-label="User"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-bell"
                severity="warning"
                text
                rounded
                aria-label="Notification"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-heart"
                severity="help"
                text
                rounded
                aria-label="Favorite"
            />
            <Button class="fadein animation-duration-500"
                icon="pi pi-times"
                severity="danger"
                text
                rounded
                aria-label="Cancel"
            />

            <hr />

            <ButtonGroup>
                <Button class="fadein animation-duration-500"
                    label="Save"
                    icon="pi pi-check"
                    plain
                    text
                    severity="info"
                    raised
                />
                <Button class="fadein animation-duration-500"
                    label="Delete"
                    icon="pi pi-trash"
                    plain
                    text
                    severity="danger"
                    raised
                />
                <Button class="fadein animation-duration-500"
                    label="Delete"
                    icon="pi pi-trash"
                    plain
                    text
                    severity="danger"
                    raised
                />
                <Button class="fadein animation-duration-500"
                    label="Delete"
                    icon="pi pi-trash"
                    plain
                    text
                    severity="danger"
                    raised
                />
                <Button class="fadein animation-duration-500" label="Cancel" icon="pi pi-times" plain text raised />
            </ButtonGroup>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from "vue";
import AppLayout from "@/layout/AppLayout.vue";
import { Head, Link, router } from "@inertiajs/vue3";

const items = ref([
    {
        label: "Update",
        icon: "pi pi-refresh",
    },
    {
        label: "Delete",
        icon: "pi pi-times",
    },
]);
</script>

<style scope></style>
