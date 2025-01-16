import { createWebHistory, createRouter } from "vue-router";
import MainPage from "@/components/MainPage";
import NotFound from "@/components/NotFound";
import TileDetails from "@/components/TileDetails";
import ContactPage from "@/components/ContactPage.vue";
import BiographyPage from "@/components/BiographyPage.vue";

const routes = [
  { path: "/", redirect: "/time" },
  {
    path: "/tag",
    component: MainPage,
    props: { name: "tag" },
    name: "main_tag",
  },
  {
    path: "/t",
    name: "tags",
    component: MainPage,
    props: { name: "tag" },
    children: [
      {
        path: ":tag",
        component: MainPage,
        props: true,
        name: "tag",
        children: [
          {
            path: ":id",
            name: "detail-tag",
            component: TileDetails,
            props: true,
          },
        ],
      },
    ],
  },
  { path: "/bio", name: "bio", component: BiographyPage },
  { path: "/contact", name: "contact", component: ContactPage },
  {
    path: "/time",
    component: MainPage,
    props: { name: "time" },
    name: "main_time",
    children: [
      { path: ":id", name: "detail-time", component: TileDetails, props: true },
    ],
  },
  {
    path: "/type",
    component: MainPage,
    props: { name: "type" },
    name: "main_type",
    children: [
      { path: ":id", name: "detail-type", component: TileDetails, props: true },
    ],
  },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
