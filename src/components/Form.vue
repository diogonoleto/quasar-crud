<template>
  <q-dialog v-model="dialog" persistent :maximized="max">
    <q-layout view="hHh lpr fFf" container class="scxs">
      <q-form @submit="submit">
        <q-header
          class="bg-white text-grey-10"
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
        <q-page-container
          class="scroll row items-center"
          style="height: calc(100vh - 50px)"
          id="dialog-container"
        >
          <div class="col-12">
            <!-- inputs -->
            <div v-for="(i, k) in p" :key="k">
              <div class="q-px-md q-pt-lg q-pb-md" v-if="i.separator">
                {{ i.separator }}
                <q-separator />
              </div>
              <div
                class="text-center q-my-md"
                style="height: 70px;"
                v-if="k == 'photo'"
              >
                <div class="column items-center profile-photo">
                  <q-avatar class="shadow-5" size="70px" v-if="i.value">
                    <q-img :src="i.value" />
                    <span
                      class="user-image-edit"
                      style="width: 70px;height: 70px;"
                      @click="photoUpload = true"
                      v-if="!i.readonly"
                    >
                      <q-icon
                        name="photo_camera"
                        color="black"
                        size="18px"
                        class="absolute-bottom-right"
                      ></q-icon>
                    </span>
                  </q-avatar>
                  <q-avatar
                    round="round"
                    color="primary"
                    icon="photo_camera"
                    size="70px"
                    text-color="white"
                    v-else
                  >
                    <span
                      class="user-image-edit"
                      style="width: 70px;height: 70px;"
                      @click="photoUpload = true"
                      v-if="!i.readonly"
                    >
                      <q-icon
                        name="photo_camera"
                        color="black"
                        size="18px"
                        class="absolute-bottom-right"
                      ></q-icon>
                    </span>
                  </q-avatar>
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
              <uploader
                class="q-ma-xs-xs archive q-mx-md-md q-my-md-xs no-shadow"
                label="Arquivos"
                multiple
                auto-upload
                color="white"
                :prefixPath="i.prefixPath"
                @uploaded="uploadComplete"
                @start="uploadStart"
                v-else-if="i.type == 'file'"
              >
                <template v-slot:header="scope">
                  <div
                    class="row items-center q-py-none q-pr-sm"
                    style="color: #757575;"
                  >
                    <q-icon
                      name="mdi- mdi-alpha-a-box-outline"
                      class="q-pr-md q-pl-xs"
                      size="24px"
                    />
                    <q-btn
                      v-if="scope.queuedFiles.length > 0"
                      icon="clear_all"
                      @click="scope.removeQueuedFiles"
                      round
                      dense
                      flat
                    >
                      <q-tooltip>Limpar tudo</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="scope.uploadedFiles.length > 0"
                      icon="done_all"
                      @click="scope.removeUploadedFiles"
                      round
                      dense
                      flat
                    >
                      <q-tooltip>Remover arquivos carregados</q-tooltip>
                    </q-btn>
                    <q-spinner
                      v-if="scope.isUploading"
                      class="q-uploader__spinner"
                    />

                    <div class="col">
                      <div class="q-uploader__subtitle">
                        {{ scope.uploadSizeLabel }} /
                        {{ scope.uploadProgressLabel }}
                      </div>
                    </div>
                    <q-btn
                      size="10px"
                      flat
                      icon-right="arrow_forward_ios"
                      label="Adicionar"
                      padding="sm xs"
                      v-if="scope.canAddFiles"
                      type="a"
                    >
                      <q-uploader-add-trigger />
                    </q-btn>

                    <q-btn
                      v-if="scope.canUpload"
                      icon="cloud_upload"
                      @click="scope.upload"
                      round
                      dense
                      flat
                    >
                      <q-tooltip>Fazer upload de arquivos</q-tooltip>
                    </q-btn>

                    <q-btn
                      v-if="scope.isUploading"
                      icon="clear"
                      @click="scope.abort"
                      round
                      dense
                      flat
                    >
                      <q-tooltip>Abortar upload</q-tooltip>
                    </q-btn>
                  </div>
                </template>
              </uploader>
              <div v-else-if="i.type == 'id'"></div>
              <q-card
                class="q-ma-xs-xs q-mx-md-md q-my-md-xs q-py-none no-shadow"
                v-else
              >
                <q-list bordered class="rounded-borders">
                  <q-item class="q-py-xs q-pr-sm" v-if="!i.display">
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
                      <q-item-label v-else-if="form[k] && i.format == 'mobile'">
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
                        v-if="!i.readonly"
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
                    >
                      <template
                        v-slot:control="{ id, floatingLabel, value, emitValue }"
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
                    <q-field
                      v-model="form[k]"
                      :label="i.label"
                      :hint="i.hint ? i.hint : ''"
                      class="col-12 q-mt-0"
                      @blur="validate(k, $event)"
                      :error="i.validate ? $v.form[k].$error : false"
                      hide-bottom-space
                      v-else-if="i.type == 'integer'"
                    >
                      <template
                        v-slot:control="{ id, floatingLabel, value, emitValue }"
                      >
                        <money
                          autofocus
                          :id="id"
                          :value="value"
                          class="q-field__input text-right"
                          @focus="$event.target.select()"
                          @input="emitValue"
                          v-bind="floatFormatInteger"
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
                      :unmasked-value="i.mask ? true : false"
                      v-else-if="i.type == 'product'"
                    >
                      <template v-slot:before>
                        <q-icon :name="i.icon"></q-icon>
                      </template>
                      <template v-slot:append>
                        <q-icon
                          name="mdi- mdi-barcode-scan"
                          @click="capturebarcode()"
                        ></q-icon>
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
                      v-else-if="i.type == 'date'"
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
            @click="close"
          />
          <q-btn
            type="submit"
            :loading="submitting"
            :disabled="disabled"
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
</template>

