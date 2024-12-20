import { defineStore } from "pinia";

export const useSignaturePadStore = defineStore("signaturepad", {
    state: () => ({
        undoMethods: {},
        clearMethods: {},
        lastPadStroke: [],
        activeRow: [],
    }),
    actions: {
        registerUndo(index, undoMethod) {
            this.undoMethods[index] = undoMethod;
        },
        registerClear(index, clearMethod) {
            this.clearMethods[index] = clearMethod;
        },
        triggerUndo() {
            if (this.undoMethods[this.getLastStokeIndex()]) {
                this.undoMethods[this.getLastStokeIndex()]();
                this.lastPadStroke.pop();
            }
        },
        triggerActiveRow(row) {
            console.log(row)
            console.log(this.activeRow);
            if (this.activeRow.includes(row)) {
                this.activeRow = this.activeRow.filter(item => item !== row)
            } else {
                this.activeRow.push(row)
            }
        },
        triggerClearRow() {
            if (this.getLastStokeIndex()) {
                let parts = this.getLastStokeIndex().split("_");
                let result = parts.slice(0, 2).join("_");

                for (let i = 0; i <= 10; i++) {
                    this.clearMethods[`${result}_${i}`]();
                }
            }
        },
        triggerClearPad() {
            if (this.getLastStokeIndex()) {
                this.clearMethods[this.getLastStokeIndex()]();
                this.lastPadStroke = this.lastPadStroke.filter(
                    (value) => value !== this.getLastStokeIndex()
                );
            }
        },
        showState() {
            // console.log(this.undoMethods);
        },
        getLastStokeIndex() {
            return this.lastPadStroke[this.lastPadStroke.length - 1];
        },
    },
});
