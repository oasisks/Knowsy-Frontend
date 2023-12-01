// import "@/assets/main.css";
import "@/assets/index.css";
import "purecss";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { createApp, defineComponent } from "vue";

import VueGoogleMaps from "@fawmi/vue-google-maps";
import PrimeVue from 'primevue/config';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/lara-light-teal/theme.css';
import App from "./App.vue";
import router from "./router";
import Slider from "primevue/slider"
import SelectButton from 'primevue/selectbutton';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);
app.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_API,
  },
});
app.use(PrimeVue)
app.component('Slider', Slider);
app.component('SelectButton', SelectButton);


app.mount("#app");
