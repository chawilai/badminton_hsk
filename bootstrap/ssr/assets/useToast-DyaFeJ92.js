import { reactive } from "vue";
const toasts = reactive([]);
let toastId = 0;
function useToast() {
  const add = ({ severity = "info", summary = "", detail = "", life = 5e3 }) => {
    const id = ++toastId;
    toasts.push({ id, severity, summary, detail, life });
    if (life > 0) {
      setTimeout(() => {
        remove(id);
      }, life);
    }
  };
  const remove = (id) => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
    }
  };
  return { add, remove, toasts };
}
export {
  toasts as t,
  useToast as u
};
