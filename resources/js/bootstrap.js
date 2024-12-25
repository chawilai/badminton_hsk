import axios from 'axios';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

window.axios = axios;
window.dayjs = dayjs;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
