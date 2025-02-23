<template>
  <Head title="Party Lists" />

  <AppLayout>
    <div class="p-grid p-dir-col lg:p-dir-row p-m-3">
      <!-- Create Party Button -->
      <div class="col-12 lg:col-3 mb-6">
        <Button
          label="Create Party"
          icon="pi pi-plus"
          class="p-button-raised mb-2"
          @click="showDialog = true"
        />
      </div>

      <!-- Party List -->
      <div class="col-12 lg:col-9">
        <div class="flex justify-content-between align-items-center">
            <h3>Party List</h3>
            <button @click="reloadPage()" class="h-2rem"><i class="pi pi-refresh"></i> Reload</button>
        </div>


        <DataTable
          :value="filteredParties"
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

      <!-- Create Party Dialog -->
      <!-- <Dialog
      v-model:visible="visible"
      header="บันทึกผลการแข่งขัน"
      :style="{ width: '25rem', padding: '0px' }"
      :position="position"
      :modal="true"
      :draggable="false"
    > -->
      <Dialog
        header="Create Party"
        v-model:visible="showDialog"
        :modal="true"
        :closeOnEscape="true"
        :draggable="false"
        class="create-party-dialog mx-2"
      >
        <form @submit.prevent="createParty">
          <div class="p-fluid w-full sm:w-30rem">
            <!-- Party Details Section -->
            <h3 class="section-title">Party Details</h3>
            <div class="grid align-center justify-between">
              <div class="field col-4 md-4">
                <label for="play_date">Play Date</label>
                <Calendar v-model="form.play_date" showIcon iconDisplay="input" @date-select="formatDate" dateFormat="yy-mm-dd" />
              </div>

              <div class="field col-4 md-4">
                <label for="max_players">Max Players</label>
                <InputNumber id="max_players" v-model="form.max_players" :min="1" />
              </div>

              <div class="field col-4 md-4">
                <label for="status">Status</label>
                <Dropdown
                  id="status"
                  v-model="form.status"
                  :options="statuses"
                  placeholder="Select Status"
                />
              </div>
            </div>

            <div class="grid align-center justify-between">
              <div class="field col-12 md-6">
                <label for="court_id">Court</label>
                <Dropdown
                  id="court_id"
                  v-model="form.court_id"
                  :options="courts"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Court"
                />
              </div>
            </div>

            <div class="field-checkbox mt-4">
              <Checkbox
                name="is_private"
                v-model="form.is_private"
                binary
                inputId="is_private"
              ></Checkbox>
              <label for="is_private">Private Party</label>
            </div>

            <!-- Court Bookings Section -->
            <h3 class="section-title">Court Bookings</h3>
            <div
              v-for="(booking, index) in form.court_bookings"
              :key="index"
              class="court-booking p-3 mb-2 border-round-lg shadow-2"
            >
              <h4 class="mb-2">Booking #{{ index + 1 }}</h4>
              <div class="flex gap-4">
                <div class="flex-1">
                  <label for="court_field_number">คอร์ทที่</label>

                  <Dropdown
                    :options="[
                      { name: 1 },
                      { name: 2 },
                      { name: 3 },
                      { name: 4 },
                      { name: 5 },
                      { name: 6 },
                      { name: 7 },
                      { name: 8 },
                      { name: 9 },
                      { name: 10 },
                      { name: 11 },
                      { name: 12 },
                    ]"
                    id="court_field_number"
                    name="court_field_number"
                    optionLabel="name"
                    optionValue="name"
                    v-model="booking.court_field_number"
                    checkmark
                    :highlightOnSelect="false"
                    class="w-full"
                  />
                </div>
                <div class="flex-1">
                  <label for="start_time">เวลาเริ่ม</label>
                  <Dropdown
                    :options="timeOptions"
                    id="start_time"
                    name="start_time"
                    optionLabel="name"
                    optionValue="name"
                    v-model="booking.start_time"
                    checkmark
                    :highlightOnSelect="false"
                    class="w-full"
                  />
                </div>

                <div class="flex-1">
                  <label for="end_time">เวลาจบ</label>
                  <Dropdown
                    :options="filteredEndTimeOptions(index)"
                    id="end_time"
                    name="end_time"
                    optionLabel="name"
                    optionValue="name"
                    v-model="booking.end_time"
                    checkmark
                    :highlightOnSelect="false"
                    class="w-full"
                  />
                </div>
              </div>

              <Button
                label="ลบคอร์ท"
                icon="pi pi-minus"
                class="p-button-danger mt-3"
                @click="removeCourtBooking(index)"
              />
            </div>

            <Button
              label="เพิ่มคอร์ท"
              icon="pi pi-plus"
              class="p-button-secondary mt-3"
              @click="addCourtBooking"
            />
          </div>

          <!-- Submit and Cancel Buttons -->
          <div class="mt-4 flex p-justify-end gap-2">
            <Button
              label="Create"
              icon="pi pi-check"
              class="p-button-success"
              type="submit"
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-secondary"
              @click="showDialog = false"
            />
          </div>
        </form>
      </Dialog>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { ref, computed } from "vue";
