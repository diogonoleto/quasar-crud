<template>
  <q-page padding style="backgroud: #f0f2f5;" class=" row items-center">
    <q-form
      class="authentication q-gutter-y-md q-gutter-y-xs"
      ref="emailAuthenticationForm"
      @submit="onSubmit"
    >
      <q-card>
        <q-card-section>
          <h5 class="text-center q-ma-md">{{ getAuthType }}</h5>
          <q-input
            v-model="email"
            name="email"
            outlined="outlined"
            lazy-rules="lazy-rules"
            autocomplete="email"
            color="primary"
            data-cy="email"
            label="E-MAIL"
            type="email"
            :rules="[
              val => !!val || '*Campo é obrigatório',
              val =>
                (val.includes('@') && val.includes('.')) ||
                '*Por favor forneça um email válido'
            ]"
          />
          <q-input
            v-model="password"
            lazy-rules="lazy-rules"
            outlined="outlined"
            autocomplete="current-password new-password"
            color="primary"
            data-cy="password"
            label="SENHA"
            :rules="[val =&gt; !!val || '*Campo é obrigatório']"
            :type="isPwd ? 'password' : 'text'"
            @keyup.enter="
              onSubmit();
              $event.target.blur();
            "
          >
            <template v-slot:append>
              <q-icon
                class="cursor-pointer"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            v-if="isRegistration"
            lazy-rules="lazy-rules"
            outlined="outlined"
            autocomplete="new-password"
            color="primary"
            data-cy="verifyPassword"
            label="CONFIRMAR SENHA"
            v-model="passwordMatch"
            :rules="[
              val => !!val || '*Campo é obrigatório',
              val => val === password || '*As senhas não correspondem'
            ]"
            :type="isPwd ? 'password' : 'text'"
            @keyup.enter="
              onSubmit();
              $event.target.blur();
            "
          >
            <template v-slot:append>
              <q-icon
                class="cursor-pointer"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn
            class="btn-fixed-width full-width q-mt-md"
            data-cy="submit"
            type="submit"
            :label="getAuthType"
          >
          </q-btn>
          <!-- <q-separator />
      <q-btn
        class="btn-fixed-width full-width q-mt-md"
        @click="loginProvider()"
        align="center"
        style="background: #097ceb; color: white"
        label="Login com Facebook"
        icon="fab fa-facebook-f"
      /> -->
          <p class="q-mt-md q-mb-none text-center">
            <router-link class="text-primary" :to="routeAuthentication">
              <span v-if="isRegistration">Precisa fazer login?</span>
              <span v-else>Precisa criar uma conta?</span>
            </router-link>
          </p>
          <p class="q-ma-sm text-center">
            <router-link class="text-primary" to="forgotPassword"
              >Esqueceu a senha?</router-link
            >
          </p>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex';
import { QSpinnerGears } from 'quasar';
export default {
  name: 'Auth',
  computed: {
    getAuthType() {
      return this.isRegistration ? 'Registrar' : 'Logar';
    },
    isRegistration() {
      return this.$route.name === 'Register';
    },
    routeAuthentication() {
      return this.isRegistration ? '/auth/login' : '/auth/register';
    }
  },
  data() {
    return {
      email: 'demo@demo.com',
      isPwd: true,
      password: '123456',
      passwordMatch: null
    };
  },
  methods: {
    ...mapActions('auth', ['createNewUser', 'loginUser', 'loginFacebook']),
    onSubmit() {
      const { email, password } = this;
      this.$refs.emailAuthenticationForm.validate().then(async success => {
        if (success) {
          this.$q.loading.show({
            message: this.isRegistration
              ? 'Registrando sua conta...'
              : 'Autenticando sua conta...',
            backgroundColor: 'grey',
            spinner: QSpinnerGears,
            customClass: 'loader'
          });
          try {
            if (this.isRegistration) {
              await this.createNewUser({ email, password });
            } else {
              await this.loginUser({ email, password });
            }
            this.$router.push({ path: '/' });
          } catch (err) {
            console.error(err);
            this.$q.notify({
              message: `Ocorreu um erro: ${err}`,
              color: 'negative'
            });
          } finally {
            this.$q.loading.hide();
          }
        }
      });
    },
    loginProvider() {
      this.$q.loading.show({
        message: this.isRegistration
          ? 'Registrando sua conta...'
          : 'Autenticando sua conta...',
        backgroundColor: 'grey',
        spinner: QSpinnerGears,
        customClass: 'loader'
      });
      try {
        this.loginFacebook().then(() => {
          this.$router.push({ name: 'dashboard' });
          this.$q.loading.hide();
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({
          message: `Ocorreu um erro: ${err}`,
          color: 'negative'
        });
      }
    }
  }
};
</script>

<style>
.authentication {
  margin: auto;
  max-width: 30em;
  width: 100%;
}
</style>
