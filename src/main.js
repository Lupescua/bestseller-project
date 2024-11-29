import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';

const app = createApp(App);

app.config.globalProperties.$fallbackImage = 'https://via.placeholder.com/150';

app.use(router).mount('#app');
