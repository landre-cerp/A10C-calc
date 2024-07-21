import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/LoadPage.vue') },
      { path: '/Load', component: () => import('pages/LoadPage.vue') },
      {
        path: '/TakeOff',
        component: () => import('src/pages/TakeOffPage.vue'),
      },
      { path: '/Flight', component: () => import('src/pages/FlightPage.vue') },
      {
        path: '/Landing',
        component: () => import('src/pages/LandingPage.vue'),
      },
      { path: '/Brief', component: () => import('src/pages/BriefPage.vue') },
      { path: '/Dcs', component: () => import('src/pages/DcsConnectPage.vue') },
      { path: '/About', component: () => import('src/pages/AboutPage.vue') },
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
