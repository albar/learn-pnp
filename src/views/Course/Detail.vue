<template>
  <v-container class="px-4" :key="$route.params.id">
    <portal to="page-action">
      <v-btn key="back" text small color="secondary" exact to="/course" class="mr-2">Back</v-btn>
      <v-menu key="menu" offset-y left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            text
            small
            depressed
            style="padding: 0; min-width: unset;"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list elevation="0" nav flat dense>
          <v-list-item :to="`/course/${$route.params.id}/edit`">
            <v-list-item-icon class="mr-0">
              <v-icon small>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="remove">
            <v-list-item-icon class="mr-0">
              <v-icon small color="red">mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title style="color: #F44336">Delete</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </portal>
    <template v-if="course">
      <v-row>
        <v-col cols="12" class="d-flex">
          <h4 class="text-h4 mx-0">{{ course.Title }}</h4>
          <v-chip
            v-if="course.Category"
            small
            class="ma-2"
            outlined
            label
          >
            {{ course.Category.Title }}
          </v-chip>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          {{ course.Description }}
        </v-col>
      </v-row>
      <template v-if="course.Requirements && course.Requirements.length > 0">
        <h5 class="text-subtitle-2 text-decoration-underline">
          This course requires the following courses to be taken fisrt
        </h5>
        <v-row>
          <template v-for="requirement in course.Requirements">
            <v-col :key="requirement.Id" cols="auto">
              <course-card
                :course="requirement"
                title-link
              ></course-card>
            </v-col>
          </template>
        </v-row>
      </template>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import '@pnp/sp/presets/core';
import '@pnp/sp/items';
import { ICourse } from '@/models/course';
import { getCourseById } from '@/managers/course';
import CourseCard from '@/components/CourseCard.vue';

export default Vue.extend({
  name: 'CourseDetail',
  components: { CourseCard },
  data: () => ({
    course: null as ICourse | null,
  }),
  watch: {
    '$route.params.id': function OnParamsIdChanged() {
      this.loadCourse();
    },
  },
  created() {
    this.loadCourse();
  },
  methods: {
    async loadCourse() {
      try {
        if (this.$route.params.id) {
          const id = Number(this.$route.params.id);
          this.course = await getCourseById(this.$sp, id);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async remove() {
      if (this.course) {
        await this.$sp.web.lists.getByTitle('Courses')
          .items.getById(this.course.Id)
          .delete();

        this.$router.push('/course');
      }
    },
  },
});
</script>
