<template>
  <div>
    <portal to="page-action">
      <v-btn
        outlined
        small
        color="secondary"
        link to="/course/create"
      >Create a Course</v-btn>
    </portal>
    <v-toolbar flat>
      <v-container fluid class="d-flex align-stretch justify-space-between">
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
    </v-toolbar>

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
import { ICourse } from '@/models/course';
import CourseListItem from '@/components/CourseListItem.vue';

const date = new Date();
const ndate = new Date();
ndate.setSeconds(59);

const courses: ICourse[] = [
  {
    Id: 1,
    Title: 'A Course',
    Description: 'A Course Description',
    Category: {
      Id: 0,
      Title: 'Category A',
    },
    Created: date,
    Modified: date,
  },
  {
    Id: 2,
    Title: 'New Course',
    Description: 'New Course Description',
    Category: {
      Id: 1,
      Title: 'Category B',
    },
    Created: date,
    Modified: ndate,
  },
];

export default Vue.extend({
  components: { CourseListItem },
  data: () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: null as PagedItemCollection<any[]> | null,
    query: null as string | null,
  }),
  computed: {
    courses(): ICourse[] {
      if (this.items) {
        return this.items.results.map((item) => {
          const course: ICourse = {
            Id: item.Id,
            Title: item.Title,
            Description: item.Description,
          };

          if (item.Category) {
            course.Category = item.Category;
          }
          if (item.Created) {
            course.Created = new Date(item.Created);
          }
          if (item.Modified) {
            course.Modified = new Date(item.Modified);
          }

          return course;
        });
      }
      return courses;
    },
  },
  async created() {
    try {
      this.items = await this.$sp.web.lists
        .getByTitle('Courses')
        .items.expand('Category')
        .select('*', 'Category/Id', 'Category/Title')
        .top(10)
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
