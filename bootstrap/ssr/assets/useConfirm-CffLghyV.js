import { reactive } from "vue";
const confirmState = reactive({
  visible: false,
  message: "",
  header: "",
  icon: "",
  accept: null,
  reject: null
});
function useConfirm() {
  const confirm = (options) => {
    confirmState.visible = true;
    confirmState.message = options.message || "Are you sure?";
    confirmState.header = options.header || "Confirm";
    confirmState.icon = options.icon || "";
    confirmState.accept = options.accept || null;
    confirmState.reject = options.reject || null;
  };
  const close = () => {
    confirmState.visible = false;
    confirmState.accept = null;
    confirmState.reject = null;
  };
  return { confirm, close, confirmState };
}
export {
  confirmState as c,
  useConfirm as u
};
