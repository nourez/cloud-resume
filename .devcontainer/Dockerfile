# Base: Ubuntu devcontainer image (non-root "vscode" user, common tools, sudo, etc.)
ARG VARIANT="ubuntu-24.04"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

USER root

# ---- Core OS tooling ----
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    unzip \
    jq \
    less \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

USER vscode
