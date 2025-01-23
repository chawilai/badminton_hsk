<template>
  <AppLayout>
    <div class="p-grid p-dir-col lg:p-dir-row p-m-3">
      <!-- Party List -->
      <div class="p-col-12 lg:p-col-9">
        <h3>My Party List</h3>
        <DataTable
          :value="parties"
          class="p-datatable-responsive"
          :paginator="true"
          :rows="20"
        >
          <Column field="id" header="ID" />
          <Column field="play_date" header="Play Date" />
          <Column field="court.name" header="Court Name" />
          <Column field="play_hours" header="Play Hours" />
          <Column header="Members">
            <template #body="slotProps">
              {{ slotProps.data.members_count }}/{{ slotProps.data.max_players }}
            </template>
          </Column>
          <Column field="status" header="Status" />
          <Column header="Action">
            <template #body="slotProps">
              <Button
                v-if="!isUserInParty(slotProps.data.members)"
                label="Join"
                class="p-button-success"
                @click="joinParty(slotProps.data.id)"
              />
              <Button
                v-else
                label="Enter"
                class="p-button-primary"
                @click="enterParty(slotProps.data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { ref } from "vue";
import { usePage, router } from "@inertiajs/vue3";

const showDialog = ref(false);
const page = usePage();

const parties = ref(page.props.parties ?? []); // Replace with API data
const courts = ref(page.props.courts ?? []); // Court options from server
const statuses = ["Open", "Full", "Over"]; // Status options

// Form with dynamic court bookings
const form = ref({
  play_date: null,
  court_id: null,
  max_players: 4,
  status: "Open",
  is_private: false,
  court_bookings: [
    {
      court_id: null,
      court_field_number: null,
      start_time: "",
      end_time: "",
    },
  ],
});

// Authenticated user from backend
const authUser = page.props.auth.user;

const isUserInParty = (members) => {
  return members.some((member) => member.user_id === authUser.id);
};

const joinParty = (partyId) => {
  console.log(`Joining party ${partyId}`);
  // Make API call to join the party
  router.post(`/parties/${partyId}/join`, {}, {
    onSuccess: () => {
      // Refresh or show success message
      console.log("Successfully joined the party");
    },
    onError: (error) => {
      console.error("Error joining the party:", error);
    },
  });
};

const enterParty = (partyId) => {
  console.log(`Entering party ${partyId}`);
  // Navigate to the party page
  router.get(`/party/${partyId}`);
};

</script>

<style scoped>
.court-booking {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
</style>
