import test from 'node:test';
import assert from 'node:assert/strict';
import { useMobileMenu } from './useMobileMenu.js';

test('mobile menu starts closed and toggles open and closed', () => {
  const menu = useMobileMenu();

  assert.equal(menu.isMenuOpen.value, false);

  menu.toggleMenu();
  assert.equal(menu.isMenuOpen.value, true);

  menu.toggleMenu();
  assert.equal(menu.isMenuOpen.value, false);
});

test('mobile menu can be closed explicitly', () => {
  const menu = useMobileMenu();

  menu.openMenu();
  assert.equal(menu.isMenuOpen.value, true);

  menu.closeMenu();
  assert.equal(menu.isMenuOpen.value, false);
});

test('mobile menu closes on Escape key', () => {
  const menu = useMobileMenu();

  menu.openMenu();
  menu.closeMenuOnEscape({ key: 'Escape' });

  assert.equal(menu.isMenuOpen.value, false);
});

test('mobile menu ignores non-Escape keys', () => {
  const menu = useMobileMenu();

  menu.openMenu();
  menu.closeMenuOnEscape({ key: 'Enter' });

  assert.equal(menu.isMenuOpen.value, true);
});

test('mobile menu focuses plain element targets', () => {
  const menu = useMobileMenu();
  let focused = false;

  menu.focusMenuTarget({
    focus() {
      focused = true;
    },
  });

  assert.equal(focused, true);
});

test('mobile menu focuses component root elements', () => {
  const menu = useMobileMenu();
  let focused = false;

  menu.focusMenuTarget({
    $el: {
      focus() {
        focused = true;
      },
    },
  });

  assert.equal(focused, true);
});

test('mobile menu ignores empty focus targets', () => {
  const menu = useMobileMenu();

  assert.doesNotThrow(() => {
    menu.focusMenuTarget(null);
    menu.focusMenuTarget({});
  });
});
