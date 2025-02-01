<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 sm:px-6 sm:py-3',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-lg',
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-green-900 transition-color shadow-sm shadow-green-900 hover:bg-green-700 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }
  return variants[props.variant]
})
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    :class="[
      'flex items-center justify-center rounded-xl transition-colors duration-200',
      ,
      variantClasses,
      sizeClasses,
      'disabled:cursor-not-allowed disabled:opacity-50',
    ]"
  >
    <template v-if="loading">
      <svg
        class="mr-3 -ml-1 h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Processing...</span>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>
