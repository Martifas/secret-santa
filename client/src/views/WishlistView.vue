<script setup lang="ts">
import { ref } from 'vue'
import { FwbInput, FwbTextarea } from 'flowbite-vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

const wishlistTitle = ref('')
const wishlistDescription = ref('')

async function createWishlist() {}
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <div class="mt-7 flex gap-6">
      <div class="relative hidden h-[600px] basis-1/2 md:block">
        <img
          class="h-full w-full max-w-[500px] overflow-hidden rounded-lg object-cover object-center"
          src="https://images.unsplash.com/photo-1639562954924-1928f7cda17c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Pile of gifts"
        />
      </div>
      <div class="basis-full md:basis-1/2">
        <div class="mb-8">
          <h2 class="mb-4 text-3xl font-bold">Create Your Online Wishlist</h2>
          <p class="text-gray-600">
            Create your wishlist online with Gift Meister. Eliminate duplicate gifts and save time
            with our user-friendly tool.
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="createWishlist">
          <div class="space-y-4">
            <FwbInput
              v-model="wishlistTitle"
              placeholder="Title"
              label="Enter the title of your wishlist"
              required
              class="bg-white"
            />

            <FwbTextarea
              v-model="wishlistDescription"
              placeholder="Description"
              label="Enter the description of your wishlist"
              :rows="5"
              class="bg-white"
              required
            />
          </div>

          <div class="flex justify-center text-sm sm:justify-end!">On the next page you can add your gifts.</div>
          <div class="flex w-full flex-row justify-center sm:justify-end!">
            <button
              type="submit"
              class="flex rounded-xl sm:px-8 sm:py-4 bg-green-900 px-4 py-2 text-center text-white hover:bg-green-700"
            >
              Create wishlist
              <ArrowRightIcon class="my-auto ml-2 inline size-5 cursor-pointer" />
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="mt-8 border-1 border-gray-300 p-8">
      <div>
        <h2 class="text-xl font-bold">How to Make Your Wishlist Online</h2>
        <p class="py-2">
          Got a birthday or holiday coming up? A wishlist makes it super easy to show your friends
          and family exactly what you'd love. It's all about making gift-giving simple and fun.
        </p>
        <p class="py-2">
          And hey, if your kids are too young or your grandparents aren't into technology, why not
          make a wishlist for them? It’s a nice way to help out.
        </p>
      </div>
      <div>
        <h2 class="pt-7 text-xl font-bold">How Does It Work?</h2>
        <p class="py-2">
          Setting up a wishlist on Gift Meister is easy as pie. Here’s how you can get started:
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li><b>Create your account:</b> Get started using Facebook or Google account.</li>
          <li>
            <b>Add a title and description: </b>
            Give a little context about your wishlist.
          </li>
          <li>
            <b>Add gifts: </b>
            You can paste a product’s URL, type in the name, or browse using our suggestion tool.
          </li>
          <li>
            <b>Share your wishlist: </b>
            Let others know by sharing a link.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Benefits of Creating a Wishlist</h2>
        <p class="py-2">Why create a wishlist? Check out these perks:</p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>No duplicates: </b> Everyone sees what's on your list, so you get what you need
            without the repeats.
          </li>
          <li>
            <b>Easy for your friends and family: </b>
            They can pick a gift you’ll love without having to guess.
          </li>
          <li>
            <b>Budget-friendly:</b>
            Keep track of what you've spent and save for what you really want.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Tips for Organizing Your Online Wishlist</h2>
        <p class="py-2">Want to keep your wishlist on point? Here are some tips:</p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>Be specific:</b> Everyone gets to experience the excitement and surprise as gifts are
            revealed.
          </li>
          <li><b>Be realistic:</b> Opt for gifts that are within reach.</li>
          <li>
            <b>Keep it updated:</b> Adjust your list as your preferences change or as you receive
            items.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Is Creating a Wishlist Free?</h2>
        <p class="py-2">Absolutely! You can set up as many wishlists as you like at no cost.</p>
      </div>
    </div>
  </div>
</template>
