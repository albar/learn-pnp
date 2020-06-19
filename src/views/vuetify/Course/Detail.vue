<template>
  <div v-if="!initializing">
    <portal to="page-action">
      <v-btn text small color="secondary" exact to="/vuetify/course" class="mr-2">Back</v-btn>
      <v-menu offset-y left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs" v-on="on"
            text
            small
            depressed
            style="padding: 0; min-width: unset;"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list elevation="0" nav flat dense>
          <v-list-item :to="`/vuetify/course/${$route.params.id}/edit`">
            <v-list-item-icon left>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item inactive color="red">
            <v-list-item-icon left>
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </portal>
    <v-container class="px-4">
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h4 class="text-h4">{{ item.Title }}</h4>
          <v-chip
            v-if="item.Category"
            small
            class="ma-2"
            outlined
            label
          >
            {{ item.Category.Title }}
          </v-chip>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          {{ item.Description }}
        </v-col>
      </v-row>
      <h5 class="text-subtitle-2 text-decoration-underline">
        This course requires the following courses to be taken fisrt
      </h5>
      <v-row>
        <template v-for="requirement in item.Requirements">
          <v-col :key="requirement.Id" cols="auto">
            <v-card outlined>
              <v-card-title>
                {{ requirement.Title }}
                <v-chip
                  v-if="requirement.Category"
                  small
                  class="ma-2"
                  outlined
                  flat
                  label
                >
                  {{ requirement.Category.Title }}
                </v-chip>
              </v-card-title>
              <v-card-text v-text="requirement.Description"></v-card-text>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ICourse } from '@/models/course';

const course: ICourse = {
  Id: 1,
  Title: 'New Course',
  Description: 'New Course Description',
  Category: {
    Id: 1,
    Title: 'Category B',
  },
  Created: new Date(),
  Modified: new Date(),
  Requirements: [
    {
      Id: 1,
      Title: 'Another Course',
      Description: 'New Course Description',
      Category: {
        Id: 1,
        Title: 'Category B',
      },
      Created: new Date(),
      Modified: new Date(),
    },
    {
      Id: 2,
      Title: 'Yet Another Course',
      Description: 'New Course Description',
      Category: {
        Id: 1,
        Title: 'Category B',
      },
      Created: new Date(),
      Modified: new Date(),
    },
  ],
};

export default Vue.extend({
  data: () => ({
    initializing: true,
    course: null as ICourse | null,
  }),
  async created() {
    try {
      if (this.$route.params.id) {
        const id = Number(this.$route.params.id);
        this.course = await this.$sp.web
          .lists.getByTitle('Courses')
          .items.getById(id)
          .expand('Category')
          .select('*', 'Category/Id', 'Category/Title')
          .get<ICourse>();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.initializing = false;
    }
  },
  computed: {
    item(): ICourse {
      if (this.course) return this.course;
      return course;
    },
  },
});
</script>
