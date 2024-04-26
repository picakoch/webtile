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
                    media {
                        data {
                            id,
                            attributes{
                                formats
                            }
                        }
                    }
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