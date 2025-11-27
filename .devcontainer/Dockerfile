# Base: Ubuntu devcontainer image (non-root "vscode" user, common tools, sudo, etc.)
ARG VARIANT="ubuntu-24.04"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

# ---- Build args (tweak as needed) ----
ARG NODE_VERSION="24.11.1"
ARG PNPM_VERSION="9.15.0"
ARG PYTHON_VERSION="3.12"
ARG OPEN_TOFU_VERSION="1.9.0"
ARG GO_VERSION="1.25.4"
ARG SYFT_VERSION="1.38.0"
ARG GOLANGCI_LINT_VERSION="2.6.2"
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

# ---- Go ----
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    tarball="go${GO_VERSION}.linux-${arch}.tar.gz"; \
    curl -fsSL "https://go.dev/dl/${tarball}" -o "/tmp/${tarball}"; \
    checksum=$(curl -fsSL "https://go.dev/dl/?mode=json" | jq -r ".[] | select(.version == \"go${GO_VERSION}\") | .files[] | select(.filename == \"${tarball}\") | .sha256"); \
    echo "${checksum}  /tmp/${tarball}" | sha256sum --check -; \
    rm -rf /usr/local/go; \
    tar -C /usr/local -xzf "/tmp/${tarball}"; \
    rm "/tmp/${tarball}"; \
    mkdir -p /go/bin

ENV GOROOT=/usr/local/go
ENV GOPATH=/home/vscode/go
ENV PATH="${GOPATH}/bin:${GOROOT}/bin:${PATH}"

# ---- golangci-lint ----
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    tarball="golangci-lint-${GOLANGCI_LINT_VERSION}-linux-${arch}.tar.gz"; \
    base_url="https://github.com/golangci/golangci-lint/releases/download/v${GOLANGCI_LINT_VERSION}"; \
    curl -fsSL "${base_url}/${tarball}" -o "/tmp/${tarball}"; \
    curl -fsSL "${base_url}/golangci-lint-${GOLANGCI_LINT_VERSION}-checksums.txt" -o /tmp/golangci-lint-checksums.txt; \
    (cd /tmp && grep " ${tarball}$" golangci-lint-checksums.txt | sha256sum --check --status); \
    tar -C /tmp -xzf "/tmp/${tarball}"; \
    install -m 0755 "/tmp/golangci-lint-${GOLANGCI_LINT_VERSION}-linux-${arch}/golangci-lint" /usr/local/bin/golangci-lint; \
    rm -rf "/tmp/${tarball}" "/tmp/golangci-lint-${GOLANGCI_LINT_VERSION}-linux-${arch}" /tmp/golangci-lint-checksums.txt

# ---- Node.js ----
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    case "$arch" in \
    amd64) node_arch="linux-x64" ;; \
    arm64) node_arch="linux-arm64" ;; \
    *) echo "Unsupported architecture: ${arch}" >&2; exit 1 ;; \
    esac; \
    tmpdir="$(mktemp -d)"; \
    node_tar="node-v${NODE_VERSION}-${node_arch}.tar.xz"; \
    curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/${node_tar}" -o "${tmpdir}/${node_tar}"; \
    curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt" -o "${tmpdir}/SHASUMS256.txt"; \
    (cd "${tmpdir}" && grep " ${node_tar}" SHASUMS256.txt | sha256sum --check --status); \
    tar -xJf "${tmpdir}/${node_tar}" -C /usr/local --strip-components=1; \
    rm -rf "${tmpdir}"

# ---- PNPM ----
RUN set -eux; \
    corepack enable; \
    corepack prepare "pnpm@${PNPM_VERSION}" --activate


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
