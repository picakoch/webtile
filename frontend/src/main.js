import { createApp, h } from "vue";
import MasonryWall from '@yeger/vue-masonry-wall'
import { createApolloProvider } from "@vue/apollo-option";
import apolloClient from "./vue-apollo";
import router from "./router";
import VueLogger from 'vuejs3-logger';
import {store} from './store/index'


const isProduction = process.env.NODE_ENV === 'production';

const options = {
    isEnabled: true,
    logLevel : isProduction ? 'error' : 'debug',
    stringifyArguments : false,
    showLogLevel : true,
    showMethodName : true,
    separator: '|',
    showConsoleColors: true
};

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

import App from "./App.vue";

const app = createApp({
  render: () => h(App),
});
import uk from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
uk.use(Icons)

app.use(apolloProvider);
app.use(MasonryWall)
app.use(router)
app.use(store)
app.use(VueLogger, options);
app.mount("#app");