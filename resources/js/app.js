import "./bootstrap";

import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { createPinia } from "pinia";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ZiggyVue } from "../../vendor/tightenco/ziggy";

import { Draggable, DraggablePlugin, DraggableDirective } from '@braks/revue-draggable';

import Vue3Lottie from 'vue3-lottie'

// Paper CSS (imported first so our styles override it)
import "paper-css/paper.min.css";

// DaisyUI + Tailwind CSS (imported via app.css)
import "@/../css/app.css";
import "@/../assets/styles.scss";
import "@/../css/custom.css";
import "@/../css/badminton-theme.css";

// Apply theme early to prevent flash
if (typeof window !== 'undefined') {
    const darkThemes = ['badminton-dark', 'dark', 'synthwave', 'halloween', 'forest', 'black', 'luxury', 'dracula', 'business', 'night', 'coffee', 'dim', 'sunset', 'abyss'];
    const storedTheme = localStorage.getItem('badminton-theme') || 'badminton-dark';
    document.documentElement.setAttribute('data-theme', storedTheme);
    if (darkThemes.includes(storedTheme)) {
        document.documentElement.classList.add('dark');
    }
}

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob("./Pages/**/*.vue")
        ),
    setup({ el, App, props, plugin }) {
        const pinia = createPinia();

        const app = createApp({ render: () => h(App, props) });

        app.use(plugin);
        app.use(pinia);
        app.use(ZiggyVue);
        app.use(DraggablePlugin);
        app.use(Vue3Lottie);

        app.mount(el);

        return app;
    },
    progress: {
        color: "oklch(var(--p))",
        showSpinner: true,
    },
});
