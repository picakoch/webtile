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
                :href="imageSrc"
                :data-caption="tileAudio?.data?.attributes?.title"
              >
                <img
                  :src="imageSrc"
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
                v-if="!player_playing"
              >
                <unicon
                  name="play-circle"
                  fill="white"
                  width="76"
                  height="76"
                ></unicon>
              </span>
              <span
                class="player-icon"
                @click.prevent="playerStop()"
                v-if="player_playing"
              >
                <unicon
                  name="stop-circle"
                  fill="white"
                  width="76"
                  height="76"
                ></unicon>
              </span>
              <span
                class="player-icon uk-margin-small-left"
                @click.prevent="nextTrack(-1)"
                v-if="player_playing"
              >
                <unicon
                  name="step-backward"
                  fill="white"
                  width="30"
                  height="30"
                ></unicon>
              </span>

              <span
                class="player-icon uk-margin-small-left"
                @click.prevent="nextTrack()"
                v-if="player_playing"
              >
                <unicon
                  name="skip-forward"
                  fill="white"
                  width="30"
                  height="30"
                ></unicon>
              </span>
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

            <div
              v-for="track in tileAudio?.data?.attributes?.tracks?.data"
              :key="track.id"
              class="uk-margin-small-top"
            >
              <audio
                :id="`audio_track_${id}_${track.id}`"
                controls
                preload="auto"
                class="audio_player"
                v-show="!player_playing"
                :controlsList="`noplaybackrate ${
                  track.attributes.can_download === true ? '' : 'nodownload'
                }`"
                @play="trackPlay(track)"
                @ended="trackEnded(track)"
              >
                <source
                  :src="
                    appStore.backend_url +
                    track.attributes.media.data.attributes.url
                  "
                />
                Your browser does not support the audio element.
              </audio>
              <span v-show="!player_playing" class="uk-margin-left">{{
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

<script setup>
import { AUDIO_Q } from '~/queries/queries'
import { StrapiBlocks } from "vue-strapi-blocks-renderer"

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { $apollo } = useNuxtApp()
const appStore = useAppStore()

const player_playing = ref(false)
const player_track = ref(null)
const current_track = ref(null)
const current_image_url = ref(null)
const current_album_content = ref(null)
const current_track_content = ref(null)
const current_image_full_url = ref(null)
const current_time = ref("0:00")
const total_time = ref("0:00")
const tileAudio = ref({})

const imageSrc = computed(() => {
  return `${appStore.backend_url}${current_image_full_url.value}`
})

const player_track_index = computed(() => {
  let tracks = tileAudio.value?.data?.attributes?.tracks?.data
  if (player_playing.value && tracks) {
    let index = tracks.findIndex((e) => {
      return e.id === player_track.value.id
    })
    return index + 1
  }
  return 0
})

const secsToString = (sec_num) => {
  var minutes = Math.floor(sec_num / 60)
  var seconds = sec_num - minutes * 60
  if (minutes < 10) {
    minutes = "0" + minutes
  }
  if (seconds < 10) {
    seconds = "0" + seconds
  }
  return minutes + ":" + seconds
}

const refreshDuration = () => {
  if (player_playing.value && player_track.value) {
    let el = document.getElementById(
      `audio_track_${props.id}_${player_track.value.id}`
    )
    if (el) {
      current_time.value = secsToString(Math.floor(el.currentTime))
      total_time.value = secsToString(Math.floor(el.duration))
    }
  }
  setTimeout(refreshDuration, 500)
}

const nextTrack = (d = 1) => {
  let current_track_id = player_track.value.id
  let tracks = tileAudio.value?.data?.attributes?.tracks?.data
  if (player_playing.value) {
    let index = tracks.findIndex((e) => {
      return e.id === player_track.value.id
    })
    if (index < tracks.length && index >= 0) {
      index = (index + d) % tracks.length
      player_track.value = tracks[index]
      playerPlay()
    }
  }
  let el = document.getElementById(
    `audio_track_${props.id}_${current_track_id}`
  )
  if (el) {
    el.currentTime = 0
  }
}

const playerPlayClicked = () => {
  player_track.value = tileAudio.value?.data?.attributes?.tracks?.data[0]
  playerPlay()
}

const playerPlay = () => {
  player_playing.value = true
  if (player_track.value === null) {
    player_track.value = tileAudio.value?.data?.attributes?.tracks?.data[0]
  }
  if (!player_track.value) {
    return
  }
  trackPlay(player_track.value)
  let el = document.getElementById(
    `audio_track_${props.id}_${player_track.value.id}`
  )
  if (el) {
    el.play()
  }
}

const playerStop = () => {
  stopAll(false)
  player_playing.value = false
  current_track.value = null
  trackPlay()
}

const stopAll = (reset_time = true) => {
  const els = [...document.getElementsByTagName("audio")]
  els.forEach((e) => {
    e.pause()
    if (reset_time) {
      e.currentTime = 0
    }
  })
}

const trackEnded = (track) => {
  let tracks = tileAudio.value?.data?.attributes?.tracks?.data
  let current_track_id = null
  if (player_playing.value && player_track.value.id === track.id) {
    let index = tracks.findIndex((e) => {
      return e.id === track.id
    })
    current_track_id = tracks[index].id
    if (index < tracks.length - 1 && index >= 0) {
      player_track.value = tracks[index + 1]
    } else {
      player_track.value = tracks[0]
    }
    playerPlay()
  }
  let el = document.getElementById(
    `audio_track_${props.id}_${current_track_id}`
  )
  if (el) {
    el.currentTime = 0
  }
}

const trackPlay = (track) => {
  const song_image = track?.attributes?.image?.data?.attributes
  const song_content = track?.attributes?.content
  const album_image =
    tileAudio.value?.data?.attributes?.tile?.image?.data?.attributes
  current_album_content.value = tileAudio.value?.data?.attributes?.content
  let image = song_image || album_image
  current_track_content.value = song_content
  current_image_full_url.value = image.url
  current_track.value = track
  if (image) {
    current_image_url.value = image.formats.thumbnail.url
    if (image?.formats?.small) {
      current_image_url.value = image.formats.small.url
    }
    if (image?.formats?.medium) {
      current_image_url.value = image.formats.medium.url
    }
  }
  if (track) {
    player_track.value = track
    tileAudio.value?.data?.attributes?.tracks?.data.forEach((e) => {
      if (e.id !== track.id) {
        let el = document.getElementById(`audio_track_${props.id}_${e.id}`)
        if (el) {
          el.pause()
          if (!player_playing.value) {
            el.currentTime = 0
          }
        }
      }
    })
  } else {
    stopAll()
  }
}

onMounted(async () => {
  // Clean up any existing modal
  const existingModal = document.getElementById("audio_modal_" + props.id)
  existingModal?.remove()

  try {
    const { data } = await $apollo.defaultClient.query({
      query: AUDIO_Q,
      variables: {
        id: props.id
      }
    })

    tileAudio.value = data
    
    trackPlay()
    refreshDuration()

    // Show the modal
    const { UIkit } = await import('uikit')
    UIkit.modal("#audio_modal_" + props.id).show()
  } catch (error) {
    console.error('Error fetching tile audio:', error)
  }
})
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