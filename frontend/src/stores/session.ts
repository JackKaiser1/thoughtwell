import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSessionStore = defineStore("session", () => {
  const isLoggedIn = ref(false);

  function loginSession() {
    isLoggedIn.value = true;
  }

  function logoutSession() {
    isLoggedIn.value = false;
  }

  return { loginSession, logoutSession, isLoggedIn };
});