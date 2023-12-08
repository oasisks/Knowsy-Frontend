import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import EventComponent from "../components/Event/EventComponent.vue";
import AnnouncementView from "../views/AnnouncementView.vue";
import HomeFeedView from "../views/HomeFeedView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import PostView from "../views/PostView.vue";
import ProfileView from "../views/ProfileView.vue";
import ProjectView from "../views/ProjectView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/feed",
      name: "HomeFeed",
      component: HomeFeedView,
    },
    {
      path: "/announcements/:_id",
      name: "Announcement",
      component: AnnouncementView,
      meta: { requiresAuth: true },
    },
    {
      path: "/projects/:_id",
      name: "Projects",
      component: ProjectView,
      meta: { requireAuth: true },
    },
    {
      path: "/projects/:_id/events",
      name: "Events",
      component: EventComponent,
      meta: { requireAuth: true },
    },
    {
      path: "/posts/:_id",
      name: "Posts",
      component: PostView,
      meta: { requireAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
