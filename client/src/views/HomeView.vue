<template>
  <div
    class="h-96 min-h-[300px] w-full bg-[url(https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center"
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
      <div class="text-md mx-auto flex w-40 flex-col mt-20">
        <a class="m-2 rounded-sm bg-green-900 p-2 text-center text-white hover:bg-green-700">
          Create Wishlist
        </a>
        <a class="m-2 rounded-sm bg-green-900 p-2 text-center text-white hover:bg-green-700">
          Draw Names
        </a>
      </div>
    </div>
  </div>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="order-1 my-auto sm:order-1">
        <div>
          <h3 class="text-2xl font-bold">Create Your Own</h3>
          <h3 class="text-2xl font-bold text-green-900">Wishlist</h3>
          <p>
            Happy Giftlist is the ultimate solution for creating your online wishlist. Say goodbye
            to duplicate gifts and save time with our simple, user-friendly tool.
          </p>
        </div>
      </div>
      <div class="order-2 sm:order-2">
        <img
          src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="gifts_pile"
          class="h-auto w-full max-w-xl rounded-xl max-h-[300px] object-cover"
        />
      </div>
      <div class="order-3 my-auto sm:order-4">
        <div>
          <h3 class="text-2xl font-bold">Quick and Easy</h3>
          <h3 class="text-2xl font-bold text-green-900">Draw Names</h3>
          <p>
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
          class="h-auto w-full max-w-xl rounded-xl max-h-[300px] object-cover"
        />
      </div>
    </div>
  </div>
</template>
