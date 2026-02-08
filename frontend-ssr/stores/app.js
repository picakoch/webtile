import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    config: {},
    tags: [],
    headline_as_tile: process.env.HEADLINE_AS_TILE || "false",
    headers_as_tile: process.env.HEADERS_AS_TILE || "false",
    category_break: process.env.CATEGORY_BREAK || "true",
    image_border: process.env.IMAGE_BORDER || "true",
    backend_url: process.env.STRAPI_API_URL,
    support_enabled: process.env.SUPPORT_ENABLED || "true",
    media_enabled: process.env.MEDIA_ENABLED || "true",
    newsletter_enabled: process.env.NEWSLETTER_ENABLED || "true",
  }),

  getters: {
    headlineAsTile: (state) => state.headline_as_tile === "true",
    headersAsTile: (state) => state.headers_as_tile === "true",
    categoryBreak: (state) => state.category_break === "true",
    imageBorder: (state) => state.image_border === "true",
    supportEnabled: (state) => state.support_enabled === "true",
    mediaEnabled: (state) => state.media_enabled === "true",
    newsletterEnabled: (state) => state.newsletter_enabled === "true",

    headline_enabled: (state) => {
      let exp_date = new Date(state.config?.headline_expiration);
      let now = new Date();
      return !exp_date || now < exp_date;
    },

    label_date: (state) => state.config?.label_date || "Date",
    label_theme: (state) => state.config?.label_theme || "Thème",
    label_media: (state) => state.config?.label_media || "Media",
    label_bio: (state) => state.config?.label_bio || "Biographie",
    label_contact: (state) => state.config?.label_contact || "Contact",
    label_newsletter: (state) => state.config?.label_newsletter || "Newsletter",
    label_contacts: (state) => state.config?.label_contacts || "Contacts",
    label_support: (state) => state.config?.label_support || "Soutenir",
    label_music: (state) => state.config?.label_music || "Musiques",
    label_images: (state) => state.config?.label_images || "Photos",
    label_video: (state) => state.config?.label_video || "Videos",
    label_text: (state) => state.config?.label_text || "Textes",
    donation_url: (state) => state.config?.donation_url || null,
    support_text: (state) => state.config?.support_text,
  },

  actions: {
    setConfig(cfg) {
      this.config = cfg;
    },
    setTags(tags) {
      this.tags = tags;
    },
  },
  hydrate(state, initialState) {
    // This ensures the state from server is used on client
    state.config = initialState.config || {}
    state.tags = initialState.tags || []
  }
});
