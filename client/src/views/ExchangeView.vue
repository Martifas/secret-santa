<script setup lang="ts">
import { ref } from 'vue'
import { FwbInput } from 'flowbite-vue'

const name = ref('')
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
