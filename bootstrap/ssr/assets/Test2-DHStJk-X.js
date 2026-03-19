import { reactive, ref, computed, onMounted, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Test2",
  __ssrInlineRender: true,
  setup(__props) {
    const example_arr = [
      { text: "我" },
      { text: "喜欢" },
      { text: "喝" },
      { text: "茶" }
    ];
    const currect_arr = ["我", "喜欢", "喝", "茶"];
    const answers = reactive(example_arr);
    const answerSlots = reactive([null, null, null, null]);
    const isDragOverSlot = reactive([false, false, false, false]);
    const isDragOverAnswersBox = ref(false);
    const completeText = ref("");
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    const allFilledAnswer = computed(() => {
      return answerSlots.filter((item) => item).length === 4;
    });
    onMounted(() => {
      shuffleArray(answers);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Quiz" }, null, _parent));
      _push(`<div class="${ssrRenderClass([{
        "bg-green-200": isDragOverAnswersBox.value,
        "bg-gray-200": !answers.length
      }, "min-h-15 flex justify-center items-center mb-4"])}" data-v-9d09794b><!--[-->`);
      ssrRenderList(answers, (answer, index) => {
        _push(`<div class="answer" draggable="true" data-v-9d09794b>${ssrInterpolate(answer.text)}</div>`);
      });
      _push(`<!--]-->`);
      if (!answers.length) {
        _push(`<div class="placeholder" data-v-9d09794b>Drag answers here</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex justify-center items-center gap-x-3" data-v-9d09794b><!--[-->`);
      ssrRenderList(answerSlots, (slot, index) => {
        _push(`<div class="${ssrRenderClass([{
          "bg-green-200": isDragOverSlot[index],
          "bg-gray-200": !slot
        }, "slot"])}" data-v-9d09794b>`);
        if (slot) {
          _push(`<div class="${ssrRenderClass([
            allFilledAnswer.value ? slot.text === currect_arr[index] ? "bg-green-300" : "bg-red-300" : "",
            "slot-content"
          ])}" draggable="true" data-v-9d09794b>${ssrInterpolate(slot.text)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass([completeText.value === "Currect !" ? "bg-green-300" : "bg-red-300", "flex justify-center items-center mx-auto mt-4 w-screen"])}" data-v-9d09794b>${ssrInterpolate(completeText.value)}</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Test2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Test2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9d09794b"]]);
export {
  Test2 as default
};
