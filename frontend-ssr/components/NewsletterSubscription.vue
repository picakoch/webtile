<template>
  <div class="uk-light uk-margin uk-margin-left uk-margin-right">
    <div class="uk-grid" uk-grid>
      <form
        class="uk-width-1-1@xl uk-width-1-1@m uk-width-1-1@s"
        @submit.prevent="subscribe"
      >
        <fieldset class="uk-fieldset uk-light">
          <h3 class="uk-legend">Inscription</h3>

          <StrapiBlocks
            v-if="appStore.config?.newsletter_description"
            :content="appStore.config?.newsletter_description"
          ></StrapiBlocks>

          <div class="uk-margin">
            <label class="uk-form-label" for="form-stacked-text">Nom *</label>
            <div class="uk-form-controls">
              <input
                v-model="name"
                class="uk-input"
                id="form-stacked-text"
                type="text"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div class="uk-margin">
            <label class="uk-form-label" for="form-stacked-text">Email *</label>
            <div class="uk-form-controls">
              <input
                v-model="email"
                class="uk-input"
                id="form-stacked-text"
                type="email"
                placeholder="nom@domain.fr"
              />
            </div>
          </div>
          <div class="uk-margin">
            <input
              type="submit"
              class="uk-dark uk-button uk-button-default"
              value="Inscription"
            />
          </div>
        </fieldset>

        <div
          uk-alert
          class="uk-margin-top uk-background-secondary"
          v-if="subscription_message.length > 1"
        >
          <a href class="uk-alert-close" uk-close></a>
          {{ subscription_message }}.
        </div>
        <div v-else-if="pending" class="uk-position-center">
          <div class="spinner uk-margin-top" uk-spinner="ratio: 3"></div>
        </div>
      </form>

      <form
        class="uk-width-1-3@xl uk-width-1-2@m uk-width-1-1@s"
        @submit.prevent="unsubscribe"
      >
        <fieldset class="uk-fieldset uk-light">
          <h3 class="uk-legend">Désinscription</h3>

          <div class="uk-margin">
            <label class="uk-form-label" for="form-stacked-text">Email *</label>
            <div class="uk-form-controls">
              <input
                v-model="email_unsubscribe"
                class="uk-input"
                id="form-stacked-text"
                type="email"
                placeholder="nom@domain.fr"
              />
            </div>
          </div>
          <div class="uk-margin">
            <input
              type="submit"
              class="uk-dark uk-button uk-button-default"
              value="Désinscription"
            />
          </div>
        </fieldset>

        <div
          uk-alert
          style=""
          class="uk-margin-top uk-background-secondary"
          v-if="unsubscription_message.length > 1"
        >
          <a href class="uk-alert-close" uk-close></a>
          {{ unsubscription_message }}.
        </div>
        <div v-else-if="pendingUnsubscribe" class="uk-position-center">
          <div class="spinner uk-margin-top" uk-spinner="ratio: 3"></div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import gql from "graphql-tag"
import { StrapiBlocks } from "vue-strapi-blocks-renderer"

const { $apollo } = useNuxtApp()

const email = ref("")
const name = ref("")
const email_unsubscribe = ref("")
const subscription_message = ref("")
const unsubscription_message = ref("")
const pending = ref(false)
const pendingUnsubscribe = ref(false)

const subscribe = async () => {
  resetMessage()
  if (name.value !== "" && email.value !== "") {
    pending.value = true
    try {
      await $apollo.defaultClient.mutate({
        mutation: gql`
          mutation createNewsletterSubscription(
            $name: String!
            $email: String!
          ) {
            createNewsletterSubscription(
              data: { name: $name, email: $email }
            ) {
              data {
                id
                attributes {
                  email
                }
              }
            }
          }
        `,
        variables: {
          name: name.value,
          email: email.value,
        },
      })
      subscription_message.value = "Vous êtes maintenant inscrit.e à la newsletter. Merci!"
      resetForm()
    } catch (error) {
      console.error(error)
      subscription_message.value = "Vous êtes déjà inscrit.e à la newsletter."
      resetForm()
    } finally {
      pending.value = false
    }
  } else {
    subscription_message.value = "Merci de remplir tous les champs."
  }
}

const unsubscribe = async () => {
  resetMessage()
  if (email_unsubscribe.value !== "") {
    pendingUnsubscribe.value = true
    try {
      const { data } = await $apollo.defaultClient.query({
        query: gql`
          query findnewsletterSubscriptions($email: String!) {
            newsletterSubscriptions(filters: { email: { eq: $email } }) {
              data {
                id
                attributes {
                  email
                }
              }
            }
          }
        `,
        variables: {
          email: email_unsubscribe.value,
        },
        fetchPolicy: "no-cache",
      })

      if (data?.newsletterSubscriptions?.data[0]?.id) {
        await $apollo.defaultClient.mutate({
          mutation: gql`
            mutation deleteNewsletterSubscription($id: ID!) {
              deleteNewsletterSubscription(id: $id) {
                data {
                  id
                  attributes {
                    email
                  }
                }
              }
            }
          `,
          variables: {
            id: data?.newsletterSubscriptions?.data[0]?.id,
          },
          fetchPolicy: "no-cache",
        })
        unsubscription_message.value = "Vous êtes maintenant désinscrit.e à la newsletter."
        resetForm()
      } else {
        unsubscription_message.value = "Vous n'êtes pas inscrit..."
      }
    } catch (error) {
      console.error(error)
      unsubscription_message.value = "Vous n'êtes pas inscrit..."
    } finally {
      pendingUnsubscribe.value = false
    }
  } else {
    unsubscription_message.value = "Merci de remplir tous les champs."
  }
}

const resetForm = () => {
  email.value = ""
  name.value = ""
  email_unsubscribe.value = ""
}

const resetMessage = () => {
  unsubscription_message.value = ""
  subscription_message.value = ""
}
</script>