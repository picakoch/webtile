import { createApp, h } from "vue";
import { createApolloProvider } from "@vue/apollo-option";
import apolloClient from "./vue-apollo";

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

import App from "./App.vue";

const app = createApp({
  render: () => h(App),
});

app.use(apolloProvider);
app.mount("#app");