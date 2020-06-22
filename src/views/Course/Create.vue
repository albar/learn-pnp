<template>
  <div>
    <portal to="page-action">
      <v-btn key="cancel"
        @click="$router.back()"
        text small color="secondary"
        class="mr-2"
      >Cancel</v-btn>
      <v-btn key="save" outlined small color="primary" @click="submit">Submit</v-btn>
    </portal>

    <course-form
      :course-id.sync="course.Id"
      :title.sync="course.Title"
      :description.sync="course.Description"
      :category.sync="course.Category"
      :requirements.sync="course.Requirements"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import '@pnp/sp/presets/core';
import '@pnp/sp/items';
import CourseForm from '@/components/CourseForm.vue';
import { ICourse, addCourse } from '@/models/course';

export default Vue.extend({
  name: 'CourseCreate',
  components: { CourseForm },
  data: () => ({
    course: {
      Id: 0,
      Title: null,
      Description: null,
      Category: null,
      Requirements: [],
    } as ICourse,
  }),
  methods: {
    async submit() {
      await addCourse(this.$sp, this.course);
      this.$router.push(`/course/${this.course.Id}`);
    },
  },
});
</script>
