<template>
  <div :class="this.$q.screen.xs ? 'scxs' : ''">
    <q-header class="bg-white shadow-2" style="margin-top: 50px;">
      <q-tabs
        v-model="tab"
        inline-label
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-route-tab :to="'/'" name="profile" icon="people" label="Perfil" />
        <q-route-tab
          :to="'/tipo'"
          name="type"
          icon="mdi- mdi-tag-multiple-outline"
          label="Tipo"
        />
        <q-route-tab
          :to="'/interessado'"
          name="interest"
          icon="people"
          label="Interessado"
        />
      </q-tabs>
    </q-header>
    <q-tab-panels v-model="tab" style="padding-top: 50px;">
      <q-tab-panel name="profile" class="q-pa-none q-mt-sm">
        <profile />
        <address-current />
        <social />
        <change-password />
      </q-tab-panel>
      <q-tab-panel name="type" class="q-pa-none">
        <type />
      </q-tab-panel>
      <q-tab-panel name="interest" class="q-pa-none">
        <interest />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import ChangePassword from './auth/ChangePassword';
import Type from './Type';
import Interest from './Interest';

import AddressCurrent from './Address';
import Social from './Social';
import Profile from './Profile';

export default {
  name: 'UserIdex',
  components: {
    ChangePassword,
    Type,
    Interest,
    AddressCurrent,
    Social,
    Profile
  },
  data() {
    return {
      tab: this.$router.currentRoute.name
    };
  },
  mounted() {
    this.$store.commit('app/setHeader', {
      title: 'CONFIGURAÇÕES',
      subtitle: '',
      route: '/'
    });
  }
};
</script>
