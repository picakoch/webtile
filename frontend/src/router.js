import { createWebHistory, createRouter } from "vue-router";
import MainPage from "@/components/MainPage";
import NotFound from "@/components/NotFound";
import TileDetails from "@/components/TileDetails";
import ContactPage from "@/components/ContactPage.vue";
import BiographyPage from "@/components/BiographyPage.vue";

const routes = [
  { path: "/", redirect: "/time" },
  {
    path: "/:name",
    component: MainPage,
    props: true,
    name: "main",
    children: [
      { path: "/:id", name: "detail", component: TileDetails, props: true },
    ],
  },
  { path: "/bio", name: "bio", component: BiographyPage },
  { path: "/contact", name: "contact", component: ContactPage },
  {
    path: "/t",
    name: "tag",
    component: null,
    children: [
      {
        path: ":tag",
        component: MainPage,
        props: true,
        name: "tag",
        children: [
          { path: ":id", name: "detail", component: TileDetails, props: true },
        ],
      },
    ],
  },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
  { path: "/:pathMatch(.*)", name: "bad-not-found", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
