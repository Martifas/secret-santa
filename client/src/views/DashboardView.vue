<script setup lang="ts">
import { onMounted, ref } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { trpc } from '@/trpc'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import Container from '@/components/Container.vue'
import InsctructionsContainer from '@/components/instructions/InsctructionsContainer.vue'
import DashboardContainer from '@/components/DashboardContainer.vue'
import DashboardContainerHeading from '@/components/DashboardContainerHeading.vue'
import type { UserWishlistForMember } from '@server/entities/userWishlist'
import WishlistContainer from '@/components/dashboard/WishlistContainer.vue'
import type { UserEventForMember } from '@server/entities/userEvent'
import EventContainer from '@/components/dashboard/EventContainer.vue'
import ActionButton from '@/components/ActionButton.vue'

const { user } = useAuth0()
const router = useRouter()

const userWishlists = ref<UserWishlistForMember[]>([])
const userEvents = ref<UserEventForMember[]>([])

async function loadUserWishlists() {
  try {
    if (!user.value?.sub) {
      console.error('User not authenticated')
      return
    }

    const wishlists = await trpc.userWishlist.getUserWishlists.query({
      userId: user.value.sub,
    })

    userWishlists.value = wishlists ?? []
  } catch {}
}
async function loadUserEvents() {
  try {
    if (!user.value?.sub) {
      console.error('User not authenticated')
      return
    }

    const events = await trpc.userEvent.getUserEvents.query({
      userId: user.value.sub,
    })

    userEvents.value = events ?? []
  } catch (error) {
    console.error('Failed to load user events:', error)
  }
}

onMounted(() => {
  loadUserWishlists()
  loadUserEvents()
})
</script>

<template>
  <Container>
    <div class="mt-7 flex flex-col flex-wrap gap-6 sm:flex-row">
      <div class="w-full min-w-[300px] sm:flex-1">
        <DashboardContainer>
          <DashboardContainerHeading>Your Exchanges</DashboardContainerHeading>
          <EventContainer :events="userEvents" />
          <div class="flex justify-center pt-5">
            <ActionButton type="button" @click="router.push({ name: 'Exchange' })" class="items"
              >Create New Gift Exchange</ActionButton
            >
          </div>
        </DashboardContainer>
      </div>

      <div class="w-full min-w-[300px] sm:flex-1">
        <DashboardContainer>
          <DashboardContainerHeading>Your Wishlists</DashboardContainerHeading>
          <WishlistContainer :wishlists="userWishlists" />
          <div class="flex justify-center pt-5">
            <ActionButton type="button" @click="router.push({ name: '' })" class="items"
              >Create New Wishlist</ActionButton
            >
          </div>
        </DashboardContainer>
      </div>
    </div>
    <InsctructionsContainer>
      <div>
        <h2 class="text-xl font-bold">Welcome to Your Gift Meister Dashboard</h2>
        <p class="py-2">
          Your Gift Meister dashboard is your personal gift-giving headquarters. Here you can manage
          all your gift exchanges, keep track of your wishlists, and organize your gifting
          activities in one convenient place. Whether you're participating in multiple exchanges or
          managing your own wishlist, everything you need is right here.
        </p>
      </div>
      <div>
        <h2 class="pt-7 text-xl font-bold">Managing Your Exchanges</h2>
        <p class="py-2">
          The Exchanges section at the top of your dashboard helps you keep track of all your
          ongoing gift exchanges. Here's how to make the most of this feature:
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>View active exchanges:</b> Each card represents a different gift exchange you're
            participating in. Click on any exchange to see all the details.
          </li>
          <li>
            <b>Create new exchanges: </b>
            Use the "Create New Gift Exchange" button to start a new event. Perfect for birthdays,
            holidays, or any special occasion.
          </li>
          <li>
            <b>Track multiple events: </b>
            Keep all your exchanges organized in one place, whether they're upcoming or ongoing.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Working with Your Wishlists</h2>
        <p class="py-2">
          The Wishlists section helps you keep track of gift ideas for yourself and share them with
          others. Here's how to use this feature effectively:
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>Access your wishlists:</b> Click on any wishlist card to view or edit your desired
            items. Add details like links, sizes, or color preferences.
          </li>
          <li>
            <b>Organize by occasion: </b>
            Create separate wishlists for different events or categories to keep your gift ideas
            organized.
          </li>
          <li>
            <b>Share with others:</b>
            Your wishlists can be shared with friends and family, making it easier for them to
            choose the perfect gift for you.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Tips for Using Your Dashboard</h2>
        <p class="py-2">
          Make the most of your Gift Meister dashboard with these helpful tips and best practices:
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>Regular updates:</b> Keep your wishlists current by adding or removing items as your
            preferences change.
          </li>
          <li>
            <b>Stay organized:</b> Check your exchanges regularly to keep track of important dates
            and any updates from other participants.
          </li>
          <li>
            <b>Quick access:</b> Use your dashboard as your central hub for all gift-giving
            activities, whether you're giving or receiving.
          </li>
        </ul>
      </div>
    </InsctructionsContainer>
  </Container>
</template>
