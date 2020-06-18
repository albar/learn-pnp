<template>
  <div>
    <v-toolbar flat>
      <v-container fluid class="d-flex align-top justify-space-between">
        <div class="mr-auto pr-2" style="max-width: 50%">
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
          <v-btn text small color="primary" style="padding: 0; height: unset;">Filter</v-btn>
        </div>
        <v-btn outlined link-to="/course/create">Create</v-btn>
      </v-container>
    </v-toolbar>
    <v-toolbar flat>
      <v-container fluid class="d-flex justify-end">
        <v-btn @click="next" color="primary" outlined small style="padding: 0; min-width: unset;">
          <v-icon>mdi-menu-right</v-icon>
        </v-btn>
      </v-container>
    </v-toolbar>
    <v-list two-line>
      <template v-for="(course, index) in courses">
        <v-list-item :key="course.Id">
          <template>
            <v-list-item-content>
              <v-list-item-title v-text="course.Title"></v-list-item-title>
              <v-list-item-subtitle
                class="text--primary"
                v-text="course.Category ? course.Category.Title : ''"
              ></v-list-item-subtitle>
              <v-list-item-subtitle v-text="course.Description"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text v-text="course.Modified"></v-list-item-action-text>
              <div>
                <v-btn text small color="primary">View</v-btn>
                <v-btn text small color="secondary">Edit</v-btn>
              </div>
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-divider v-if="index + 1 < courses.length" :key="index"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import { PagedItemCollection } from '@pnp/sp/items';
import { ICourse } from '@/models/course';

const courses: ICourse[] = [
  {
    Id: 1,
    Title: 'A Course',
    Description: 'A Course Description',
    Category: {
      Id: 0,
      Title: 'Category A',
    },
    Created: new Date(),
    Modified: new Date(),
  },
  {
    Id: 2,
    Title: 'New Course',
    Description: 'New Course Description',
    Category: {
      Id: 1,
      Title: 'Category B',
    },
    Created: new Date(),
    Modified: new Date(),
  },
];

interface IComponentData {
  items?: PagedItemCollection<ICourse[]>;
}

export default Vue.extend({
  data: (): IComponentData => ({
    items: undefined,
  }),
  computed: {
    courses(): ICourse[] {
      if (!this.items) return courses;
      return this.items.results;
    },
  },
  async created() {
    try {
      this.items = await sp.web.lists
        .getByTitle('Courses')
        .items.top(10)
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
