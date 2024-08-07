<template>
  <div class="uk-margin-top" style="min-height: 80vh">
    <div v-if="$apollo.loading" class="uk-position-center">
      <div class="spinner" uk-spinner="ratio: 3"></div>
    </div>
    <template v-else-if="$store.getters.category_break">
      <div v-for="group in sorted_items" :key="group" class="tile-group">
        <div class="uk-text-center" v-if="!$store.getters.headers_as_tile">
          <h2
            :id="`tile_group_${group[0]}`"
            v-if="group"
            class="white_text uk-padding"
          >
            {{ group[0] }}
          </h2>
        </div>
        <TileGrid :items="group[1]" :title="group[0]"></TileGrid>
      </div>
    </template>
    <template v-else>
      <TileGrid
        :items="all_items"
        :key="name + '_' + q.replace(' ', '')"
      ></TileGrid>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import TileGrid from "@/components/TileGrid.vue";
import { IMAGES_Q, VIDEOS_Q, AUDIOS_Q, TEXTS_Q, SEARCH_Q } from "@/lib/queries";
import uk from "uikit";

export default {
  name: "MainPage",
  components: { TileGrid },
  props: {
    name: String,
    q: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tileImages: { data: [] },
      tileVideos: { data: [] },
      tileTexts: { data: [] },
      tileAudios: { data: [] },
      search: {
        tileAudios: { data: [] },
        tileImages: { data: [] },
        tileVideos: { data: [] },
        tileTexts: { data: [] },
      },
    };
  },
  methods: {
    updatePath(e) {
      this.$log.debug("MODAL HIDDEN", e);
      // get parent path property
      if (this.$route.matched.length >= 2) {
        let path = this.$route.matched[this.$route.matched.length - 2].path;
        this.$log.debug(path);
        let realPath = path.replace(
          /:\w+/g,
          (param) => this.$route.params[param.substr(1)]
        );
        this.$router.push(realPath);
      } else {
        this.$log.debug("Matched ", this.$route.matched);
      }
    },
    stopAllTracks() {
      const els = [...document.getElementsByTagName("audio")];
      els.forEach((e) => {
        e.pause();
        e.currentTime = 0;
      });
    },
    sortTime(a, b) {
      return (
        new Date(a?.attributes?.tile?.date) -
        new Date(b?.attributes?.tile?.date)
      );
    },
  },
  computed: {
    total_length() {
      return Object.values(this.items)
        .map((e) => e.length)
        .reduce((acc, cv) => {
          return acc + cv;
        }, 0);
    },
    sorted_items() {
      if (this.name === "time") {
        return Object.entries(this.items).sort((a, b) => -(a[0] - b[0]));
      } else {
        return Object.entries(this.items).sort((a, b) => a[0] - b[0]);
      }
    },
    all_items() {
      console.log("Evaluate all_items");
      let ret = [];
      this.sorted_items.forEach((e) => {
        let title = {
          is_title: true,
          title: e[0],
          large: false,
          id: `tile_group_${e[0]}`,
        };
        ret = [...ret, title, ...e[1]];
      });
      return ret;
    },
    items() {
      if (this.$apollo.loading) {
        return [];
      }
      let image = this.tileImages.data;
      let audio = this.tileAudios.data;
      let video = this.tileVideos.data;
      let text = this.tileTexts.data;

      if (this.q.length > 2) {
        image = this.search.tileImages.data;
        audio = this.search.tileAudios.data;
        video = this.search.tileVideos.data;
        text = this.search.tileTexts.data;
      }

      if (this.name === "type") {
        const obj = {};
        obj[this.$store.getters.label_music] = audio;
        obj[this.$store.getters.label_images] = image;
        obj[this.$store.getters.label_video] = video;
        obj[this.$store.getters.label_text] = text;
        return obj;
      }
      let allTiles = image.concat(text, audio, video);
      allTiles.sort(this.sortTime);
      if (
        this.$store.getters.config?.headline &&
        this.$store.getters.headline_as_tile === true &&
        this.$store.getters.headline_enabled
      ) {
        allTiles.unshift({
          is_title: true,
          title: this.$store.getters.config?.headline,
        });
      }
      if (this.name === "time") {
        return Object.groupBy(allTiles, (e) =>
          e?.attributes?.tile?.date
            ? new Date(e.attributes.tile.date).getFullYear()
            : new Date().getFullYear()
        );
      } else if (this.name === "theme") {
        let ret = {};
        this.$store.getters.tags.forEach((tag) => {
          let tag_name = tag?.attributes?.name;
          let fTiles = allTiles.filter((e) =>
            e?.attributes?.tile?.tags?.data
              .map((ee) => ee.attributes.name)
              .includes(tag_name)
          );
          if (fTiles.length > 0) {
            ret[tag_name] = fTiles;
          }
        });
        return ret;
      }

      return [];
    },
  },
  apollo: {
    $query: {
      loadingKey: "loading",
    },
    tileImages: IMAGES_Q,
    tileAudios: AUDIOS_Q,
    tileVideos: VIDEOS_Q,
    tileTexts: TEXTS_Q,
    search: {
      query: SEARCH_Q,
      result(res) {
        this.$log.debug(res);
      },
      variables() {
        return {
          query: this.q,
        };
      },
      skip() {
        return this.q.length <= 2;
      },
    },
  },
  mounted() {
    var _self = this;
    uk.util.on(document, "hidden", ".uk-lightbox", function (e) {
      _self.updatePath(e);
    });
    uk.util.on(document, "hidden", ".uk-modal", function (e) {
      _self.updatePath(e);
      _self.stopAllTracks();
    });
  },
  watch: {
    sorted_items: function () {
      this.$emit(
        "nav",
        this.sorted_items.map((e) => e[0])
      );
    },
    q: function () {
      this.$log.debug("Q changed...", this.q);
    },
  },
};
</script>

<style>
.tile-group {
  margin-top: 10px;
}
</style>
