<template>
  <div uk-modal :id="'text_modal_' + id" class="uk-modal-full">
    <div
      class="uk-modal-dialog uk-modal-body uk-light uk-background-secondary"
      style="min-height: 100vh"
    >
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <h2 class="uk-modal-title">
        {{ tileText?.data?.attributes?.tile.title }}
      </h2>
      <div class="" uk-grid v-if="pdf">
        <div class="uk-width-1-1 uk-margin-top uk-text-center pdf-container">
          <div v-for="page in pages" :key="page" class="uk-margin-bottom">
            <VuePDF
              v-if="pdf"
              :pdf="pdf"
              intent="display"
              fit-parent
              :page="page"
            >
              <div>Chargement du contenu...</div>
            </VuePDF>
          </div>
        </div>
      </div>
      <StrapiBlocks
        v-else-if="tileText?.data?.attributes?.description"
        :content="tileText?.data?.attributes?.description"
      ></StrapiBlocks>
    </div>
  </div>
</template>

<script setup>
import { TEXT_Q } from '~/queries/queries'
import { VuePDF, usePDF } from "@tato30/vue-pdf"
import { StrapiBlocks } from "vue-strapi-blocks-renderer"

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { $apollo } = useNuxtApp()
const appStore = useAppStore()

const tileText = ref({})
const pdf = ref(null)
const pages = ref([])

onMounted(async () => {
  // Clean up any existing modal
  const existingModal = document.getElementById("text_modal_" + props.id)
  existingModal?.remove()

  try {
    const { data } = await $apollo.defaultClient.query({
      query: TEXT_Q,
      variables: {
        id: props.id
      }
    })

    tileText.value = data

    if (tileText.value.data.attributes?.media?.data?.attributes?.url) {
      const { pdf: pdfDoc, pages: pdfPages } = usePDF(
        appStore.backend_url +
          tileText.value.data.attributes.media.data.attributes.url
      )
      pdf.value = pdfDoc
      pages.value = pdfPages
    }

    // Show the modal
    const { UIkit } = await import('uikit')
    UIkit.modal("#text_modal_" + props.id).show()
  } catch (error) {
    console.error('Error fetching tile text:', error)
  }
})
</script>

<style scoped>
.pdf-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
}
</style>