<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { setTokenGetter } from './trpc'
import { onMounted } from 'vue'

const { isLoading, getAccessTokenSilently } = useAuth0()

onMounted(() => {
  setTokenGetter(() => getAccessTokenSilently())
})
</script>

<template>
  <div v-if="isLoading" class="flex min-h-screen items-center justify-center">Loading...</div>
  <RouterView v-else />
</template>
