<template>
  <q-header elevated class="bg-primary text-white" :style="style">
    <q-toolbar v-if="title">
      <q-btn flat round dense icon="chevron_left" :to="header.route" type="a" />
      <q-space />
      <div class="text-center q-mb-xs q-mt-xs">
        <div style="line-height: 0.9rem;">
          {{ header.title }}
        </div>
        <div class="text-caption" style="line-height: 0.9rem;">
          {{ header.subtitle }}
        </div>
      </div>
      <q-space />
      <q-btn dense flat no-wrap class="q-ml-xs">
        <q-avatar size="40px">
          <img :src="getPhoto" />
        </q-avatar>
        <q-icon name="arrow_drop_down" size="16px" />
        <q-menu auto-close>
          <q-list style="min-width:150px">
            <q-item>
              <q-item-section>
                <strong>{{ current ? current.name : '' }}</strong>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="logout">
              <q-item-section>Sair</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  data() {
    return {
      style:
        this.$router.currentRoute.name == 'dashboard'
          ? 'height:130px'
          : 'height:50px',
      title: this.$router.currentRoute.name == 'dashboard' ? false : true
    };
  },
  computed: {
    ...mapGetters('app', ['header', 'current']),
    getPhoto() {
      return this.current && this.current.photo
        ? this.current.photo
        : require('assets/avatar.jpg');
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logoutUser');
    }
  },
  watch: {
    $route(from, to) {
      if (to !== from) {
        this.style = from.name == 'dashboard' ? 'height:130px' : 'height:50px';
        this.title = from.name == 'dashboard' ? false : true;
      }
    }
  }
};
</script>
