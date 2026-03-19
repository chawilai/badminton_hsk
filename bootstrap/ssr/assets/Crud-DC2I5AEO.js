import { ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import "./useToast-DyaFeJ92.js";
const _sfc_main = {
  __name: "Crud",
  __ssrInlineRender: true,
  setup(__props) {
    const products = ref([
      { name: "Product 1", description: "Description for product 1", inventoryStatus: "instock", category: "Accessories", price: 199, quantity: 10, id: "p1GTr", code: "Xv1A3" },
      { name: "Product 2", description: "Description for product 2", inventoryStatus: "outofstock", category: "Electronics", price: 349, quantity: 0, id: "p2TYr", code: "Nv2B5" },
      { name: "Product 3", description: "Description for product 3", inventoryStatus: "lowstock", category: "Fashion", price: 79, quantity: 5, id: "p3ZTq", code: "Cv3C7" },
      { name: "Product 4", description: "Description for product 4", inventoryStatus: "instock", category: "Accessories", price: 129, quantity: 15, id: "p4WEy", code: "Dv4D9" }
    ]);
    const product = ref({});
    const productDialog = ref(false);
    const deleteProductDialog = ref(false);
    const searchQuery = ref("");
    const submitted = ref(false);
    const filteredProducts = computed(() => {
      if (!searchQuery.value) return products.value;
      const q = searchQuery.value.toLowerCase();
      return products.value.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    });
    const statusClass = (status) => {
      switch (status) {
        case "instock":
          return "badge-success";
        case "lowstock":
          return "badge-warning";
        case "outofstock":
          return "badge-error";
        default:
          return "badge-ghost";
      }
    };
    const formatCurrency = (value) => {
      if (value == null) return "";
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-between"><div class="flex gap-2"><button class="btn btn-primary btn-sm">+ New</button></div><div><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Search..." class="input input-bordered input-sm w-48"></div></div><div class="overflow-x-auto"><table class="table table-zebra"><thead><tr><th>Code</th><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Status</th><th>Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(filteredProducts.value, (item) => {
        _push(`<tr><td class="font-mono text-sm">${ssrInterpolate(item.code)}</td><td class="font-medium">${ssrInterpolate(item.name)}</td><td>${ssrInterpolate(item.category)}</td><td>${ssrInterpolate(formatCurrency(item.price))}</td><td>${ssrInterpolate(item.quantity)}</td><td><span class="${ssrRenderClass([statusClass(item.inventoryStatus), "badge badge-sm"])}">${ssrInterpolate(item.inventoryStatus)}</span></td><td><div class="flex gap-1"><button class="btn btn-ghost btn-xs">Edit</button><button class="btn btn-ghost btn-xs text-error">Delete</button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><dialog class="${ssrRenderClass([{ "modal-open": productDialog.value }, "modal"])}"><div class="modal-box"><h3 class="font-bold text-lg">${ssrInterpolate(product.value.id ? "Edit" : "New")} Product</h3><div class="py-4 space-y-4"><div class="form-control"><label class="label"><span class="label-text">Name</span></label><input${ssrRenderAttr("value", product.value.name)} type="text" class="${ssrRenderClass([{ "input-error": submitted.value && !product.value.name }, "input input-bordered"])}">`);
      if (submitted.value && !product.value.name) {
        _push(`<label class="label"><span class="label-text-alt text-error">Name is required.</span></label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-control"><label class="label"><span class="label-text">Description</span></label><textarea class="textarea textarea-bordered" rows="3">${ssrInterpolate(product.value.description)}</textarea></div><div class="grid grid-cols-2 gap-4"><div class="form-control"><label class="label"><span class="label-text">Category</span></label><select class="select select-bordered"><option${ssrIncludeBooleanAttr(Array.isArray(product.value.category) ? ssrLooseContain(product.value.category, null) : ssrLooseEqual(product.value.category, null)) ? " selected" : ""}>Accessories</option><option${ssrIncludeBooleanAttr(Array.isArray(product.value.category) ? ssrLooseContain(product.value.category, null) : ssrLooseEqual(product.value.category, null)) ? " selected" : ""}>Electronics</option><option${ssrIncludeBooleanAttr(Array.isArray(product.value.category) ? ssrLooseContain(product.value.category, null) : ssrLooseEqual(product.value.category, null)) ? " selected" : ""}>Fashion</option></select></div><div class="form-control"><label class="label"><span class="label-text">Price</span></label><input${ssrRenderAttr("value", product.value.price)} type="number" class="input input-bordered"></div></div><div class="grid grid-cols-2 gap-4"><div class="form-control"><label class="label"><span class="label-text">Quantity</span></label><input${ssrRenderAttr("value", product.value.quantity)} type="number" class="input input-bordered"></div><div class="form-control"><label class="label"><span class="label-text">Status</span></label><select class="select select-bordered"><option value="instock"${ssrIncludeBooleanAttr(Array.isArray(product.value.inventoryStatus) ? ssrLooseContain(product.value.inventoryStatus, "instock") : ssrLooseEqual(product.value.inventoryStatus, "instock")) ? " selected" : ""}>In Stock</option><option value="lowstock"${ssrIncludeBooleanAttr(Array.isArray(product.value.inventoryStatus) ? ssrLooseContain(product.value.inventoryStatus, "lowstock") : ssrLooseEqual(product.value.inventoryStatus, "lowstock")) ? " selected" : ""}>Low Stock</option><option value="outofstock"${ssrIncludeBooleanAttr(Array.isArray(product.value.inventoryStatus) ? ssrLooseContain(product.value.inventoryStatus, "outofstock") : ssrLooseEqual(product.value.inventoryStatus, "outofstock")) ? " selected" : ""}>Out of Stock</option></select></div></div></div><div class="modal-action"><button class="btn btn-ghost">Cancel</button><button class="btn btn-primary">Save</button></div></div><form method="dialog" class="modal-backdrop"><button>close</button></form></dialog><dialog class="${ssrRenderClass([{ "modal-open": deleteProductDialog.value }, "modal"])}"><div class="modal-box max-w-sm"><h3 class="font-bold text-lg">Confirm</h3><p class="py-4">Are you sure you want to delete <b>${ssrInterpolate(product.value.name)}</b>?</p><div class="modal-action"><button class="btn btn-ghost">Cancel</button><button class="btn btn-error">Delete</button></div></div><form method="dialog" class="modal-backdrop"><button>close</button></form></dialog></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Prime/Crud.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
