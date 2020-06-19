import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Main from '../views/Main.vue';

Vue.use(VueRouter);

function buildRoutes(parent: string): RouteConfig[] {
  return [
    {
      path: '',
      redirect: '/vuetify/course',
    },
    {
      path: 'course',
      component: () => import(`@/views/${parent}/Course/List`),
      meta: {
        breadcrumbs: ['Course'],
      },
    },
    {
      path: 'course/create',
      component: () => import(`@/views/${parent}/Course/Form`),
      meta: {
        breadcrumbs: ['Course', 'Create'],
      },
    },
    {
      path: 'course/:id',
      component: () => import(`@/views/${parent}/Course/Detail`),
      meta: {
        breadcrumbs: ['Course', 'Detail'],
      },
    },
    {
      path: 'course/:id/edit',
      component: () => import(`@/views/${parent}/Course/Form`),
      meta: {
        breadcrumbs: ['Course', 'Edit'],
      },
    },
  ];
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/vuetify/course',
  },
  {
    path: '/vuetify',
    children: buildRoutes('vuetify'),
    component: Main,
    meta: {
      title: 'Vuetify',
    },
  },
  // {
  //   path: '/diy',
  //   children: buildRoutes('diy'),
  //   component: Main,
  //   meta: {
  //     title: 'Diy',
  //   },
  // },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
