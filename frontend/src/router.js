import { createWebHistory, createRouter } from "vue-router";
import MainPage from "@/components/MainPage";
import NotFound from "@/components/NotFound";
import TileDetails from "@/components/TileDetails";
import NewsletterSubscription from "@/components/NewsletterSubscription.vue";
import SupportProject from "@/components/SupportProject.vue";

const routes = [
  { path: "/", redirect: "/time" },
  {
    path: "/:name",
    component: MainPage,
    props: true,
    name: 'main',
    children: [
      { path: ":id", name: "detail", component: TileDetails, props: true },
    ],
  },
  { path: "/newsletter", name: "newsletter", component: NewsletterSubscription },
  { path: "/donate", name: "support", component: SupportProject },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
  { path: "/:pathMatch(.*)", name: "bad-not-found", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
