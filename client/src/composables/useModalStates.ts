import { ref } from 'vue'

export function useModalStates() {
  const showDrawNamesPrompt = ref(false)
  const showReDrawNamesPrompt = ref(false)
  const showDeleteEventPrompt = ref(false)
  const showKickMemberPrompt = ref(false)

  const openModal = (modalName: string) => {
    switch (modalName) {
      case 'draw':
        showDrawNamesPrompt.value = true
        break
      case 'redraw':
        showReDrawNamesPrompt.value = true
        break
      case 'delete':
        showDeleteEventPrompt.value = true
        break
      case 'kick':
        showKickMemberPrompt.value = true
        break
    }
  }

  const closeModal = (modalName: string) => {
    switch (modalName) {
      case 'draw':
        showDrawNamesPrompt.value = false
        break
      case 'redraw':
        showReDrawNamesPrompt.value = false
        break
      case 'delete':
        showDeleteEventPrompt.value = false
        break
      case 'kick':
        showKickMemberPrompt.value = false
        break
    }
  }

  return {
    showDrawNamesPrompt,
    showReDrawNamesPrompt,
    showDeleteEventPrompt,
    showKickMemberPrompt,
    openModal,
    closeModal,
  }
}