import { Head, usePage, router } from "@inertiajs/vue3";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

const toast = useToast();
const confirmPopup = useConfirm();

const showDialog = ref(false);
const page = usePage();

const parties = ref(page.props.parties ?? []); // Replace with API data
const courts = ref(page.props.courts ?? []); // Court options from server
const statuses = ["Open", "Full", "Over"]; // Status options

// Form with dynamic court bookings
const form = ref({
  play_date: null,
  court_id: null,
  max_players: 18,
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

// Filter parties based on the current date
const filteredParties = computed(() => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  return parties.value.filter((party) => party.play_date >= today); // Filter for future or today's parties
});

const reloadPage = () => {
    router.get(`/party-lists`, {}, { preserveScroll: true })
}

const timeOptions = Array.from({ length: 24 }, (_, i) => ({
  name: `${String(i + 1).padStart(2, "0")}:00`,
}));

const formatDate = (date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  form.value.play_date = offsetDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

// Computed property to filter end time options
const filteredEndTimeOptions = (index) => {
  if (!form.value.court_bookings[index].start_time) {
    return timeOptions; // If no start time is selected, show all options
  }

  // Find the index of the selected start time
  const startTimeIndex = timeOptions.findIndex(
    (option) => option.name === form.value.court_bookings[index].start_time
  );

  // Allow only times within 12 hours after the selected start time
  return timeOptions.filter((_, index) => {
    const diff = (index - startTimeIndex + 24) % 24; // Calculate the circular difference
    return diff <= 6; // Allow up to 12 hours after the start time
  });
};

const isUserInParty = (members) => {
  return members.some((member) => member.user_id === authUser.id);
};

const joinParty = (partyId) => {
  //   console.log(`Joining party ${partyId}`);

  // Make API call to join the party
  router.post(
    `/party-join`,
    { party_id: partyId }, // Pass the party ID as part of the request body
    {
      onSuccess: (res) => {
        // Show success message or refresh the party data
        parties.value = res.props.parties;
        courts.value = res.props.courts;

        toast.add({
          severity: "success",
          summary: "เข้าร่วมปาร์ตี้สำเร็จ",
          detail: "คุณเข้าร่วมปาร์ตี้สำเร็จแล้ว!",
          life: 3000,
        });

        console.log("Successfully joined the party");
      },
      onError: (error) => {
        // Show error message
        toast.add({
          severity: "error",
          summary: "เข้าร่วมปาร์ตี้ล้มเหลว",
          detail: error?.message || "เกิดข้อผิดพลาดในการเข้าร่วมปาร์ตี้",
          life: 3000,
        });

        console.error("Error joining the party:", error);
      },
    }
  );
};

const enterParty = (partyId) => {
  console.log(`Entering party ${partyId}`);
  // Navigate to the party page
  router.get(`/party/${partyId}`);
};

// Add a new court booking
const addCourtBooking = () => {
  form.value.court_bookings.push({
    court_id: form.court_id,
    court_field_number: null,
    start_time: "",
    end_time: "",
  });
};

// Remove a court booking
const removeCourtBooking = (index) => {
  form.value.court_bookings.splice(index, 1);
};

// Create Party Handler
const createParty = () => {
  console.log("Creating party:", form.value);

  router.post("/party-create", form.value, {
    preserveScroll: true,
    headers: {
      Accept: "application/json",
    },
    onSuccess: (page) => {
      parties.value = page.props.parties;
      courts.value = page.props.courts;

      showDialog.value = false;
      // Refresh party list or show toast message
    },
    onError: (error) => {
      console.error("Error creating party:", error);
    },
  });
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
