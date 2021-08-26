<template>
  <comp-list-form
    :dialog="dialog"
    :title="title"
    :items="items"
    @rClose="dialog = false"
    @rSubmit="save($event)"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import { cpf, mobile } from 'src/validators/validators';
import CompListForm from 'src/components/ListForm';

export default {
  name: 'Profile',
  components: { CompListForm },
  data() {
    return {
      dialog: false,
      title: 'DADOS CADASTRAIS',
      items: {
        photo: {
          prefixPath: 'users/',
          value: ''
        },
        name: {
          label: 'Nome',
          hint: 'Nome completo',
          display: false,
          trim: true,
          icon: 'mdi- mdi-alpha-n-box-outline',
          validate: { required },
          value: ''
        },
        cpf: {
          label: 'CPF',
          hint: '###.###.###-##',
          display: false,
          icon: 'mdi- mdi-alpha-c-box-outline',
          mask: '###.###.###-##',
          format: 'cpf',
          validate: { required, cpf },
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
        },
        gender: {
          type: 'select',
          label: 'Sexo',
          display: false,
          icon: 'mdi- mdi-gender-male-female',
          options: ['Feminino', 'Masculino'],
          validate: { required },
          value: ''
        }
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
