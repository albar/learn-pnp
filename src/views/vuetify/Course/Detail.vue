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
      </template>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import '@pnp/sp/presets/core';
import '@pnp/sp/items';
import { ICourse } from '@/models/course';

const staticCourse: ICourse = {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: [] as any[],
  }),
  async created() {
    try {
      if (this.$route.params.id) {
        const id = Number(this.$route.params.id);
        this.items = await this.$sp.web
          .lists.getByTitle('CoursesDependencies')
          .items.filter(`Child eq ${id}`)
          .expand('Child', 'Child/Category', 'Parent', 'Parent/Category')
          .select(
            'Child/Id', 'Child/Title', 'Child/Description',
            'Child/Category/Id', 'Child/Category/Title',
            'Parent/Id', 'Parent/Title', 'Parent/Description',
            'Parent/Category/Id', 'Parent/Category/Title',
          )
          .get();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.initializing = false;
    }
  },
  computed: {
    course(): ICourse {
      if (this.items && this.items.length > 0) {
        const course = this.items[0].Child;
        const requirements: ICourse[] = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const item of this.items) {
          if (!item.Parent) {
            // eslint-disable-next-line no-continue
            continue;
          }

          requirements.push({
            Id: item.Parent.Id,
            Title: item.Parent.Title,
            Description: item.Parent.Description,
            Category: item.Parent.Category,
          });
        }

        return {
          Id: course.Id,
          Title: course.Title,
          Description: course.Description,
          Category: course.Category,
          Requirements: requirements,
          Created: new Date(course.Created),
          Modified: new Date(course.Modified),
        };
      }
      return staticCourse;
    },
  },
});
</script>
