# Base: Ubuntu devcontainer image (non-root "vscode" user, common tools, sudo, etc.)
ARG VARIANT="ubuntu-24.04"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

# ---- Build args (tweak as needed) ----
ARG NODE_VERSION="24"
ARG PYTHON_VERSION="3.12"
ARG OPEN_TOFU_VERSION="1.9.0"
ARG UV_VERSION=0.9.11
ARG TARGETARCH

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
    python3-venv \
    && ln -s /usr/bin/python${PYTHON_VERSION} /usr/local/bin/python \
    && ln -s /usr/bin/python${PYTHON_VERSION} /usr/local/bin/python3 \
    && rm -rf /var/lib/apt/lists/*

# ---- Python tooling ----


# Install UV from prebuilt binary and verify checksum
RUN set -eux; \
    case "${TARGETARCH:-}" in \
    amd64) UV_ARCH="x86_64-unknown-linux-gnu" ;; \
    arm64) UV_ARCH="aarch64-unknown-linux-gnu" ;; \
    *) echo "Unsupported TARGETARCH: ${TARGETARCH:-unknown}" >&2; exit 1 ;; \
    esac; \
    curl -fsSLO https://github.com/astral-sh/uv/releases/download/${UV_VERSION}/uv-${UV_ARCH}.tar.gz; \
    curl -fsSLO https://github.com/astral-sh/uv/releases/download/${UV_VERSION}/uv-${UV_ARCH}.tar.gz.sha256; \
    sha256sum --check uv-${UV_ARCH}.tar.gz.sha256; \
    tmpdir="$(mktemp -d)"; \
    tar -xzf uv-${UV_ARCH}.tar.gz -C "${tmpdir}"; \
    uv_bin="$(find "${tmpdir}" -type f -name uv -print -quit)"; \
    install -m 0755 "${uv_bin}" /usr/local/bin/uv; \
    if uvx_bin="$(find "${tmpdir}" -type f -name uvx -print -quit)"; then \
    install -m 0755 "${uvx_bin}" /usr/local/bin/uvx; \
    fi; \
    rm -rf "${tmpdir}" uv-${UV_ARCH}.tar.gz uv-${UV_ARCH}.tar.gz.sha256

# ---- OpenTofu CLI ----
# Download the architecture-appropriate OpenTofu archive, verify checksum, and install
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    base_url="https://github.com/opentofu/opentofu/releases/download/v${OPEN_TOFU_VERSION}"; \
    tofu_zip="tofu_${OPEN_TOFU_VERSION}_linux_${arch}.zip"; \
    curl -fsSL "${base_url}/${tofu_zip}" -o "/tmp/${tofu_zip}"; \
    curl -fsSL "${base_url}/tofu_${OPEN_TOFU_VERSION}_SHA256SUMS" -o /tmp/tofu_SHA256SUMS; \
    (cd /tmp && sha256sum --check --ignore-missing tofu_SHA256SUMS); \
    unzip "/tmp/${tofu_zip}" -d /tmp; \
    mv /tmp/tofu /usr/local/bin/tofu; \
    chmod +x /usr/local/bin/tofu; \
    rm -rf "/tmp/${tofu_zip}" /tmp/tofu_SHA256SUMS
