export default {
  methods: {
    updateMetaTags(title, description) {
      let my_title = this.$store.getters.config?.title;
      if (title) {
        my_title += " | " + title;
      }
      let my_description = this.$store.getters.config?.subtitle || my_title;
      if (description) {
        my_description += description;
      }
      this.$route.meta.title = my_title;
      this.$route.meta.title = my_description;
      document.title = my_title;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        // Create meta description tag if it doesn't exist
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", my_description);
    },
  },
};
