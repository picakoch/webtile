import { createApp, h } from "vue";
import { createApolloProvider } from "@vue/apollo-option";
import apolloClient from "./vue-apollo";
import router from "./router";
import logger from "@/lib/logger";
import { store } from "./store";
import uk from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import { VueMasonryPlugin } from "vue-masonry";
import UniIcon from "@/components/UniIcon.vue";

const isProduction = import.meta.env.PROD;

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

import App from "./App.vue";

const app = createApp({
  render: () => h(App),
});

uk.use(Icons);

app.use(apolloProvider);
app.use(VueMasonryPlugin);
app.use(router);
app.use(store);
app.use(logger, { level: isProduction ? "error" : "debug" });
// Keeps the <unicon> tag used in templates since vue-unicons
// eslint-disable-next-line vue/multi-word-component-names
app.component("unicon", UniIcon);
router.isReady().then(() => app.mount("#app"));
