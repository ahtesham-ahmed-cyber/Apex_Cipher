# Changelog — APEX CIPHER responsive redesign

## Final usability pass (2026-10-13)
- Added a shared search button and search dialog to every HTML page. It searches the page catalogue everywhere and attempts full-page text indexing when served over HTTP(S).
- Added consistent hover/focus mega-menu panels for the primary navigation, with touch-friendly expansion on narrow screens.
- Updated shared card styling to a layered, overlapping deck: hover/focus/active cards rise to the foreground and reveal a cyan/blue/violet gradient; mobile retains swipeable cards.
- Added a footer-visibility guard that temporarily hides the floating Back control while the footer is in view, preventing it from covering footer copy.
- Preserved the existing static HTML/CSS/vanilla JavaScript architecture and content.

## Earlier redesign changes
- Light corporate theme and improved text contrast.
- Responsive spacing, focus-visible styles, reduced-motion handling, and a first-pass Back button placement fix.
- Removed a suspicious external stylesheet reference while preserving local assets.

## Navigation interaction repair (2026-10-13)
- Fixed mobile/tablet submenu clicks so the first click can open a mega-menu without the shared drawer immediately closing.
- Added explicit expanded/hidden accessibility states and keyboard Escape handling for mega-menus.
- Added a hover bridge between top-level navigation items and dropdown panels to prevent the menu disappearing while moving the pointer into it.
- Raised menu stacking/pointer-interaction priority and clarified active-page and hover highlights.
- Extended current-section mapping for the FAQ page.
- Verified navigation-related JavaScript syntax; full browser interaction testing still needs to be run in a browser.
