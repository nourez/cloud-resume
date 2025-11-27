# Base: Ubuntu devcontainer image (non-root "vscode" user, common tools, sudo, etc.)
ARG VARIANT="ubuntu-24.04"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

# ---- Build args (tweak as needed) ----
ARG OPEN_TOFU_VERSION="1.9.0"
ARG SYFT_VERSION="1.38.0"
ARG GRYPE_VERSION="0.104.1"
ARG UV_VERSION="0.9.11"
ARG TARGETARCH

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

# ---- Python tooling (uv) ----
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
    (cd /tmp && grep " ${tofu_zip}$" tofu_SHA256SUMS | sha256sum --check --status); \
    unzip "/tmp/${tofu_zip}" -d /tmp; \
    mv /tmp/tofu /usr/local/bin/tofu; \
    chmod +x /usr/local/bin/tofu; \
    rm -rf "/tmp/${tofu_zip}" /tmp/tofu_SHA256SUMS

# ---- Syft CLI ----
# Download the architecture-appropriate Syft binary, verify checksum, and install
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    case "$arch" in \
    amd64) syft_arch="amd64" ;; \
    arm64) syft_arch="arm64" ;; \
    *) echo "Unsupported architecture: ${arch}" >&2; exit 1 ;; \
    esac; \
    curl -fsSL "https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_linux_${syft_arch}.tar.gz" -o "/tmp/syft_${SYFT_VERSION}_linux_${syft_arch}.tar.gz"; \
    curl -fsSL "https://github.com/anchore/syft/releases/download/v${SYFT_VERSION}/syft_${SYFT_VERSION}_checksums.txt" -o /tmp/syft_checksums.txt; \
    (cd /tmp && grep " syft_${SYFT_VERSION}_linux_${syft_arch}.tar.gz$" syft_checksums.txt | sha256sum --check --status); \
    tar -xzf "/tmp/syft_${SYFT_VERSION}_linux_${syft_arch}.tar.gz" -C /tmp; \
    install -m 0755 "/tmp/syft" /usr/local/bin/syft; \
    rm -rf "/tmp/syft" "/tmp/syft_${SYFT_VERSION}_linux_${syft_arch}.tar.gz" /tmp/syft_checksums.txt

# ---- Grype CLI ----
# Download the architecture-appropriate Grype binary, verify checksum, and install
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    case "$arch" in \
    amd64) grype_arch="amd64" ;; \
    arm64) grype_arch="arm64" ;; \
    *) echo "Unsupported architecture: ${arch}" >&2; exit 1 ;; \
    esac; \
    curl -fsSL "https://github.com/anchore/grype/releases/download/v${GRYPE_VERSION}/grype_${GRYPE_VERSION}_linux_${grype_arch}.tar.gz" -o "/tmp/grype_${GRYPE_VERSION}_linux_${grype_arch}.tar.gz"; \
    curl -fsSL "https://github.com/anchore/grype/releases/download/v${GRYPE_VERSION}/grype_${GRYPE_VERSION}_checksums.txt" -o /tmp/grype_checksums.txt; \
    (cd /tmp && grep " grype_${GRYPE_VERSION}_linux_${grype_arch}.tar.gz$" grype_checksums.txt | sha256sum --check --status); \
    tar -xzf "/tmp/grype_${GRYPE_VERSION}_linux_${grype_arch}.tar.gz" -C /tmp; \
    install -m 0755 "/tmp/grype" /usr/local/bin/grype; \
    rm -rf "/tmp/grype" "/tmp/grype_${GRYPE_VERSION}_linux_${grype_arch}.tar.gz" /tmp/grype_checksums.txt

USER vscode
