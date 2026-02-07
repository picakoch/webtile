<template>
  <div></div>
</template>

<script setup>
import { slugify } from '~/utils/utils'

const appStore = useAppStore()
const router = useRouter()

onMounted(() => {
  const tags = appStore.tags
  if (tags.length > 0) {
    router.push('/t/' + slugify(tags[0]?.attributes?.name))
  }
})
</script>