<template>
  <div>
    <div class="uk-background-cover"
         style="background-image: url(/images/banner_sly.png); height: 90px; width: 100%; opacity: 1">
      <nav class="uk-navbar-container" uk-navbar style="background: none;">
        <div class="uk-navbar-left uk-margin-left">
          <ul class="uk-navbar-nav">
            <li>
              <a class="nav_text_main" href="/">{{ config?.data?.attributes.title }} </a>
            </li>
          </ul>
        </div>

        <div class="uk-navbar-right uk-margin-right">
          <ul class="uk-navbar-nav">
            <li v-for="category in categories" v-bind:key="category.id">
              <RouterLink
                  :to="'/category/' + category.id "
                  :key="category.id "
                  :style="nav_styles(category.strapiId)"
              >
                {{ category.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import {TILE_COLORS} from "@/lib/constants";

export default {
  name: "NavBar",
  data() {
    return {
      categories: [
        {name: 'Images', id: 'image', strapiId: 'TileImageEntity'},
        {name: 'Vidéos', id: 'video', strapiId: 'TileVideoEntity'},
        {name: 'Audio', id: 'audio', strapiId: 'TileAudioEntity'},
        {name: 'Textes', id: 'text', strapiId: 'TileTextEntity'},
      ],
      config: null,
    };
  },
  methods: {
    nav_styles: function (cat_id) {
      return {
        '--border-color': TILE_COLORS[cat_id],
      }
    }
  },
  apollo: {
    config: {
      query: gql`
        query {
            config {
              data {
                attributes {
                  title
                }
              }
            }
        }
      `,
      fetchPolicy: 'cache-first'
    },
  },
};
</script>

<style scoped>
.uk-navbar-nav > li > a {
  font-size: 1.1em;
  font-weight: 900;
  color: white;
  padding-left: 10px;
  padding-right: 10px;
  border: 10px solid;
  border-color: #00000000;
}

.uk-navbar-nav > li > a:hover, .uk-navbar-nav > li > a:active {
  font-size: 1.1em;
  font-weight: 900;
  color: #ccc;
  border-color: var(--border-color);
}

.nav_text_main {
  font-size: 1.2em;
}

</style>