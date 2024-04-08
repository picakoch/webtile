import { createMemoryHistory, createRouter } from 'vue-router'
import TileGrid from "./components/TileGrid";

const routes = [
  { path: '/' },
  {
    path: "/category/:slug",
    component: TileGrid,
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;