import { createStore } from 'vuex'

export const store = createStore({
    state() {
        return {
            config: {},
            tags: [],
            headline_as_tile: process.env.VUE_APP_HEADLINE_AS_TILE || 'false',
            headers_as_tile: process.env.VUE_APP_HEADERS_AS_TILE || 'false',
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
        },
        headline_as_tile: state => {
            return state.headline_as_tile === 'true'
        },
        headers_as_tile: state => {
            return state.headers_as_tile === 'true'
        },
        headline_enabled: state => {
            let exp_date = new Date(state.config?.headline_expiration)
            let now = new Date()
            console.log(exp_date, now, !exp_date, now < exp_date)
            return !exp_date || now < exp_date
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
