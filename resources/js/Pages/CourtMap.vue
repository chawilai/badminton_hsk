<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { Head, usePage } from "@inertiajs/vue3";
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps({
  courts: { type: Array, default: () => [] },
});

// Map state
const mapContainer = ref(null);
let map = null;
let markers = [];
let userMarker = null;

// UI state
const userLocation = ref(null);
const locating = ref(false);
const locationError = ref('');
const selectedCourt = ref(null);
const searchQuery = ref('');
const showList = ref(false);

// Default center: Chiang Mai
const defaultCenter = [18.7883, 98.9853];
const defaultZoom = 12;

// Court type labels
const courtTypeLabel = (type) => {
  const map = { rubber: 'ยาง', wood: 'ไม้', synthetic: 'พื้นสังเคราะห์' };
  return map[type] || type || '-';
};

// Compute distance (Haversine formula) in km
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Courts with distance
const courtsWithDistance = computed(() => {
  return props.courts.map(c => ({
    ...c,
    distance: userLocation.value
      ? haversine(userLocation.value.lat, userLocation.value.lng, parseFloat(c.latitude), parseFloat(c.longitude))
      : null,
  }));
});

// Filtered & sorted courts
const filteredCourts = computed(() => {
  let list = courtsWithDistance.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.address?.toLowerCase().includes(q)
    );
  }
  if (userLocation.value) {
    list = [...list].sort((a, b) => a.distance - b.distance);
  }
  return list;
});

