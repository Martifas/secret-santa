<script setup lang="ts">
import { ref } from 'vue'
import { FwbInput } from 'flowbite-vue'

const name = ref('')
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
