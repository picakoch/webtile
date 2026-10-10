import gql from "graphql-tag";

// Strapi 5 GraphQL: fields are returned directly (no data/attributes),
// documents are identified by documentId. Tiles are fetched by their slug
// (URLs: /time/audio/retour-a-la-mer).

const tile = `
 tile {
    id
    title
    date
    large
    tags {
        name
    }
    image {
        documentId
        formats
        url
        width
        height
        size
    }
}
`;

// What a tile needs to be listed in the grid
const tileListFields = `
    documentId
    slug
    ${tile}
`;

export const CONFIG_Q = gql`
  query {
    config {
      title
      banner {
        documentId
        formats: url
        url
      }
      bg {
        documentId
        formats: url
        url
      }
      logo {
        documentId
        formats: url
        url
      }
      headline
      contacts
      contact_footer
      headline_expiration
      newsletter_description
      biography
      label_date
      label_theme
      label_media
      label_bio
      label_contact
      label_newsletter
      label_contacts
      label_support
      label_music
      label_images
      label_video
      label_text
      donation_url
      support_text
      subtitle
      subtitle_line2
    }
  }
`;

export const TAGS_Q = gql`
  query {
    tags(sort: "rank", pagination: { limit: 500 }) {
      documentId
      name
    }
  }
`;

export const IMAGES_Q = gql`
    query {
        tileImages(sort: "tile.date:desc", pagination: { limit: 500 }) {
            ${tileListFields}
        }
    }
`;

export const TEXTS_Q = gql`
    query {
        tileTexts(sort: "tile.date:desc", pagination: { limit: 500 }) {
            ${tileListFields}
            media {
                documentId
                name
                url
            }
        }
    }
`;

export const VIDEOS_Q = gql`
    query {
        tileVideos(sort: "tile.date:desc", pagination: { limit: 500 }) {
            ${tileListFields}
        }
    }
`;

export const AUDIOS_Q = gql`
    query {
        tileAudios(sort: "tile.date:desc", pagination: { limit: 500 }) {
            ${tileListFields}
        }
    }
`;

/* Single retrieval, by slug */

export const IMAGE_Q = gql`
    query getImage($slug: String!) {
        tileImages(filters: { slug: { eq: $slug } }) {
            documentId
            slug
            description
            images(pagination: { limit: 100 }) {
                documentId
                formats
                url
                caption
            }
            ${tile}
        }
    }
`;

export const VIDEO_Q = gql`
    query getVideo($slug: String!) {
        tileVideos(filters: { slug: { eq: $slug } }) {
            documentId
            slug
            description
            video {
                documentId
                url
                caption
            }
            ${tile}
        }
    }
`;

export const AUDIO_Q = gql`
    query getAudio($slug: String!) {
        tileAudios(filters: { slug: { eq: $slug } }) {
            documentId
            slug
            content
            title
            tracks(pagination: { limit: 100 }) {
                documentId
                name
                content
                can_download
                image {
                    documentId
                    formats
                    url
                    width
                    height
                    size
                    caption
                }
                media {
                    documentId
                    url
                    caption
                }
            }
            ${tile}
        }
    }
`;

export const TEXT_Q = gql`
    query getText($slug: String!) {
        tileTexts(filters: { slug: { eq: $slug } }) {
            documentId
            slug
            media {
                documentId
                name
                url
            }
            ${tile}
            description
        }
    }
`;

// Old URLs (/time/audio_5) used Strapi 4 ids, kept in legacy_id
export const LEGACY_Q = {
  image: gql`
    query legacyImage($id: Int!) {
      tileImages(filters: { legacy_id: { eq: $id } }) {
        slug
      }
    }
  `,
  video: gql`
    query legacyVideo($id: Int!) {
      tileVideos(filters: { legacy_id: { eq: $id } }) {
        slug
      }
    }
  `,
  audio: gql`
    query legacyAudio($id: Int!) {
      tileAudios(filters: { legacy_id: { eq: $id } }) {
        slug
      }
    }
  `,
  text: gql`
    query legacyText($id: Int!) {
      tileTexts(filters: { legacy_id: { eq: $id } }) {
        slug
      }
    }
  `,
};

export const SEARCH_Q = gql`
    query doSearch($query: String!){
        search(query: $query) {
            tileImages(pagination: { limit: 20 }) {
                nodes {
                    ${tileListFields}
                }
            }
            tileVideos(pagination: { limit: 20 }) {
                nodes {
                    ${tileListFields}
                }
            }
            tileTexts(pagination: { limit: 20 }) {
                nodes {
                    ${tileListFields}
                }
            }
            tileAudios(pagination: { limit: 20 }) {
                nodes {
                    ${tileListFields}
                }
            }
        }
    }
`;
