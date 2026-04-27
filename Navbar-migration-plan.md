# Navbar Migration Plan

## POC Goal

Replace the current sidebar-first shell with a top-navigation shell that gives Atlas a more accounting and product-ops feel, closer in posture to Xero, without trying to rebuild the whole app at once.

The point of the POC is to answer:

- does top-nav improve the product feel?
- can we keep navigation clear as modules grow?
- does the shell still work well on mobile?
- do inventory screens benefit from it?

## POC Scope

Do not migrate the whole app yet.

POC should cover:

- protected shell
- dashboard/home
- inventory overview
- inventory items
- inventory movements
- settings
- components page

Leave more specialized or less important screens for later.

## Target Navigation Model

### Primary Top Nav

For major modules:

- Home
- Inventory
- Sales
- Purchases
- Reporting
- Accounting
- Contacts
- Settings

Not all of these need to be fully built yet, but the shell should be designed for them.

### Secondary Nav

For within a module, prefer top-nav flyouts instead of a permanently visible second navigation row.

Example for Inventory:

- Overview
- Items
- Movements

Expected behavior:

- clicking `Inventory` in the top nav goes to `/inventory`
- hovering or opening `Inventory` exposes deeper routes like `Overview`, `Items`, and `Movements`

This keeps module-level context in one place instead of stacking a second full-width subnav under the header.

### Mobile Nav

Use:

- a top bar
- menu trigger
- drawer or sheet for primary nav
- grouped child links inside module entries where needed

Do not try to squeeze the full desktop nav into a tiny mobile top bar.

## POC Architecture Plan

### 1. Create a New Protected Shell Variant

Do not immediately destroy the current sidebar shell.

Build a new shell path first:

- new top-nav shell component
- likely:
  - `dashboard-top-nav-shell.tsx`
  - `dashboard-top-nav.tsx`
  - `dashboard-mobile-nav.tsx`

This lets us compare and migrate safely.

### 2. Move Nav Config Into Structured Metadata

Current nav is probably too sidebar-oriented.

Create a shared config shape like:

- primary nav items
- optional child items
- route matching info
- labels and icons

Something like:

- `dashboard-navigation.ts`

This config should support:

- top nav
- top-nav flyout items
- mobile nav
- breadcrumbs

One source of truth is the important part.

### 3. Refactor Breadcrumbs to Align With Top-Nav Shell

Breadcrumb helpers already exist, which helps.

Now make breadcrumbs aware of:

- top-level module
- flyout child route
- action pages like `new` and `edit`

This matters so the new shell does not feel disjointed.

### 4. Add Module Flyout Pattern

For the POC, implement this first for Inventory in the top nav.

Expected interaction:

- top nav highlights `Inventory`
- direct click opens `/inventory`
- hover or menu-open reveals:
  - Overview
  - Items
  - Movements

This replaces the need for a persistent secondary navigation row.

### 5. Migrate a Controlled Route Set

Switch only these first:

- `/dashboard`
- `/inventory`
- `/inventory/items`
- `/inventory/movements`
- `/settings`
- `/components`

Then inspect:

- header spacing
- content max widths
- mobile behavior
- breadcrumb placement
- page intro consistency
- whether the flyout removes the need for always-on subnav

### 6. Retune Page Spacing and Header Composition

Once the shell changes, some pages will feel off.

Expect to adjust:

- top padding
- title position
- breadcrumb rhythm
- toolbar alignment
- wide-table containment

This is normal and should be part of the POC, not treated as accidental cleanup.

## Implementation Order

1. Extract a shared navigation config.
2. Build new desktop top nav.
3. Build top-nav flyouts for modules with child routes.
4. Build mobile nav drawer or sheet.
5. Build top-nav shell layout.
6. Wire shell to selected POC routes.
7. Tune breadcrumbs.
8. Tune inventory pages inside new shell.
9. Tune settings and components pages.
10. Review desktop and mobile behavior.

## File-Level Direction

Likely new or refactored files:

- `apps/web/components/dashboard/dashboard-navigation.ts`
- `apps/web/components/dashboard/dashboard-top-nav.tsx`
- `apps/web/components/dashboard/dashboard-mobile-nav.tsx`
- `apps/web/components/dashboard/dashboard-top-nav-shell.tsx`

Updates likely needed in:

- `apps/web/components/dashboard/dashboard-shell.tsx`
- `apps/web/components/dashboard/dashboard-breadcrumbs.ts`

Potentially inventory module:

- add flyout child-route metadata for inventory

## Design Decisions To Lock Before Coding

### Keep or Remove the Left Rail Entirely

For the POC, remove the sidebar from the new shell entirely.

Do not do hybrid sidebar plus top nav. That would muddy the evaluation.

### How Many Top-Level Nav Items

Keep it restrained for the POC.

If too many unfinished modules exist, use placeholders carefully or reduce the set.

### Should Dashboard Become Home

Probably yes. That reads more product-like.

### Should Components Stay in Primary Nav

No, not long-term.

For the POC it can stay reachable, but ideally it becomes a lower-priority internal route.

### How Should Mobile Subnav Work

Best POC:

- primary modules in a sheet
- child routes shown inside the active module’s menu group instead of an always-visible subnav strip

That is simpler, lighter, and more consistent with the desktop nav model.

### Should Breadcrumbs Always Show

No.

Best POC:

- keep breadcrumbs for deeper routes like create, edit, and nested detail screens
- consider hiding or reducing breadcrumbs on module overview and primary list pages if the top nav and page header already provide enough orientation

## POC Success Criteria

The migration is working if:

- app feels more like an operations or accounting product
- inventory pages are easier to scan and navigate
- primary nav is clear without a sidebar
- mobile nav is still usable
- breadcrumbs and page intros still make sense
- layout does not feel top-heavy or crowded
- flyout navigation removes the need for redundant shell chrome

## Main Risks

### Too Many Top-Level Modules

Could make the header cramped fast.

### Mobile Complexity

Top-nav shells can get messy on small screens if not planned carefully.

### Pages May Briefly Feel Under-Structured

The sidebar currently provides visual anchoring. Without it, we need stronger page rhythm.

### Components or Internal Routes May Not Fit Naturally

Some routes exist because of the starter structure, not because they belong in a real app nav.

## Recommendation

Best POC path:

- build the new top-nav shell
- wire only a subset of routes
- use Inventory as the proving ground
- decide after that whether to fully retire the sidebar

That keeps the project ambitious but sane.
