import { describe, it, expect } from 'vitest'
import { useModalStates } from '../useModalStates'

describe('useModalStates', () => {
  describe('initial state', () => {
    it('should initialize all modal states as false', () => {
      const {
        showDrawNamesPrompt,
        showReDrawNamesPrompt,
        showDeleteEventPrompt,
        showKickMemberPrompt
      } = useModalStates()

      expect(showDrawNamesPrompt.value).toBe(false)
      expect(showReDrawNamesPrompt.value).toBe(false)
      expect(showDeleteEventPrompt.value).toBe(false)
      expect(showKickMemberPrompt.value).toBe(false)
    })
  })

  describe('openModal', () => {
    it('should open draw names modal', () => {
      const { showDrawNamesPrompt, openModal } = useModalStates()
      openModal('draw')
      expect(showDrawNamesPrompt.value).toBe(true)
    })

    it('should open redraw names modal', () => {
      const { showReDrawNamesPrompt, openModal } = useModalStates()
      openModal('redraw')
      expect(showReDrawNamesPrompt.value).toBe(true)
    })

    it('should open delete event modal', () => {
      const { showDeleteEventPrompt, openModal } = useModalStates()
      openModal('delete')
      expect(showDeleteEventPrompt.value).toBe(true)
    })

    it('should open kick member modal', () => {
      const { showKickMemberPrompt, openModal } = useModalStates()
      openModal('kick')
      expect(showKickMemberPrompt.value).toBe(true)
    })

    it('should not affect other modals when opening one modal', () => {
      const {
        showDrawNamesPrompt,
        showReDrawNamesPrompt,
        showDeleteEventPrompt,
        showKickMemberPrompt,
        openModal
      } = useModalStates()

      openModal('draw')

      expect(showDrawNamesPrompt.value).toBe(true)
      expect(showReDrawNamesPrompt.value).toBe(false)
      expect(showDeleteEventPrompt.value).toBe(false)
      expect(showKickMemberPrompt.value).toBe(false)
    })
  })

  describe('closeModal', () => {
    it('should close draw names modal', () => {
      const { showDrawNamesPrompt, openModal, closeModal } = useModalStates()
      openModal('draw')
      closeModal('draw')
      expect(showDrawNamesPrompt.value).toBe(false)
    })

    it('should close redraw names modal', () => {
      const { showReDrawNamesPrompt, openModal, closeModal } = useModalStates()
      openModal('redraw')
      closeModal('redraw')
      expect(showReDrawNamesPrompt.value).toBe(false)
    })

    it('should close delete event modal', () => {
      const { showDeleteEventPrompt, openModal, closeModal } = useModalStates()
      openModal('delete')
      closeModal('delete')
      expect(showDeleteEventPrompt.value).toBe(false)
    })

    it('should close kick member modal', () => {
      const { showKickMemberPrompt, openModal, closeModal } = useModalStates()
      openModal('kick')
      closeModal('kick')
      expect(showKickMemberPrompt.value).toBe(false)
    })

    it('should not affect other modals when closing one modal', () => {
      const {
        showDrawNamesPrompt,
        showReDrawNamesPrompt,
        showDeleteEventPrompt,
        showKickMemberPrompt,
        openModal,
        closeModal
      } = useModalStates()
   
      openModal('draw')
      openModal('redraw')
      openModal('delete')
      openModal('kick')

      closeModal('draw')

      expect(showDrawNamesPrompt.value).toBe(false)
      expect(showReDrawNamesPrompt.value).toBe(true)
      expect(showDeleteEventPrompt.value).toBe(true)
      expect(showKickMemberPrompt.value).toBe(true)
    })
  })
})