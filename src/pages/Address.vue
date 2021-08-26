<template>
  <q-card class="no-border-radius shadow-2 q-mb-sm">
    <q-toolbar class="text-uppercase">
      <q-toolbar-title>ENDEREÇOS</q-toolbar-title>
      <q-btn
        round
        flat
        dense
        color="grey-8"
        icon="mdi- mdi-square-edit-outline"
        size="13px"
        @click="
          item = '';
          dialog = true;
        "
      >
        <q-tooltip>Adicionar</q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-list
      v-show="addresses && Object.keys(addresses).length !== 0"
      class="q-px-none q-py-xs-md q-py-md-xs"
    >
      <q-item v-for="(e, i) in addresses" :key="i">
        <q-item-section>
          <q-item-label caption>{{ e.type }}</q-item-label>
          <q-item-label
            >{{ e.logradouro }}, {{ e.number }}{{ ', ' + e.complement }},
            {{ e.district }}, {{ e.city }}-{{ e.uf }},
            {{ e.cep | formatCep }}</q-item-label
          >
        </q-item-section>
        <q-item-section center side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn
              size="10px"
              flat
              dense
              round
              color="primary"
              icon="mdi- mdi-square-edit-outline"
              @click="
                item = e;
                dialog = true;
              "
            />
            <q-btn
              size="10px"
              flat
              dense
              round
              color="red-9"
              icon="delete"
              @click="
                item = e;
                dialogDelete = true;
              "
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <comp-form
      :dialog="dialog"
      :items="items"
      :header="header"
      @rClose="dialog = false"
      @rSubmit="save($event)"
    />
    <comp-delete
      :dialog="dialogDelete"
      :items="items"
      :header="header"
      @rClose="dialogDelete = false"
      @rSubmit="sDelete($event)"
    />
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import { cep } from 'src/validators/validators';
import CompForm from 'src/components/Form';
import CompDelete from 'src/components/Delete.vue';

export default {
  components: { CompForm, CompDelete },
  name: 'Address',
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      item: '',
      items: {
        id: {
          type: 'id',
          value: ''
        },
        type: {
          type: 'select',
          label: 'Tipo',
          hint: 'Tipo de endereço',
          icon: 'mdi- mdi-alpha-t-box-outline',
          options: ['Residencial', 'Comercial'],
          display: false,
          validate: { required },
          value: ''
        },
        cep: {
          label: 'CEP',
          mask: '##.###-###',
          hint: 'CEP do endereço',
          icon: 'mdi- mdi-alpha-c-box-outline',
          format: 'cep',
          display: false,
          trim: true,
          validate: { required, cep }
        },
        logradouro: {
          label: 'Endereço',
          icon: 'mdi- mdi-alpha-e-box-outline',
          display: false,
          trim: true,
          validate: { required },
          value: ''
        },
        number: {
          label: 'Número',
          icon: 'mdi- mdi-alpha-n-box-outline',
          display: false,
          trim: true,
          validate: { required },
          value: ''
        },
        complement: {
          label: 'Complemento',
          icon: 'mdi- mdi-alpha-c-box-outline',
          display: false,
          required: false,
          trim: true,
          value: ''
        },
        district: {
          label: 'Bairro',
          icon: 'mdi- mdi-alpha-b-box-outline',
          validate: { required },
          display: false,
          trim: true,
          value: ''
        },
        city: {
          label: 'Cidade',
          icon: 'mdi- mdi-alpha-n-box-outline',
          display: false,
          trim: true,
          validate: { required },
          value: ''
        },
        uf: {
          label: 'UF',
          icon: 'mdi- mdi-alpha-u-box-outline',
          display: false,
          trim: true,
          validate: { required },
          value: ''
        }
      },
      header: {
        title: 'Novo Endereço'
      }
    };
  },
  computed: {
    ...mapGetters('app', ['addresses'])
  },
  created() {
    this.$store.dispatch('app/addressList');
  },
  methods: {
    ...mapActions('app', ['addressCreateOrUpdate', 'addressDelete']),
    async save(form) {
      this.$q.loading.show({
        message: 'Atualizando os dados, aguarde...',
        customClass: 'text-h3, text-bold'
      });
      try {
        await this.addressCreateOrUpdate(form);
      } catch (err) {
        this.$q.notify({
          message: `Parece ter um problema ao atualizar os seus dados: ${err}`,
          color: 'negative'
        });
      } finally {
        this.dialog = false;
        this.$q.loading.hide();
      }
    },
    async sDelete() {
      this.$q.loading.show({
        message: 'Deletando os dados, aguarde...',
        customClass: 'text-h3, text-bold'
      });
      try {
        await this.addressDelete({ id: this.item.id });
      } catch (err) {
        this.$q.notify({
          message: `Parece que ocorreu um problema: ${err}`,
          color: 'negative'
        });
      } finally {
        this.dialogDelete = false;
        this.$q.loading.hide();
      }
    }
  },
  watch: {
    dialog() {
      if (this.dialog) {
        this.header.title = 'NOVO ENDEREÇO';
        if (this.item && this.item.id) {
          this.header.title = 'EDITAR ENDEREÇO';
          Object.keys(this.items).forEach(d => {
            this.items[d].value = this.item[d];
          });
        } else {
          Object.keys(this.items).forEach(d => {
            this.items[d].value = '';
          });
        }
      }
    },
    dialogDelete() {
      this.header.title = 'O endereço será excluido, você tem certeza?';
      Object.keys(this.items).forEach(d => {
        this.items[d].value = this.item[d];
      });
    }
  }
};
</script>
