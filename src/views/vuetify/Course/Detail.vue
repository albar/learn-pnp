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
import { ICourse, ICourseCategory } from '@/models/course';

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
    item: null as ICourse | null,
  }),
  async created() {
    try {
      if (this.$route.params.id) {
        const id = Number(this.$route.params.id);

        const course = await this.$sp.web
          .lists.getByTitle('Courses')
          .items.getById(id)
          .expand('Category')
          .select('*', 'Category/Id', 'Category/Title')
          .get();

        this.item = {
          Id: course.Id,
          Title: course.Title,
          Description: course.Description,
          Category: course.Category,
          Created: new Date(course.Created),
          Modified: new Date(course.Modified),
        };

        const requirements = await this.$sp.web
          .lists.getByTitle('CoursesDependencies')
          .items.filter(`ChildId eq ${id}`)
          .expand('Parent')
          .select('Parent/Id', 'Parent/Title', 'Parent/Description', 'Parent/CategoryId')
          .getAll();

        let categoriesIds = requirements.map((req) => req.Parent.CategoryId);

        const categories: ICourseCategory[] = [];

        if (this.item?.Category) {
          categoriesIds = categoriesIds.filter((cId) => cId !== this.item?.Category?.Id);
          categories.push(this.item.Category);
        }

        if (categoriesIds.length > 0) {
          categories.push(
            ...await this.$sp.web
              .lists.getByTitle('CourseCategory')
              .items.filter(categoriesIds.map((cId) => `Id eq ${cId}`).join(' or '))
              .get<ICourseCategory[]>(),
          );
        }

        const dcat: {[key: number]: ICourseCategory} = {};

        // eslint-disable-next-line no-restricted-syntax
        for (const cat of categories) {
          dcat[cat.Id] = cat;
        }

        this.item.Requirements = requirements.map((req) => {
          const parent = req.Parent;
          return {
            Id: parent.Id,
            Title: parent.Title,
            Description: parent.Description,
            Category: dcat[parent.CategoryId],
          };
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.initializing = false;
    }
  },
  computed: {
    course(): ICourse {
      if (this.item) {
        return this.item;
      }
      return staticCourse;
    },
  },
});
</script>
