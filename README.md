# Singularity

A multi-merchant commerce platform for creators, Shopify-style, built twice as a learning project.
You build each task in `mine/`. Then Claude Code builds the same task in `claude/`, and you compare the two.

## What's where

```text
singularity/
├── README.md            this file
├── docs/
│   ├── PLAN.md          product and technical plan: decisions, architecture, data model, roadmap
│   ├── TASKS.md         all tasks, with a checkbox for you and one for Claude
│   └── TDD_PHASE_1.md   test-first steps (red → green → refactor) for every Phase 1 task
├── mine/                your code (its own Git repo)
│   └── .gitattributes
└── claude/              Claude Code's code (its own Git repo)
    ├── CLAUDE.md        rules Claude Code reads at the start of every session
    └── .gitattributes
```

`.gitattributes` keeps line endings as LF in both repos, so comparing the two shows only real code differences on Windows.

## Before task 1.1

1. Install Node.js (LTS), pnpm, Git, Docker Desktop (with WSL 2) and Claude Code.
2. Create the two Git repos in PowerShell:

   ```powershell
   cd C:\Jade\Coding\singularity\mine
   git init -b main
   cd ..\claude
   git init -b main
   git add .
   git commit -m "setup: CLAUDE.md"
   ```

3. Optional: create two private GitHub repos, then run `git remote add origin <url>` and `git push -u origin main` in each folder.
4. Domain: not needed until task 1.16. Develop on `*.localhost` addresses.

## The loop for each task

1. Read the task in `docs/TASKS.md` and its Red list in `docs/TDD_PHASE_1.md`.
2. Build it test-first in `mine/`, then commit as `<id>: <title>`.
3. Open Claude Code inside `claude/` and paste the prompt from `docs/TASKS.md`.
4. Compare the two commits, then tick both boxes in `docs/TASKS.md`.
