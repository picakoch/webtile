<template>
  <div class="uk-margin-top">
    <div v-if="$apollo.loading" class="uk-position-center">
      <div class="spinner" uk-spinner="ratio: 3"></div>
    </div>
    <TileGrid v-else :items="items"></TileGrid>
  </div>
</template>

<script>
import TileGrid from "@/components/TileGrid.vue";
import {IMAGES_Q, VIDEOS_Q, AUDIOS_Q, TEXTS_Q} from '@/lib/queries'
import uk from "uikit"

export default {
  name: "MainPage",
  components: {TileGrid},
  props: {
    name: String,
  },
  data() {
    return {
      tileImages: {data: []},
      tileVideos: {data: []},
      tileTexts: {data: []},
      tileAudios: {data: []},

    };
  },
  computed: {
    items: function () {
      if (this.$apollo.loading) {
        return []
      }
      console.log(this.name)
      if (this.name === "image") {
        return this.tileImages.data
      } else if (this.name === "video") {
        return this.tileVideos.data
      } else if (this.name === "audio") {
        return this.tileAudios.data
      } else if (this.name === "text") {
        return this.tileTexts.data
      } else if (this.name === "all") {
        return this.tileImages.data.concat(this.tileTexts.data, this.tileAudios.data, this.tileVideos.data)
      }
      return []
    }
  },
  apollo: {
    $query: {
      loadingKey: 'loading',
    },
    tileImages: IMAGES_Q,
    tileAudios: AUDIOS_Q,
    tileVideos: VIDEOS_Q,
    tileTexts: TEXTS_Q,
  },
  mounted() {
    var self = this
    uk.util.on(document, 'hidden', '.uk-lightbox', function (e) {
      console.log("HIDDEN", e)
      // get parent path property
      let path = self.$route.matched[this.$route.matched.length - 2].path
      let realPath = path.replace(/:\w+/g, param =>
          self.$route.params[param.substr(1)])
      self.$router.push(realPath)
    });
  }
};
</script>

<style>
.spinner {
  color: white;
  margin-left: auto;
}

.uk-spinner svg * {
  stroke-width: 2px !important;
}
</style>