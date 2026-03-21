import { ref } from 'vue';
import th from '@/locales/th';
import en from '@/locales/en';

const messages = { th, en };
const locale = ref(typeof window !== 'undefined' ? (localStorage.getItem('badminton-locale') || 'th') : 'th');

export function useLocale() {
  const t = (key, params = {}) => {
    let msg = messages[locale.value]?.[key] ?? messages.th[key] ?? key;
    Object.entries(params).forEach(([k, v]) => {
      msg = msg.replace(`{${k}}`, v);
    });
    return msg;
  };

  const setLocale = (lang) => {
    locale.value = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('badminton-locale', lang);
      document.documentElement.setAttribute('lang', lang);
    }
  };

  const toggleLocale = () => {
    setLocale(locale.value === 'th' ? 'en' : 'th');
  };

  return { locale, t, setLocale, toggleLocale };
}

export { locale };
