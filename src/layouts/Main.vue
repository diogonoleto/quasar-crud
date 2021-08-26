<template>
  <q-layout view="hHh lpr fFf">
    <q-page-container :style="style">
      <Header />
      <q-page style="min-height:0">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Header from './Header';
export default {
  name: 'Main',
  components: { Header },
  data() {
    return {
      style:
        this.$router.currentRoute.name == 'dashboard'
          ? 'padding-top:130px'
          : 'padding-top:50px'
    };
  },
  watch: {
    $route(from, to) {
      if (to !== from) {
        this.style =
          from.name == 'dashboard' ? 'padding-top:130px' : 'padding-top:50px';
        this.title = from.name == 'dashboard' ? false : true;
      }
    }
  }
};
</script>

<style>
body.body--dark {
  background: #f9f9f9;
}
</style>
