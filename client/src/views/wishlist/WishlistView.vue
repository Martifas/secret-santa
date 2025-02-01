<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import ActionButton from '@/components/ActionButton.vue'
import Container from '@/components/Container.vue'
import InsctructionsContainer from '@/components/instructions/InsctructionsContainer.vue'
import { trpc } from '@/trpc'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useWishlistStore } from '@/stores/wishlistStore'

const isLoading = ref(false)
const { user } = useAuth0()
const router = useRouter()
const wishlistStore = useWishlistStore()

interface WishlistForm {
  title: string
  description: string
}

const form = ref<WishlistForm>({
  title: '',
  description: '',
})

async function createWishlist() {
  isLoading.value = true
  try {
    if (!user.value?.sub) {
      throw new Error('User not authenticated')
    }
    const createdWishlistId = await trpc.userWishlist.createUserWishlist.mutate({
      title: form.value.title,
      description: form.value.description,
      userId: user.value.sub,
    })

    wishlistStore.setWishlistDetails(form.value.title, form.value.description)

    form.value = {
      title: '',
      description: '',
    }

    router.push({
      name: 'WishlistItems',
      params: {
        id: createdWishlistId,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create wishlist:', error.message)
    } else {
      console.error('Failed to create wishlist:', error)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Container>
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
            <label for="title" class="mb-2 block text-sm font-medium text-gray-900"
              >Enter the title of your wishlist</label
            >
            <input
              type="text"
              id="title"
              v-model="form.title"
              placeholder="Title"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-md focus:border-blue-500 focus:ring-blue-500"
            />

            <label for="description" class="mb-2 block text-sm font-medium text-gray-900"
              >Enter the description of your wishlist</label
            >

            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-md focus:border-blue-500 focus:ring-blue-500"
              placeholder="Description"
            ></textarea>
          </div>

          <div class="flex justify-center text-sm sm:justify-end!">
            On the next page you can add your gifts.
          </div>
          <div class="flex w-full flex-row justify-center sm:justify-end!">
            <ActionButton type="submit" :loading="isLoading" variant="primary" size="md">
              Create wishlist
              <ArrowRightIcon class="my-auto ml-2 inline size-5 cursor-pointer" />
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
    <InsctructionsContainer>
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
    </InsctructionsContainer>
  </Container>
</template>