// Custom marker icon
const courtIcon = L.divIcon({
  html: `<div style="background:#22c55e;width:32px;height:32px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
  </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = L.divIcon({
  html: `<div style="background:#3b82f6;width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 3px rgba(59,130,246,0.3),0 2px 8px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Build popup content
const buildPopup = (court) => {
  const dist = court.distance != null ? `<div style="color:#3b82f6;font-weight:700;font-size:13px;margin-bottom:6px;">📍 ${court.distance.toFixed(1)} กม.</div>` : '';
  const price = court.play_price ? `<div style="font-size:11px;color:#666;margin-top:2px;">💰 ${parseFloat(court.play_price).toLocaleString()} ฿/ชม.</div>` : '';
  const fields = court.field_total ? `<div style="font-size:11px;color:#666;margin-top:2px;">🏸 ${court.field_total} สนาม${court.court_type ? ' · ' + courtTypeLabel(court.court_type) : ''}</div>` : '';
  const hours = court.operation_hours ? `<div style="font-size:11px;color:#666;margin-top:2px;">🕐 ${court.operation_hours}</div>` : '';
  const phone = court.phone ? `<div style="font-size:11px;margin-top:2px;"><a href="tel:${court.phone}" style="color:#22c55e;text-decoration:none;">📞 ${court.phone}</a></div>` : '';
  const buffet = court.has_buffet_session ? `<div style="font-size:11px;color:#f59e0b;margin-top:2px;font-weight:600;">🎾 บุฟเฟ่ต์แบด${court.buffet_entry_fee ? ' · ' + parseFloat(court.buffet_entry_fee).toLocaleString() + '฿' : ''}</div>` : '';

  const lat = parseFloat(court.latitude);
  const lng = parseFloat(court.longitude);
  const navUrl = court.google_map_url || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return `
    <div style="min-width:200px;max-width:260px;font-family:system-ui,sans-serif;">
      <div style="font-weight:700;font-size:14px;color:#1f2937;margin-bottom:4px;">${court.name}</div>
      ${court.address ? `<div style="font-size:11px;color:#888;margin-bottom:6px;">${court.address}</div>` : ''}
      ${dist}${fields}${price}${hours}${phone}${buffet}
      <div style="margin-top:8px;display:flex;gap:6px;">
        <a href="${navUrl}" target="_blank" rel="noopener"
           style="flex:1;text-align:center;padding:6px 0;background:#22c55e;color:#fff;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;">
          🧭 นำทาง
        </a>
      </div>
    </div>
  `;
};

// Init map
const initMap = () => {
  if (!mapContainer.value) return;

  map = L.map(mapContainer.value, {
    center: defaultCenter,
    zoom: defaultZoom,
    zoomControl: false,
  });

  L.control.zoom({ position: 'topright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  addCourtMarkers();
};

const addCourtMarkers = () => {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  props.courts.forEach(court => {
    const lat = parseFloat(court.latitude);
    const lng = parseFloat(court.longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    const courtData = courtsWithDistance.value.find(c => c.id === court.id) || court;
    const marker = L.marker([lat, lng], { icon: courtIcon })
      .bindPopup(buildPopup(courtData), { maxWidth: 280 })
      .addTo(map);

    marker.on('click', () => {
      selectedCourt.value = courtData;
    });

    markers.push(marker);
  });

  // Fit bounds if courts exist
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
};

// Get user location
const locateMe = () => {
  if (!navigator.geolocation) {
    locationError.value = 'เบราว์เซอร์ไม่รองรับ GPS';
    return;
  }
  locating.value = true;
  locationError.value = '';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      userLocation.value = { lat: latitude, lng: longitude };
      locating.value = false;

      if (map) {
        // Add/move user marker
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker([latitude, longitude], { icon: userIcon })
          .bindPopup('<div style="font-weight:600;font-size:13px;">📍 ตำแหน่งของคุณ</div>')
          .addTo(map);

        // Re-render popups with distance
        addCourtMarkers();

        // Pan to user
        map.setView([latitude, longitude], 13);
      }
    },
    (err) => {
      locating.value = false;
      if (err.code === 1) locationError.value = 'กรุณาอนุญาตการเข้าถึงตำแหน่ง';
      else if (err.code === 2) locationError.value = 'ไม่สามารถระบุตำแหน่งได้';
      else locationError.value = 'หมดเวลาระบุตำแหน่ง';
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};

// Focus on a court
const focusCourt = (court) => {
  if (!map) return;
  const lat = parseFloat(court.latitude);
  const lng = parseFloat(court.longitude);
  map.setView([lat, lng], 16);
  selectedCourt.value = court;
  showList.value = false;

  // Open popup
  const marker = markers.find(m => {
    const ll = m.getLatLng();
    return Math.abs(ll.lat - lat) < 0.0001 && Math.abs(ll.lng - lng) < 0.0001;
  });
  if (marker) marker.openPopup();
};

onMounted(() => {
  nextTick(() => initMap());
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<template>
  <Head title="สนามแบดมินตันใกล้ฉัน" />
  <AppLayout :fullWidth="true">
    <div class="relative h-[calc(100vh-3.5rem-4rem)] lg:h-[calc(100vh-4rem)]">
      <!-- Map -->
      <div ref="mapContainer" class="absolute inset-0 z-0"></div>

      <!-- Top controls -->
      <div class="absolute top-3 left-3 right-14 z-[1000] flex gap-2">
        <!-- Search -->
        <div class="relative flex-1 max-w-xs">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาสนาม..."
            class="w-full h-10 pl-9 pr-3 rounded-xl bg-base-100/95 backdrop-blur-sm border border-base-300 shadow-lg text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
            @focus="showList = true"
          />
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>

        <!-- Locate button -->
        <button
          @click="locateMe"
          :disabled="locating"
          class="h-10 w-10 rounded-xl bg-base-100/95 backdrop-blur-sm border border-base-300 shadow-lg flex items-center justify-center shrink-0 cursor-pointer hover:bg-primary/10 transition-colors disabled:opacity-50"
          title="ตำแหน่งของฉัน"
        >
          <span v-if="locating" class="loading loading-spinner loading-xs text-primary"></span>
          <svg v-else class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2m-5.636-5.636L14.95 7.778M9.05 16.222l-1.414 1.414M7.778 9.05L6.364 7.636m11.272 8.728l1.414 1.414"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        </button>

        <!-- List toggle -->
        <button
          @click="showList = !showList"
          class="h-10 w-10 rounded-xl bg-base-100/95 backdrop-blur-sm border border-base-300 shadow-lg flex items-center justify-center shrink-0 cursor-pointer hover:bg-primary/10 transition-colors"
          title="รายการสนาม"
        >
          <svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        </button>
      </div>

      <!-- Location error -->
      <div v-if="locationError" class="absolute top-16 left-3 right-3 z-[1000]">
        <div class="bg-error/90 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm">
          {{ locationError }}
          <button @click="locationError = ''" class="ml-2 underline cursor-pointer bg-transparent border-0 text-white text-xs">ปิด</button>
        </div>
      </div>

      <!-- Court list panel -->
      <transition name="slide-up">
        <div
          v-if="showList"
          class="absolute bottom-0 left-0 right-0 z-[1000] max-h-[60vh] bg-base-100/95 backdrop-blur-xl rounded-t-2xl shadow-2xl border-t border-base-300 overflow-hidden flex flex-col"
        >
          <!-- Handle -->
          <div class="flex justify-center pt-2 pb-1 shrink-0">
            <div class="w-10 h-1 rounded-full bg-base-300"></div>
          </div>

          <!-- Header -->
          <div class="px-4 py-2 border-b border-base-200 flex items-center justify-between shrink-0">
            <span class="text-sm font-bold text-base-content">
              สนามแบดมินตัน
              <span class="text-base-content/40 font-normal ml-1">({{ filteredCourts.length }})</span>
            </span>
            <button @click="showList = false" class="btn btn-ghost btn-xs btn-circle">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- List -->
          <div class="overflow-y-auto flex-1 overscroll-contain">
            <div v-if="filteredCourts.length === 0" class="py-8 text-center text-sm text-base-content/40">
              ไม่พบสนาม
            </div>
            <button
              v-for="court in filteredCourts"
              :key="court.id"
              @click="focusCourt(court)"
              class="w-full text-left px-4 py-3 border-b border-base-200 hover:bg-primary/5 transition-colors cursor-pointer bg-transparent border-0 border-solid"
            >
              <div class="flex items-start gap-3">
                <!-- Icon -->
                <div class="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-5 h-5 text-success" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-base-content truncate">{{ court.name }}</div>
                  <div v-if="court.address" class="text-[11px] text-base-content/50 truncate mt-0.5">{{ court.address }}</div>
                  <div class="flex items-center gap-2 mt-1">
                    <span v-if="court.field_total" class="text-[10px] text-base-content/40">🏸 {{ court.field_total }} สนาม</span>
                    <span v-if="court.play_price" class="text-[10px] text-base-content/40">💰 {{ parseFloat(court.play_price).toLocaleString() }}฿</span>
                    <span v-if="court.has_buffet_session" class="text-[10px] text-warning font-semibold">🎾 บุฟเฟ่ต์</span>
                  </div>
                </div>
                <!-- Distance -->
                <div v-if="court.distance != null" class="text-right shrink-0">
                  <div class="text-sm font-bold text-primary">{{ court.distance.toFixed(1) }}</div>
                  <div class="text-[10px] text-base-content/40">กม.</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </transition>

      <!-- Court count badge -->
      <div v-if="!showList" class="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
        <button
          @click="showList = true"
          class="h-10 px-5 rounded-full bg-primary text-primary-content shadow-lg border-0 cursor-pointer text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          สนาม {{ filteredCourts.length }} แห่ง
          <span v-if="userLocation" class="text-primary-content/70">· ใกล้คุณ</span>
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
:deep(.leaflet-popup-content) {
  margin: 10px 12px;
}
</style>
