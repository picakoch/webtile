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
          let url = e.attributes.formats.thumbnail.url
          if (e.attributes.formats?.small) {
            url = e.attributes.formats.small.url
          }
          if (e.attributes.formats?.medium) {
            url = e.attributes.formats.medium.url
          }
          if (e.attributes.formats?.large) {
            url = e.attributes.formats.large.url
          }
          return {
            source: this.backend_url + url,
            caption: ''
          }
        }) || []
        if (images.length === 0) {
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