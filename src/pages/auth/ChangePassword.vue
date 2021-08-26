<template>
  <q-card
    class="no-border-radius"
    :class="change ? 'fullscreen' : 'shadow-2 q-mb-sm'"
  >
    <q-toolbar class="text-uppercase">
      <q-toolbar-title>Trocar Senha</q-toolbar-title>
      <q-btn
        round
        flat
        dense
        color="grey-8"
        icon="mdi- mdi-square-edit-outline"
        size="13px"
        @click="
          item = '';
          change = true;
        "
        v-if="!change"
      >
        <q-tooltip>Trocar Senha</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-form @submit="save" v-if="change">
      <q-card-section
        class="row items-center"
        style="height:calc(100vh - 104px)"
      >
        <div class="col-12">
          <q-input
            v-model="password"
            outlined
            lazy-rules="lazy-rules"
            autocomplete="current-password old-password"
            color="primary"
            data-cy="oldPassword"
            label="SENHA ANTIGA"
            :rules="[val =&gt; !!val || '*Campo é obrigatório']"
            :type="isPwd ? 'password' : 'text'"
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
            v-model="password"
            lazy-rules="lazy-rules"
            outlined
            autocomplete="current-password new-password"
            color="primary"
            data-cy="password"
            label="NOVA SENHA"
            :rules="[val =&gt; !!val || '*Field is required']"
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
            v-model="passwordMatch"
            outlined
            lazy-rules="lazy-rules"
            autocomplete="new-password"
            color="primary"
            data-cy="verifyPassword"
            label="CONFIRMAR NOVA SENHA"
            :rules="[
              val => !!val || '*Campo é obrigatório',
              val => val === password || '*As senhas não coincidem'
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
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          color="white"
          class="q-mr-sm"
          text-color="grey-5"
          label="Cancelar"
          @click="change = false"
        />
        <q-btn
          type="submit"
          :loading="submitting"
          :disabled="disabled"
          color="primary"
          label="ALTERAR SENHA"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { QSpinnerGears, QSpinnerRadio } from 'quasar';
export default {
  name: 'ChangePassword',
  data() {
    return {
      change: false,
      submitting: false,
      disabled: false,
      isPwd: true,
      password: null,
      passwordMatch: null
    };
  },
  created() {
    const online = window.navigator.onLine;
    this.$q.loading.show({
      message: online
        ? 'Carregando informações do usuário ...'
        : 'Parece que você perdeu a conectividade de rede. Por favor, conecte-se novamente à sua rede para acessar seus dados.',
      backgroundColor: online ? 'grey' : 'red-6',
      spinner: online ? QSpinnerGears : QSpinnerRadio,
      customClass: 'loader'
    });
  },
  mounted() {
    const { current } = this;
    if (current) {
      this.$q.loading.hide();
    }
  },
  computed: {
    ...mapGetters('app', ['current'])
  },
  methods: {
    ...mapMutations('app', ['setDialog']),
    async save() {
      this.submitting = true;
      this.$q.loading.show({
        message: 'Atualizando seus dados, aguarde...',
        customClass: 'text-h3, text-bold'
      });
      try {
        await this.createOne(this.form);
      } catch (err) {
        this.$q.notify({
          message: `Parece um problema ao atualizar a senha: ${err}`,
          color: 'negative'
        });
      } finally {
        this.$q.loading.hide();
        this.setDialog(false);
      }
    }
  },
  watch: {
    current() {
      this.$q.loading.hide();
    }
  }
};
</script>
