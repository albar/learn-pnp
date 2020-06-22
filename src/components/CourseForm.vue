<template>
  <v-form class="px-4">
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-text-field
            label="Course Title"
            placeholder="type the course title"
            v-model="course.Title"
            flat
            dense
            outlined
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="course.Category"
            label="Category"
            placeholder="select the category"
            :items="categories"
            item-text="Title"
            :item-value="item => item"
            :value-comparator="(a,b) => a && b && a.Id === b.Id"
            flat
            dense
            outlined
          >
            <template v-slot:prepend-item>
              <v-list-item ripple @click="uncategorize">
                <v-list-item-content>
                  <v-list-item-title>Uncategorized</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea
            label="Description"
            placeholder="type the course description"
            v-model="course.Description"
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
            v-model="course.Requirements"
            :items="courses"
            item-text="Title"
            :item-value="item => item"
            :value-comparator="(a,b) => a.Id === b.Id"
            label="Requirements (optional)"
            placeholder="select some requirement(s)"
            flat
            small-chips
            outlined
            multiple
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import { ICourse, Mapper as CourseMapper } from '@/models/course';
import { ICourseCategory, Mapper as CategoryMapper } from '@/models/category';

export default Vue.extend({
  props: {
    courseId: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: null,
    },
    category: {
      type: Object,
      default: (): ICourse|null => null,
    },
    description: {
      type: String,
      default: null,
    },
    requirements: {
      type: Array,
      default: (): ICourse[] => [],
    },
  },
  data: () => ({
    course: {
      Id: 0,
      Title: null,
      Description: null,
      Category: null,
      Requirements: [],
    } as ICourse,
    courses: [] as ICourse[],
    categories: [] as ICourseCategory[],
    initialization: null as Promise<void> | null,
  }),
  watch: {
    async title(value) {
      await this.initialization;
      if (this.course.Title !== value) {
        this.course.Title = value;
      }
    },
    async category(value: ICourseCategory|null) {
      await this.initialization;
      if (this.course.Category && value && this.course.Category.Id === value.Id) return;
      this.course.Category = value;
    },
    async description(value) {
      await this.initialization;
      if (this.course.Description !== value) {
        this.course.Description = value;
      }
    },
    async requirements(value: ICourse[]) {
      await this.initialization;

      if (value.length === 0) {
        if (this.course.Requirements.length > 0) {
          this.course.Requirements = [];
        }
        return;
      }

      if (value.length === this.course.Requirements.length
        && value.every((v) => this.course.Requirements.some((o) => v.Id === o.Id))) {
        return;
      }

      this.course.Requirements = value;
    },
    'course.Title': function CourseTitleUpdated(value) {
      this.$emit('update:title', value);
    },
    'course.Description': function CourseDescriptionUpdated(value) {
      this.$emit('update:description', value);
    },
    'course.Category': function CourseCategoryUpdated(value: ICourseCategory) {
      this.$emit('update:category', value);
    },
    'course.Requirements': function CourseRequirementsUpdated(value: ICourse[], old: ICourse[]) {
      if (value.length === old.length && value.every((c) => old.some((o) => c.Id === o.Id))) {
        return;
      }

      this.$emit('update:requirements', value);
    },
  },
  created() {
    this.initialization = this.initialize();
  },
  methods: {
    async initialize() {
      const coursesRequest = this.$sp.web.lists.getByTitle('Courses')
        .items.filter(`Id ne ${this.courseId}`)
        .get();
      const categoriesRequest = this.$sp.web.lists.getByTitle('CourseCategories')
        .items.getAll();

      this.course.Id = this.courseId;
      this.course.Title = this.title;
      this.course.Description = this.description;
      this.course.Requirements = this.requirements as ICourse[];

      if (this.category) {
        this.course.Category = this.category;
      }

      this.categories = CategoryMapper.mapAll(await categoriesRequest);
      this.courses = CourseMapper.mapAll(await coursesRequest);
    },
    uncategorize() {
      this.course.Category = null;
    },
  },
});
</script>
