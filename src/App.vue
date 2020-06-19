<template>
  <v-app id="app" class="grey lighten-4">
    <v-main>
      <v-container>
        <v-toolbar flat dense>
          <v-container fluid class="d-flex align-center justify-space-between">
            <v-breadcrumbs :items="breadcrumbs" class="pa-0"></v-breadcrumbs>
            <portal-target
              name="page-action"
              :transition="SlideOnSwitch"
            ></portal-target>
          </v-container>
        </v-toolbar>
        <router-view class="mt-4"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { RouteRecord } from 'vue-router';

const SlideOnSwitch = Vue.extend({
  functional: true,
  render(h, ctx) {
    return h('transition-group', {
      props: {
        name: 'slide-on-switch',
        mode: 'out-in',
      },
    }, ctx.children);
  },
});

export default Vue.extend({
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
    SlideOnSwitch() {
      return SlideOnSwitch;
    },
  },
});
</script>

<style>
.container {
  padding: unset !important;
}
.slide-on-switch {
  transition: .3s all ease-out;
}
.slide-on-switch-leave-active {
  opacity: 0;
}
.slide-on-switch-enter {
  opacity: 0;
  transform: translate(.1rem, 0);
}
</style>
