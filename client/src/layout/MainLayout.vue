<script setup lang="ts">
import { FwbNavbarLink } from 'flowbite-vue'
import StackedLayout from './StackedLayout.vue'
import { useAuthStore } from '@/stores/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { trpc } from '@/trpc'

const router = useRouter()
const auth = useAuthStore()

const links = computed(() => [
  { label: 'Articles', name: 'Home' },
  ...(auth.isLoggedIn
    ? [{ label: 'Write an article', name: 'WriteArticle' }]
    : [
        { label: 'Login', name: 'Login' },
        { label: 'Signup', name: 'Signup' },
      ]),
])

async function logoutUser() {
  try {
    await trpc.user.logout.mutate()
    auth.checkAuthStatus()
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <StackedLayout :links="links">
    <template #menu>
      <FwbNavbarLink v-if="auth.isLoggedIn" @click.prevent="logoutUser" link="#">
        Logout
      </FwbNavbarLink>
    </template>
  </StackedLayout>
</template>
