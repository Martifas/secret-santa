<script setup lang="ts">
import { FwbNavbar, FwbNavbarCollapse, FwbNavbarLink, FwbNavbarLogo } from 'flowbite-vue'
</script>

<template>
  <fwb-navbar class="border-gray-200 bg-white dark:bg-gray-900">
    <template #logo>
      <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="../../src/assets/gift-logo.svg" class="h-8" alt="Flowbite Logo" />
        <span class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Flowbite
        </span>
      </a>
    </template>
    <template #default="{ isShowMenu }">
      <fwb-navbar-collapse :is-show-menu="isShowMenu">
        <fwb-navbar-link href="#" is-active>Home</fwb-navbar-link>
        <fwb-navbar-link href="#">About</fwb-navbar-link>
        <fwb-navbar-link href="#">Services</fwb-navbar-link>
        <fwb-navbar-link href="#">Pricing</fwb-navbar-link>
        <fwb-navbar-link href="#">Contact</fwb-navbar-link>
      </fwb-navbar-collapse>
    </template>
  </fwb-navbar>
</template>