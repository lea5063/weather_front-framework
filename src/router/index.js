import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/map',
    name: 'WeatherMap',
    component: () => import('../views/WeatherMapView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 새 화면은 상단에서 시작하고 브라우저 뒤로가기는 이전 스크롤 위치를 복원하기 위해 생성했습니다.
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

export default router
