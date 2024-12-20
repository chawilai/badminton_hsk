import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
    state: () => ({
        count: 0,
    }),
    actions: {
        increment() {
            console.log("increment");
            this.count++;

            console.log(this.count)
        },
        decrement() {
            console.log("decrement");
            this.count--;

            console.log(this.count);
        },
    },
    getters: {
        doubleCount: (state) => state.count * 2,
    },
});
