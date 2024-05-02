<template>
  <div>
  </div>
</template>

<script>
import {VIDEO_Q} from '@/lib/queries'
import uk from "uikit"

export default {
  name: "TileVideo",
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
    }
  },
  computed: {},
  methods: {},
  apollo: {
    tileVideo: {
      query: VIDEO_Q,
      variables() {
        return {
          id: this.id,
        }
      },
      result: function (res) {
        const video = res?.data?.tileVideo?.data?.attributes?.video?.data?.attributes?.url
        const description = res?.data?.tileVideo?.data?.attributes?.description
        uk.lightboxPanel(
            {
              id: 'video_' + this.id,
              items: [{source: this.$store.getters.backend_url + video, caption: description}],
              videoAutoplay: true
            }).show()
      }
    }
  }
}
</script>


<style scoped>
</style>