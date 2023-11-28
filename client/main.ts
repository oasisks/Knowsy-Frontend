import "@/assets/main.css";
import "purecss";

import VueGoogleMaps from "@fawmi/vue-google-maps";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { createApp } from "vue";

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

app.mount("#app");