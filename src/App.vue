<template>
  <v-app id="app" class="grey lighten-4">
    <v-main>
      <v-container>
        <v-toolbar flat dense>
          <v-container fluid class="d-flex align-center justify-space-between">
            <v-breadcrumbs :items="breadcrumbs" class="pa-0"></v-breadcrumbs>
            <v-progress-linear
              :active="loading"
              :indeterminate="loading"
              :height="2"
              absolute
              bottom
              color="blue lighten-2"
            ></v-progress-linear>
            <portal-target name="page-action"></portal-target>
          </v-container>
        </v-toolbar>
        <v-divider></v-divider>
        <transition :name="transition" mode="out-in">
          <router-view class="transitioned mt-4"></router-view>
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { RouteRecord } from 'vue-router';

export default Vue.extend({
  data: () => ({
    loading: false,
    transition: '',
  }),
  computed: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    breadcrumbs(): any[] {
      const breadcrumbs = this.$route.matched
        .flatMap((route: RouteRecord) => route.meta.breadcrumbs);

      return ['Learn PnpJs', ...breadcrumbs].map((breadcrumb: string) => ({
        disabled: false,
        exact: true,
        href: null,
        link: true,
        text: breadcrumb,
        to: null,
      }));
    },
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    },
  },
  created() {
    this.$router.beforeEach((_, __, next) => {
      this.loading = true;
      next();
    });
    this.$router.afterEach(() => {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });
  },
});
</script>

<style>
.container {
  padding: unset !important;
}
.transitioned {
  transition: all .1s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
</style>
