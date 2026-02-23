# CLAUDE.md — AI Assistant Guide for Ai-Coding-Assistant

This file provides context and conventions for AI assistants (Claude Code and others) working
on this repository.

---

## Project Overview

**Name:** Ai-Coding-Assistant
**Purpose:** An AI-powered coding assistant with no limit to the length of code it can generate.
**Status:** Early-stage / greenfield — initial commit only; no source code has been written yet.

The goal is to build a tool (likely a CLI or web service) that leverages a large language model
(LLM) to write, edit, explain, and reason about code without hard token or length restrictions
that many out-of-the-box AI coding tools impose.

---

## Repository Layout (current)

```
Ai-Coding-Assistant/
├── .git/          # Git metadata — do not modify directly
├── README.md      # One-line project description
└── CLAUDE.md      # This file — AI assistant guide
```

As the project grows, the expected top-level directories are:

```
Ai-Coding-Assistant/
├── src/           # All application source code
├── tests/         # Unit, integration, and end-to-end tests
├── docs/          # Extended documentation
├── scripts/       # Utility/automation scripts
├── .env.example   # Template for required environment variables
├── CLAUDE.md      # This file
└── README.md      # User-facing documentation
```

---

## Tech Stack (to be decided / likely)

No technology has been committed yet. When adding dependencies, prefer:

- **Runtime:** Node.js (TypeScript) or Python 3.11+ — pick one and stay consistent.
- **AI/LLM SDK:** Anthropic SDK (`@anthropic-ai/sdk` or `anthropic` Python package) for
  Claude model access, unless another provider is explicitly chosen.
- **Testing:** Jest (Node) or pytest (Python).
- **Linting/Formatting:** ESLint + Prettier (Node) or Ruff + Black (Python).

Document the chosen stack in this file once decided.

---

## Development Workflow

### Branch Strategy

| Branch | Purpose |
|--------|---------|
| `master` | Stable, production-ready code |
| `claude/<task-id>` | AI-generated feature or fix branches |
| `feat/<name>` | Human-authored feature branches |
| `fix/<name>` | Bug-fix branches |

- All AI-generated work must happen on a `claude/` branch and be merged via pull request.
- Never push directly to `master`.

### Starting Work

```bash
# Clone
git clone <repo-url>
cd Ai-Coding-Assistant

# Create a feature branch (AI agents use the pre-assigned branch name)
git checkout -b feat/my-feature

# Install dependencies (once a stack is chosen, add the actual command here)
# npm install   OR   pip install -e ".[dev]"
```

### Making Changes

1. Read existing code before modifying it.
2. Keep changes minimal and focused — do not refactor unrelated code.
3. Add/update tests for every behaviour change.
4. Run linters and tests before committing (see **Commands** below).

### Committing

```bash
git add <specific-files>          # Never use `git add -A` blindly
git commit -m "type: short description"
```

Commit message format:

```
<type>(<optional scope>): <imperative summary, ≤72 chars>

<optional body — why, not what>
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`.

### Pushing / Pull Requests

```bash
git push -u origin <branch-name>
```

- AI branches must start with `claude/` — pushes to other branch prefixes may be rejected.
- Open a PR against `master`; include a summary, test plan, and any breaking changes.

---

## Commands

> **Update this section** as soon as a package manager and scripts are added.

| Task | Command (Node) | Command (Python) |
|------|---------------|-----------------|
| Install deps | `npm install` | `pip install -e ".[dev]"` |
| Run app | `npm start` | `python -m ai_coding_assistant` |
| Run tests | `npm test` | `pytest` |
| Lint | `npm run lint` | `ruff check .` |
| Format | `npm run format` | `black .` |
| Type check | `npm run typecheck` | `mypy src/` |
| Build | `npm run build` | *(n/a for scripts)* |

---

## Environment Variables

Store secrets in a `.env` file (never commit it). Provide a `.env.example` template.

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | API key for Claude model access |
| `MODEL` | No | Claude model ID to use (default: `claude-opus-4-6`) |
| `MAX_TOKENS` | No | Override default output token limit |
| `LOG_LEVEL` | No | `debug` \| `info` \| `warn` \| `error` (default: `info`) |

