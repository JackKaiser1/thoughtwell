import { createRouter, createWebHistory } from 'vue-router'
import LoosePageMode from "../layout/viewport/LoosePagesMode.vue";
import Home from '@/layout/viewport/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/loosePages", component: LoosePageMode },
    { path: "/home", component: Home },
  ],
})

export default router
