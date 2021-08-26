<template>
  <q-card class="no-border-radius shadow-2 q-mb-sm">
    <q-toolbar>
      <q-toolbar-title>{{ title }}</q-toolbar-title>
      <q-btn
        round
        flat
        dense
        color="grey-8"
        icon="mdi- mdi-square-edit-outline"
        size="13px"
        @click="dialog = true"
      >
        <q-tooltip>Editar</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-card-section class="q-px-none q-py-sm-md q-py-md-xs">
      <q-list class="row">
        <q-item
          class="col-xs-12"
          :class="k == 'photo' ? 'col-md-auto' : 'col-md'"
          v-for="(i, k) in items"
          :key="k"
        >
          <q-item-section v-if="k == 'photo'" avatar>
            <q-avatar v-if="i.value">
              <img :src="i.value" />
            </q-avatar>
            <q-avatar
              round="round"
              color="primary"
              icon="photo_camera"
              size="40px"
              text-color="white"
              v-else
            />
          </q-item-section>
          <q-item-section v-if="k != 'photo'">
            <q-item-label caption>{{ i.label }}:</q-item-label>
            <q-item-label v-if="k == 'cpf'">
              {{ i.value | formatCPF }}
            </q-item-label>
            <q-item-label v-else-if="k == 'mobile' || k == 'whatsapp'">
              {{ i.value | formatMobile }}
            </q-item-label>
            <q-item-label v-else-if="k == 'cep'">
              {{ i.value | formatCep }}
            </q-item-label>
            <q-item-label v-else-if="k == 'current'">
              {{ i.value | formatNumber(2, 'R$ ') }}
            </q-item-label>
            <q-item-label v-else>{{ i.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-dialog v-model="dialog" persistent :maximized="max">
      <q-layout view="hHh lpr fFf" container class="scxs">
        <q-form @submit="submit">
          <q-header
            class="bg-white text-grey-10"
            style="height:50px"
            v-if="header"
          >
            <q-toolbar>
              <q-toolbar-title>
                {{ header.title }}
              </q-toolbar-title>
              <q-btn flat round icon="close" @click="dialog = false"></q-btn>
            </q-toolbar>
          </q-header>
          <q-page-container
            class="scroll row items-center"
            style="height: 100vh"
            id="dialog-container"
          >
            <div class="col-12">
              <!-- inputs -->
              <div v-for="(i, k) in p" :key="k">
                <div
                  class="text-center q-my-md"
                  style="height: 70px;"
                  v-if="k == 'photo'"
                >
                  <div class="column items-center profile-photo">
                    <q-avatar class="shadow-5" size="70px" v-if="i.value">
                      <q-img :src="i.value"></q-img>
                    </q-avatar>
                    <q-avatar
                      round="round"
                      color="primary"
                      icon="photo_camera"
                      size="70px"
                      text-color="white"
                      v-else
                    ></q-avatar>
                    <span
                      class="user-image-edit"
                      style="width: 70px;height: 70px;"
                      @click="photoUpload = true"
                    >
                      <q-icon
                        name="photo_camera"
                        color="black"
                        size="18px"
                        class="absolute-bottom-right"
                      ></q-icon>
                    </span>
                  </div>
                  <q-dialog
                    v-model="photoUpload"
                    transition-hide="scale"
                    transition-show="scale"
                  >
                    <uploader
                      class="q-my-lg"
                      label="Envie uma foto"
                      :prefixPath="i.prefixPath"
                      @uploaded="photoUploadComplete"
                    />
                  </q-dialog>
                </div>
                <q-card
                  class="q-ma-xs-xs q-mx-md-md q-my-md-xs q-py-none no-shadow"
                  v-else
                >
                  <q-list bordered class="rounded-borders">
                    <q-item class="q-pr-sm" v-if="!i.display">
                      <q-item-section side center>
                        <q-icon :name="i.icon" size="24px" />
                      </q-item-section>
                      <q-item-section center>
                        <q-item-label caption v-if="form[k]">
                          {{ i.label }}
                        </q-item-label>
                        <q-item-label v-if="form[k] && !i.format">
                          {{ form[k] }}
                        </q-item-label>
                        <q-item-label v-else-if="form[k] && i.format == 'cpf'">
                          {{ form[k] | formatCPF }}
                        </q-item-label>
                        <q-item-label
                          v-else-if="form[k] && i.format == 'mobile'"
                        >
                          {{ form[k] | formatMobile }}
                        </q-item-label>
                        <q-item-label v-else-if="form[k] && i.format == 'cep'">
                          {{ form[k] | formatCep }}
                        </q-item-label>
                        <q-item-label
                          v-else-if="form[k] && i.format == 'current'"
                        >
                          {{ form[k] | formatNumber(2, 'R$ ') }}
                        </q-item-label>
                        <q-item-label v-else-if="form[k] && i.format == 'date'">
                          {{ form[k] | formatDate('DD/MM/YYYY') }}
                        </q-item-label>
                        <q-item-label
                          v-else-if="form[k] && i.format == 'dateTime'"
                        >
                          {{ form[k] | formatDate('DD/MM/YYYY HH:mm') }}
                        </q-item-label>
                        <q-item-label
                          v-else-if="form[k] && i.format == 'integer'"
                        >
                          {{ form[k] | formatNumber(0, '') }}
                        </q-item-label>
                        <q-item-label v-else caption>
                          {{ i.label }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section center side>
                        <q-btn
                          size="10px"
                          flat
                          icon-right="arrow_forward_ios"
                          label="Editar"
                          padding="sm xs"
                          @click="i.display = true"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pr-sm" v-else>
                      <q-select
                        v-model="form[k]"
                        autofocus
                        class="col-12 q-mt-0"
                        :options="i.options"
                        :label="i.label"
                        @input="validate(k, $event)"
                        @blur="validate(k, $event)"
                        @keydown.prevent.tab="validate(k, $event)"
                        @keydown.prevent.enter="validate(k, $event)"
                        :error="$v.form[k].$error"
                        hide-bottom-space
                        :unmasked-value="i.mask ? true : false"
                        ref="money"
                        v-if="i.type == 'select'"
                      >
                        <template v-slot:before>
                          <q-icon :name="i.icon"></q-icon>
                        </template>
                      </q-select>
                      <q-field
                        v-model="form[k]"
                        :label="i.label"
                        :hint="i.hint ? i.hint : ''"
                        class="col-12 q-mt-0"
                        @blur="validate(k, $event)"
                        :error="i.validate ? $v.form[k].$error : false"
                        hide-bottom-space
                        v-else-if="i.type == 'money'"
                        @focus="scroll()"
                      >
                        <template
                          v-slot:control="{
                            id,
                            floatingLabel,
                            value,
                            emitValue
                          }"
                        >
                          <money
                            autofocus
                            :id="id"
                            :value="value"
                            class="q-field__input text-right"
                            @focus="$event.target.select()"
                            @input="emitValue"
                            v-bind="floatFormatCurrent"
                            v-show="floatingLabel"
                          />
                        </template>
                        <template v-slot:before>
                          <q-icon :name="i.icon"></q-icon>
                        </template>
                      </q-field>
                      <q-input
                        v-model="form[k]"
                        autofocus
                        :label="i.label"
                        :hint="i.hint ? i.hint : ''"
                        class="col-12 q-mt-0"
                        @blur="validate(k, $event)"
                        @keydown.prevent.tab="validate(k, $event)"
                        :error="i.validate ? $v.form[k].$error : false"
                        @focus="$event.target.select()"
                        hide-bottom-space
                        autogrow
                        v-on:keyup="i.format == 'cep' ? buscarCep(k) : null"
                        :unmasked-value="i.mask ? true : false"
                        v-else-if="i.type == 'grow'"
                      >
                        <template v-slot:before>
                          <q-icon :name="i.icon"></q-icon>
                        </template>
                      </q-input>
                      <q-input
                        v-model="form[k]"
                        autofocus
                        :label="i.label"
                        :hint="i.hint ? i.hint : ''"
                        :mask="i.mask ? i.mask : ''"
                        class="col-12 q-mt-0"
                        @blur="validate(k, $event)"
                        @keydown.prevent.tab="validate(k, $event)"
                        @keydown.prevent.enter="validate(k, $event)"
                        :error="i.validate ? $v.form[k].$error : false"
                        @focus="$event.target.select()"
                        hide-bottom-space
                        v-on:keyup="i.format == 'cep' ? buscarCep(k) : null"
                        :unmasked-value="i.mask ? true : false"
                        v-else
                      >
                        <template v-slot:before>
                          <q-icon :name="i.icon"></q-icon>
                        </template>
                      </q-input>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </div>
          </q-page-container>
          <q-footer align="right" bordered class="bg-white q-pa-sm text-right">
            <q-btn
              color="white"
              class="q-mr-sm"
              text-color="grey-5"
              label="CANCELAR"
              @click="dialog = false"
            />
            <q-btn
              type="submit"
              :loading="submitting"
              :disabled="submitting"
              color="primary"
              label="SALVAR"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </q-footer>
        </q-form>
      </q-layout>
    </q-dialog>
  </q-card>
</template>

<script>
import { mask } from 'vue-the-mask';
import { QUploaderBase } from 'quasar';
import uploader from 'src/components/Uploader';

export default {
  name: 'Profile',
  directives: { mask },
  mixins: [QUploaderBase],
  components: { uploader },
  props: ['items', 'header', 'title'],
  data() {
    return {
      max: this.$q.screen.xs ? true : false,
      submitting: false,
      photoUpload: false,
      dialog: false,
      p: {},
      form: {},
      floatFormatCurrent: {
        decimal: ',',
        thousands: '.',
        precision: 2,
        masked: false
      }
    };
  },
  validations() {
    const validations = {
      form: {}
    };
    Object.keys(this.items).forEach(d => {
      validations.form[d] = { ...this.items[d].validate };
    });
    return validations;
  },
  methods: {
    validate(v, e) {
      let p = this.p[v];
      if (p.validate) {
        this.$v.form[v].$touch();
        if (this.$v.form[v].$error) {
          return false;
        }
      }
      if (p.trim) {
        this.form[v] = this.form[v].trim();
      }
      p.display = false;
      if (e.key == 'Tab' || e.key == 'Enter') {
        var k = Object.keys(this.p);
        if (e.shiftKey) {
          var ni = k.indexOf(v) - 1;
        } else {
          var ni = k.indexOf(v) + 1;
        }
        var nx = k[ni];
        if (nx) {
          this.p[nx].display = true;
        }
      }
    },
    buscarCep(v) {
      if (/^[0-9]{8}$/.test(this.form[v])) {
        fetch('https://viacep.com.br/ws/' + this.form[v] + '/json/')
          .then(resp => resp.json())
          .then(r => {
            if (!('erro' in r)) {
              this.form.logradouro = r.logradouro;
              this.form.district = r.bairro;
              this.form.city = r.localidade;
              this.form.uf = r.uf;
              this.p.number.display = true;
            } else {
              return this.$q.notify({
                message: 'CEP informado não foi encontrado!',
                icon: 'report_problem',
                color: 'negative'
              });
            }
          });
      }
    },
    submit() {
      this.submitting = true;
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        this.submitting = false;
        Object.keys(this.p).forEach(d => {
          if (this.$v.form[d] && this.$v.form[d].$error) {
            this.p[d].display = true;
          }
        });
        return this.$q.notify({
          message: `Por favor, preencher todos os campos!`,
          icon: 'report_problem',
          color: 'negative'
        });
      }
      this.$emit('rSubmit', this.form);
      this.dialog = false;
    },
    photoUploadComplete(info) {
      this.form.photo = info.link;
      this.photoUpload = false;
      this.$q.notify({
        message: `Sua foto carregou com sucesso`,
        color: 'positive'
      });
    },
    scroll(e) {
      e.target.scrollIntoView({ behavior: 'smooth' });
    }
  },
  watch: {
    dialog() {
      if (this.dialog) {
        this.form = { ...this.items };
        Object.keys(this.items).forEach(d => {
          this.form[d] = this.items[d].value;
        });
      }
      this.p = { ...this.items };
      this.submitting = false;
      this.$v.$reset();
    }
  }
};
</script>
