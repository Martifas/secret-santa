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
  ComputerDesktopIcon,
} from '@heroicons/vue/24/outline'
import { useAuth0 } from '@auth0/auth0-vue'
import { computed, watch } from 'vue'
import { trpc } from '@/trpc'
import { useRouter } from 'vue-router'
import pic from '../assets/profile.png'

const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()
const router = useRouter()

const login = () => {
  const currentRoute = router.currentRoute.value
  loginWithRedirect({
    appState: {
      target: currentRoute.name !== 'Home' ? currentRoute.fullPath : '/',
    },
  })
}

const logoutUser = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  })
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

const baseNavigation = [
  { name: 'Gift Exchange', to: { name: 'Exchange' } },
  { name: 'Create Wishlist', to: { name: 'Wishlist' } },
]

const navigation = computed(() => {
  if (isAuthenticated.value) {
    return [{ name: 'Dashboard', to: { name: 'Dashboard' } }, ...baseNavigation]
  }
  return baseNavigation
})
</script>

<template>
  <Disclosure
    as="nav"
    class="border-bottom sticky top-0 z-50 border-1 border-gray-300 bg-white"
    v-slot="{ open }"
  >
    <div class="container mx-auto max-w-7xl">
      <div class="relative flex h-16 items-center justify-center">
        <div class="absolute inset-y-0 left-0 flex items-center px-4 sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md border-1 p-1 text-black hover:bg-green-900 hover:text-white focus:outline-hidden focus:ring-inset"
          >
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div
          class="sm:justify-endstart flex flex-1 items-center justify-center sm:items-stretch sm:justify-start!"
        >
          <router-link class="flex items-center" :to="{ name: 'Home' }">
            <img
              class="h-8 w-auto"
              src="https://i.ibb.co/6ytXyyw/gift-meister-final.png"
              alt="Gift Meister"
            />
          </router-link>

          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                :class="[
                  'text-black hover:text-green-900',
                  'rounded-md px-3 py-2 text-sm font-bold',
                ]"
              >
                <GiftIcon v-if="item.name === 'Gift Exchange'" class="inline size-6" />
                <SparklesIcon v-if="item.name === 'Create Wishlist'" class="inline size-6" />
                <ComputerDesktopIcon v-if="item.name === 'Dashboard'" class="inline size-6" />
                {{ item.name }}</router-link
              >
            </div>
          </div>
        </div>

        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-4"
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
                  :src="user?.picture || pic"
                  @error="($event.target as HTMLImageElement).src = pic"
                  class="m-0.5 size-8 rounded-full"
                  crossorigin="anonymous"
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
                <MenuItem v-slot="{ active }" v-if="user?.given_name">
                  <span class="block px-4 py-2 text-sm text-gray-700">
                    {{ user.given_name }}
                  </span>
                </MenuItem>

                <MenuItem v-slot="{ active }">
                  <button
                    @click="logoutUser"
                    :class="[
                      active ? 'bg-gray-100 outline-hidden' : '',
                      'block px-4 py-2 text-sm text-gray-700 hover:text-green-900',
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
            @click="login"
            class="rounded-md bg-green-900 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Log in
          </button>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :to="item.to"
          :class="[
            'border-t-1 border-black text-black last:border-b-1 hover:text-green-900',
            'block px-3 py-2 text-base font-bold',
          ]"
        >
          {{ item.name }}
        </router-link>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
