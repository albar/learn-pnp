import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/course',
  },
  {
    path: '/course',
    component: () => import('@/views/Course/List.vue'),
    meta: {
      breadcrumbs: ['Course'],
    },
  },
  {
    path: '/course/create',
    component: () => import('@/views/Course/Form.vue'),
    meta: {
      breadcrumbs: ['Course', 'Create'],
    },
  },
  {
    path: '/course/:id',
    component: () => import('@/views/Course/Detail.vue'),
    meta: {
      breadcrumbs: ['Course', 'Detail'],
    },
  },
  {
    path: '/course/:id/edit',
    component: () => import('@/views/Course/Form.vue'),
    meta: {
      breadcrumbs: ['Course', 'Edit'],
    },
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
