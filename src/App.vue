<template>
  <v-app id="app" class="grey lighten-4">
    <v-main>
      <v-container>
        <v-toolbar flat dense>
          <v-container fluid class="d-flex align-center justify-space-between">
            <v-breadcrumbs :items="breadcrumbs" class="pa-0"></v-breadcrumbs>
            <portal-target name="page-action"></portal-target>
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
  },
});
</script>

<style>
.container {
  padding: unset !important;
}
</style>
