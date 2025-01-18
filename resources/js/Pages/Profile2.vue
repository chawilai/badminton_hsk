<template>
    <div class="profile-page">
        <div class="profile-section">
            <h2>Profile</h2>
            <div class="profile-details">
                <!-- Avatar Section -->
                <div class="avatar-section">
                    <Avatar
                        v-if="profile.avatar"
                        :image="profile.avatar"
                        shape="circle"
                        size="large"
                    />
                    <Avatar
                        v-else
                        label="?"
                        shape="circle"
                        size="large"
                        class="p-mr-2"
                    />
                    <Button
                        label="Edit Avatar"
                        icon="pi pi-camera"
                        class="p-button-outlined p-mt-2"
                    />
                </div>
                <!-- Name Section -->
                <div class="name-section">
                    <h3>{{ profile.name }}</h3>
                    <Button
                        label="Edit Name"
                        icon="pi pi-pencil"
                        class="p-button-outlined"
                    />
                </div>
                <!-- Gender Section -->
                <div class="gender-section">
                    <p>Gender: {{ profile.gender || "Not Set" }}</p>
                    <Button
                        label="Edit Gender"
                        icon="pi pi-pencil"
                        class="p-button-outlined"
                    />
                </div>
                <!-- Birthday Section -->
                <div class="birthday-section">
                    <p>Birthday: {{ profile.birthday || "Not Set" }}</p>
                    <Button
                        label="Edit Birthday"
                        icon="pi pi-pencil"
                        class="p-button-outlined"
                    />
                </div>
            </div>
        </div>

        <Divider />

        <div class="summary-section">
            <h2>Played Summary</h2>
            <div class="summary-stats">
                <div class="stat-item">
                    <h3>Total Games</h3>
                    <p>{{ playedSummary.totalGames }}</p>
                </div>
                <div class="stat-item">
                    <h3>Total Parties</h3>
                    <p>{{ playedSummary.totalParties }}</p>
                </div>
                <div class="stat-item">
                    <h3>Skill Level</h3>
                    <p>{{ playedSummary.skillLevel }}</p>
                </div>
            </div>
            <div class="card">
                <div class="skill-chart w-30rem">
                    <h3>กราฟคุณสมบัติ</h3>
                    <canvas id="skillRadarChart"></canvas>
                </div>
            </div>
        </div>

        <Divider />

        <div class="history-section">
            <h2>Game History</h2>
            <DataTable :value="gameHistory" responsiveLayout="scroll">
                <Column field="date" header="Date"></Column>
                <Column field="opponent" header="Opponent"></Column>
                <Column field="result" header="Result"></Column>
            </DataTable>
        </div>

        <Divider />

        <div class="party-section">
            <h2>Party History</h2>
            <DataTable :value="partyHistory" responsiveLayout="scroll">
                <Column field="partyName" header="Party Name"></Column>
                <Column field="date" header="Date"></Column>
                <Column field="role" header="Role"></Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(...registerables);
Chart.register(ChartDataLabels);

const profile = ref({
    name: "John Doe",
    avatar: null,
    gender: null,
    birthday: null,
});

const playedSummary = ref({
    totalGames: 25,
    totalParties: 10,
    skillLevel: "Advanced",
});

const gameHistory = ref([
    { date: "2025-01-01", opponent: "Player A", result: "Win" },
]);

const partyHistory = ref([
    { partyName: "Weekend Smash", date: "2025-01-01", role: "Participant" },
    { partyName: "Holiday Bash", date: "2025-01-02", role: "Organizer" },
]);

const skillData = ref({
    labels: ["ความเร็ว", "พลัง", "แม่นยำ", "กลยุทธ์", "เทคนิค", "ประสบการณ์", "การลวง"],
    datasets: [
        {
            label: "Player A Skills",
            data: [8, 7, 2, 8.5, 7.5, 9, 6.5],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
        },
    ],
});

onMounted(() => {
    const ctx = document.getElementById("skillRadarChart").getContext("2d");
    new Chart(ctx, {
        type: "radar",
        data: skillData.value,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false, // This hides the dataset group indicators
                },
                tooltip: {
                    enabled: true, // Ensures tooltips are shown
                    callbacks: {
                        label: function (context) {
                            return `${context.raw}`; // Customizes the label format
                        },
                    },
                },
                datalabels: {
                    display: true, // Show labels on data points
                    color: "black", // Label color
                    font: {
                        size: 12, // Font size
                        weight: "bold", // Font weight
                    },
                    formatter: (value) => value, // Show the value directly
                },
            },
            scales: {
                r: {
                    suggestedMin: 0,
                    suggestedMax: 10,
                },
            },
        },
    });
});
</script>

<style scoped>
.profile-page {
    padding: 1rem;
}

.profile-section {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.avatar-section {
    text-align: center;
}

.name-section,
.gender-section,
.birthday-section {
    margin-top: 1rem;
}

.summary-stats {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
}

.stat-item {
    text-align: center;
    flex: 1;
    min-width: 120px;
}

.skill-chart {
    margin-top: 2rem;
}

.history-section,
.party-section {
    margin-top: 1.5rem;
}
</style>
