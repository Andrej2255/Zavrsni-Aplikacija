const routes = [
  { path: '/login', component: () => import('@/pages/LoginPage.vue') },
  { path: '/register', component: () => import('@/pages/RegisterPage.vue') },

  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
      { path: 'exercises', component: () => import('@/pages/ExerciseLibraryPage.vue') },
      { path: 'plans', component: () => import('@/pages/PlansPage.vue') },
      { path: 'plans/:id', component: () => import('@/pages/PlanEditorPage.vue') },
      { path: 'schedule', component: () => import('@/pages/SchedulePage.vue') },
      { path: 'sessions', component: () => import('@/pages/HistoryPage.vue') },
      { path: 'sessions/:id', component: () => import('@/pages/WorkoutSessionPage.vue') },
      { path: 'progress', component: () => import('@/pages/ProgressPage.vue') },
      { path: 'goals', component: () => import('@/pages/GoalsPage.vue') },
      { path: 'profile', component: () => import('@/pages/ProfilePage.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
