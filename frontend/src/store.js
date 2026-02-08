import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      config: {},
      tags: [],
      headline_as_tile: import.meta.env.VITE_HEADLINE_AS_TILE || "false",
      headers_as_tile: import.meta.env.VITE_HEADERS_AS_TILE || "false",
      category_break: import.meta.env.VITE_CATEGORY_BREAK || "true",
      image_border: import.meta.env.VITE_IMAGE_BORDER || "true",
      backend_url: import.meta.env.VITE_STRAPI_API_URL,
      support_enabled: import.meta.env.VITE_SUPPORT_ENABLED || "true",
      media_enabled: import.meta.env.VITE_MEDIA_ENABLED || "true",
      newsletter_enabled: import.meta.env.VITE_NEWSLETTER_ENABLED || "true",
    };
  },
  getters: {
    config: (state) => {
      return state.config;
    },
    tags: (state) => {
      return state.tags;
    },
    backend_url: (state) => {
      return state.backend_url;
    },
    headline_as_tile: (state) => {
      return state.headline_as_tile === "true";
    },
    headers_as_tile: (state) => {
      return state.headers_as_tile === "true";
    },
    category_break: (state) => {
      return state.category_break === "true";
    },
    image_border: (state) => {
      return state.image_border === "true";
    },
    support_enabled: (state) => {
      return state.support_enabled === "true";
    },
    media_enabled: (state) => {
      return state.media_enabled === "true";
    },
    newsletter_enabled: (state) => {
      return state.newsletter_enabled === "true";
    },
    headline_enabled: (state) => {
      let exp_date = new Date(state.config?.headline_expiration);
      let now = new Date();
      return !exp_date || now < exp_date;
    },
    label_date: (state) => {
      return state.config?.label_date || "Date";
    },
    label_theme: (state) => {
      return state.config?.label_theme || "Thème";
    },
    label_media: (state) => {
      return state.config?.label_media || "Media";
    },
    label_bio: (state) => {
      return state.config?.label_bio || "Biographie";
    },
    label_contact: (state) => {
      return state.config?.label_contact || "Contact";
    },
    label_newsletter: (state) => {
      return state.config?.label_newsletter || "Newsletter";
    },
    label_contacts: (state) => {
      return state.config?.label_contacts || "Contacts";
    },
    label_support: (state) => {
      return state.config?.label_support || "Soutenir";
    },
    label_music: (state) => {
      return state.config?.label_music || "Musiques";
    },
    label_images: (state) => {
      return state.config?.label_images || "Photos";
    },
    label_video: (state) => {
      return state.config?.label_video || "Videos";
    },
    label_text: (state) => {
      return state.config?.label_text || "Textes";
    },
    donation_url: (state) => {
      return state.config?.donation_url || null;
    },
    support_text: (state) => {
      return state.config?.support_text;
    },
  },
  mutations: {
    setConfig(state, cfg) {
      state.config = cfg;
    },
    setTags(state, tags) {
      state.tags = tags;
    },
  },
});
