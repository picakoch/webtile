import { createStore } from 'vuex'

export const store = createStore({
    state() {
        return {
            config: {},
            backend_url: process.env.VUE_APP_STRAPI_API_URL,
        }
    },
    getters: {
        config: state => {
            return state.config
        },
        backend_url: state => {
            return state.backend_url
        }
    },
    mutations: {
        setConfig(state, cfg) {
            // mutate state
            state.config = cfg
        }
    }
})
