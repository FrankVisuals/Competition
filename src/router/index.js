import { createRouter, createWebHistory } from "vue-router"
import PublicLayout from "../layouts/PublicLayout.vue"
import AuthLayout from "../layouts/AuthLayout.vue"
import HomeView from "../views/HomeView.vue"
import DashboardView from "../views/DashboardView.vue"
import CompetitionsView from "../views/CompetitionsView.vue"
import ProfileView from "../views/ProfileView.vue"
import LoginView from "../views/LoginView.vue"
import RegisterView from "../views/RegisterView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/auth",
      name: "auth",
      component: PublicLayout,
      children: [
        {
          path: "login",
          name: "login",
          component: LoginView
        },
        {
          path: "register",
          name: "register",
          component: RegisterView
        }
      ]
    },
    {
      path: "/tracker",
      name: "tracker",
      component: AuthLayout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: DashboardView
        },
        {
          path: "/competitions",
          name: "competitions",
          component: CompetitionsView
        },
        {
          path: "/profile",
          name: "profile",
          component: ProfileView
        }
      ]
    }
  ]
})

export default router
