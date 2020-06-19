<template>
  <div v-if="!initializing">
    <portal to="page-action">
      <v-btn @click="back" text small color="secondary" class="mr-2">Cancel</v-btn>
      <v-btn outlined small color="primary">Save</v-btn>
    </portal>

    <v-form>
      <v-container class="px-4">
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              label="Course Name"
              placeholder="type the course name"
              flat
              dense
              outlined
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              label="Category"
              placeholder="select the category"
              flat
              dense
              outlined
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="Description"
              placeholder="type the course description"
              auto-grow
              rows="3"
              flat
              dense
              outlined
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="requirements"
              :items="['a', 'b', 'c']"
              label="Requirements (optional)"
              placeholder="select some requirement(s)"
              outlined
              dense
              chips
              small-chips
              multiple
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import '@pnp/sp/presets/core';
import '@pnp/sp/items';
import { ICourse } from '@/models/course';

function createCourse(): ICourse {
  return {
    Title: null,
    Description: null,
    Category: null,
    Requirements: [],
  };
}

export default Vue.extend({
  data: () => ({
    initializing: true,
    requirements: [],
    course: null as ICourse | null,
  }),
  async created() {
    try {
      if (this.$route.params.id) {
        const id = Number(this.$route.params.id);
        this.course = await this.$sp.web
          .lists.getByTitle('Courses')
          .items.select('*', 'Category/Id', 'Category/Title')
          .expand('Category').getById(id)
          .get<ICourse>();
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (!this.course) {
        this.course = createCourse();
      }

      setTimeout(() => {
        this.initializing = false;
      }, 100);
    }
  },
  computed: {
    editing(): boolean {
      return this.course != null;
    },
  },
  methods: {
    back() {
      this.$router.back();
    },
  },
});
</script>
