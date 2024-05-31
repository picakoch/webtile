<template>
  <div class="uk-light uk-margin uk-margin-left uk-margin-right">
    <div class="uk-grid" uk-grid>

      <form class="uk-width-1-3"
            @submit.prevent="subscribe"
      >
        <fieldset class="uk-fieldset uk-light">
          <h2 class="uk-legend">Inscrivez-vous à la newsletter</h2>

          <StrapiBlocks v-if="$store.getters.config?.newsletter_description" :content="$store.getters.config?.newsletter_description"></StrapiBlocks>

          <div class="uk-margin">
            <label class="uk-form-label" for="form-stacked-text">Nom *</label>
            <div class="uk-form-controls">
              <input v-model="name" class="uk-input" id="form-stacked-text" type="text" placeholder="Votre nom">
            </div>
          </div>

          <div class="uk-margin">
            <label class="uk-form-label" for="form-stacked-text">Email *</label>
            <div class="uk-form-controls">
              <input v-model="email" class="uk-input" id="form-stacked-text" type="email" placeholder="nom@domain.fr">
            </div>
          </div>
          <div class="uk-margin">
            <input type="submit" class="uk-dark uk-button uk-button-default" value="Inscription">
          </div>

        </fieldset>

        <div uk-alert class="uk-margin-top uk-background-secondary" v-if="subscription_message.length > 1">
          <a href class="uk-alert-close" uk-close></a>
          {{ subscription_message }}.
        </div>
        <div v-else-if="$apollo.loading" class="uk-position-center">
          <div class="spinner uk-margin-top" uk-spinner="ratio: 3"></div>
        </div>

      </form>

      <form class="uk-width-1-3"
            @submit.prevent="unsubscribe"
      >
        <fieldset class="uk-fieldset uk-light">
          <h2 class="uk-legend">Déinscription</h2>

          <div class="uk-margin">
            <label class="uk-form-label" for="form-stacked-text">Email *</label>
            <div class="uk-form-controls">
              <input v-model="email_unscubscribe" class="uk-input" id="form-stacked-text" type="email"
                     placeholder="nom@domain.fr">
            </div>
          </div>
          <div class="uk-margin">
            <input type="submit" class="uk-dark uk-button uk-button-default" value="Déinscription">
          </div>
        </fieldset>

        <div uk-alert style="" class="uk-margin-top uk-background-secondary" v-if="unsubscription_message.length > 1">
          <a href class="uk-alert-close" uk-close></a>
          {{ unsubscription_message }}.
        </div>
        <div v-else-if="$apollo.loading" class="uk-position-center">
          <div class="spinner uk-margin-top" uk-spinner="ratio: 3"></div>
        </div>

      </form>
    </div>
  </div>

</template>

<script>
import gql from "graphql-tag";
import {StrapiBlocks} from "vue-strapi-blocks-renderer";

export default {
  name: "NewsletterSubscription",
  components: {StrapiBlocks},
  data() {
    return {
      email: '',
      name: '',
      email_unscubscribe: '',
      subscription_message: '',
      unsubscription_message: '',
    };
  },
  methods: {
    subscribe() {
      this.resetMessage()
      if (this.name !== '' && this.email !== '') {
        this.$apollo.mutate({
          // Query
          mutation: gql`mutation createNewsletterSubscription($name: String!, $email: String!) {
              createNewsletterSubscription(data: {name: $name, email: $email}) {
                  data {id attributes{email}}
              }
          }`,
          // Parameters
          variables: {
            name: this.name,
            email: this.email,
          },
        }).then((data) => {
          this.subscription_message = 'Vous êtes maintenant inscrit.e à la newsletter. Merci!'
          this.resetForm()
          this.$log.debug(data)
        }).catch((e) => {
          this.$log.error(e)
          this.subscription_message = 'Vous êtes déjà inscrit.e à la newsletter.'
          this.resetForm()
        })
      } else {
        this.subscription_message = 'Merci de remplir tous les champs.'
      }

    },
    resetForm() {
      this.email = ''
      this.name = ''
      this.email_unscubscribe = ''
    },
    resetMessage() {
      this.unsubscription_message = ''
      this.subscription_message = ''
    },
    unsubscribe() {
      this.resetMessage()
      if (this.email_unscubscribe !== '') {
        this.$apollo.query({
          query: gql`query findnewsletterSubscriptions($email: String!){
                      newsletterSubscriptions(filters: {email: { eq: $email } }) {
                        data {
                          id
                          attributes {
                            email
                          }
                        }
                      }
                    }`,
          variables: {
            email: this.email_unscubscribe
          },
          fetchPolicy: 'no-cache'
        }).then((data) => {
          this.$log.debug(data)
          if (data?.data?.newsletterSubscriptions?.data[0]?.id) {
            this.$apollo.mutate({
              // Query
              mutation: gql`mutation deleteNewsletterSubscription($id: ID!) {
                  deleteNewsletterSubscription(id: $id) {
                      data {id attributes{email}}
                  }
              }`,
              // Parameters
              variables: {
                id: data?.data?.newsletterSubscriptions?.data[0]?.id,
              },
              fetchPolicy: 'no-cache'
            }).then((data2) => {
              this.unsubscription_message = 'Vous êtes maintenant désinscrit.e à la newsletter.'
              this.resetForm()
              this.$log.debug(data2)
            }).catch((e) => {
              this.$log.error(e)
              this.unsubscription_message = "Vous n'êtes pas inscrit..."
            })
          } else {
            this.unsubscription_message = "Vous n'êtes pas inscrit..."
          }
        }).catch((e) => {
          this.$log.error(e)
          this.unsubscription_message = "Vous n'êtes pas inscrit..."
        })
      } else {
        this.unsubscription_message = 'Merci de remplir tous les champs.'
      }
    }
  }
};
</script>
