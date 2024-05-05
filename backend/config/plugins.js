module.exports = ({env}) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env('SMTP_PORT'),
        auth: {
          type: "login",
          user: env('SMTP_EMAIL'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_EMAIL'),
        defaultReplyTo: env('SMTP_EMAIL'),
      },
    },
  },
  'drag-drop-content-types': {
    enabled: true
  },
  "fuzzy-search": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::tile-image.tile-image",
          modelName: "TileImage",
          transliterate: false,
          fuzzysortOptions: {
            characterLimit: 300,
            threshold: -1000,
            limit: 5,
            keys: [
              {
                name: "tile_title",
                weight: 100,
              }, {
                name: "description",
                weight: -100,
              },
            ],
          },
        },
        {
          uid: "api::tile-video.tile-video",
          modelName: "TileVideo",
          transliterate: false,
          fuzzysortOptions: {
            characterLimit: 300,
            threshold: -1000,
            limit: 10,
            keys: [
              {
                name: "tile_title",
                weight: 100,
              }, {
                name: "description",
                weight: -100,
              },
            ],
          },
        },
        {
          uid: "api::tile-audio.tile-audio",
          modelName: "TileAudio",
          transliterate: false,
          fuzzysortOptions: {
            characterLimit: 300,
            threshold: -1000,
            limit: 10,
            keys: [
              {
                name: "tile_title",
                weight: 100,
              }, {
                name: "description",
                weight: -100,
              },
            ],
          },
        },
        {
          uid: "api::tile-text.tile-text",
          modelName: "TileText",
          transliterate: false,
          fuzzysortOptions: {
            characterLimit: 2000,
            threshold: -1000,
            limit: 10,
            allowTypo: true,
            keys: [
              {
                name: "tile_title",
                weight: 100,
              }, {
                name: "description",
                weight: -100,
              },
            ],
          },
        },
      ],
    },
  },
});
