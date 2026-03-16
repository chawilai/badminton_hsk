import { ref } from 'vue';

const isDarkMode = ref(false);
const currentTemplate = ref('badminton');

export function useBadmintonLayout() {
    const initTheme = () => {
        // Restore dark mode preference
        const storedDark = localStorage.getItem('badminton-dark-mode');
        if (storedDark !== null) {
            isDarkMode.value = storedDark === 'true';
        } else {
            isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        applyDarkClass(isDarkMode.value);

        // Restore template preference
        const storedTemplate = localStorage.getItem('badminton-template');
        if (storedTemplate) {
            currentTemplate.value = storedTemplate;
        }
    };

    const applyDarkClass = (dark) => {
        const html = document.documentElement;
        if (dark) {
            html.classList.add('dark', 'tw-dark');
        } else {
            html.classList.remove('dark', 'tw-dark');
        }
    };

    const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value;
        localStorage.setItem('badminton-dark-mode', isDarkMode.value.toString());
        applyDarkClass(isDarkMode.value);
    };

    const switchTemplate = (template) => {
        currentTemplate.value = template;
        localStorage.setItem('badminton-template', template);
        window.location.reload();
    };

    return {
        isDarkMode,
        currentTemplate,
        initTheme,
        toggleDarkMode,
        switchTemplate,
    };
}
