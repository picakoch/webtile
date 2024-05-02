import {store} from "@/store";

export const TILE_COLORS =
    {
        TileImageEntity: () => store.getters.config?.image_color,
        TileVideoEntity: () => store.getters.config?.video_color,
        TileAudioEntity: () => store.getters.config?.audio_color,
        TileTextEntity: () => store.getters.config?.text_color,
    }

export const TILE_NAMES =
    {
        TileImageEntity: 'image',
        TileVideoEntity: 'video',
        TileAudioEntity: 'audio',
        TileTextEntity: 'text',
    }
