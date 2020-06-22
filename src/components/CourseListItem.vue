<template>
  <v-list-item>
    <template>
      <v-list-item-content>
        <v-list-item-title class="d-flex">
          <b>{{ course.Title }}</b>
          <v-chip
            v-if="course.Category"
            x-small
            class="mx-2 px-1"
            outlined
            label
          >
            {{ course.Category.Title }}
          </v-chip>
        </v-list-item-title>
        <v-list-item-subtitle v-text="course.Description"></v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <div>
          <v-icon
            v-if="course.Modified && course.Created &&
              course.Modified.getTime() > course.Created.getTime()"
            left small
          >mdi-pencil</v-icon>
          <v-list-item-action-text
            v-text="course.Modified || course.Created"
          ></v-list-item-action-text>
        </div>
        <div>
          <v-btn v-if="viewable"
            @click="view"
            text small
            color="primary"
          >View</v-btn>
          <v-btn v-if="editable"
            @click="edit"
            text small
            color="secondary"
          >Edit</v-btn>
        </div>
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  props: {
    course: {
      type: Object,
      required: true,
    },
    viewable: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    viewLink: {
      type: String,
      default: null,
    },
    editLink: {
      type: String,
      default: null,
    },
  },
  methods: {
    view() {
      if (this.viewLink) {
        this.$router.push(this.viewLink);
      } else {
        this.$emit('view');
      }
    },
    edit() {
      if (this.editable) {
        this.$router.push(this.editLink);
      } else {
        this.$emit('edit');
      }
    },
  },
});
</script>
