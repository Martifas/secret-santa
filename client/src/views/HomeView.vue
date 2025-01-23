<template>
  <div
    class="h-80 min-h-[300px] w-full bg-[url(https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center"
  >
    <div class="flex h-full flex-col justify-between pb-20">
      <div class="mx-3 pt-8 text-white sm:mx-auto max-w-6xl">
        <h2 class="text-xl font-bold [text-shadow:_1px_1px_1px_rgb(0_0_0)]">
          Online Wishlist Maker and Secret Santa Generator
        </h2>
        <p class="[text-shadow:_1px_1px_0px_rgb(0_0_0)]">
          Create your personal wishlist online or organize a Secret Santa with our easy-to-use tool.
          Quickly add and reserve gifts with convenience!
        </p>
      </div>
      <div class="mx-auto flex w-36 flex-col text-sm">
        <a class="m-2 rounded-sm bg-green-900 p-2 text-center text-white hover:bg-green-700">
          Draw Names
        </a>
        <a class="m-2 rounded-sm bg-green-900 p-2 text-center text-white hover:bg-green-700">
          Create Wishlist
        </a>
      </div>
    </div>
  </div>
  <div className="mx-3 sm:mx-auto max-w-6xl">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-8">
      <div className="order-1 p-3 sm:order-1 my-auto">
        <div>
          <h3 className="font-bold text-2xl">Create Your Own</h3>
          <h3 className="font-bold text-2xl text-green-900">Wishlist</h3>
          <p>
            Happy Giftlist is the ultimate solution for creating your online wishlist. Say goodbye
            to duplicate gifts and save time with our simple, user-friendly tool.
          </p>
        </div>
      </div>
      <div className="order-2 p-3 sm:order-2">
        <img
          src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="gifts_pile"
          className="h-auto w-full rounded-xl"
        />
      </div>
      <div className="order-3 p-3 sm:order-4 my-auto">
        <div>
          <h3 className="font-bold text-2xl">Quick and Easy</h3>
          <h3 className="font-bold text-2xl text-green-900">Draw Names</h3>
          <p>
            Draw names for your Secret Santa or gift exchange with Happy Giftlist's free online
            Secret Santa Generator. Our user-friendly tool simplifies organizing your group's gift
            exchange, and the best part is, it's completely free!
          </p>
        </div>
      </div>
      <div className="order-4 p-3 sm:order-3">
        <img
          src="https://images.unsplash.com/photo-1497700003451-e1df943a194b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="second_image"
          className="h-auto w-full rounded-xl"
        />
      </div>
    </div>
  </div>
</template>
