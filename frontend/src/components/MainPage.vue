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
    <div class="uk-background-secondary uk-light">
      <i>Aucun résultat</i>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import TileGrid from "@/components/TileGrid.vue";
import {IMAGES_Q, VIDEOS_Q, AUDIOS_Q, TEXTS_Q, SEARCH_Q} from '@/lib/queries'
import uk from "uikit"

export default {
  name: "MainPage",
  components: {TileGrid},
  props: {
    name: String,
    q: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      tileImages: {data: []},
      tileVideos: {data: []},
      tileTexts: {data: []},
      tileAudios: {data: []},
      search: {
        tileAudios: {data: []},
        tileImages: {data: []},
        tileVideos: {data: []},
        tileTexts: {data: []},
      },
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
    total_length() {
      return Object.values(this.items).map(e => e.length).reduce((acc, cv) => {
        return acc + cv
      }, 0);
    },
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
      let image = this.tileImages.data
      let audio = this.tileAudios.data
      let video = this.tileVideos.data
      let text = this.tileTexts.data

      if (this.q.length > 2) {
        image = this.search.tileImages.data
        audio = this.search.tileAudios.data
        video = this.search.tileVideos.data
        text = this.search.tileTexts.data
      }

      if (this.name === "type") {
        return {
          'Photos': image,
          'Videos': video,
          'Musique': audio,
          'Textes': text
        }
      }
      let allTiles = image.concat(text, audio, video)
      allTiles.sort(this.sortTime)

      if (this.name === "time") {
        return Object.groupBy(allTiles, (e) => e?.attributes?.tile?.date ? new Date(e.attributes.tile.date).getFullYear() : new Date().getFullYear())
      } else if (this.name === "theme") {
        let ret = {}
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
    search: {
      query: SEARCH_Q,
      result(res) {
        this.$log.debug(res)
      },
      variables() {
        return {
          query: this.q,
        }
      },
      skip() {
        return this.q.length <= 2
      },
    }
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
      this.$emit('nav', this.sorted_items.map(e => e[0]))
    },
    q: function () {
      this.$log.debug("Q changed...", this.q)
    }
  }
};
</script>

<style>
.tile-group {
  margin-top: 10px;
}
</style>