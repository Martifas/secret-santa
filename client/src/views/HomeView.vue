<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated } = useAuth0()
</script>
<template>
  <div
    class="h-96 min-h-[400px] w-full bg-[url(https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center"
  >
    <div class="container mx-auto max-w-7xl flex-col items-center justify-between px-4 py-8">
      <div class="text-white">
        <h2 class="text-3xl font-bold [text-shadow:_1px_1px_1px_rgb(0_0_0)]">
          Online Wishlist Maker and Secret Santa Generator
        </h2>
        <p class="[text-shadow:_1px_1px_0px_rgb(0_0_0)]">
          Create your personal wishlist online or organize a Secret Santa with our easy-to-use tool.
          Quickly add and reserve gifts with convenience!
        </p>
      </div>
      <div class="text-md mx-auto mt-20 flex w-40 flex-col items-center">
        <router-link
          v-if="isAuthenticated"
          :to="{ name: 'Dashboard' }"
          class="m-2 w-3xs rounded-sm bg-green-900  shadow-gray-800 p-2 text-center text-white shadow-md hover:bg-green-700"
        >
          Dashboard
        </router-link>
        <router-link
          :to="{ name: 'Wishlist' }"
          class="m-2 w-3xs rounded-sm bg-green-900 shadow-gray-800 p-2 text-center text-white shadow-md hover:bg-green-700"
        >
          Create Wishlist
        </router-link>
        <router-link
          :to="{ name: 'Exchange' }"
          class="m-2 w-3xs rounded-sm shadow-gray-900 bg-green-800 p-2 text-center text-white shadow-md hover:bg-green-700"
        >
          Create Exchange Event
        </router-link>
      </div>
    </div>
  </div>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="order-1 my-auto sm:order-1">
        <div>
          <h3 class="pb-1 text-2xl font-bold">Create Your Own</h3>
          <router-link :to="{ name: 'Wishlist' }" class="rounded-sm">
            <h3 class="text-2xl font-bold text-green-900 hover:text-green-700">Wishlist</h3>
          </router-link>

          <p class="mt-2">
            Happy Giftlist is the ultimate solution for creating your online wishlist. Say goodbye
            to duplicate gifts and save time with our simple, user-friendly tool.
          </p>
        </div>
      </div>
      <div class="order-2 sm:order-2">
        <img
          src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="gifts_pile"
          class="h-auto max-h-[300px] w-full max-w-xl rounded-xl object-cover"
        />
      </div>
      <div class="order-3 my-auto sm:order-4">
        <div>
          <h3 class="text-2xl font-bold">Quick and Easy</h3>
          <router-link :to="{ name: 'Exchange' }" class="rounded-sm">
            <h3 class="text-2xl font-bold text-green-900 hover:text-green-700">Gift Exchange</h3>
          </router-link>
          <p class="mt-2">
            Draw names for your Secret Santa or gift exchange with Happy Giftlist's free online
            Secret Santa Generator. Our user-friendly tool simplifies organizing your group's gift
            exchange, and the best part is, it's completely free!
          </p>
        </div>
      </div>
      <div class="order-4 sm:order-3">
        <img
          src="https://images.unsplash.com/photo-1497700003451-e1df943a194b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="second_image"
          class="h-auto max-h-[300px] w-full max-w-xl rounded-xl object-cover"
        />
      </div>
    </div>
  </div>
</template>
