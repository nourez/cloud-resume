#!/usr/bin/env bash
set -euo pipefail

echo "[post-create] Starting post-create setup..."

########################################
# Env: pnpm global bin
########################################
# pnpm needs PNPM_HOME set for global installs (otherwise ERR_PNPM_NO_GLOBAL_BIN_DIR).
PNPM_HOME="${PNPM_HOME:-/home/vscode/.local/share/pnpm}"
export PNPM_HOME
export PATH="${PNPM_HOME}:${HOME}/.local/bin:${PATH}"

mkdir -p "${PNPM_HOME}"

# Persist for interactive shells (bash/zsh)
pnpm_env_snippet='export PNPM_HOME="${PNPM_HOME:-/home/vscode/.local/share/pnpm}"\nexport PATH="$PNPM_HOME:$HOME/.local/bin:$PATH"\n'
if ! grep -Fq "PNPM_HOME" /home/vscode/.bashrc 2>/dev/null; then
  printf "%b" "${pnpm_env_snippet}" >> /home/vscode/.bashrc
fi
if ! grep -Fq "PNPM_HOME" /home/vscode/.zshrc 2>/dev/null; then
  printf "%b" "${pnpm_env_snippet}" >> /home/vscode/.zshrc
fi

########################################
# Helper: ensure Node (nvm) is loaded
########################################
use_node_default() {
  if [ -s "/usr/local/nvm/nvm.sh" ]; then
    # shellcheck source=/dev/null
    . "/usr/local/nvm/nvm.sh"
    nvm use default || true
  fi
}

########################################
# 1. frontend/ (Node + pnpm + Playwright)
########################################
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  echo "[post-create] Setting up frontend (Node + pnpm)..."
  pushd frontend > /dev/null

  use_node_default

  echo "[post-create] Installing Node dependencies with pnpm in ./frontend..."
  pnpm install

  if grep -q '"@playwright/test"' package.json 2>/dev/null; then
    echo "[post-create] Installing Playwright browsers and dependencies (frontend)..."
    npx playwright install --with-deps
  fi

  popd > /dev/null
else
  echo "[post-create] Skipping frontend setup (frontend/ or frontend/package.json not found)."
fi

########################################
# 2. api/ (Python via uv, uv-managed runtime)
########################################
PY_VERSION="3.12"

if [ -d "api" ]; then
  echo "[post-create] Setting up api (Python via uv) in ./api..."
  pushd api > /dev/null

  # Ensure uv-managed Python runtime exists
  echo "[post-create] Ensuring uv Python ${PY_VERSION} is installed..."
  if ! uv python list | grep -q "${PY_VERSION}"; then
    uv python install "${PY_VERSION}"
  fi

  # Create .venv using that runtime if it doesn't exist
  if [ ! -d ".venv" ]; then
    echo "[post-create] Creating .venv with uv and Python ${PY_VERSION} in ./api..."
    uv venv --python "${PY_VERSION}" .venv
  fi

  # Sync deps if pyproject.toml exists
  if [ -f "pyproject.toml" ]; then
    echo "[post-create] Syncing Python dependencies with uv in ./api..."
    uv sync
  else
    echo "[post-create] No pyproject.toml in ./api yet, skipping uv sync."
  fi

  popd > /dev/null
else
  echo "[post-create] Skipping api setup (api/ folder not found)."
fi

echo "[post-create] All done."

########################################
# 3. SSH Based Git Commit Signing
########################################

git config --local gpg.format ssh
git config --local gpg.ssh.program "$(which ssh-keygen)"
git config --local commit.gpgsign true

########################################
# 4. Tools
########################################
echo "[post-create] Installing tools..."
pnpm install -g @openai/codex
pnpm install -g @google/gemini-cli
pnpm install -g @fission-ai/openspec@latest
