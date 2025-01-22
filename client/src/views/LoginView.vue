<script lang="ts" setup>
import { ref } from 'vue'
import PageForm from '../components/PageForm.vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import { useRouter } from 'vue-router'
import useErrorMessage from '../composables/userErrorMessage/'
import { useAuthStore } from '@/stores/user'
import { trpc } from '@/trpc'

const router = useRouter()
const auth = useAuthStore()

const userForm = ref({
  email: '',
  password: '',
})
const [submitLogin, errorMessage] = useErrorMessage(async () => {
  try {
    const result = await trpc.user.login.mutate(userForm.value)
    if (result.success) {
      auth.checkAuthStatus()
      const redirectTo = (router.currentRoute.value.query.redirect as string) ?? {
        name: 'Home',
      }
      router.push(redirectTo)
    }
  } catch (error) {
    console.error('Full login error:', error) // Add detailed error logging

    // More specific error handling
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`)
    } else {
      throw new Error('Login failed due to an unexpected error')
    }
  }
})
</script>

<template>
  <PageForm heading="Log in to your account" formLabel="Login" @submit="submitLogin">
    <template #default>
      <FwbInput
        label="Email"
        type="email"
        autocomplete="username"
        v-model="userForm.email"
        :required="true"
      />
      <FwbInput
        label="Password"
        id="password"
        name="password"
        type="password"
        autocomplete="current-password"
        v-model="userForm.password"
        :required="true"
      />
      <FwbAlert v-if="errorMessage" data-testid="errorMessage" type="danger">
        {{ errorMessage }}
      </FwbAlert>
      <div class="grid">
        <FwbButton color="default" type="submit" size="xl">Log in</FwbButton>
      </div>
    </template>
    <template #footer>
      <FwbAlert class="bg-transparent text-center">
        Not a member?
        <RouterLink
          to="/signup"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </RouterLink>
        <br />
        or go
        <RouterLink to="/" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          back home
        </RouterLink>
      </FwbAlert>
    </template>
  </PageForm>
</template>
