<template>
  <div>
    <portal to="page-action">
      <v-btn key="cancel"
        @click="$router.back()"
        text small color="secondary"
        class="mr-2">Cancel</v-btn>
      <v-btn key="save" outlined small color="primary" @click="save">Save</v-btn>
    </portal>

    <course-form v-if="course"
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
import { ICourse } from '@/models/course';
import { getCourseById, updateCourse } from '@/managers/course';

export default Vue.extend({
  name: 'CourseEdit',
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
  async created() {
    try {
      this.course.Id = Number(this.$route.params.id);
      const course = await getCourseById(this.$sp, this.course.Id);
      if (course !== null) {
        this.course.Id = course.Id;
        this.course.Title = course.Title;
        this.course.Description = course.Description;
        this.course.Category = course.Category;
        this.course.Requirements = course.Requirements;
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (!this.course) {
        this.$router.back();
      }
    }
  },
  methods: {
    async save() {
      await updateCourse(this.$sp, this.course);
      this.$router.push(`/course/${this.course.Id}`);
    },
  },
});
</script>
