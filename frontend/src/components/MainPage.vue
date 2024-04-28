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
  methods: {
    updatePath(e) {
      this.$log.debug("MODAL HIDDEN", e)
      // get parent path property
      if (this.$route.matched.length >= 2) {
        let path = this.$route.matched[this.$route.matched.length - 2].path
        this.$log.debug(path)
        let realPath = path.replace(/:\w+/g, param =>
            this.$route.params[param.substr(1)])
        this.$router.push(realPath)
      } else {
        this.$log.debug("Matched ", this.$route.matched)
      }
    }
  },
  computed: {
    items: function () {
      if (this.$apollo.loading) {
        return []
      }
      this.$log.debug(this.name)
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
    var _self = this
    uk.util.on(document, 'hidden', '.uk-lightbox', function (e) {
      _self.updatePath(e)
    });
    uk.util.on(document, 'hidden', '.uk-modal', function (e) {
      _self.updatePath(e)
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