<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { FwbInput } from 'flowbite-vue'
import { useAuth0 } from '@auth0/auth0-vue'

const name = ref('')
const { isAuthenticated, loginWithRedirect } = useAuth0()

onMounted(async () => {
  if (!isAuthenticated.value) {
    await loginWithRedirect({
      appState: { returnTo: '/gift-exchanges' }
    })
  }
})
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <div>
      <h2>Draw Names Online</h2>
      <p>
        Draw names for gifts online with Happy Giftlist. Easily add gifts and invite participants
        for a quick and simple gift exchange.
      </p>
    </div>
    <div>
      <fwb-input v-model="name" placeholder="enter your first name" label="First name" />
    </div>
  </div>
</template>
