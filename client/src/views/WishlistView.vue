<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FwbInput } from 'flowbite-vue'
import { useAuth0 } from '@auth0/auth0-vue'

const name = ref('')
const { isAuthenticated, loginWithRedirect } = useAuth0()

onMounted(async () => {
  if (!isAuthenticated.value) {
    await loginWithRedirect({
      appState: { returnTo: '/gift-exchanges' },
    })
  }
})
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <div>
      <h2>Wishlist</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae natus earum dolor vel.
        Animi impedit vitae iure optio laboriosam aut pariatur aperiam doloribus suscipit!
        Reprehenderit unde ex iusto ipsam doloremque?
      </p>
    </div>
    <div>
      <fwb-input v-model="name" placeholder="enter your first name" label="First name" />
    </div>
  </div>
</template>
