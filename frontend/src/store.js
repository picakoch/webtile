import { createStore } from 'vuex'

export const store = createStore({
    state() {
        return {
            config: {},
            tags: [],
            backend_url: process.env.VUE_APP_STRAPI_API_URL,
        }
    },
    getters: {
        config: state => {
            return state.config
        },
        tags: state => {
            return state.tags
        },
        backend_url: state => {
            return state.backend_url
        }
    },
    mutations: {
        setConfig(state, cfg) {
            state.config = cfg
        },
        setTags(state, tags) {
            state.tags = tags
        }
    }
})
