<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { Head, usePage, router } from "@inertiajs/vue3";
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const page = usePage();
const user = page.props.auth.user;

const skillData = ref({
    labels: ["ความเร็ว", "พลัง", "แม่นยำ", "กลยุทธ์", "เทคนิค", "ประสบการณ์", "การลวง"],
    datasets: [{
        label: "Skills",
        data: [8, 7, 2, 8.5, 7.5, 9, 6.5],
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderColor: "#10b981",
        borderWidth: 2,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
    }],
});

onMounted(() => {
    const canvas = document.getElementById("skillRadarChart");
    if (canvas) {
        new Chart(canvas.getContext("2d"), {
            type: "radar",
            data: skillData.value,
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        display: true,
                        color: "#6b7280",
                        font: { size: 11, weight: "bold" },
                        formatter: (value) => value,
                    },
                },
                scales: {
                    r: {
                        suggestedMin: 0,
                        suggestedMax: 10,
                        grid: { color: "rgba(16, 185, 129, 0.1)" },
                        angleLines: { color: "rgba(16, 185, 129, 0.1)" },
                        pointLabels: { font: { size: 12 }, color: "#6b7280" },
                    },
                },
            },
        });
    }
});
</script>

<template>
    <Head title="Home" />

    <AppLayout>
        <div class="tw-space-y-4">
            <!-- Profile Card -->
            <div class="tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-overflow-hidden">
                <div class="tw-h-20 tw-bg-gradient-to-r tw-from-court-500 tw-to-court-400"></div>
                <div class="tw-px-4 tw-pb-4 tw--mt-10">
                    <div class="tw-flex tw-items-end tw-gap-3 tw-mb-3">
                        <UserAvatar :src="user?.avatar" :name="user?.name" size="xl" rounded="2xl" class="tw-border-4 tw-border-white dark:tw-border-court-900" />
                        <div class="tw-pb-1">
                            <h2 class="tw-text-lg tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">{{ user?.name }}</h2>
                            <p class="tw-text-sm tw-text-gray-500 tw-m-0">{{ user?.email }}</p>
                        </div>
                    </div>
                    <p v-if="user?.player_motto" class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400 tw-m-0 tw-italic">"{{ user.player_motto }}"</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="tw-grid tw-grid-cols-2 tw-gap-3">
                <button @click="router.get('/party-lists')"
                    class="badminton-card tw-flex tw-flex-col tw-items-center tw-gap-2 tw-p-4 tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-cursor-pointer tw-transition-all hover:tw-border-court-300">
                    <div class="tw-w-10 tw-h-10 tw-bg-court-100 dark:tw-bg-court-800 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                        <i class="pi pi-list tw-text-court-600 dark:tw-text-court-400"></i>
                    </div>
                    <span class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Party Lists</span>
                </button>
                <button @click="router.get('/my-parties')"
                    class="badminton-card tw-flex tw-flex-col tw-items-center tw-gap-2 tw-p-4 tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-cursor-pointer tw-transition-all hover:tw-border-court-300">
                    <div class="tw-w-10 tw-h-10 tw-bg-court-100 dark:tw-bg-court-800 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                        <i class="pi pi-play tw-text-court-600 dark:tw-text-court-400"></i>
                    </div>
                    <span class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">My Parties</span>
                </button>
                <button @click="router.get('/chat')"
                    class="badminton-card tw-flex tw-flex-col tw-items-center tw-gap-2 tw-p-4 tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-cursor-pointer tw-transition-all hover:tw-border-court-300">
                    <div class="tw-w-10 tw-h-10 tw-bg-court-100 dark:tw-bg-court-800 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                        <i class="pi pi-comments tw-text-court-600 dark:tw-text-court-400"></i>
                    </div>
                    <span class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Chat</span>
                </button>
                <button @click="router.get('/profile')"
                    class="badminton-card tw-flex tw-flex-col tw-items-center tw-gap-2 tw-p-4 tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-cursor-pointer tw-transition-all hover:tw-border-court-300">
                    <div class="tw-w-10 tw-h-10 tw-bg-court-100 dark:tw-bg-court-800 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                        <i class="pi pi-user tw-text-court-600 dark:tw-text-court-400"></i>
                    </div>
                    <span class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Profile</span>
                </button>
            </div>

            <!-- Skill Radar Chart -->
            <div class="tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-p-4">
                <h3 class="tw-text-base tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0 tw-mb-3">กราฟคุณสมบัติ</h3>
                <div class="tw-max-w-sm tw-mx-auto">
                    <canvas id="skillRadarChart"></canvas>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
