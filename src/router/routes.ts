import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/Load', component: () => import('pages/LoadPage.vue') },
      { path: '/Airfield', component: () => import('pages/AirfieldPage.vue') },
      { path: '/Flight', component: () => import('src/pages/FlightPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
