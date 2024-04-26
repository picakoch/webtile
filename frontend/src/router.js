import { createWebHistory, createRouter } from 'vue-router'
import MainPage from "./components/MainPage";
import NotFound from "./components/NotFound";
import TileDetails from "./components/TileDetails";

const routes = [
  { path: "/", component: MainPage, props: {name: 'all'}},
  {
    path: "/category/:name",
    component: MainPage,
    props: true,
    children: [
      { path: ':id(\\d+)', name: 'single', component: TileDetails, props: true },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;