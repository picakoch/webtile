import gql from "graphql-tag";

const tile = `
 tile {
    id
    title
    date
    large
    tags {
        data {
            attributes {
              name
            }
        }
    }
    image {
        data {
            id
            attributes {
                formats
                url
            }
        }
    }
}
`;

export const CONFIG_Q = gql`
  query {
    config {
      data {
        attributes {
          title
          banner {
            data {
              id
              attributes {
                formats: url
                url
              }
            }
          }
          bg {
            data {
              id
              attributes {
                formats: url
                url
              }
            }
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
        }
      }
    }
  }
`;

export const TAGS_Q = gql`
  query {
    tags(sort: "rank", pagination: { limit: 100 }) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const IMAGES_Q = gql`
    query {
        tileImages(sort: "tile.date:desc", pagination: { limit: 100 }) {
            data {
                id
                attributes {
                    ${tile}
                }
            }
        }
    }
`;

export const TEXTS_Q = gql`
    query {
        tileTexts(sort: "tile.date:desc", pagination: { limit: 100 }) {
            data {
                id
                attributes {
                    ${tile}
                    media {
                        data {
                            id
                            attributes {
                                name
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const VIDEOS_Q = gql`
    query {
        tileVideos(sort: "tile.date:desc", pagination: { limit: 100 }) {
            data {
                id
                attributes {
                    ${tile}
                }
            }
        }
    }
`;

export const AUDIOS_Q = gql`
    query {
        tileAudios(sort: "tile.date:desc", pagination: { limit: 100 }) {
            data {
                id
                attributes {
                    ${tile}
                }
            }
        }
    }

`;

/* Single retrieval */

export const IMAGE_Q = gql`
    query getImage($id: ID) {
        tileImage(id: $id) {
            data {
                id
                attributes {
                    description
                    images {
                        data {
                            id
                            attributes {
                                formats
                                url
                                caption
                            }
                        }
                    }
                    ${tile}
                }
            }
        }
    }

`;
export const VIDEO_Q = gql`
    query getVideo($id: ID) {
        tileVideo(id: $id) {
            data {
                id
                attributes {
                    description
                    video {
                        data {
                            id
                            attributes {
                                url
                                caption
                            }
                        }
                    }
                    ${tile}
                }
            }
        }
    }
`;

export const AUDIO_Q = gql`
    query getAudio($id: ID) {
        tileAudio(id: $id) {
            data {
                id
                attributes {
                    content
                    title
                    tracks {
                        data {
                            id
                            attributes {
                                name
                                content
                                image {
                                    data {
                                        id
                                        attributes {
                                            formats
                                            url
                                            caption
                                        }
                                    }
                                }
                                media {
                                    data {
                                        id
                                        attributes {
                                            url
                                            caption
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ${tile}
                }
            }
        }
    }
`;

export const TEXT_Q = gql`
    query getText($id: ID) {
        tileText(id: $id) {
            data {
                id
                attributes {
                    media {
                        data {
                            id
                            attributes {
                                name
                                url
                            }
                        }
                    }
                    ${tile}
                    description
                }
            }
        }
    }
`;

export const SEARCH_Q = gql`
    query doSearch($query: String!){
        search(query: $query) {
            tileImages {
                data {
                    id
                    attributes {
                        ${tile}
                    }
                }
            }
            tileVideos {
                data {
                    id
                    attributes {
                        ${tile}
                    }
                }
            }
            tileTexts {
                data {
                    id
                    attributes {
                        ${tile}
                    }
                }
            }
            tileAudios {
                data {
                    id
                    attributes {
                        ${tile}
                    }
                }
            }
        }
    }
`;
