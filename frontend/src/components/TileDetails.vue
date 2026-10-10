<template>
  <div>
    <template v-if="slug">
      <TileImage v-if="type === 'image'" :slug="slug"></TileImage>
      <TileVideo v-else-if="type === 'video'" :slug="slug"></TileVideo>
      <TileAudio v-else-if="type === 'audio'" :slug="slug"></TileAudio>
      <TileText v-else-if="type === 'text'" :slug="slug"></TileText>
      <div v-else>Internal error {{ type }}</div>
    </template>
  </div>
</template>

<script>
import TileImage from "@/components/TileImage.vue";
import TileVideo from "@/components/TileVideo.vue";
import TileAudio from "@/components/TileAudio.vue";
import TileText from "@/components/TileText.vue";
import { LEGACY_Q } from "@/lib/queries";

export default {
  name: "TileDetails",
  components: { TileText, TileVideo, TileImage, TileAudio },
  props: {
    // /time/audio/retour-a-la-mer
    type: String,
    slug: String,
    // Old links: /time/audio_5 (Strapi 4 id)
    id: String,
  },
  async created() {
    if (this.slug || !this.id) {
      return;
    }
    const [type, legacyId] = this.id.split("_");
    const query = LEGACY_Q[type];
    const found =
      query &&
      /^\d+$/.test(legacyId || "") &&
      (
        await this.$apollo.query({
          query,
          variables: { id: Number(legacyId) },
        })
      ).data;
    const slug = found && Object.values(found)[0]?.[0]?.slug;
    // Same parent page, new tile URL
    const parent = this.$route.path.replace(/\/[^/]*$/, "");
    this.$router.replace(slug ? `${parent}/${type}/${slug}` : parent);
  },
};
</script>

<style scoped></style>
