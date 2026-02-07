<template>
  <div :id="'image_' + id" uk-lightbox></div>
</template>

<script setup>
import { IMAGE_Q } from '~/queries/queries'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { $apollo } = useNuxtApp()
const appStore = useAppStore()
const empty_gallery = ref(false)

onMounted(async () => {
  try {
    const { data } = await $apollo.defaultClient.query({
      query: IMAGE_Q,
      variables: {
        id: props.id
      }
    })

    const description = data?.tileImage?.data?.attributes?.description
    const images = data?.tileImage?.data?.attributes?.images?.data.map((e) => {
      let url = e.attributes.formats.thumbnail.url
      let caption = e.attributes.caption
      if (e.attributes.formats?.small) {
        url = e.attributes.formats.small.url
      }
      if (e.attributes.formats?.medium) {
        url = e.attributes.formats.medium.url
      }
      if (e.attributes.formats?.large) {
        url = e.attributes.formats.large.url
      }
      return {
        source: appStore.backend_url + url,
        caption: caption || description,
      }
    }) || []

    if (images.length === 0) {
      empty_gallery.value = true
    } else {
      const { UIkit } = await import('uikit')
      UIkit.lightboxPanel({ items: images }).show()
    }
  } catch (error) {
    console.error('Error fetching tile image:', error)
  }
})
</script>

<style scoped></style>