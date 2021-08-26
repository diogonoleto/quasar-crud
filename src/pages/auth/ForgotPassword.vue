<template>
  <q-page padding="padding">
    <q-form
      class="authentication q-gutter-y-md"
      ref="forgotPasswordForm"
      @submit="onSubmit"
    >
      <router-link to="/">
        <q-img alt="Logo" src="/statics/fp-logo.png"></q-img>
      </router-link>
      <h4 class="q-mb-none">Esqueceu a senha</h4>
      <div class="inst q-mb-lg">
        Digite seu e-mail e enviaremos um link para redefinir sua senha.
      </div>
      <q-input
        v-model="email"
        outlined
        autocomplete="email"
        color="primary"
        data-cy="email"
        for="email"
        label="E-MAIL"
        lazy-rules="lazy-rules"
        name="email"
        type="email"
        :rules="[val =&gt; !!val || '*Field is required', val =&gt; val.includes('@') &amp;&amp; val.includes('.') || '*Please Provide a valid email']"
      ></q-input>
      <q-btn
        class="full-width q-mt-md"
        color="primary"
        data-cy="submit"
        label="REDEFINIR SENHA"
        :loading="loading"
        @click="onSubmit"
      >
        <template v-slot:loading>
          <q-spinner-gears></q-spinner-gears>
        </template>
      </q-btn>
    </q-form>
  </q-page>
</template>

<script>
import { QSpinnerGears } from 'quasar';
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false
    };
  },
  methods: {
    onSubmit() {
      this.$refs.forgotPasswordForm.validate().then(async success => {
        this.$q.loading.show({
          message: 'Tentando redefinir sua senha...',
          backgroundColor: 'grey',
          spinner: QSpinnerGears,
          customClass: 'loader'
        });
        if (success) {
          try {
            await this.$fb.auth().sendPasswordResetEmail(this.email);
            this.$q.notify({
              color: 'positive',
              message:
                'Um e-mail de redefinição foi enviado para o e-mail com o qual você se registrou para redefinir sua senha.'
            });
          } catch (err) {
            this.$q.notify({
              color: 'negative',
              message: `Há um erro: ${err}`
            });
          }
        }
        this.$q.loading.hide();
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.authentication
  margin auto
  max-width 30em
  width 100%
  .q-img
    height 190px
.q-page >>> .q-img__image
  height 184px
  background-size 35% !important
  background-position 50% 100% !important
</style>
