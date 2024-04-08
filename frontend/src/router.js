import { createWebHistory, createRouter } from 'vue-router'
import TileGrid from "./components/TileGrid";
import NotFound from "./components/NotFound";

const routes = [
  { path: "/", component: TileGrid},
  {
    path: "/category/:name",
    component: TileGrid,
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;