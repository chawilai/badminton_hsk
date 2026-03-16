<script setup>
import { ref, computed } from "vue";
import { useToast } from "@/composables/useToast";

const toast = useToast();

const products = ref([
    { name: "Product 1", description: "Description for product 1", inventoryStatus: "instock", category: "Accessories", price: 199, quantity: 10, id: "p1GTr", code: "Xv1A3" },
    { name: "Product 2", description: "Description for product 2", inventoryStatus: "outofstock", category: "Electronics", price: 349, quantity: 0, id: "p2TYr", code: "Nv2B5" },
    { name: "Product 3", description: "Description for product 3", inventoryStatus: "lowstock", category: "Fashion", price: 79, quantity: 5, id: "p3ZTq", code: "Cv3C7" },
    { name: "Product 4", description: "Description for product 4", inventoryStatus: "instock", category: "Accessories", price: 129, quantity: 15, id: "p4WEy", code: "Dv4D9" },
]);

const product = ref({});
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const searchQuery = ref("");
const submitted = ref(false);

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value;
    const q = searchQuery.value.toLowerCase();
    return products.value.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
});

const statusClass = (status) => {
    switch (status) {
        case "instock": return "badge-success";
        case "lowstock": return "badge-warning";
        case "outofstock": return "badge-error";
        default: return "badge-ghost";
    }
};

const openNew = () => {
    product.value = { inventoryStatus: "instock" };
    submitted.value = false;
    productDialog.value = true;
};

const editProduct = (prod) => {
    product.value = { ...prod };
    productDialog.value = true;
};

const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};

const saveProduct = () => {
    submitted.value = true;
    if (!product.value.name?.trim()) return;

    if (product.value.id) {
        const index = products.value.findIndex(p => p.id === product.value.id);
        if (index > -1) products.value[index] = { ...product.value };
        toast.add({ severity: "success", summary: "Success", detail: "Product Updated", life: 3000 });
    } else {
        product.value.id = "p" + Math.random().toString(36).substr(2, 4);
        product.value.code = Math.random().toString(36).substr(2, 5);
        products.value.push({ ...product.value });
        toast.add({ severity: "success", summary: "Success", detail: "Product Created", life: 3000 });
    }
    productDialog.value = false;
};

const deleteProduct = () => {
    products.value = products.value.filter(p => p.id !== product.value.id);
    deleteProductDialog.value = false;
    toast.add({ severity: "success", summary: "Success", detail: "Product Deleted", life: 3000 });
};

const formatCurrency = (value) => {
    if (value == null) return "";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
};
</script>

<template>
    <div class="space-y-4">
        <!-- Toolbar -->
        <div class="flex items-center justify-between">
            <div class="flex gap-2">
                <button class="btn btn-primary btn-sm" @click="openNew">+ New</button>
            </div>
            <div>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search..."
                    class="input input-bordered input-sm w-48"
                />
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="table table-zebra">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredProducts" :key="item.id">
                        <td class="font-mono text-sm">{{ item.code }}</td>
                        <td class="font-medium">{{ item.name }}</td>
                        <td>{{ item.category }}</td>
                        <td>{{ formatCurrency(item.price) }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>
                            <span class="badge badge-sm" :class="statusClass(item.inventoryStatus)">
                                {{ item.inventoryStatus }}
                            </span>
                        </td>
                        <td>
                            <div class="flex gap-1">
                                <button class="btn btn-ghost btn-xs" @click="editProduct(item)">Edit</button>
                                <button class="btn btn-ghost btn-xs text-error" @click="confirmDeleteProduct(item)">Delete</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Product Dialog -->
        <dialog class="modal" :class="{ 'modal-open': productDialog }">
            <div class="modal-box">
                <h3 class="font-bold text-lg">{{ product.id ? 'Edit' : 'New' }} Product</h3>
                <div class="py-4 space-y-4">
                    <div class="form-control">
                        <label class="label"><span class="label-text">Name</span></label>
                        <input v-model="product.name" type="text" class="input input-bordered" :class="{ 'input-error': submitted && !product.name }" />
                        <label v-if="submitted && !product.name" class="label"><span class="label-text-alt text-error">Name is required.</span></label>
                    </div>
                    <div class="form-control">
                        <label class="label"><span class="label-text">Description</span></label>
                        <textarea v-model="product.description" class="textarea textarea-bordered" rows="3"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="form-control">
                            <label class="label"><span class="label-text">Category</span></label>
                            <select v-model="product.category" class="select select-bordered">
                                <option>Accessories</option>
                                <option>Electronics</option>
                                <option>Fashion</option>
                            </select>
                        </div>
                        <div class="form-control">
                            <label class="label"><span class="label-text">Price</span></label>
                            <input v-model.number="product.price" type="number" class="input input-bordered" />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="form-control">
                            <label class="label"><span class="label-text">Quantity</span></label>
                            <input v-model.number="product.quantity" type="number" class="input input-bordered" />
                        </div>
                        <div class="form-control">
                            <label class="label"><span class="label-text">Status</span></label>
                            <select v-model="product.inventoryStatus" class="select select-bordered">
                                <option value="instock">In Stock</option>
                                <option value="lowstock">Low Stock</option>
                                <option value="outofstock">Out of Stock</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-action">
                    <button class="btn btn-ghost" @click="productDialog = false">Cancel</button>
                    <button class="btn btn-primary" @click="saveProduct">Save</button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop"><button @click="productDialog = false">close</button></form>
        </dialog>

        <!-- Delete Confirmation -->
        <dialog class="modal" :class="{ 'modal-open': deleteProductDialog }">
            <div class="modal-box max-w-sm">
                <h3 class="font-bold text-lg">Confirm</h3>
                <p class="py-4">Are you sure you want to delete <b>{{ product.name }}</b>?</p>
                <div class="modal-action">
                    <button class="btn btn-ghost" @click="deleteProductDialog = false">Cancel</button>
                    <button class="btn btn-error" @click="deleteProduct">Delete</button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop"><button @click="deleteProductDialog = false">close</button></form>
        </dialog>
    </div>
</template>
