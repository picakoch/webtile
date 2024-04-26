import gql from "graphql-tag";

export const IMAGES_Q = gql`
    query {
        tileImages {
            data {
                id
                attributes {
                    tile {
                        id,
                        title,
                        image {data{attributes{formats}}}
                    },
                }
            }
        }
    }
`
export const TEXTS_Q = gql`
    query {
        tileTexts {
            data {
                id
                attributes {
                    tile {
                        id,
                        title,
                        image {data{attributes{formats}}}
                    },
                }
            }
        }
    }
`

export const VIDEOS_Q = gql`
    query {
        tileVideos {
            data {
                id
                attributes {
                    tile {
                        id,
                        title,
                        image {data{attributes{formats}}}
                    },
                }
            }
        }
    }
`

export const AUDIOS_Q = gql`
    query {
        tileAudios {
            data {
                id
                attributes {
                    tile {
                        id,
                        title,
                        image {data{attributes{formats}}}
                    },
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
                        description,
                        images{data{attributes{formats}}},
                    }
                }
            }
        }
    `
export const VIDEO_Q = gql`
    query getImage($id: ID) {
        tileVideo(id: $id) {
            data {
                id
                attributes {
                    description,
                    video{data{attributes{url}}},
                }
            }
        }
    }
`


export const AUDIO_Q = gql`
    query getImage($id: ID) {
        tileAudio(id: $id) {
            data {
                id
                attributes {
                    description
                    tracks{data{attributes{name media{data{attributes{url}}}}}}
                }
            }
        }
    }
`