<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const { isLoading } = useAuth0()
</script>

<template>
  <div v-if="isLoading" class="flex min-h-screen items-center justify-center">Loading...</div>
  <RouterView v-else />
</template>
