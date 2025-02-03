<template>
  <Container>
    <div class="flex flex-col justify-center rounded-lg bg-white p-8 shadow-lg md:flex-row">
      <div
        class="h-full w-full hidden sm:block max-w-[500px] overflow-hidden rounded-lg object-cover object-center"
      >
        <img
          src="https://images.unsplash.com/photo-1507208773393-40d9fc670acf?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Typing on laptop"
          class="rounded-lg shadow-md"
        />
      </div>
      <div class="mt-6 my-auto md:ml-8 md:w-1/2 max-w-[300px]">
        <h2 class="text-3xl font-bold text-gray-900">Our Story</h2>
        <h3 class="mt-2 text-xl text-gray-700">The Joy of Giving and Receiving Gifts</h3>
        <p class="mt-4 text-gray-600">
          At GiftMeister, we believe the joy of giving and receiving gifts should be simple, not
          stressful. Our platform makes it easy to create and share wishlists, organize Secret Santa
          events, and simplify the entire process.
        </p>
        <p class="mt-4 text-gray-600">
          With GiftMeister, users can easily create personal wishlists, add gifts from any online
          store, and share them with friends and family. Our platform keeps all your gift ideas
          organized, ensuring you get exactly what you want while avoiding duplicates.
        </p>
        <p class="mt-4 text-gray-600">
          Our team built GiftMeister with user experience in mind. Whether you're planning a
          birthday, gift exchange, or keeping track of future gift ideas, our platform is here to
          help. Sign up now and enjoy stress-free gifting today.
        </p>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
import Container from '@/components/Container.vue'
</script>
