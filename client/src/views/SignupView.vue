<script lang="ts" setup>
import { ref } from 'vue'
import PageForm from '../components/PageForm.vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import { DEFAULT_SERVER_ERROR } from '../consts'
import AlertError from '../components/AlertError.vue'
import { trpc } from '@/trpc'
import { useAuthStore } from '@/stores/user'

const auth = useAuthStore()

const userForm = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

const hasSucceeded = ref(false)
const errorMessage = ref('')

async function submitSignup() {
  try {
    const response = await trpc.user.signup.mutate({
      email: userForm.value.email,
      password: userForm.value.password,
      firstName: userForm.value.firstName,
      lastName: userForm.value.lastName,
    })

    // If we got a response (string), signup was successful
    if (response) {
      errorMessage.value = ''
      hasSucceeded.value = true
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
  }
}
</script>

<template>
  <PageForm heading="Sign up for an account" formLabel="Signup" @submit="submitSignup">
    <template #default>
      <FwbInput
        data-testid="firstName"
        label="First Name"
        type="text"
        v-model="userForm.firstName"
        :required="true"
      />
      <FwbInput
        data-testid="lastName"
        label="Last Name"
        type="text"
        v-model="userForm.lastName"
        :required="true"
      />
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
      <FwbAlert v-if="hasSucceeded" data-testid="successMessage" type="success">
        You have successfully signed up! You can now log in.
        <RouterLink
          to="/login"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Go to the login page
        </RouterLink>
      </FwbAlert>
      <AlertError :message="errorMessage">
        {{ errorMessage }}
      </AlertError>
      <div class="grid">
        <FwbButton color="default" type="submit" size="xl">Sign up</FwbButton>
      </div>
    </template>
    <template #footer>
      <FwbAlert class="bg-transparent text-center">
        Already a member?
        {{ ' ' }}
        <RouterLink
          to="/login"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Log in
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
