<template>
  <v-card outlined>
    <v-card-title>
      <router-link
        v-if="titleLink"
        :to="`/course/${course.Id}`"
        class="text-h6"
      >{{ course.Title }}</router-link>
      <h6 v-else class="text-h6">{{ course.Title }}</h6>
      <v-chip
        v-if="course.Category"
        small
        class="ma-2"
        outlined
        flat
        label
      >
        {{ course.Category.Title }}
      </v-chip>
    </v-card-title>
    <v-card-text v-text="course.Description"></v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    course: {
      type: Object,
      required: true,
    },
    titleLink: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
