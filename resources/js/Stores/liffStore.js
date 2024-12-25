// Store (liffStore.js)
import { defineStore } from 'pinia';

export const useLiffStore = defineStore('liff', {
    state: () => ({
        initialized: false,
        liff: null
    }),
    actions: {
        async initializeLiff() {
            if (!this.initialized) {
                try {
                    await liff.init({ liffId: "2001165902-JR5Z95AG" });
                    console.log("LIFF initialization successful");
                    this.initialized = true;
                } catch (error) {
                    console.error("LIFF Initialization failed", error);
                }
            }
        },
    },
});
