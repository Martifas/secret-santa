<script setup lang="ts">
import { GiftIcon, SparklesIcon, HomeIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Home', to: { name: 'Home' }, icon: HomeIcon, current: false },
  { name: 'Gift Exchange', to: { name: 'Exchange' }, icon: GiftIcon, current: false },
  { name: 'Create Wishlist', to: { name: 'Wishlist' }, icon: SparklesIcon, current: false },
  { name: 'About', to: { name: 'About' }, icon: InformationCircleIcon, current: false },
]
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-300 bg-white">
    <div class="mx-auto w-full max-w-screen-xl px-4 py-6 md:py-8">
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-2">
          <router-link
            class="flex items-center transition-opacity hover:opacity-80"
            :to="{ name: 'Home' }"
          >
            <img
              class="-ml-2 h-8 w-auto"
              src="https://i.ibb.co/6ytXyyw/gift-meister-final.png"
              alt="Gift Meister"
            />
          </router-link>
          <p class="text-sm text-gray-600">Making gift exchanges magical, Secret Santa simple.</p>
        </div>
        <nav class="flex flex-col sm:flex-row gap-1 sm:gap-4">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-green-800"
            :class="[
              item.current ? 'text-green-900 underline' : 'text-black hover:text-green-900',
              'rounded-md px-3 py-2 text-sm font-bold',
            ]"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.name }}
          </router-link>
        </nav>
      </div>
      <hr class="my-6 border-gray-200" />
      <div class="flex items-center justify-center text-sm text-gray-500">
        <p>© {{ currentYear }} Gift Meister™. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>