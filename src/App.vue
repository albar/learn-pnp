<template>
  <v-app id="app">
    <v-main>
      <v-container>
        <v-toolbar flat>
          <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" depressed outlined small v-bind="attrs" v-on="on">
                {{ $route.matched[0] ? $route.matched[0].meta.title : '' }}
                <v-icon right small>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list elevation="0">
              <v-list-item
                v-for="(item, index) in ['vuetify', 'diy']"
                :key="index"
                @click="$router.push(`/${item}/`)"
              >
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-divider></v-divider>
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
      return this.$route
        .matched
        .slice(1)
        .flatMap((route: RouteRecord) => route.meta.breadcrumbs.map((breadcrumb: string) => ({
          disabled: false,
          exact: true,
          href: route.path,
          link: true,
          text: breadcrumb,
          to: route.path,
        })));
    },
  },
});
</script>

<style>
.container {
  padding: unset !important;
}
</style>
