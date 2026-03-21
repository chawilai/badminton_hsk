import { ref } from 'vue';

const currentTheme = ref('badminton-dark');

const availableThemes = [
    { name: 'badminton', label: '🏸 Badminton', dark: false },
    { name: 'badminton-dark', label: '🏸 Badminton Dark', dark: true },
    { name: 'light', label: '☀️ Light', dark: false },
    { name: 'dark', label: '🌙 Dark', dark: true },
    { name: 'cupcake', label: '🧁 Cupcake', dark: false },
    { name: 'bumblebee', label: '🐝 Bumblebee', dark: false },
    { name: 'emerald', label: '💎 Emerald', dark: false },
    { name: 'corporate', label: '🏢 Corporate', dark: false },
    { name: 'synthwave', label: '🌆 Synthwave', dark: true },
    { name: 'retro', label: '📺 Retro', dark: false },
    { name: 'cyberpunk', label: '🤖 Cyberpunk', dark: false },
    { name: 'valentine', label: '💖 Valentine', dark: false },
    { name: 'halloween', label: '🎃 Halloween', dark: true },
    { name: 'garden', label: '🌿 Garden', dark: false },
    { name: 'forest', label: '🌲 Forest', dark: true },
    { name: 'aqua', label: '💧 Aqua', dark: false },
    { name: 'lofi', label: '🎵 Lo-Fi', dark: false },
    { name: 'pastel', label: '🎨 Pastel', dark: false },
    { name: 'fantasy', label: '🧚 Fantasy', dark: false },
    { name: 'wireframe', label: '📐 Wireframe', dark: false },
    { name: 'black', label: '⬛ Black', dark: true },
    { name: 'luxury', label: '👑 Luxury', dark: true },
    { name: 'dracula', label: '🧛 Dracula', dark: true },
    { name: 'cmyk', label: '🖨️ CMYK', dark: false },
    { name: 'autumn', label: '🍂 Autumn', dark: false },
    { name: 'business', label: '💼 Business', dark: true },
    { name: 'acid', label: '🧪 Acid', dark: false },
    { name: 'lemonade', label: '🍋 Lemonade', dark: false },
    { name: 'night', label: '🌃 Night', dark: true },
    { name: 'coffee', label: '☕ Coffee', dark: true },
    { name: 'winter', label: '❄️ Winter', dark: false },
    { name: 'dim', label: '🔅 Dim', dark: true },
    { name: 'nord', label: '🧊 Nord', dark: false },
    { name: 'sunset', label: '🌅 Sunset', dark: true },
    { name: 'caramellatte', label: '🍮 Caramel Latte', dark: false },
    { name: 'silk', label: '🧵 Silk', dark: false },
    { name: 'abyss', label: '🌊 Abyss', dark: true },
];

export function useBadmintonLayout() {
    const initTheme = () => {
        if (typeof window === 'undefined') return;
        const storedTheme = localStorage.getItem('badminton-theme');
        if (storedTheme) {
            currentTheme.value = storedTheme;
        }
        applyTheme(currentTheme.value);
    };

    const applyTheme = (theme) => {
        if (typeof window === 'undefined') return;
        document.documentElement.setAttribute('data-theme', theme);
        const isDark = availableThemes.find(t => t.name === theme)?.dark ?? false;
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const switchTheme = (theme) => {
        currentTheme.value = theme;
        if (typeof window !== 'undefined') {
            localStorage.setItem('badminton-theme', theme);
        }
        applyTheme(theme);
    };

    return {
        currentTheme,
        availableThemes,
        initTheme,
        switchTheme,
    };
}
