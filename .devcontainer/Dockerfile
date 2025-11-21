# Base: Ubuntu devcontainer image (non-root "vscode" user, common tools, sudo, etc.)
ARG VARIANT="ubuntu-24.04"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

# ---- Build args (tweak as needed) ----
ARG NODE_VERSION="24"
ARG PYTHON_VERSION="3.12"
ARG OPEN_TOFU_VERSION="1.9.0"

ENV NVM_DIR="/usr/local/nvm"
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

USER root

# ---- Core OS tooling ----
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    wget \
    git \
    gnupg2 \
    openssh-client \
    unzip \
    jq \
    less \
    build-essential \
    python${PYTHON_VERSION} \
    python3-pip \
    python3-venv \
    && ln -s /usr/bin/python${PYTHON_VERSION} /usr/local/bin/python \
    && ln -s /usr/bin/python${PYTHON_VERSION} /usr/local/bin/python3 \
    && rm -rf /var/lib/apt/lists/*

# ---- Node + pnpm via nvm ----
RUN mkdir -p ${NVM_DIR} ${PNPM_HOME} \
    && curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . "${NVM_DIR}/nvm.sh" \
    && nvm install ${NODE_VERSION} \
    && nvm alias default ${NODE_VERSION} \
    && nvm use default \
    && corepack enable \
    && corepack prepare pnpm@latest --activate \
    && chown -R vscode:vscode ${NVM_DIR} ${PNPM_HOME}

# Ensure nvm is available in non-login shells and that the default Node is active
RUN echo "export NVM_DIR=\"${NVM_DIR}\"" >> /etc/profile.d/nvm.sh \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> /etc/profile.d/nvm.sh \
    && echo 'if command -v nvm >/dev/null 2>&1; then' >> /etc/profile.d/nvm.sh \
    && echo '  nvm use default >/dev/null 2>&1 || true' >> /etc/profile.d/nvm.sh \
    && echo 'fi' >> /etc/profile.d/nvm.sh
