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
import WishlistContainer from '@/components/WishlistContainer.vue'
import type { UserEventForMember } from '@server/entities/userEvent'

const isLoading = ref(false)
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
    console.log('Loaded events:', events)
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
    <div class="mt-7 flex flex-wrap justify-center gap-3">
      <DashboardContainer>
        <DashboardContainerHeading>Your Exchanges</DashboardContainerHeading>
        <div class="p-1">
          <div v-if="userEvents.length === 0" class="text-gray-500">
            You don't have any events yet.
          </div>
          <div v-else class="flex justify-center gap-10">
            <div
              v-for="event in userEvents"
              :key="event.id"
              class="flex aspect-square size-32 place-items-end justify-center rounded-lg bg-cover bg-center p-4 sm:size-40"
              :style="{
                backgroundImage: `url(https://cdn.pixabay.com/photo/2017/10/20/20/37/gift-boxes-2872745_960_720.png)`,
              }"
            >
              <div class="h-15 rounded-lg bg-white p-1">
                <h3 class="text-center font-medium text-pretty text-black sm:text-lg">
                  {{ event.eventTitle }}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </DashboardContainer>

      <DashboardContainer>
        <DashboardContainerHeading>Your Wishlists</DashboardContainerHeading>
        <WishlistContainer :wishlists="userWishlists" />
      </DashboardContainer>
    </div>
    <InsctructionsContainer>
      <div>
        <h2 class="text-xl font-bold">Draw Names with Gift Meister</h2>
        <p class="py-2">
          Make gift-giving fun and easy with Gift Meister, your go-to for stress-free name drawing.
          Our user-friendly platform walks you through every step, from gathering participants to
          picking out the perfect gifts, ensuring a fun time for everyone involved.
        </p>
      </div>
      <div>
        <h2 class="pt-7 text-xl font-bold">How Does It Work?</h2>
        <p class="py-2">
          Setting up a gift exchange with Happy Giftlist's is quick and hassle-free, leaving you to
          enjoy the best part - picking out great gifts!
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li><b>Create your account:</b> Get started using Facebook or Google account.</li>
          <li>
            <b>Organize a group gift exchange: </b>
            Just enter the event details, set a budget, and invite participants by adding their
            email addresses.
          </li>
          <li>
            <b>Avoid awkward pairings: </b>
            Our exclusion feature ensures everyone has a great time without any drama.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Choosing the Perfect Gift for Your Draw</h2>
        <p class="py-2">
          Finding the ideal gift can be simple with a little thought and creativity. Here are some
          tips to help you pick something special:
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>Encourage wishlist completion:</b> If they haven't already, nudge your gift recipient
            to fill out their wishlist.
          </li>
          <li>
            <b>Gather intel: </b>
            Collect clues about their preferences from friends or their social media profiles
          </li>
          <li>
            <b>Be creative:</b>
            Personalize your gift or choose something unique that shows you've put thought into it,
            like a custom-made item.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Benefits of Drawing Names</h2>
        <p class="py-2">
          Drawing names for gift exchanges is an exciting way to celebrate with friends, family, or
          colleagues. Here are a few reasons why it's great:
        </p>
        <ul class="list-disc space-y-2 pl-5">
          <li>
            <b>Shared joy:</b> Everyone gets to experience the excitement and surprise as gifts are
            revealed.
          </li>
          <li>
            <b>Thoughtful gifting:</b> It encourages picking gifts that truly resonate with the
            recipient, often leading to delightful surprises.
          </li>
          <li>
            <b>Stronger bonds:</b> This fun tradition is perfect for strengthening relationships and
            making lasting memories during the festive season.
          </li>
        </ul>
      </div>
      <div>
        <h2 class="mt-7 text-xl font-bold">Is Happy Giftmeister Free?</h2>
        <p class="py-2">
          Yes, Happy Giftlist is totally free! Whether you’re arranging a gift exchange, creating
          wishlists for special events, or just keeping track of your holiday desires, Happy
          Giftlist is here to help at no cost to you.
        </p>
      </div>
    </InsctructionsContainer>
  </Container>
</template>
