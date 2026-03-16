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
        <div class="space-y-4">
            <!-- Profile Card -->
            <div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
                <div class="h-20 bg-gradient-to-r from-primary to-primary/80"></div>
                <div class="px-4 pb-4 -mt-10">
                    <div class="flex items-end gap-3 mb-3">
                        <UserAvatar :src="user?.avatar" :name="user?.name" size="xl" rounded="2xl" class="border-4 border-base-100" />
                        <div class="pb-1">
                            <h2 class="text-lg font-bold text-base-content m-0">{{ user?.name }}</h2>
                            <p class="text-sm text-base-content/60 m-0">{{ user?.email }}</p>
                        </div>
                    </div>
                    <p v-if="user?.player_motto" class="text-sm text-base-content/70 m-0 italic">"{{ user.player_motto }}"</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-2 gap-3">
                <button @click="router.get('/party-lists')"
                    class="badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30">
                    <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <i class="pi pi-list text-primary"></i>
                    </div>
                    <span class="text-sm font-medium text-base-content/80">Party Lists</span>
                </button>
                <button @click="router.get('/my-parties')"
                    class="badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30">
                    <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <i class="pi pi-play text-primary"></i>
                    </div>
                    <span class="text-sm font-medium text-base-content/80">My Parties</span>
                </button>
                <button @click="router.get('/chat')"
                    class="badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30">
                    <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <i class="pi pi-comments text-primary"></i>
                    </div>
                    <span class="text-sm font-medium text-base-content/80">Chat</span>
                </button>
                <button @click="router.get('/profile')"
                    class="badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30">
                    <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <i class="pi pi-user text-primary"></i>
                    </div>
                    <span class="text-sm font-medium text-base-content/80">Profile</span>
                </button>
            </div>

            <!-- Skill Radar Chart -->
            <div class="bg-base-100 rounded-xl border border-base-300 p-4">
                <h3 class="text-base font-bold text-base-content m-0 mb-3">กราฟคุณสมบัติ</h3>
                <div class="max-w-sm mx-auto">
                    <canvas id="skillRadarChart"></canvas>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
