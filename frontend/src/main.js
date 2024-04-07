import { createApp, h } from "vue";
import MasonryWall from '@yeger/vue-masonry-wall'
import { createApolloProvider } from "@vue/apollo-option";
import apolloClient from "./vue-apollo";
import router from "./router";

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

import App from "./App.vue";

const app = createApp({
  render: () => h(App),
});

app.use(apolloProvider);
app.use(MasonryWall)
app.use(router)

app.mount("#app");