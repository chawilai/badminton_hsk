<template>
  <AppLayout>
    <div class="p-grid p-dir-col lg:p-dir-row p-m-3">
      <!-- Create Party Button -->
      <div class="p-col-12 lg:p-col-3">
        <Button
          label="Create Party"
          icon="pi pi-plus"
          class="p-button-raised p-mb-2"
          @click="showDialog = true"
        />
      </div>

      <!-- Party List -->
      <div class="p-col-12 lg:p-col-9">
        <h2>Party List</h2>
        <DataTable
          :value="parties"
          class="p-datatable-responsive"
          :paginator="true"
          :rows="20"
        >
          <Column field="play_date" header="Play Date" />
          <Column field="court.name" header="Court Name" />
          <Column field="play_hours" header="Play Hours" />
          <Column field="max_players" header="Max Players" />
          <Column field="status" header="Status" />
        </DataTable>
      </div>

      <!-- Create Party Dialog -->
      <Dialog
        header="Create Party"
        :visible="showDialog"
        :modal="true"
        :closable="true"
        @hide="showDialog = false"
      >
        <form @submit.prevent="createParty">
          <div class="p-fluid">
            <!-- Party Details -->
            <div class="p-field">
              <label for="play_date">Play Date</label>
              <Calendar id="play_date" v-model="form.play_date" dateFormat="yy-mm-dd" />
            </div>

            <div class="p-field">
              <label for="max_players">Max Players</label>
              <InputNumber id="max_players" v-model="form.max_players" :min="1" />
            </div>

            <div class="p-field">
              <label for="status">Status</label>
              <Dropdown
                id="status"
                v-model="form.status"
                :options="statuses"
                placeholder="Select Status"
              />
            </div>

            <div class="p-field">
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

            <div class="p-field-checkbox mt-4">
              <Checkbox inputId="is_private" v-model="form.is_private" />
              <label for="is_private">Private Party</label>
            </div>

            <!-- Court Bookings Section -->
            <h3>Court Bookings</h3>
            <div
              v-for="(booking, index) in form.court_bookings"
              :key="index"
              class="p-fluid court-booking"
            >
              <h4>Booking #{{ index + 1 }}</h4>

              <div class="p-field">
                <label for="court_field_number">Court Field Number</label>
                <InputNumber
                  id="court_field_number"
                  v-model="booking.court_field_number"
                  :min="1"
                />
              </div>

              <div class="p-field">
                <label for="start_time">Start Time</label>
                <InputText
                  id="start_time"
                  v-model="booking.start_time"
                  placeholder="HH:MM"
                />
              </div>

              <div class="p-field">
                <label for="end_time">End Time</label>
                <InputText id="end_time" v-model="booking.end_time" placeholder="HH:MM" />
              </div>

              <Button
                label="Remove"
                icon="pi pi-minus"
                class="p-button-danger p-mb-2"
                @click="removeCourtBooking(index)"
              />
            </div>

            <Button
              label="Add Booking"
              icon="pi pi-plus"
              class="p-button-secondary p-mb-3"
              @click="addCourtBooking"
            />
          </div>

          <!-- Submit and Cancel Buttons -->
          <div class="p-mt-3">
            <Button
              label="Create"
              icon="pi pi-check"
              class="p-button-success p-mr-2"
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
import { ref } from "vue";
import { usePage, router } from "@inertiajs/vue3";

const showDialog = ref(false);
const page = usePage();

const parties = ref(page.props.parties ?? []); // Replace with API data
const courts = ref(page.props.courts ?? []); // Court options from server
const statuses = ["Open", "Full", "Over"]; // Status options

console.log(parties);

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

// Add a new court booking
const addCourtBooking = () => {
  form.value.court_bookings.push({
    court_id: null,
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

  router.post("/party/create", form.value, {
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
