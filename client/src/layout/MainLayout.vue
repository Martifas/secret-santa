<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import {
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  GiftIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
import { useAuth0 } from '@auth0/auth0-vue'
import { watch } from 'vue'
import { trpc } from '@/trpc'

const { user, isAuthenticated, isLoading, logout, loginWithRedirect } = useAuth0()

async function loginUser() {
  try {
    await loginWithRedirect()
  } catch (error) {
    console.error('Login failed:', error)
  }
}

async function logoutUser() {
  try {
    await logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

watch(
  [isLoading, () => isAuthenticated, () => user],
  async ([loading, isAuth, authUser]) => {
    if (!loading && isAuth && authUser?.value?.sub && authUser?.value?.email) {
      try {
        await trpc.user.userSync.mutate({
          auth0Id: authUser.value.sub,
          email: authUser.value.email,
          firstName: authUser.value.given_name || '',
          lastName: authUser.value.family_name || '',
          picture: authUser.value.picture || '',
        })
      } catch (error) {
        console.error('Failed to sync user with database:', error)
      }
    }
  },
  { immediate: true }
)

const navigation = [
  { name: 'Draw Names', href: '#', current: false },
  { name: 'Create Wishlist', href: '#', current: false },
]
</script>

<template>
  <Disclosure as="nav" class="bg-white" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-1 text-black hover:bg-green-900 hover:text-white focus:outline-hidden focus:ring-inset border-1"
          >
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <img
              class="h-8 w-auto"
              src="https://i.ibb.co/6ytXyyw/gift-meister-final.png"
              alt="Gift Meister"
            />
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                :class="[
                  item.current ? 'text-green-900 underline' : 'text-black hover:text-green-900',
                  'rounded-md px-3 py-2 text-sm font-bold',
                ]"
                :aria-current="item.current ? 'page' : undefined"
              >
                <GiftIcon v-if="item.name === 'Draw Names'" class="inline size-6" />
                <SparklesIcon v-if="item.name === 'Create Wishlist'" class="inline size-6" />
                {{ item.name }}</a
              >
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <!-- Loading State -->
          <div v-if="isLoading" class="text-sm text-gray-500">Loading...</div>

          <!-- Authenticated State: Profile dropdown -->
          <Menu v-else-if="isAuthenticated" as="div" class="relative ml-3">
            <div>
              <MenuButton
                class="relative flex rounded-full border-2 border-green-900 text-sm hover:border-black focus:outline-hidden"
              >
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Open user menu</span>
                <img
                  :src="user?.picture"
                  :alt="`${user?.name}'s profile picture`"
                  class="m-0.5 size-8 rounded-full"
                />

                <ChevronDownIcon class="mt-2 mr-1 inline size-6 text-slate-600" />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden"
              >
                <MenuItem v-slot="{ active }" v-if="user?.name">
                  <span class="block px-4 py-2 text-sm text-gray-700">
                    {{ user.name }}
                  </span>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-gray-100 outline-hidden' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                    >Your Profile</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-gray-100 outline-hidden' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                    >Settings</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    @click="logoutUser"
                    :class="[
                      active ? 'bg-gray-100 outline-hidden' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>

          <!-- Unauthenticated State: Login button -->
          <button
            v-else
            @click="loginUser"
            class="rounded-md bg-green-900 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Log in
          </button>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :class="[
            item.current
              ? 'text-green-900 underline'
              : 'border-t-1 border-black text-black last:border-b-1 hover:text-green-900',
            'block px-3 py-2 text-base font-bold',
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
  <router-view></router-view>
</template>
