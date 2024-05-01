import gql from "graphql-tag";

const tile = `
 tile {
    id
    title
    image {
        data {
            id
            attributes {
                formats
            }
        }
    }
}
`

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
                                formats:url
                            }
                        }
                    }
                    bg {
                        data {
                            id
                            attributes {
                                formats:url
                            }
                        }
                    }
                    text_color
                    image_color
                    video_color
                    audio_color
                }
            }
        }
    }
`

    export const IMAGES_Q = gql`
    query {
        tileImages(sort: "rank") {
            data {
                id
                attributes {
                    ${tile}
                }
            }
        }
    }
`
export const TEXTS_Q = gql`
    query {
        tileTexts(sort: "rank") {
            data {
                id
                attributes {
                    ${tile}
                }
            }
        }
    }
`

export const VIDEOS_Q = gql`
    query {
        tileVideos(sort: "rank") {
            data {
                id
                attributes {
                    ${tile}
                }
            }
        }
    }
`

export const AUDIOS_Q = gql`
    query {
        tileAudios(sort: "rank") {
            data {
                id
                attributes {
                    ${tile}
                }
            }
        }
    }

`

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
                            }
                        }
                    }
                    ${tile}
                }
            }
        }
    }

`
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
                            }
                        }
                    }
                    ${tile}
                }
            }
        }
    }
`


export const AUDIO_Q = gql`
    query getAudio($id: ID) {
        tileAudio(id: $id) {
            data {
                id
                attributes {
                    description
                    tracks {
                        data {
                            id
                            attributes {
                                name
                                image {
                                    data {
                                        id
                                        attributes {
                                            formats
                                        }
                                    }
                                }
                                media {
                                    data {
                                        id
                                        attributes {
                                            url
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
`