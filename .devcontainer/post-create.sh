#!/usr/bin/env bash
set -euo pipefail

log() { echo "[post-create] $*"; }
warn() { echo "[post-create][warn] $*" >&2; }

log "Starting post-create setup..."

########################################
# 1. frontend/ (Node + pnpm + Playwright)
########################################
setup_frontend() {
  if [ ! -d "frontend" ] || [ ! -f "frontend/package.json" ]; then
    log "Skipping frontend (frontend/ or package.json not found)."
    return
  fi

  log "Setting up frontend (Node + pnpm)..."
  pushd frontend > /dev/null

  use_node_default

  log "Installing Node dependencies with pnpm in ./frontend..."
  pnpm install

  if grep -q '"@playwright/test"' package.json 2>/dev/null; then
    log "Installing Playwright browsers and dependencies (frontend)..."
    pnpm run playwright install --with-deps
  fi

  popd > /dev/null
}

########################################
# 2. api/ (Python via uv, uv-managed runtime)
########################################
setup_api() {
  local py_version="3.12"

  if [ ! -d "api" ]; then
    log "Skipping api setup (api/ folder not found)."
    return
  fi

  log "Setting up api (Python via uv) in ./api..."
  pushd api > /dev/null

  log "Ensuring uv Python ${py_version} is installed..."
  if ! uv python list | grep -q "${py_version}"; then
    uv python install "${py_version}"
  fi

  if [ ! -d ".venv" ]; then
    log "Creating .venv with uv and Python ${py_version} in ./api..."
    uv venv --python "${py_version}" .venv
  fi

  if [ -f "pyproject.toml" ]; then
    log "Syncing Python dependencies with uv in ./api..."
    uv sync
  else
    log "No pyproject.toml in ./api yet, skipping uv sync."
  fi

  popd > /dev/null
}

########################################
# 3. SSH Based Git Commit Signing
########################################

setup_git_signing() {
  git config --local gpg.format ssh
  git config --local gpg.ssh.program "$(which ssh-keygen)"
  git config --local commit.gpgsign true
}

########################################
# 4. Tools (pnpm PATH + global CLIs)
########################################

persist_pnpm_path() {
  # pnpm global bin location (matches devcontainer feature default)
  PNPM_HOME="${PNPM_HOME:-/home/vscode/.local/share/pnpm}"
  mkdir -p "${PNPM_HOME}"
  export PNPM_HOME

  # Keep PATH consistent for current and future shells
  export PATH="${PNPM_HOME}:${HOME}/.local/bin:/usr/local/share/nvm/versions/node/v24.11.1/bin:${PATH}"

  local snippet
  snippet=$(cat <<'EOF'
# pnpm global tool path (added by post-create.sh)
export PNPM_HOME="${PNPM_HOME:-$HOME/.local/share/pnpm}"
export PATH="${PNPM_HOME}:${HOME}/.local/bin:/usr/local/share/nvm/versions/node/v24.11.1/bin:${PATH}"
EOF
)

  for rc in "${HOME}/.profile" "${HOME}/.zprofile" "${HOME}/.zshrc"; do
    touch "${rc}"
    if ! grep -q 'pnpm global tool path' "${rc}"; then
      printf '\n%s\n' "${snippet}" >> "${rc}"
    fi
  done
}

install_global_tools() {
  persist_pnpm_path

  if ! command -v pnpm >/dev/null 2>&1; then
    log "pnpm not found; skipping CLI installs."
    return
  fi

  log "Installing global CLIs via pnpm..."
  pnpm install -g @openai/codex @google/gemini-cli @fission-ai/openspec@latest \
    || warn "pnpm global install encountered issues (continuing)."
}

main() {
  setup_frontend
  setup_api
  setup_git_signing
  install_global_tools
  log "All done."
}

main
