<template>
  <div></div>
</template>

<script setup>
import { VIDEO_Q } from '~/queries/queries'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { $apollo } = useNuxtApp()
const appStore = useAppStore()

onMounted(async () => {
  try {
    const { data } = await $apollo.defaultClient.query({
      query: VIDEO_Q,
      variables: {
        id: props.id
      }
    })

    const video = data?.tileVideo?.data?.attributes?.video?.data?.attributes?.url
    const description = data?.tileVideo?.data?.attributes?.description
    
    if (video) {
      const { UIkit } = await import('uikit')
      UIkit.lightboxPanel({
        id: "video_" + props.id,
        items: [
          {
            source: appStore.backend_url + video,
            caption: description,
          },
        ],
        videoAutoplay: true,
      }).show()
    }
  } catch (error) {
    console.error('Error fetching tile video:', error)
  }
})
</script>

<style scoped></style>