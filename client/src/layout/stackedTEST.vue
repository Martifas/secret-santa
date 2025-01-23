<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { FwbNavbar, FwbNavbarCollapse, FwbNavbarLink } from 'flowbite-vue'

const { links } = defineProps<{
  links: {
    label: string
    name?: string
    action?: () => void
    show?: boolean
  }[]
}>()

const route = useRoute()
const navigation = computed(() =>
  links.map((item) => ({
    ...item,
    isActive: item.name ? route.name === item.name : false,
  }))
)
</script>

<template>
  <FwbNavbar>
    <template #default="{ isShowMenu }">
      <div class="px-4">
        <FwbNavbar-collapse :isShowMenu="isShowMenu">
          <template v-for="link in navigation" :key="link.label">
            <!-- For regular route links -->
            <FwbNavbarLink
              v-if="link.name"
              :is-active="link.isActive"
              :link="{ name: link.name } as any"
              link-attr="to"
              component="RouterLink"
            >
              {{ link.label }}
            </FwbNavbarLink>
            <!-- For action links (like login/logout) -->
            <FwbNavbarLink v-else href="#" @click.prevent="link.action">
              {{ link.label }}
            </FwbNavbarLink>
          </template>
        </FwbNavbar-collapse>
      </div>
    </template>
  </FwbNavbar>
  <main>
    <div class="container mx-auto px-6 py-6">
      <RouterView />
    </div>
  </main>
</template>