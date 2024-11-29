import { createRouter, createWebHistory } from "vue-router";
import PLP from "../pages/PLP.vue";
import PDP from "../pages/PDP.vue";

const routes = [
  { path: "/", component: PLP },
  { path: "/:id", component: PLP, props: true }, // categories
  { path: "/product/:id", component: PDP, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
