// import "@/assets/main.css";
import "@/assets/index.css";
import "purecss";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import VueGoogleMaps from "@fawmi/vue-google-maps";
import "primeicons/primeicons.css";
import Button from "primevue/button";
import Card from "primevue/card";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/lara-light-green/theme.css";
import ScrollPanel from "primevue/scrollpanel";
import SelectButton from "primevue/selectbutton";
import Slider from "primevue/slider";
import VirtualScroller from "primevue/virtualscroller";
import App from "./App.vue";
import router from "./router";

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
app.use(PrimeVue);
app.component("Slider", Slider);
app.component("SelectButton", SelectButton);
app.component("Card", Card);
app.component("ScrollPanel", ScrollPanel);
app.component("VirtualScroller", VirtualScroller);
app.component("Button", Button);
app.component("InputText", InputText);

app.mount("#app");
