import { createApp, h } from "vue";
import { createApolloProvider } from "@vue/apollo-option";
import apolloClient from "./vue-apollo";
import router from "./router";
import logger from "@/lib/logger";
import { store } from "./store";
import uk from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import { VueMasonryPlugin } from "vue-masonry";
import Unicon from "vue-unicons";
import {
  uniPlayCircle,
  uniPauseCircle,
  uniSkipForward,
  uniStepBackward,
  uniStopCircle,
  uniMusic,
  uniVideo,
  uniFile,
  uniImages,
} from "vue-unicons/dist/icons";

Unicon.add([
  uniPlayCircle,
  uniPauseCircle,
  uniSkipForward,
  uniStepBackward,
  uniStopCircle,
  uniMusic,
  uniVideo,
  uniFile,
  uniImages,
]);

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
app.use(Unicon);
router.isReady().then(() => app.mount("#app"));