<script>
import { mask } from 'vue-the-mask';
import { QUploaderBase } from 'quasar';
import uploader from 'src/components/Uploader';
import { QSpinnerFacebook } from 'quasar';

export default {
  name: 'Profile',
  directives: { mask },
  mixins: [QUploaderBase],
  components: { uploader },
  props: ['dialog', 'items', 'header', 'title'],
  data() {
    return {
      max: this.$q.screen.xs ? true : false,
      submitting: false,
      disabled: false,
      photoUpload: false,
      p: {},
      form: {},
      floatFormatCurrent: {
        decimal: ',',
        thousands: '.',
        precision: 2,
        masked: false
      },
      floatFormatInteger: {
        decimal: ',',
        thousands: '.',
        precision: 0,
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
      if (v == 'barcode') {
        if (this.form[v].length > 6) {
          this.buscarProcess(this.form[v]);
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
    buscarProcess(v) {
      let self = this;
      self.$q.loading.show({
        message: 'Buscando informações do processo...',
        backgroundColor: 'grey',
        spinner: QSpinnerFacebook,
        customClass: 'loader'
      });
      fetch('https://api.cosmos.bluesoft.com.br/gtins/' + v, {
        headers: {
          'X-Cosmos-Token': 'fJs5mJm48DVxbt3Pt6-llA'
        }
      })
        .then(resp => resp.json())
        .then(r => {
          self.form.name = r.description;
          if (r.thumbnail) {
            self.form.photo = r.thumbnail;
          }
          if (r.brand) {
            self.form.brand = r.brand;
          }
          if (r.ncm) {
            self.form.ncm = r.ncm;
          }
          if (r.gpc) {
            self.form.ncm = r.gpc;
          }
          if (r.gtins) {
            self.form.gtins = r.gtins;
            self.form.unit = r.gtins
              .find(rg => rg.gtin == r.gtin)
              .commercial_unit.type_packaging.toUpperCase();

            let unit = r.gtins
              .reduce(
                (p, c) =>
                  p.concat(c.commercial_unit.type_packaging.toUpperCase()),
                []
              )
              .sort();
            if (unit) {
              this.items.unit.options = this.items.unit.options.filter(i =>
                unit.includes(i)
              );
              this.items.unit.options.forEach((iuo, k) => {
                r.gtins.forEach(rg => {
                  if (iuo == rg.commercial_unit.type_packaging.toUpperCase()) {
                    this.items.unit.options[k] =
                      iuo + ' (' + rg.commercial_unit.quantity_packaging + ')';
                  }
                });
              });
            }
          }
          self.$q.loading.hide();
        })
        .catch(function(error) {
          self.$q.loading.hide();
        });
    },
    submit() {
      this.submitting = true;
      this.disabled = true;
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        this.submitting = false;
        this.disabled = false;
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
    },
    close() {
      this.$emit('rClose', false);
    },
    photoUploadComplete(info) {
      this.form.photo = info.link;
      this.photoUpload = false;
      this.$q.notify({
        message: `Sua foto carregou com sucesso`,
        color: 'positive'
      });
    },
    uploadComplete(info) {
      this.form['attachments'].push(info);
      this.photoUpload = false;
      this.disabled = false;
      this.$q.notify({
        message: `Seu arquivo carregou com sucesso`,
        color: 'positive'
      });
    },
    uploadStart(info) {
      this.disabled = true;
    },
    capturebarcode() {
      let self = this;
      cordova.plugins.barcodeScanner.scan(
        function(result) {
          self.form.barcode = result.text;
          self.buscarProcess(self.form.barcode);
        },
        function(error) {},
        {
          preferFrontCamera: false,
          showFlipCameraButton: true,
          showTorchButton: true,
          torchOn: true,
          saveHistory: false,
          prompt: 'Coloque um código de barras dentro da área de digitalização',
          resultDisplayDuration: 500,
          formats: 'QR_CODE,EAN_13',
          orientation: 'landscape',
          disableSuccessBeep: false
        }
      );
    }
  },
  watch: {
    dialog() {
      if (this.dialog) {
        this.form = { ...this.items };
        Object.keys(this.items).forEach(d => {
          if (d == 'attachments') {
            this.form[d] = [];
          } else {
            this.form[d] = this.items[d].value;
          }
        });
      }
      this.p = { ...this.items };
      this.submitting = false;
      this.disabled = false;
      this.$v.$reset();
    }
  }
};
</script>
