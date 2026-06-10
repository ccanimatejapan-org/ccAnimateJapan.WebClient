import { ref } from 'vue';

export function useMobileMenu() {
  const isMenuOpen = ref(false);

  function openMenu() {
    isMenuOpen.value = true;
  }

  function closeMenu() {
    isMenuOpen.value = false;
  }

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value;
  }

  function closeMenuOnEscape(event) {
    if (event.key !== 'Escape') return;
    closeMenu();
  }

  function focusMenuTarget(target) {
    const element = target?.$el ?? target;
    element?.focus?.();
  }

  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    closeMenuOnEscape,
    focusMenuTarget,
  };
}
