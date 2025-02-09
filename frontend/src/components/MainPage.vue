<template>
  <div class="uk-margin-top" style="min-height: 80vh">
    <div v-if="$apollo.loading" class="uk-position-center">
      <div class="spinner" uk-spinner="ratio: 3"></div>
    </div>
    <template v-else-if="$store.getters.category_break">
      <div v-for="group in sorted_items" :key="group" class="tile-group">
        <TileGrid :items="group[1]" :title="group[0]" :key="group"></TileGrid>
      </div>
    </template>
    <template v-else>
      <TileGrid
        :items="all_items"
        :key="name + '_' + q.replace(' ', '') + '_' + tag + '_' + media"
      ></TileGrid>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import TileGrid from "@/components/TileGrid.vue";
import { IMAGES_Q, VIDEOS_Q, AUDIOS_Q, TEXTS_Q, SEARCH_Q } from "@/lib/queries";
import uk from "uikit";
import { slugify } from "@/lib/utils";
import metaManager from "@/mixins/metaManager";

export default {
  name: "MainPage",
  mixins: [metaManager],
  components: { TileGrid },
  props: {
    name: String,
    tag: String,
    media: String,
    q: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      items: [],
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
        new Date(b?.attributes?.tile?.date) -
        new Date(a?.attributes?.tile?.date)
      );
    },
    compute_items() {
      this.$log.debug("Compute items", this.name, this.tag, this.media);
      if (this.name === "tag" && !this.tag) {
        this.updateMetaTags(this.$store.getters.label_theme);
        const tags = this.$store.getters.tags;
        if (tags.length > 0) {
          this.$router.push(
            "/t/" + slugify(this.$store.getters.tags[0]?.attributes?.name)
          );
          this.items = [];
          return;
        }
      }
      if (this.name === "media" && !this.media) {
        this.updateMetaTags(this.$store.getters.label_music);
        this.$router.push("/m/" + slugify(this.$store.getters.label_music));
        this.items = [];
        return;
      }
      if (this.$apollo.loading || this.name === "tag") {
        this.items = [];
        return;
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
      let ret_items = {};
      if (this.name === "type") {
        ret_items[this.$store.getters.label_music] = audio;
        ret_items[this.$store.getters.label_images] = image;
        ret_items[this.$store.getters.label_video] = video;
        ret_items[this.$store.getters.label_text] = text;
      } else {
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
          this.updateMetaTags(this.$store.getters.label_date);
          ret_items = Object.groupBy(allTiles, (e) =>
            e?.attributes?.tile?.date
              ? new Date(e.attributes.tile.date).getFullYear()
              : new Date().getFullYear()
          );
        } else if (this.name === "theme") {
          this.$store.getters.tags.forEach((tag) => {
            let tag_name = tag?.attributes?.name;
            let fTiles = allTiles.filter((e) =>
              e?.attributes?.tile?.tags?.data
                .map((ee) => ee.attributes.name)
                .includes(tag_name)
            );
            if (fTiles.length > 0) {
              ret_items[tag_name] = fTiles;
            }
          });
        } else if (this.tag && this.tag.length > 1) {
          this.updateMetaTags(this.tag);
          this.$store.getters.tags.forEach((tag) => {
            let tag_name = tag?.attributes?.name;
            let fTiles = allTiles.filter((e) =>
              e?.attributes?.tile?.tags?.data
                .map((ee) => ee.attributes.name)
                .includes(tag_name)
            );
            if (fTiles.length > 0 && slugify(tag_name) === this.tag) {
              ret_items[tag_name] = fTiles;
            }
          });
        } else if (this.media && this.media.length > 1) {
          this.updateMetaTags(this.media);
          if (this.media === slugify(this.$store.getters.label_music)) {
            ret_items[this.$store.getters.label_music] = audio;
          } else if (this.media === slugify(this.$store.getters.label_images)) {
            ret_items[this.$store.getters.label_images] = image;
          } else if (this.media === slugify(this.$store.getters.label_video)) {
            ret_items[this.$store.getters.label_video] = video;
          } else if (this.media === slugify(this.$store.getters.label_text)) {
            ret_items[this.$store.getters.label_text] = text;
          }
        }
      }
      Object.keys(ret_items).forEach((k) => {
        ret_items[k] = ret_items[k].map((e, i) => {
          return { tile: e, id: i === 0 ? `tile_group_${k}` : `tile_${e.id}` };
        });
      });
      this.items = ret_items;
    },
  },
  computed: {
    sorted_items() {
      if (this.name === "time") {
        return Object.entries(this.items).sort((a, b) => -(a[0] - b[0]));
      } else {
        return Object.entries(this.items).sort((a, b) => a[0] - b[0]);
      }
    },
    all_items() {
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
      this.$log.info(ret);
      return ret;
    },
  },
  apollo: {
    $query: {
      loadingKey: "loading",
    },
    tileImages: {
      query: IMAGES_Q,
      result() {
        this.compute_items();
      },
    },
    tileAudios: {
      query: AUDIOS_Q,
      result() {
        this.compute_items();
      },
    },
    tileVideos: {
      query: VIDEOS_Q,
      result() {
        this.compute_items();
      },
    },
    tileTexts: {
      query: TEXTS_Q,
      result() {
        this.compute_items();
      },
    },
    search: {
      query: SEARCH_Q,
      result(res) {
        this.$log.debug(res);
        this.compute_items();
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
    name() {
      this.compute_items();
    },
    tag() {
      this.compute_items();
    },
    media() {
      this.compute_items();
    },
    q: function () {
      this.$log.debug("Q changed...", this.q);
      this.compute_items();
    },
  },
};
</script>

<style>
.tile-group {
  margin-top: 10px;
}
</style>
