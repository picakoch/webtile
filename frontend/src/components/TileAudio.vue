<template>
  <div uk-modal :id="'audio_modal_' + id" class="uk-modal-full">

    <div class="uk-modal-dialog uk-modal-body uk-light uk-background-secondary" style="min-height: 100vh">
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <h2 class="uk-modal-title">{{ tileAudio?.data?.attributes?.description }}</h2>
      <div class="" uk-grid>
        <div class="uk-width-1-3">
          <div class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary">
            <img alt="track_image" width="100%" :src="$store.getters.backend_url + current_image_url"
                          v-if="current_image_url">
          </div>
        </div>
        <div class="uk-width-2-3">
          <div class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary">
            <div v-for="track in tileAudio?.data?.attributes?.tracks?.data"
                 :key="track.id" class="uk-margin-small-top">
              <audio :id="`audio_track_${id}_${track.id}`" controls controlsList="nodownload noplaybackrate"
                     @play="play(track)">
                <source :src="$store.getters.backend_url + track.attributes.media.data.attributes.url">
                Your browser does not support the audio element.
              </audio>
              <span class="uk-margin-left">{{ track.attributes.name }}</span>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {AUDIO_Q} from '@/lib/queries'
import uk from "uikit"

export default {
  name: "TileAudio",
  props: {
    id: {
      type: String
    }
  },
  components: {},
  data() {
    return {
      current_image_url: null,
    }
  },
  beforeMount() {
    document.getElementById("audio_modal_" + this.id)?.remove();
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
      if (track) {
        this.tileAudio?.data?.attributes?.tracks?.data.forEach(e => {
          if (e.id !== track.id) {
            let el = document.getElementById(`audio_track_${this.id}_${e.id}`)
            if (el) {
              el.pause()
              el.currentTime = 0
              this.$log.debug(el)
            } else {
              this.$log.debug("Cannot find ", `audio_track_${this.id}_${e.id}`)
            }
          } else {
            this.$log.debug("skip", track.id)
          }
        })
      } else {
        const els = [...document.getElementsByTagName('audio')]
        els.forEach(e => {
          e.pause()
          e.currentTime = 0
        })
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