import { createRouter, createWebHistory } from 'vue-router'
import LoosePageMode from "../layout/viewport/LoosePagesMode.vue";
import Home from '@/layout/viewport/Home.vue';
import NotebookContent from '@/layout/viewport/NotebookContent.vue';
import WriteMode from '@/layout/viewport/WriteMode.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/loosePages", component: LoosePageMode },
    { path: "/home", component: Home },
    { path: "/notebooks/content", component: NotebookContent},
    { path: "/pages/write", component: WriteMode },
  ],
})

export default router
