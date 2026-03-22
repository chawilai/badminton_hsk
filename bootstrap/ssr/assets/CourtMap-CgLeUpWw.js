import { ref, computed, onMounted, nextTick, onBeforeUnmount, unref, withCtx, createVNode, createBlock, createCommentVNode, withDirectives, vModelText, openBlock, createTextVNode, toDisplayString, Transition, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-BqVs4mIv.js";
import { Head } from "@inertiajs/vue3";
import L from "leaflet";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./useLocale-QwrDLuQY.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./useToast-DyaFeJ92.js";
import "./useConfirm-CffLghyV.js";
const defaultZoom = 13;
const _sfc_main = {
  __name: "CourtMap",
  __ssrInlineRender: true,
  props: {
    courts: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const mapContainer = ref(null);
    let map = null;
    let markers = [];
    let userMarker = null;
    const userLocation = ref(null);
    const locating = ref(false);
    const locationError = ref("");
    const selectedCourt = ref(null);
    const searchQuery = ref("");
    const showList = ref(false);
    const defaultCenter = [18.7883, 98.9853];
    const courtTypeLabel = (type) => {
      const map2 = { rubber: "ยาง", wood: "ไม้", synthetic: "พื้นสังเคราะห์" };
      return map2[type] || type || "-";
    };
    const haversine = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };
    const courtsWithDistance = computed(() => {
      return props.courts.map((c) => ({
        ...c,
        distance: userLocation.value ? haversine(userLocation.value.lat, userLocation.value.lng, parseFloat(c.latitude), parseFloat(c.longitude)) : null
      }));
    });
    const filteredCourts = computed(() => {
      let list = courtsWithDistance.value;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter(
          (c) => {
            var _a, _b;
            return ((_a = c.name) == null ? void 0 : _a.toLowerCase().includes(q)) || ((_b = c.address) == null ? void 0 : _b.toLowerCase().includes(q));
          }
        );
      }
      if (userLocation.value) {
        list = [...list].sort((a, b) => a.distance - b.distance);
      }
      return list;
    });
    const courtIcon = L.divIcon({
      html: `<div style="background:#22c55e;width:32px;height:32px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
  </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    const userIcon = L.divIcon({
      html: `<div style="background:#3b82f6;width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 3px rgba(59,130,246,0.3),0 2px 8px rgba(0,0,0,0.3);"></div>`,
      className: "",
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    const buildPopup = (court) => {
      const dist = court.distance != null ? `<div style="color:#3b82f6;font-weight:700;font-size:13px;margin-bottom:6px;">📍 ${court.distance.toFixed(1)} กม.</div>` : "";
      const price = court.play_price ? `<div style="font-size:11px;color:#666;margin-top:2px;">💰 ${parseFloat(court.play_price).toLocaleString()} ฿/ชม.</div>` : "";
      const fields = court.field_total ? `<div style="font-size:11px;color:#666;margin-top:2px;">🏸 ${court.field_total} สนาม${court.court_type ? " · " + courtTypeLabel(court.court_type) : ""}</div>` : "";
      const hours = court.operation_hours ? `<div style="font-size:11px;color:#666;margin-top:2px;">🕐 ${court.operation_hours}</div>` : "";
      const phone = court.phone ? `<div style="font-size:11px;margin-top:2px;"><a href="tel:${court.phone}" style="color:#22c55e;text-decoration:none;">📞 ${court.phone}</a></div>` : "";
      const buffet = court.has_buffet_session ? `<div style="font-size:11px;color:#f59e0b;margin-top:2px;font-weight:600;">🎾 บุฟเฟ่ต์แบด${court.buffet_entry_fee ? " · " + parseFloat(court.buffet_entry_fee).toLocaleString() + "฿" : ""}</div>` : "";
      const lat = parseFloat(court.latitude);
      const lng = parseFloat(court.longitude);
      const navUrl = court.google_map_url || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      return `
    <div style="min-width:200px;max-width:260px;font-family:system-ui,sans-serif;">
      <div style="font-weight:700;font-size:14px;color:#1f2937;margin-bottom:4px;">${court.name}</div>
      ${court.address ? `<div style="font-size:11px;color:#888;margin-bottom:6px;">${court.address}</div>` : ""}
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
    const initMap = () => {
      if (!mapContainer.value) return;
      map = L.map(mapContainer.value, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false
      });
      L.control.zoom({ position: "topright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);
      addCourtMarkers();
    };
    const addCourtMarkers = () => {
      markers.forEach((m) => map.removeLayer(m));
      markers = [];
      props.courts.forEach((court) => {
        const lat = parseFloat(court.latitude);
        const lng = parseFloat(court.longitude);
        if (isNaN(lat) || isNaN(lng)) return;
        const courtData = courtsWithDistance.value.find((c) => c.id === court.id) || court;
        const marker = L.marker([lat, lng], { icon: courtIcon }).bindPopup(buildPopup(courtData), { maxWidth: 280 }).bindTooltip(courtData.distance != null ? `${court.name} · ${courtData.distance.toFixed(1)} กม.` : court.name, {
          permanent: true,
          direction: "bottom",
          offset: [0, 4],
          className: "court-label"
        }).addTo(map);
        marker.on("click", () => {
          selectedCourt.value = courtData;
        });
        markers.push(marker);
      });
    };
    const locateMe = () => {
      if (!navigator.geolocation) {
        locationError.value = "เบราว์เซอร์ไม่รองรับ GPS";
        return;
      }
      locating.value = true;
      locationError.value = "";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          userLocation.value = { lat: latitude, lng: longitude };
          locating.value = false;
          if (map) {
            if (userMarker) map.removeLayer(userMarker);
            userMarker = L.marker([latitude, longitude], { icon: userIcon }).bindPopup('<div style="font-weight:600;font-size:13px;">📍 ตำแหน่งของคุณ</div>').addTo(map);
            addCourtMarkers();
            map.setView([latitude, longitude], 13);
          }
        },
        (err) => {
          locating.value = false;
          if (err.code === 1) locationError.value = "กรุณาอนุญาตการเข้าถึงตำแหน่ง";
          else if (err.code === 2) locationError.value = "ไม่สามารถระบุตำแหน่งได้";
          else locationError.value = "หมดเวลาระบุตำแหน่ง";
        },
        { enableHighAccuracy: true, timeout: 1e4 }
      );
    };
    const focusCourt = (court) => {
      if (!map) return;
      const lat = parseFloat(court.latitude);
      const lng = parseFloat(court.longitude);
      map.setView([lat, lng], 16);
      selectedCourt.value = court;
      showList.value = false;
      const marker = markers.find((m) => {
        const ll = m.getLatLng();
        return Math.abs(ll.lat - lat) < 1e-4 && Math.abs(ll.lng - lng) < 1e-4;
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "สนามแบดมินตันใกล้ฉัน" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { fullWidth: true }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative h-[calc(100vh-3.5rem-4rem)] lg:h-[calc(100vh-4rem)]" data-v-225803bb${_scopeId}><div class="absolute inset-0 z-0" data-v-225803bb${_scopeId}></div><div class="absolute top-3 left-3 right-14 z-[1000] flex gap-2" data-v-225803bb${_scopeId}><div class="relative flex-1 max-w-xs" data-v-225803bb${_scopeId}><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="ค้นหาสนาม..." class="w-full h-10 pl-9 pr-3 rounded-xl bg-base-100/95 backdrop-blur-sm border border-base-300 shadow-lg text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50" data-v-225803bb${_scopeId}><svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-225803bb${_scopeId}><circle cx="11" cy="11" r="8" data-v-225803bb${_scopeId}></circle><path d="m21 21-4.35-4.35" data-v-225803bb${_scopeId}></path></svg></div><button${ssrIncludeBooleanAttr(locating.value) ? " disabled" : ""} class="h-10 w-10 rounded-xl bg-base-100/95 backdrop-blur-sm border border-base-300 shadow-lg flex items-center justify-center shrink-0 cursor-pointer hover:bg-primary/10 transition-colors disabled:opacity-50" title="ตำแหน่งของฉัน" data-v-225803bb${_scopeId}>`);
            if (locating.value) {
              _push2(`<span class="loading loading-spinner loading-xs text-primary" data-v-225803bb${_scopeId}></span>`);
            } else {
              _push2(`<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-225803bb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2m-5.636-5.636L14.95 7.778M9.05 16.222l-1.414 1.414M7.778 9.05L6.364 7.636m11.272 8.728l1.414 1.414" data-v-225803bb${_scopeId}></path><circle cx="12" cy="12" r="4" data-v-225803bb${_scopeId}></circle></svg>`);
            }
            _push2(`</button><button class="h-10 w-10 rounded-xl bg-base-100/95 backdrop-blur-sm border border-base-300 shadow-lg flex items-center justify-center shrink-0 cursor-pointer hover:bg-primary/10 transition-colors" title="รายการสนาม" data-v-225803bb${_scopeId}><svg class="w-5 h-5 text-base-content/70" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-225803bb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" data-v-225803bb${_scopeId}></path></svg></button></div>`);
            if (locationError.value) {
              _push2(`<div class="absolute top-16 left-3 right-3 z-[1000]" data-v-225803bb${_scopeId}><div class="bg-error/90 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm" data-v-225803bb${_scopeId}>${ssrInterpolate(locationError.value)} <button class="ml-2 underline cursor-pointer bg-transparent border-0 text-white text-xs" data-v-225803bb${_scopeId}>ปิด</button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (showList.value) {
              _push2(`<div class="absolute bottom-0 left-0 right-0 z-[1000] max-h-[60vh] bg-base-100/95 backdrop-blur-xl rounded-t-2xl shadow-2xl border-t border-base-300 overflow-hidden flex flex-col" data-v-225803bb${_scopeId}><div class="flex justify-center pt-2 pb-1 shrink-0" data-v-225803bb${_scopeId}><div class="w-10 h-1 rounded-full bg-base-300" data-v-225803bb${_scopeId}></div></div><div class="px-4 py-2 border-b border-base-200 flex items-center justify-between shrink-0" data-v-225803bb${_scopeId}><span class="text-sm font-bold text-base-content" data-v-225803bb${_scopeId}> สนามแบดมินตัน <span class="text-base-content/40 font-normal ml-1" data-v-225803bb${_scopeId}>(${ssrInterpolate(filteredCourts.value.length)})</span></span><button class="btn btn-ghost btn-xs btn-circle" data-v-225803bb${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-225803bb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-225803bb${_scopeId}></path></svg></button></div><div class="overflow-y-auto flex-1 overscroll-contain" data-v-225803bb${_scopeId}>`);
              if (filteredCourts.value.length === 0) {
                _push2(`<div class="py-8 text-center text-sm text-base-content/40" data-v-225803bb${_scopeId}> ไม่พบสนาม </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(filteredCourts.value, (court) => {
                _push2(`<button class="w-full text-left px-4 py-3 border-b border-base-200 hover:bg-primary/5 transition-colors cursor-pointer bg-transparent border-0 border-solid" data-v-225803bb${_scopeId}><div class="flex items-start gap-3" data-v-225803bb${_scopeId}><div class="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0 mt-0.5" data-v-225803bb${_scopeId}><svg class="w-5 h-5 text-success" viewBox="0 0 24 24" fill="currentColor" data-v-225803bb${_scopeId}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" data-v-225803bb${_scopeId}></path></svg></div><div class="flex-1 min-w-0" data-v-225803bb${_scopeId}><div class="text-sm font-bold text-base-content truncate" data-v-225803bb${_scopeId}>${ssrInterpolate(court.name)}</div>`);
                if (court.address) {
                  _push2(`<div class="text-[11px] text-base-content/50 truncate mt-0.5" data-v-225803bb${_scopeId}>${ssrInterpolate(court.address)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="flex items-center gap-2 mt-1" data-v-225803bb${_scopeId}>`);
                if (court.field_total) {
                  _push2(`<span class="text-[10px] text-base-content/40" data-v-225803bb${_scopeId}>🏸 ${ssrInterpolate(court.field_total)} สนาม</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (court.play_price) {
                  _push2(`<span class="text-[10px] text-base-content/40" data-v-225803bb${_scopeId}>💰 ${ssrInterpolate(parseFloat(court.play_price).toLocaleString())}฿</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (court.has_buffet_session) {
                  _push2(`<span class="text-[10px] text-warning font-semibold" data-v-225803bb${_scopeId}>🎾 บุฟเฟ่ต์</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
                if (court.distance != null) {
                  _push2(`<div class="text-right shrink-0" data-v-225803bb${_scopeId}><div class="text-sm font-bold text-primary" data-v-225803bb${_scopeId}>${ssrInterpolate(court.distance.toFixed(1))}</div><div class="text-[10px] text-base-content/40" data-v-225803bb${_scopeId}>กม.</div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></button>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!showList.value) {
              _push2(`<div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]" data-v-225803bb${_scopeId}><button class="h-10 px-5 rounded-full bg-primary text-primary-content shadow-lg border-0 cursor-pointer text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2" data-v-225803bb${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-225803bb${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" data-v-225803bb${_scopeId}></path></svg> สนาม ${ssrInterpolate(filteredCourts.value.length)} แห่ง `);
              if (userLocation.value) {
                _push2(`<span class="text-primary-content/70" data-v-225803bb${_scopeId}>· ใกล้คุณ</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "relative h-[calc(100vh-3.5rem-4rem)] lg:h-[calc(100vh-4rem)]" }, [
                createVNode("div", {
                  ref_key: "mapContainer",
                  ref: mapContainer,
                  class: "absolute inset-0 z-0"
                }, null, 512),
                createVNode("div", { class: "absolute top-3 left-3 right-14 z-[1000] flex gap-2" }, [
                  createVNode("div", { class: "relative flex-1 max-w-xs" }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                      type: "text",
                      placeholder: "ค้นหาสนาม...",
                      class: "w-full h-10 pl-9 pr-3 rounded-xl bg-base-100/95 backdrop-blur-sm border border-base-300 shadow-lg text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50",
                      onFocus: ($event) => showList.value = true
                    }, null, 40, ["onUpdate:modelValue", "onFocus"]), [
                      [vModelText, searchQuery.value]
                    ]),
                    (openBlock(), createBlock("svg", {
                      class: "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("circle", {
                        cx: "11",
                        cy: "11",
                        r: "8"
                      }),
                      createVNode("path", { d: "m21 21-4.35-4.35" })
                    ]))
                  ]),
                  createVNode("button", {
                    onClick: locateMe,
                    disabled: locating.value,
                    class: "h-10 w-10 rounded-xl bg-base-100/95 backdrop-blur-sm border border-base-300 shadow-lg flex items-center justify-center shrink-0 cursor-pointer hover:bg-primary/10 transition-colors disabled:opacity-50",
                    title: "ตำแหน่งของฉัน"
                  }, [
                    locating.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "loading loading-spinner loading-xs text-primary"
                    })) : (openBlock(), createBlock("svg", {
                      key: 1,
                      class: "w-5 h-5 text-primary",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M12 2v2m0 16v2M2 12h2m16 0h2m-5.636-5.636L14.95 7.778M9.05 16.222l-1.414 1.414M7.778 9.05L6.364 7.636m11.272 8.728l1.414 1.414"
                      }),
                      createVNode("circle", {
                        cx: "12",
                        cy: "12",
                        r: "4"
                      })
                    ]))
                  ], 8, ["disabled"]),
                  createVNode("button", {
                    onClick: ($event) => showList.value = !showList.value,
                    class: "h-10 w-10 rounded-xl bg-base-100/95 backdrop-blur-sm border border-base-300 shadow-lg flex items-center justify-center shrink-0 cursor-pointer hover:bg-primary/10 transition-colors",
                    title: "รายการสนาม"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 text-base-content/70",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M4 6h16M4 10h16M4 14h16M4 18h16"
                      })
                    ]))
                  ], 8, ["onClick"])
                ]),
                locationError.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "absolute top-16 left-3 right-3 z-[1000]"
                }, [
                  createVNode("div", { class: "bg-error/90 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm" }, [
                    createTextVNode(toDisplayString(locationError.value) + " ", 1),
                    createVNode("button", {
                      onClick: ($event) => locationError.value = "",
                      class: "ml-2 underline cursor-pointer bg-transparent border-0 text-white text-xs"
                    }, "ปิด", 8, ["onClick"])
                  ])
                ])) : createCommentVNode("", true),
                createVNode(Transition, { name: "slide-up" }, {
                  default: withCtx(() => [
                    showList.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "absolute bottom-0 left-0 right-0 z-[1000] max-h-[60vh] bg-base-100/95 backdrop-blur-xl rounded-t-2xl shadow-2xl border-t border-base-300 overflow-hidden flex flex-col"
                    }, [
                      createVNode("div", { class: "flex justify-center pt-2 pb-1 shrink-0" }, [
                        createVNode("div", { class: "w-10 h-1 rounded-full bg-base-300" })
                      ]),
                      createVNode("div", { class: "px-4 py-2 border-b border-base-200 flex items-center justify-between shrink-0" }, [
                        createVNode("span", { class: "text-sm font-bold text-base-content" }, [
                          createTextVNode(" สนามแบดมินตัน "),
                          createVNode("span", { class: "text-base-content/40 font-normal ml-1" }, "(" + toDisplayString(filteredCourts.value.length) + ")", 1)
                        ]),
                        createVNode("button", {
                          onClick: ($event) => showList.value = false,
                          class: "btn btn-ghost btn-xs btn-circle"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4",
                            fill: "none",
                            stroke: "currentColor",
                            "stroke-width": "2",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M6 18L18 6M6 6l12 12"
                            })
                          ]))
                        ], 8, ["onClick"])
                      ]),
                      createVNode("div", { class: "overflow-y-auto flex-1 overscroll-contain" }, [
                        filteredCourts.value.length === 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "py-8 text-center text-sm text-base-content/40"
                        }, " ไม่พบสนาม ")) : createCommentVNode("", true),
                        (openBlock(true), createBlock(Fragment, null, renderList(filteredCourts.value, (court) => {
                          return openBlock(), createBlock("button", {
                            key: court.id,
                            onClick: ($event) => focusCourt(court),
                            class: "w-full text-left px-4 py-3 border-b border-base-200 hover:bg-primary/5 transition-colors cursor-pointer bg-transparent border-0 border-solid"
                          }, [
                            createVNode("div", { class: "flex items-start gap-3" }, [
                              createVNode("div", { class: "w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0 mt-0.5" }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-5 h-5 text-success",
                                  viewBox: "0 0 24 24",
                                  fill: "currentColor"
                                }, [
                                  createVNode("path", { d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" })
                                ]))
                              ]),
                              createVNode("div", { class: "flex-1 min-w-0" }, [
                                createVNode("div", { class: "text-sm font-bold text-base-content truncate" }, toDisplayString(court.name), 1),
                                court.address ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-[11px] text-base-content/50 truncate mt-0.5"
                                }, toDisplayString(court.address), 1)) : createCommentVNode("", true),
                                createVNode("div", { class: "flex items-center gap-2 mt-1" }, [
                                  court.field_total ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "text-[10px] text-base-content/40"
                                  }, "🏸 " + toDisplayString(court.field_total) + " สนาม", 1)) : createCommentVNode("", true),
                                  court.play_price ? (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-[10px] text-base-content/40"
                                  }, "💰 " + toDisplayString(parseFloat(court.play_price).toLocaleString()) + "฿", 1)) : createCommentVNode("", true),
                                  court.has_buffet_session ? (openBlock(), createBlock("span", {
                                    key: 2,
                                    class: "text-[10px] text-warning font-semibold"
                                  }, "🎾 บุฟเฟ่ต์")) : createCommentVNode("", true)
                                ])
                              ]),
                              court.distance != null ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-right shrink-0"
                              }, [
                                createVNode("div", { class: "text-sm font-bold text-primary" }, toDisplayString(court.distance.toFixed(1)), 1),
                                createVNode("div", { class: "text-[10px] text-base-content/40" }, "กม.")
                              ])) : createCommentVNode("", true)
                            ])
                          ], 8, ["onClick"]);
                        }), 128))
                      ])
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 2
                }, 1024),
                !showList.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]"
                }, [
                  createVNode("button", {
                    onClick: ($event) => showList.value = true,
                    class: "h-10 px-5 rounded-full bg-primary text-primary-content shadow-lg border-0 cursor-pointer text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M4 6h16M4 10h16M4 14h16M4 18h16"
                      })
                    ])),
                    createTextVNode(" สนาม " + toDisplayString(filteredCourts.value.length) + " แห่ง ", 1),
                    userLocation.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-primary-content/70"
                    }, "· ใกล้คุณ")) : createCommentVNode("", true)
                  ], 8, ["onClick"])
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/CourtMap.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CourtMap = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-225803bb"]]);
export {
  CourtMap as default
};
