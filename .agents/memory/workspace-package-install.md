---
name: Workspace package installation
description: Installing a dependency for one pnpm workspace package
---

When a dependency belongs to one workspace package, declare it in that package's package.json and run pnpm install from the workspace root; the generic language-package helper targets the workspace root and can fail the root-package guard.

**Why:** The package helper does not accept a workspace filter, while this monorepo rejects accidental root dependency installs.

**How to apply:** For API-server or artifact-only dependencies, edit that package's dependency list first, then run the root install so pnpm links the package correctly.