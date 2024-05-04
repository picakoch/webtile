<template>
  <div class="uk-margin-top">
    <div v-if="$apollo.loading" class="uk-position-center">
      <div class="spinner" uk-spinner="ratio: 3"></div>
    </div>
    <template v-else>
      <div v-for="group in sorted_items" :key="group" class="tile-group" :id="`tile_group_${group[0]}`">
        <div class="uk-text-center">
          <h3 v-if=group class="white_text">{{ group[0] }}</h3>
        </div>
        <TileGrid :items="group[1]"></TileGrid>
      </div>
    </template>
    <router-view></router-view>
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
    },
    stopAllTracks() {
      const els = [...document.getElementsByTagName('audio')]
      els.forEach(e => {
        e.pause()
        e.currentTime = 0
      })
    },
    sortTime(a, b) {
      return new Date(a?.attributes?.tile?.date) - new Date(b?.attributes?.tile?.date)
    }
  },
  computed: {
    sorted_items() {
      if (this.name === "time") {
        return Object.entries(this.items).sort((a, b) => -(a[0] - b[0]))
      } else {
        return Object.entries(this.items).sort((a, b) => a[0] - b[0])
      }
    },
    items() {
      if (this.$apollo.loading) {
        return []
      }
      this.$log.debug(this.name)
      if (this.name === "image") {
        return {image: this.tileImages.data}
      } else if (this.name === "video") {
        return {video: this.tileVideos.data}
      } else if (this.name === "audio") {
        return {audio: this.tileAudios.data}
      } else if (this.name === "text") {
        return {text: this.tileTexts.data}
      } else if (this.name === "time") {
        let allTiles = this.tileImages.data.concat(this.tileTexts.data, this.tileAudios.data, this.tileVideos.data)
        allTiles.sort(this.sortTime)
        return Object.groupBy(allTiles, (e) => e?.attributes?.tile?.date ? new Date(e.attributes.tile.date).getFullYear() : new Date().getFullYear())
      } else if (this.name === "theme") {
        let allTiles = this.tileImages.data.concat(this.tileTexts.data, this.tileAudios.data, this.tileVideos.data)
        let ret = {}
        console.log(this.$store.getters.tags)
        this.$store.getters.tags.forEach(tag => {
          let tag_name = tag?.attributes?.name
          let fTiles = allTiles.filter(e => e?.attributes?.tile?.tags?.data.map(ee => ee.attributes.name).includes(tag_name))
          if (fTiles.length > 0) {
            ret[tag_name] = fTiles
          }
        })
        return ret
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
      _self.stopAllTracks()
    });
  },
  watch: {
    sorted_items: function () {
      console.log("Changed sorted items", this.sorted_items.map(e => e[0]))
      this.$emit('nav', this.sorted_items.map(e => e[0]))
    }
  }
};
</script>

<style>
.tile-group {
  margin-top: 10px;
}
</style>