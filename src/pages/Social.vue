<template>
  <comp-list-form
    :dialog="dialog"
    :title="title"
    :items="items"
    :header="header"
    @rClose="dialog = false"
    @rSubmit="save($event)"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CompListForm from 'src/components/ListForm';
import { mobile } from 'src/validators/validators';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'Social',
  components: { CompListForm },
  data() {
    return {
      dialog: false,
      title: 'SITE E LINKS SOCIAIS',
      items: {
        homepage: {
          label: 'HomePage',
          display: false,
          trim: true,
          icon: 'language',
          value: ''
        },
        whatsapp: {
          label: 'Whatsapp',
          hint: '(##) #####-####',
          display: false,
          icon: 'mdi- mdi-whatsapp',
          mask: '(##) #####-####',
          format: 'mobile',
          validate: { required, mobile },
          value: ''
        }
      },
      header: {
        title: 'EDITAR SITE E LINKS SOCIAIS'
      }
    };
  },
  computed: {
    ...mapGetters('app', ['current'])
  },
  methods: {
    ...mapActions('app', ['currentCreateOrUpdate']),
    async save(form) {
      this.$q.loading.show({
        message: 'Atualizando os dados, aguarde...',
        customClass: 'text-h3, text-bold'
      });
      try {
        await this.currentCreateOrUpdate(form);
      } catch (err) {
        this.$q.notify({
          message: `Parece ter um problema ao atualizar os seus dados: ${err}`,
          color: 'negative'
        });
      } finally {
        this.dialog = false;
        this.$q.loading.hide();
      }
    }
  },
  created() {
    Object.keys(this.items).forEach(d => {
      this.items[d].value = this.current[d] ? this.current[d] : '';
    });
  },
  watch: {
    current() {
      Object.keys(this.items).forEach(d => {
        this.items[d].value = this.current[d] ? this.current[d] : '';
      });
    }
  }
};
</script>