Add new variables to this table and to `.env.example` as they are introduced.

---

## Code Conventions

### General

- Favour **clarity over cleverness**. Code is read far more than it is written.
- Keep functions/methods **short and single-purpose** (aim for < 40 lines per function).
- Avoid deep nesting; prefer early returns / guard clauses.
- Do not add comments that restate what the code obviously does. Comment *why*, not *what*.
- Delete dead code rather than commenting it out.

### Naming

| Entity | Convention (TS) | Convention (Python) |
|--------|----------------|---------------------|
| Files | `kebab-case.ts` | `snake_case.py` |
| Classes | `PascalCase` | `PascalCase` |
| Functions/Methods | `camelCase` | `snake_case` |
| Constants | `UPPER_SNAKE_CASE` | `UPPER_SNAKE_CASE` |
| Variables | `camelCase` | `snake_case` |

### Error Handling

- Validate input at system boundaries (user input, API responses).
- Use typed/structured errors — never `throw new Error("something went wrong")` without context.
- Log errors with enough context to reproduce and debug the problem.
- Do not swallow exceptions silently.

### Security

- Never log or expose API keys, tokens, or secrets.
- Sanitise all external input before use in commands, file paths, or prompts.
- Do not introduce eval-like constructs for dynamic code execution.
- Review the OWASP Top 10 when adding any user-facing surface.

### AI / LLM Specific

- Keep **system prompts** in dedicated files (e.g., `src/prompts/`) — not inline strings.
- Stream responses when possible to avoid timeout issues on long outputs.
- Implement retry logic with exponential back-off for transient API errors.
- Log token usage per request for cost monitoring.
- Do not hard-code model names in business logic — use the `MODEL` environment variable.

---

## Testing Conventions

- Co-locate unit tests with source files **or** mirror the `src/` layout under `tests/`.
- Test file naming: `*.test.ts` / `test_*.py`.
- Every public function/module should have at least one unit test.
- Integration tests that call external APIs must be tagged/marked and excluded from the
  default test run (use environment guards or test tags).
- Aim for ≥ 80% line coverage on core business logic.

---

## Documentation Conventions

- Keep `README.md` user-facing: installation, quick-start, feature list.
- Keep `CLAUDE.md` developer/AI-facing: architecture decisions, conventions, workflows.
- Document all public APIs with JSDoc / docstrings.
- Add an ADR (Architecture Decision Record) under `docs/adr/` for significant decisions.

---

## Important Notes for AI Assistants

1. **Read before editing.** Always read a file in full before proposing changes to it.
2. **Minimal scope.** Only change what is necessary for the requested task. Do not refactor
   or "improve" surrounding code unless explicitly asked.
3. **No speculative features.** Do not add error handling, config options, or utilities for
   scenarios that do not yet exist in the codebase.
4. **Commit granularly.** Prefer multiple small commits over one large commit.
5. **Branch discipline.** All AI work must stay on the assigned `claude/` branch until merged.
6. **Security first.** Flag any security concern immediately — do not silently skip it.
7. **Ask before guessing.** If requirements are ambiguous, ask a clarifying question rather
   than guessing and writing code that may need to be thrown away.
8. **Update this file.** When you add a new technology, convention, or workflow, update the
   relevant section of `CLAUDE.md` so future assistants have accurate context.

---

## Useful References

- [Anthropic Claude API docs](https://docs.anthropic.com)
- [Claude model overview](https://docs.anthropic.com/en/docs/about-claude/models)
- [Anthropic SDK (TypeScript)](https://github.com/anthropics/anthropic-sdk-typescript)
- [Anthropic SDK (Python)](https://github.com/anthropics/anthropic-sdk-python)
- [Conventional Commits spec](https://www.conventionalcommits.org/)

---

*Last updated: 2026-02-23 — reflects initial project state (README only).*
