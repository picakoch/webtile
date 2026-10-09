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
                  :src-placeholder="
                    $store.getters.backend_url + current_image_url
                  "
                  :alt="tileAudio?.data?.attributes?.title"
                  style="height: 75vh; object-fit: contain"
                />
              </a>
            </div>
          </div>
        </div>
        <div>
          <div
            class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary"
          >
            <div style="margin-left: -8px">
              <span
                class="player-icon"
                title="Lire toutes les pistes"
                @click.prevent="playerPlayClicked()"
                v-if="player_playing === false"
                ><unicon
                  name="play-circle"
                  fill="white"
                  width="76"
                  height="76"
                ></unicon
              ></span>
              <span
                class="player-icon"
                @click.prevent="playerStop()"
                v-if="player_playing === true"
                ><unicon
                  name="stop-circle"
                  fill="white"
                  width="76"
                  height="76"
                ></unicon
              ></span>
              <span
                class="player-icon uk-margin-small-left"
                @click.prevent="nextTrack(-1)"
                v-if="player_playing === true"
                ><unicon
                  name="step-backward"
                  fill="white"
                  width="30"
                  height="30"
                ></unicon
              ></span>

              <span
                class="player-icon uk-margin-small-left"
                @click.prevent="nextTrack()"
                v-if="player_playing === true"
                ><unicon
                  name="skip-forward"
                  fill="white"
                  width="30"
                  height="30"
                ></unicon
              ></span>
            </div>
            <div
              v-if="player_track && player_playing"
              class="uk-margin-small-left uk-margin-small-top"
            >
              {{ player_track_index }}. {{ player_track.attributes.name }}
            </div>
            <div
              class="uk-margin-small-left"
              v-if="player_track && player_playing"
            >
              {{ current_time }} / {{ total_time }}
            </div>
            <!-- Single element for "play all": swapping src on one element keeps
                 auto-advance allowed on mobile / background tabs -->
            <audio
              ref="player"
              preload="auto"
              @ended="nextTrack()"
              @timeupdate="refreshDuration"
              @loadedmetadata="refreshDuration"
              @error="playerError"
            ></audio>

            <div
              v-for="track in tileAudio?.data?.attributes?.tracks?.data"
              :key="track.id"
              class="uk-margin-small-top"
            >
              <audio
                :id="`audio_track_${id}_${track.id}`"
                controls
                preload="metadata"
                class="audio_player"
                v-show="player_playing === false"
                :controlsList="`noplaybackrate ${
                  track.attributes.can_download === true ? '' : 'nodownload'
                }`"
                :src="trackUrl(track)"
                @play="trackPlay(track)"
              >
                Your browser does not support the audio element.
              </audio>
              <span v-show="player_playing === false" class="uk-margin-left">{{
                track.attributes.name
              }}</span>
            </div>
            <div class="">
              <div
                v-if="current_track_content && current_track"
                class="uk-margin-top uk-light uk-background-secondary"
              >
                <StrapiBlocks :content="current_track_content"></StrapiBlocks>
              </div>
              <div
                v-if="tileAudio?.data?.attributes?.content"
                class="uk-margin-top uk-background-secondary"
              >
                <StrapiBlocks
                  :content="tileAudio?.data?.attributes?.content"
                ></StrapiBlocks>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AUDIO_Q } from "@/lib/queries";
import uk from "uikit";
import { StrapiBlocks } from "vue-strapi-blocks-renderer";
import VLazyImage from "v-lazy-image";

export default {
  name: "TileAudio",
  props: {
    id: {
      type: String,
    },
  },
  components: { StrapiBlocks, VLazyImage },
  data() {
    return {
      player_playing: false,
      player_track: null,
      current_track: null,
      current_image_url: null,
      current_album_content: null,
      current_track_content: null,
      current_image_full_url: null,
      current_time: "00:00",
      total_time: "--:--",
    };
  },
  beforeMount() {
    document.getElementById("audio_modal_" + this.id)?.remove();
  },
  mounted() {
    uk.modal("#audio_modal_" + this.id).show();
  },
  beforeUnmount() {
    // Pausing is not enough: detached media elements keep downloading and hold
    // connections to the backend, which starves the next album that is opened.
    this.audioElements().forEach((el) => {
      el.pause();
      el.removeAttribute("src");
      el.load();
    });
  },
  computed: {
    tracks() {
      return this.tileAudio?.data?.attributes?.tracks?.data || [];
    },
    player_track_index() {
      if (this.player_playing && this.player_track) {
        return this.tracks.findIndex((e) => e.id === this.player_track.id) + 1;
      }
      return 0;
    },
  },
  methods: {
    trackUrl(track) {
      return (
        this.$store.getters.backend_url +
        track.attributes.media.data.attributes.url
      );
    },
    audioElements() {
      return [...(this.$el?.querySelectorAll?.("audio") || [])];
    },
    secsToString(sec) {
      if (!Number.isFinite(sec)) {
        return "--:--";
      }
      sec = Math.floor(sec);
      const minutes = Math.floor(sec / 60);
      const seconds = sec - minutes * 60;
      return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
      );
    },
    refreshDuration() {
      const el = this.$refs.player;
      if (el) {
        this.current_time = this.secsToString(el.currentTime);
        this.total_time = this.secsToString(el.duration);
      }
    },
    nextTrack(d = 1) {
      if (!this.player_playing || !this.player_track || !this.tracks.length) {
        return;
      }
      const n = this.tracks.length;
      const index = this.tracks.findIndex((e) => e.id === this.player_track.id);
      this.player_track = this.tracks[(((index + d) % n) + n) % n];
      this.playerPlay();
    },
    playerPlayClicked() {
      this.player_track = this.tracks[0] || null;
      this.playerPlay();
    },
    playerPlay() {
      const el = this.$refs.player;
      if (!this.player_track || !el) {
        return;
      }
      // Stop individual track players before switching to album mode
      this.audioElements().forEach((e) => {
        if (e !== el) {
          e.pause();
          e.currentTime = 0;
        }
      });
      this.player_playing = true;
      this.showTrack(this.player_track);
      this.current_time = "00:00";
      this.total_time = "--:--";
      el.src = this.trackUrl(this.player_track);
      el.play().catch((err) => {
        // e.g. NotAllowedError (autoplay policy) or AbortError (src changed
        // again before playback started): don't leave the UI stuck on "playing"
        if (err.name !== "AbortError") {
          this.$log.error("Cannot play track", err);
          this.playerStop();
        }
      });
    },
    playerError() {
      if (this.player_playing) {
        this.$log.error("Audio error", this.$refs.player?.error);
        this.playerStop();
      }
    },
    playerStop() {
      this.$refs.player?.pause();
      this.player_playing = false;
      this.showTrack(null);
    },
    trackPlay(track) {
      // A track was started from its own controls: stop everything else
      if (this.player_playing) {
        this.playerStop();
      }
      this.audioElements().forEach((el) => {
        if (el.id !== `audio_track_${this.id}_${track.id}`) {
          el.pause();
          if (el.id) {
            el.currentTime = 0;
          }
        }
      });
      this.showTrack(track);
    },
    showTrack(track) {
      const song_image = track?.attributes?.image?.data?.attributes;
      const album_image =
        this.tileAudio?.data?.attributes?.tile?.image?.data?.attributes;
      const image = song_image || album_image;
      this.current_album_content = this.tileAudio?.data?.attributes?.content;
      this.current_track_content = track?.attributes?.content;
      this.current_track = track;
      if (image) {
        this.current_image_full_url = image.url;
        this.current_image_url =
          image.formats?.medium?.url ||
          image.formats?.small?.url ||
          image.formats?.thumbnail?.url ||
          image.url;
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
        if (!this.current_track) {
          this.showTrack(null);
        }
      },
    },
  },
};
</script>

<style scoped>
.player-icon:hover {
  cursor: pointer;
}

@media (min-width: 1200px) {
  .audio_player {
    width: 250px;
    height: 35px;
  }
}

@media (max-width: 1200px) {
  /* Hide the progress bar (time navigator) */
  audio::-webkit-media-controls-timeline {
    display: none;
  }

  /* For Firefox */
  audio::-moz-media-controls-progressbar {
    display: none;
  }
  .audio_player {
    width: 200px;
    height: 35px;
  }
}
</style>
