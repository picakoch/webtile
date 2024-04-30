<template>
  <div uk-modal :id="'audio_modal_' + id" class="uk-modal-full">

    <div class="uk-modal-dialog uk-modal-body uk-light uk-background-secondary">
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <h2 class="uk-modal-title">{{ tileAudio?.data?.attributes?.description }}</h2>
      <div class="uk-text-center" uk-grid>
        <div class="uk-width-1-3">
          <div class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary">
            <v-lazy-image width="100%" :src="$store.getters.backend_url + current_image_url" v-if="current_image_url"></v-lazy-image>
          </div>
        </div>
        <div class="uk-width-2-3">
          <div class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary">
            <div v-for="track in tileAudio?.data?.attributes?.tracks?.data"
                 :key="track.id">
              <span class="uk-margin-right">{{ track.attributes.name }}</span>
              <audio controls controlsList="nodownload noplaybackrate" @play="play(track)">
                <source :src="$store.getters.backend_url + track.attributes.media.data.attributes.url">
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>
      </div>
      <p class="uk-text-right">
        <button class="uk-button uk-button-default uk-modal-close" type="button">Close</button>
      </p>
    </div>
  </div>
</template>

<script>
import {AUDIO_Q} from '@/lib/queries'
import uk from "uikit"
import VLazyImage from "v-lazy-image";

export default {
  name: "TileAudio",
  props: {
    id: {
      type: String
    }
  },
  components: {VLazyImage},
  data() {
    return {
      current_image_url: null,
    }
  },
  mounted() {
    uk.modal("#audio_modal_" + this.id).show();
  },
  computed: {},
  methods: {
    play(track) {
      const song_image = track?.attributes?.image?.data?.attributes?.formats
      const album_image = this.tileAudio?.data?.attributes?.tile?.image?.data?.attributes.formats
      let image = song_image || album_image
      this.$log.debug(song_image, album_image, image)
      if (image) {
        this.current_image_url = image.thumbnail.url
        if (image?.small) {
          this.current_image_url = image.small.url
        }
        if (image?.medium) {
          this.current_image_url = image.medium.url
        }
      }
    }
  },
  apollo: {
    tileAudio: {
      query: AUDIO_Q,
      variables() {
        return {
          id: this.id,
        }
      },
      result: function () {
        this.play(null)
      }
    }
  }
}
</script>


<style scoped>
</style>