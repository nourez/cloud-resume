# Base: Ubuntu devcontainer image (non-root "vscode" user, common tools, sudo, etc.)
ARG VARIANT="ubuntu-24.04"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

# ---- Build args (tweak as needed) ----
ARG NODE_VERSION="24"
ARG PYTHON_VERSION="3.12"
ARG OPEN_TOFU_VERSION="1.9.0"

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
