module.exports = ({env}) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'ssl0.ovh.net',
        port: 587,
        auth: {
          type: "login",
          user: 'sly@slyapollinaire.com',
          pass: 'wB3RFW5nun9aEHKDxhmb', // sly
        },
      },
      settings: {
        defaultFrom: 'sly@slyapollinaire.com',
        defaultReplyTo: 'sly@slyapollinaire.com',
      },
    },
  },
});
