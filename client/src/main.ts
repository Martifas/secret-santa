import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";  
import "flowbite/dist/flowbite.css";

createApp(App).use(router).mount('#app');