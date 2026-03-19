import { computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = {
  __name: "SkillRadarChart",
  __ssrInlineRender: true,
  props: {
    skills: { type: Object, required: true },
    size: { type: Number, default: 280 },
    showLabels: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const skillDefs = [
      { key: "serve", label: "เสิร์ฟ", icon: "🏸" },
      { key: "smash", label: "สแมช", icon: "💥" },
      { key: "clear", label: "เคลียร์", icon: "🌈" },
      { key: "net_play", label: "หน้าเน็ต", icon: "🕸️" },
      { key: "defense", label: "เกมรับ", icon: "🛡️" },
      { key: "backhand", label: "แบ็คแฮนด์", icon: "🔄" },
      { key: "deception", label: "ลูกหลอก", icon: "🎭" },
      { key: "footwork", label: "ฟุตเวิร์ค", icon: "👟" },
      { key: "speed", label: "ความเร็ว", icon: "⚡" },
      { key: "stamina", label: "สตามิน่า", icon: "❤️‍🔥" }
    ];
    const N = skillDefs.length;
    const cx = computed(() => props.size / 2);
    const cy = computed(() => props.size / 2);
    const maxR = computed(() => props.size / 2 - 36);
    const getPoint = (index, value) => {
      const angle = (-90 + index * (360 / N)) * Math.PI / 180;
      const r = value / 10 * maxR.value;
      return {
        x: cx.value + r * Math.cos(angle),
        y: cy.value + r * Math.sin(angle)
      };
    };
    const gridRings = computed(() => {
      return [2, 4, 6, 8, 10].map((level) => {
        const points = Array.from({ length: N }, (_, i) => {
          const p = getPoint(i, level);
          return `${p.x},${p.y}`;
        });
        return points.join(" ");
      });
    });
    const axisLines = computed(() => {
      return skillDefs.map((_, i) => {
        const p = getPoint(i, 10);
        return { x1: cx.value, y1: cy.value, x2: p.x, y2: p.y };
      });
    });
    const dataPolygon = computed(() => {
      return skillDefs.map((def, i) => {
        const val = props.skills[def.key] || 1;
        const p = getPoint(i, val);
        return `${p.x},${p.y}`;
      }).join(" ");
    });
    const dataPoints = computed(() => {
      return skillDefs.map((def, i) => {
        const val = props.skills[def.key] || 1;
        return getPoint(i, val);
      });
    });
    const labelPositions = computed(() => {
      return skillDefs.map((def, i) => {
        const p = getPoint(i, 11.8);
        return { ...def, x: p.x, y: p.y };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        width: __props.size,
        height: __props.size,
        viewBox: `0 0 ${__props.size} ${__props.size}`,
        class: "block"
      }, _attrs))}><!--[-->`);
      ssrRenderList(gridRings.value, (ring, i) => {
        _push(`<polygon${ssrRenderAttr("points", ring)} fill="none" class="stroke-base-content/10" stroke-width="0.5"></polygon>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(axisLines.value, (line, i) => {
        _push(`<line${ssrRenderAttr("x1", line.x1)}${ssrRenderAttr("y1", line.y1)}${ssrRenderAttr("x2", line.x2)}${ssrRenderAttr("y2", line.y2)} class="stroke-base-content/10" stroke-width="0.5"></line>`);
      });
      _push(`<!--]--><polygon${ssrRenderAttr("points", dataPolygon.value)} class="fill-primary/20 stroke-primary" stroke-width="2" stroke-linejoin="round"></polygon><!--[-->`);
      ssrRenderList(dataPoints.value, (p, i) => {
        _push(`<circle${ssrRenderAttr("cx", p.x)}${ssrRenderAttr("cy", p.y)} r="3.5" class="fill-primary stroke-base-100" stroke-width="1.5"></circle>`);
      });
      _push(`<!--]-->`);
      if (__props.showLabels) {
        _push(`<!--[-->`);
        ssrRenderList(labelPositions.value, (lbl) => {
          _push(`<text${ssrRenderAttr("x", lbl.x)}${ssrRenderAttr("y", lbl.y)} text-anchor="middle" dominant-baseline="central" class="fill-base-content/70" style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600" })}">${ssrInterpolate(lbl.icon)} ${ssrInterpolate(lbl.label)}</text>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</svg>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SkillRadarChart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
