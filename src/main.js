import { createApp } from 'vue';
import { createPinia } from 'pinia';
import baseComponentRegister from '@/plugins/baseComponentRegister.js';
import fontAwesome from '@/plugins/fontAwesome.js';
import clickOutsideDirective from '@/plugins/clickOutsideDirective';
import pageScrollDirective from '@/plugins/pageScrollDirective';
import VPagination from '@/plugins/VPagination';
import VeeValidate from './plugins/veeValidate';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(baseComponentRegister);
app.use(fontAwesome);
app.use(clickOutsideDirective);
app.use(pageScrollDirective);
app.use(VPagination);
app.use(VeeValidate);

app.mount('#app');
