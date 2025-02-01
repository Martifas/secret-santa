<script setup lang="ts">
defineProps<{
  id: string
  response: 'accept' | 'refuse'
  eventId: number
}>()
</script>

<template>
  <div class="flex justify-center p-6">
    <div v-if="response === 'accept'" class="max-w-4xl text-center">
      <p class="mb-4 text-2xl">Welcome to the Gift Exchange!</p>
      <!-- Additional welcome content can go here -->
    </div>

    <div v-else class="max-w-4xl">
      <div class="mb-12 text-center">
        <p class="mb-4 text-2xl">Thanks for letting us know!</p>
        <p class="mb-6">
          While you can't join this time, here are some other ways to join the fun:
        </p>

        <div class="mb-8 flex flex-col items-center gap-4">
          <button
            class="w-sm rounded-lg bg-green-900 px-4 py-2 text-white hover:bg-green-700 sm:w-lg"
          >
            Create Your Own Gift Exchange
          </button>
          <button
            class="w-sm rounded-lg bg-green-900 px-4 py-2 text-white hover:bg-green-700 sm:w-lg"
          >
            Start Your Wishlist
          </button>
        </div>
      </div>

      <div class="mt-8 rounded-lg border border-gray-300 p-8">
        <div>
          <h2 class="text-xl font-bold">Start Your Own Gift Exchange</h2>
          <p class="py-2">
            Can't make it to this one? Why not organize your own gift exchange at a time that works
            for you? It's a great way to bring friends and family together!
          </p>
        </div>

        <div>
          <h2 class="pt-7 pb-2 text-xl font-bold">Easy Steps to Get Started</h2>
          <ul class="list-disc space-y-2 pl-5">
            <li><b>Pick a date:</b> Choose a time that works best for your group</li>
            <li><b>Invite your people:</b> We'll help you send out invitations</li>
            <li><b>Set the rules:</b> Budget, theme, or keep it simple - it's up to you!</li>
            <li><b>Let the matching begin:</b> We'll handle the random assignments</li>
          </ul>
        </div>

        <div>
          <h2 class="mt-7 pb-2 text-xl font-bold">Or Create a Wishlist Instead</h2>
          <p class="py-2">
            Not ready to organize but want to join the gift-giving spirit? Start by creating your
            wishlist:
          </p>
          <ul class="list-disc space-y-2 pl-5">
            <li><b>Share your interests:</b> Let others know what you'd love to receive</li>
            <li><b>Make gift-giving easier:</b> Help friends and family choose the perfect gift</li>
            <li><b>Stay organized:</b> Keep track of gift ideas year-round</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
