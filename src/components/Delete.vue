<template>
  <q-dialog v-model="dialog" persistent :maximized="max">
    <q-layout view="hHh lpr fFf" container class="scxs">
      <q-form @submit="submit">
        <q-header
          elevated
          class="bg-red text-white"
          style="height:50px"
          v-if="header"
        >
          <q-toolbar>
            <q-btn flat round icon="expand_more" @click="close"></q-btn>
            <q-toolbar-title>
              {{ header.title }}
            </q-toolbar-title>
          </q-toolbar>
        </q-header>
        <q-footer align="right" bordered class="bg-white q-pa-sm text-right">
          <q-btn
            color="white"
            class="q-mr-sm"
            text-color="primary"
            label="Não, cancelar"
            @click="close"
          />
          <q-btn
            type="submit"
            :loading="submitting"
            :disabled="submitting"
            color="red"
            label="Sim, deletar"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-footer>
        <q-page-container
          class="scroll row items-center"
          style="padding-top: 0px;padding-bottom: 0px;margin-top: 50px; height:calc(100vh - 150px)"
        >
          <q-list class="col-12 row q-px-xl q-py-md ">
            <q-item class="col-12" v-for="(i, k) in form" :key="k">
              <q-item-section v-if="i.label">
                <q-item-label caption>{{ i.label }}:</q-item-label>
                <q-item-label>
                  {{ i.value }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-page-container>
      </q-form>
    </q-layout>
  </q-dialog>
</template>

<script>
export default {
  name: 'Profile',
  props: ['dialog', 'header', 'items'],
  data() {
    return {
      max: this.$q.screen.xs ? true : false,
      form: {},
      submitting: false
    };
  },
  methods: {
    submit() {
      this.submitting = true;
      this.$emit('rSubmit', this.form);
    },
    close() {
      this.$emit('rClose', false);
    }
  },
  watch: {
    dialog() {
      if (this.dialog) {
        Object.keys(this.items).forEach(d => {
          if (this.items[d].value) {
            this.form[d] = {
              label: this.items[d].label,
              value: this.items[d].value
            };
          }
        });
      }
      this.submitting = false;
    }
  }
};
</script>
