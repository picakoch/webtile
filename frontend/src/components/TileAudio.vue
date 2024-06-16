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
            <div uk-lightbox class="uk-text-center">
              <a
                  class=""
                  :href="$store.getters.backend_url + current_image_full_url"
                  :data-caption="tileAudio?.data?.attributes?.title"
              >
                <v-lazy-image
                    :src="$store.getters.backend_url + current_image_full_url"
                    :src-placeholder="$store.getters.backend_url + current_image_url"
                    :alt="tileAudio?.data?.attributes?.title"
                    style="height: 60vh;"
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
              <span class="player-icon" title="Lire toutes les pistes" @click.prevent="playerPlayClicked()"
                    v-if="player_playing === false"
              ><unicon
                  name="play-circle"
                  fill="white"
                  width="76"
                  height="76"
              ></unicon
              ></span>
              <span class="player-icon" @click.prevent="playerStop()"
                    v-if="player_playing === true"
              ><unicon
                  name="stop-circle"
                  fill="white"
                  width="76"
                  height="76"
              ></unicon
              ></span>
              <span class="player-icon uk-margin-small-left" @click.prevent="nextTrack(-1)"
                    v-if="player_playing === true"
              ><unicon
                  name="step-backward"
                  fill="white"
                  width="30"
                  height="30"
              ></unicon
              ></span>

              <span class="player-icon uk-margin-small-left" @click.prevent="nextTrack()"
                    v-if="player_playing === true"
              ><unicon
                  name="skip-forward"
                  fill="white"
                  width="30"
                  height="30"
              ></unicon
              ></span>
            </div>
            <div v-if="player_track && player_playing" class="uk-margin-small-left uk-margin-small-top">
              {{ player_track_index }}. {{ player_track.attributes.name }}
            </div>
            <div class="uk-margin-small-left" v-if="player_track && player_playing">
              {{ current_time }} / {{ total_time }}
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
              <span v-show="player_playing === false" class="uk-margin-left">{{ track.attributes.name }}</span>
            </div>
          </div>
        </div>
        <div
            v-if="current_content"
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
import VLazyImage from "v-lazy-image";

export default {
  name: "TileAudio",
  props: {
    id: {
      type: String,
    },
  },
  components: {StrapiBlocks, VLazyImage},
  data() {
    return {
      player_playing: false,
      player_track: null,
      current_image_url: null,
      current_content: null,
      current_image_full_url: null,
      current_time: '0:00',
      total_time: '0:00',
    };
  },
  beforeMount() {
    document.getElementById("audio_modal_" + this.id)?.remove();
  },
  mounted() {
    uk.modal("#audio_modal_" + this.id).show();
  },
  computed: {
    player_track_index() {
      let tracks = this.tileAudio?.data?.attributes?.tracks?.data;
      if (this.player_playing && tracks) {
        let index = tracks.findIndex((e) => {
          return e.id === this.player_track.id;
        });
        return index + 1
      }
      return 0
    }
  },
  methods: {
    secsToString(sec_num) {
      var minutes = Math.floor((sec_num) / 60);
      var seconds = sec_num - (minutes * 60);

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return minutes + ':' + seconds;
    },
    refreshDuration() {
      if (this.player_playing && this.player_track) {
        let el = document.getElementById(
            `audio_track_${this.id}_${this.player_track.id}`
        );
        if (el) {
          this.current_time = this.secsToString(Math.floor(el.currentTime));
          this.total_time = this.secsToString(Math.floor(el.duration));
        }
      }
      setTimeout(this.refreshDuration, 500)
    },
    nextTrack(d = 1) {
      let current_track_id = this.player_track.id
      let tracks = this.tileAudio?.data?.attributes?.tracks?.data;
      if (this.player_playing) {
        let index = tracks.findIndex((e) => {
          return e.id === this.player_track.id;
        });
        if (index < tracks.length && index >= 0) {
          index = (index + d) % tracks.length;
          this.player_track = tracks[index];
          this.playerPlay();
        }
      }
      let el = document.getElementById(
          `audio_track_${this.id}_${current_track_id}`
      );
      if (el) {
        el.currentTime = 0;
      }
    },
    playerPlayClicked() {
      this.player_track = this.tileAudio?.data?.attributes?.tracks?.data[0];
      this.playerPlay()
    },
    playerPlay() {
      this.player_playing = true;
      if (this.player_track === null) {
        this.player_track = this.tileAudio?.data?.attributes?.tracks?.data[0];
      }
      if (!this.player_track) {
        return;
      }
      this.trackPlay(this.player_track);
      let el = document.getElementById(
          `audio_track_${this.id}_${this.player_track.id}`
      );
      if (el) {
        el.play();
      }
    },
    playerStop() {
      this.stopAll(false);
      this.player_playing = false;
      this.trackPlay();
    },
    stopAll(reset_time = true) {
      const els = [...document.getElementsByTagName("audio")];
      els.forEach((e) => {
        e.pause();
        if (reset_time) {
          e.currentTime = 0;
        }
      });
    },
    trackEnded(track) {
      let tracks = this.tileAudio?.data?.attributes?.tracks?.data;
      let current_track_id = null
      if (this.player_playing && this.player_track.id === track.id) {
        let index = tracks.findIndex((e) => {
          return e.id === track.id;
        });
        current_track_id = tracks[index].id
        if (index < (tracks.length - 1) && index >= 0) {
          this.player_track = tracks[index + 1];
        } else {
          this.player_track = tracks[0];
        }
        this.playerPlay();
      }
      let el = document.getElementById(
          `audio_track_${this.id}_${current_track_id}`
      );
      if (el) {
        el.currentTime = 0;
      }
    },
    trackPlay(track) {
      const song_image = track?.attributes?.image?.data?.attributes;
      const song_content = track?.attributes?.content;
      const album_image =
          this.tileAudio?.data?.attributes?.tile?.image?.data?.attributes;
      const album_content = this.tileAudio?.data?.attributes?.content;
      let image = song_image || album_image;
      this.current_content = song_content || album_content;
      if (this.player_playing) {
        this.current_content = album_content;
      }
      this.current_image_full_url = image.url;
      if (image) {
        this.current_image_url = image.formats.thumbnail.url;
        if (image?.formats?.small) {
          this.current_image_url = image.formats.small.url;
        }
        if (image?.formats?.medium) {
          this.current_image_url = image.formats.medium.url;
        }
      }
      if (track) {
        this.player_track = track;
        this.tileAudio?.data?.attributes?.tracks?.data.forEach((e) => {
          if (e.id !== track.id) {
            let el = document.getElementById(`audio_track_${this.id}_${e.id}`);
            if (el) {
              el.pause();
              if (!this.player_playing) {
                el.currentTime = 0;
              }
            } else {
              this.$log.debug("Cannot find ", `audio_track_${this.id}_${e.id}`);
            }
          }
        });
      } else {
        this.stopAll();
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
        this.refreshDuration()
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
