<template>
  <div uk-modal :id="'audio_modal_' + id" class="uk-modal-full">
    <div
        class="uk-modal-dialog uk-modal-body uk-light uk-background-secondary"
        style="min-height: 100vh"
    >
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <h2 class="uk-modal-title">
        {{ tileAudio?.data?.attributes?.title }}
      </h2>
      <div class="uk-grid-divider uk-child-width-1-2@m" uk-grid>
        <div>
          <div
              class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary"
          >
            <div uk-lightbox>
              <a
                  class=""
                  :href="$store.getters.backend_url + current_image_full_url"
                  data-caption=""
              >
                <img
                    alt="track_image"
                    width="100%"
                    :src="$store.getters.backend_url + current_image_url"
                    v-if="current_image_url"
                />
              </a>
            </div>
          </div>
        </div>
        <div>
          <div
              class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary"
          >
            <div>
              <span class="player-icon" title="Lire toutes les pistes"><unicon name="play-circle" fill="white"
                                                                               width="76" height="76"
                                                                               v-if="player_playing===false"
                                                                               @click.prevent="playerPlay()"></unicon></span>
              <span class="player-icon"><unicon name="stop-circle" fill="white" width="76" height="76"
                                                v-if="player_playing===true"
                                                @click.prevent="playerStop()"></unicon></span>
               <span class="player-icon uk-margin-small-left"><unicon name="step-backward" fill="white" width="30" height="30"
                                                v-if="player_playing===true"
                                                @click.prevent="nextTrack(-1)"></unicon></span>

              <span class="player-icon uk-margin-small-left"><unicon name="skip-forward" fill="white" width="30" height="30"
                                                v-if="player_playing===true"
                                                @click.prevent="nextTrack()"></unicon></span>
              <span v-if="player_track" class="uk-margin-small-left">
                {{ player_track.attributes.name }}
              </span>
            </div>
            <div
                v-for="track in tileAudio?.data?.attributes?.tracks?.data"
                :key="track.id"
                class="uk-margin-small-top"
            >
              <audio
                  :id="`audio_track_${id}_${track.id}`"
                  controls
                  v-show="player_playing === false"
                  controlsList="nodownload noplaybackrate"
                  @play="trackPlay(track)"
                  @ended="trackEnded(track)"
              >
                <source
                    :src="
                    $store.getters.backend_url +
                    track.attributes.media.data.attributes.url
                  "
                />
                Your browser does not support the audio element.
              </audio>
              <span class="uk-margin-left">{{ track.attributes.name }}</span>
            </div>
          </div>
        </div>
         <div v-if="current_content"
              class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary"
          >
            <StrapiBlocks :content="current_content"></StrapiBlocks>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
import {AUDIO_Q} from "@/lib/queries";
import uk from "uikit";
import {StrapiBlocks} from "vue-strapi-blocks-renderer";

export default {
  name: "TileAudio",
  props: {
    id: {
      type: String,
    },
  },
  components: {StrapiBlocks},
  data() {
    return {
      player_playing: false,
      player_track: null,
      current_image_url: null,
      current_content: null,
      current_image_full_url: null,
    };
  },
  beforeMount() {
    document.getElementById("audio_modal_" + this.id)?.remove();
  },
  mounted() {
    uk.modal("#audio_modal_" + this.id).show();
  },
  computed: {},
  methods: {
    nextTrack(d = 1) {
      console.log("NEXT TRACK ")
      let tracks = this.tileAudio?.data?.attributes?.tracks?.data
      if (this.player_playing) {
        let index = tracks.findIndex(e => {
          return e.id === this.player_track.id
        })
        console.log(index)
        if (index < tracks.length && index >= 0) {
          index = (index + d) % tracks.length
          console.log(index)
          this.player_track = tracks[index]
          this.playerPlay()
        }
      }
    },
    playerPlay() {
      this.player_playing = true
      if (this.player_track === null) {
        this.player_track = this.tileAudio?.data?.attributes?.tracks?.data[0]
      }
      if (!this.player_track){
        return
      }
      this.trackPlay(this.player_track)
      let el = document.getElementById(`audio_track_${this.id}_${this.player_track.id}`);
      if (el) {
        el.play()
      }
    },
    playerStop() {
      this.stopAll(false)
      this.player_playing = false
      this.trackPlay()
    },
    stopAll(reset_time=true) {
      const els = [...document.getElementsByTagName("audio")];
      els.forEach((e) => {
        e.pause();
        if (reset_time) {
          e.currentTime = 0;
        }
      });
    },
    trackEnded(track) {
      let tracks = this.tileAudio?.data?.attributes?.tracks?.data
      if (this.player_playing && this.player_track.id === track.id) {
        let index = tracks.findIndex(e => {
          return e.id === track.id
        })
        if (index < tracks.length - 1 && index >= 0) {
          this.player_track = tracks[index + 1]
          this.playerPlay()
        }
      }
    },
    trackPlay(track) {
      const song_image = track?.attributes?.image?.data?.attributes;
      const song_content = track?.attributes?.content;
      const album_image =
          this.tileAudio?.data?.attributes?.tile?.image?.data?.attributes;
      const album_content =
          this.tileAudio?.data?.attributes?.content;
      let image = song_image || album_image;
      this.current_content = song_content || album_content;
      if (this.player_playing){
        this.current_content = album_content
        image = album_image
      }
      this.current_image_full_url = image.url;
      if (image) {
        this.current_image_url = image.formats.thumbnail.url;
        if (image?.small) {
          this.current_image_url = image.formats.small.url;
        }
        if (image?.medium) {
          this.current_image_url = image.formats.medium.url;
        }
      }
      if (track) {
        this.player_track = track
        this.tileAudio?.data?.attributes?.tracks?.data.forEach((e) => {
          if (e.id !== track.id) {
            let el = document.getElementById(`audio_track_${this.id}_${e.id}`);
            if (el) {
              el.pause();
              if (!this.player_playing) {
                el.currentTime = 0;
              }
              this.$log.debug(el);
            } else {
              this.$log.debug("Cannot find ", `audio_track_${this.id}_${e.id}`);
            }
          } else {
            this.$log.debug("skip", track.id);
          }
        });
      } else {
        this.stopAll()
      }
    },
  },
  apollo: {
    tileAudio: {
      query: AUDIO_Q,
      variables() {
        return {
          id: this.id,
        };
      },
      result: function () {
        this.trackPlay();
      },
    },
  },
};
</script>

<style scoped>
.player-icon:hover {
  cursor: pointer;
}
</style>
