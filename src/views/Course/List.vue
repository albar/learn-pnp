<template>
  <div>
    <portal to="page-action">
      <v-btn key="create"
        outlined
        small
        color="secondary"
        link to="/course/create"
      >Create a Course</v-btn>
    </portal>
    <v-container class="d-flex align-stretch justify-space-between px-4">
      <v-row>
        <v-col cols="8">
          <v-text-field
            label="search"
            placeholder="type the course name"
            height="36"
            flat
            dense
            clearable
            hide-details
            outlined
          ></v-text-field>
          <v-btn text x-small color="primary" style="padding: 0; margin: 0;">Filter</v-btn>
        </v-col>
        <v-col class="d-flex">
          <v-spacer></v-spacer>
          <div class="d-flex align-end">
            <v-btn
              color="primary"
              outlined small
              disabled
              style="padding: 0; min-width: unset;"
            >
              <v-icon>mdi-menu-left</v-icon>
            </v-btn>
            <v-btn
              @click="next"
              color="primary"
              outlined small
              :disabled="!items || !items.hasNext"
              style="padding: 0; min-width: unset;"
            >
              <v-icon>mdi-menu-right</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-list two-line>
      <v-divider></v-divider>
      <template v-for="(course, index) in courses">
        <CourseListItem
          :view-link="`/course/${course.Id}`"
          :edit-link="`/course/${course.Id}/edit`"
          :key="course.Title"
          :course="course"
          viewable editable />
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import '@pnp/sp/presets/core';
import { PagedItemCollection } from '@pnp/sp/items';
import { ICourse, Mapper } from '@/models/course';
import CourseListItem from '@/components/CourseListItem.vue';

export default Vue.extend({
  name: 'CourseList',
  components: { CourseListItem },
  data: () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: null as PagedItemCollection<any[]> | null,
    query: null as string | null,
  }),
  computed: {
    courses(): ICourse[] {
      return Mapper.mapAll(this.items?.results || []);
    },
  },
  async created() {
    try {
      this.items = await this.$sp.web.lists
        .getByTitle('Courses')
        .items.expand('Category')
        .select('*', 'Category/Id', 'Category/Title')
        .top(5)
        .getPaged<ICourse[]>();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    async next() {
      if (!this.items || !this.items.hasNext) return;
      try {
        this.items = await this.items.getNext();
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>
