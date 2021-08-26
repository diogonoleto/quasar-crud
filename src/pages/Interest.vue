<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      :loading="loading"
      :data="sortName(interests, 'name')"
      :columns="columns"
      row-key="id"
      :hide-header="this.$q.screen.xs ? true : false"
      :pagination.sync="pagination"
      hide-pagination
      flat
      v-show="
        Object.keys(interests).length !== 0 && Object.keys(interest).length == 0
      "
    >
      <template v-slot:body="props">
        <q-tr :props="props" @click="interest = props.row">
          <q-td key="name" :props="props" v-if="props.row.name">
            <q-avatar
              color="primary"
              text-color="white"
              size="25px"
              class="q-mr-sm"
            >
              {{ props.row.name | navatar }}
            </q-avatar>
            {{ props.row.name }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div
      v-show="
        Object.keys(interests).length === 0 && Object.keys(interest).length == 0
      "
      class="my-sticky-header-table row items-center justify-center"
    >
      <div class="col col-sm-5 col-md-3 text-center">
        <img src="~assets/copy-paste.png" style="width:40%" /><br />
        Interesado não encontrado!
      </div>
    </div>
    <q-card class="no-border-radius" v-if="Object.keys(interest).length !== 0">
      <q-toolbar class="text-uppercase">
        <q-toolbar-title>{{ interest.name }}</q-toolbar-title>
        <q-space />
        <q-btn
          round
          dense
          flat
          color="grey-8"
          icon="edit"
          @click="dialog = true"
        >
          <q-tooltip>Editar</q-tooltip>
        </q-btn>
        <q-btn
          round
          dense
          flat
          color="grey-8"
          icon="delete"
          @click="dialogDelete = true"
        >
          <q-tooltip>Deletar</q-tooltip>
        </q-btn>
        <q-btn
          round
          dense
          flat
          color="grey-8"
          icon="close"
          @click="interest = {}"
        >
          <q-tooltip>Fechar</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-card-section :class="contentClass" class="scroll q-pa-sm">
        <q-list class="row">
          <q-item class="col-8 col-md-9">
            <q-item-section>
              <q-item-label caption>Nome:</q-item-label>
              <q-item-label>{{ interest.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
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
    <q-page-sticky
      position="bottom-right"
      :offset="[15, 30]"
      @click="
        interest = {};
        dialog = true;
      "
    >
      <q-btn fab icon="add" color="primary" />
    </q-page-sticky>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { QSpinnerGears, QSpinnerRadio } from 'quasar';
import CompForm from 'src/components/Form';
import CompDelete from 'src/components/Delete.vue';
import { required, email } from 'vuelidate/lib/validators';
import { mobile } from 'src/validators/validators';

export default {
  name: 'interestIndex',
  components: { CompForm, CompDelete },
  data() {
    return {
      interest: {},
      loading: true,
      columns: [
        {
          name: 'name',
          label: 'Nome',
          align: 'left',
          field: 'name',
          sortable: true,
          headerClasses: 'gt-xs'
        }
      ],
      pagination: {
        rowsPerPage: 0
      },
      dialog: false,
      dialogDelete: false,
      items: {
        id: {
          type: 'id',
          value: ''
        },
        name: {
          label: 'Nome',
          display: false,
          trim: true,
          icon: 'mdi- mdi-alpha-s-box-outline',
          validate: { required },
          value: ''
        },
        email: {
          label: 'E-mail',
          hint: 'E-mail principal',
          display: false,
          trim: true,
          icon: 'email',
          validate: { required, email },
          value: ''
        },
        mobile: {
          label: 'Telefone',
          hint: '(##) #####-####',
          display: false,
          icon: 'phone',
          mask: '(##) #####-####',
          format: 'mobile',
          validate: { required, mobile },
          value: ''
        }
      },
      header: {
        title: 'NOVO INTERESSADO'
      }
    };
  },
  created() {
    const online = window.navigator.onLine;
    this.$q.loading.show({
      message: online
        ? 'Carregando informações dos interessados...'
        : 'Parece que você perdeu a conectividade de rede. Por favor, conecte-se novamente à sua rede para acessar seus dados.',
      backgroundColor: online ? 'grey' : 'red-6',
      spinner: online ? QSpinnerGears : QSpinnerRadio,
      customClass: 'loader'
    });

    this.$q.loading.hide();
    if (this.interests) {
      this.loading = false;
    }
  },
  computed: {
    ...mapGetters('interest', ['interests']),
    contentClass() {
      let classe = '';
      if (this.$q.dark.isActive !== true) {
        classe += 'text-primary bg-white';
      }
      if (this.$q.screen.width > 599) {
        classe += ' card-height-mm';
      }
      return classe;
    }
  },
  methods: {
    ...mapActions('interest', ['interestCreateOrUpdate', 'interestDelete']),
    sItem(prop) {
      this.interest = this.interests.find(e => e.id == prop);
    },
    async save(form) {
      this.$q.loading.show({
        message: 'Atualizando os dados, aguarde...',
        customClass: 'text-h3, text-bold'
      });
      try {
        await this.interestCreateOrUpdate(form);
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
        await this.interestDelete({ id: this.interest.id });
      } catch (err) {
        this.$q.notify({
          message: `Parece que ocorreu um problema: ${err}`,
          color: 'negative'
        });
      } finally {
        this.dialogDelete = false;
        this.$q.loading.hide();
        this.interest = {};
      }
    }
  },
  watch: {
    interests() {
      this.$q.loading.hide();
      this.loading = false;
    },
    dialog() {
      if (this.dialog) {
        this.header.title = 'NOVO INTERESSADO';
        if (this.interest && this.interest.id) {
          this.header.title = 'EDITAR INTERESSADO';
          Object.keys(this.items).forEach(d => {
            this.items[d].value = this.interest[d];
          });
        } else {
          Object.keys(this.items).forEach(d => {
            this.items[d].value = '';
          });
        }
      }
    },
    dialogDelete() {
      this.header.title = 'O interessado será excluido, você tem certeza?';
      Object.keys(this.items).forEach(d => {
        this.items[d].value = this.interest[d];
      });
    }
  }
};
</script>
<style scoped>
.my-sticky-header-table {
  height: calc(100vh - 100px) !important;
}
.scxs .my-sticky-header-table td:nth-child(1) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.scxs .my-sticky-header-table td:nth-child(3) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
