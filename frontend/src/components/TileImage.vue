<template>
  <div :id="'image_' + id" uk-lightbox>
  </div>
</template>

<script>
import {IMAGE_Q} from '@/lib/queries'
import uk from "uikit"

export default {
  name: "TileImage",
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      backend_url: process.env.VUE_APP_STRAPI_API_URL,
      empty_gallery: false,
    }
  },
  computed: {},
  methods: {},
  apollo: {
    tileImage: {
      query: IMAGE_Q,
      result: function (res) {
        const images = res?.data?.tileImage?.data?.attributes?.images?.data.map((e) => {
          return {
            source: this.backend_url + e.attributes.formats.large.url,
            caption: ''
          }
        }) || []
        if (images.length === 0){
          this.empty_gallery = true
        } else {
          uk.lightboxPanel({items: images}).show();
        }
      },
      variables() {
        return {
          id: this.id,
        }
      }
    }
  }
}
</script>


<style scoped>
</style>