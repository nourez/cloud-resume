# Base: Ubuntu devcontainer image (non-root "vscode" user, common tools, sudo, etc.)
ARG VARIANT="ubuntu-24.04"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

# ---- Build args (tweak as needed) ----
ARG NODE_VERSION="24"
ARG PYTHON_VERSION="3.12"
ARG OPEN_TOFU_VERSION="1.9.0"
ARG GO_VERSION="1.22.5"
ARG GOLANGCI_LINT_VERSION="2.6.2"

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

# ---- Go ----
RUN arch="$(dpkg --print-architecture)" \
    && curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-${arch}.tar.gz" -o /tmp/go.tar.gz \
    && rm -rf /usr/local/go \
    && tar -C /usr/local -xzf /tmp/go.tar.gz \
    && rm /tmp/go.tar.gz \
    && mkdir -p /go/bin

ENV GOROOT=/usr/local/go
ENV GOPATH=/home/vscode/go
ENV PATH="${GOPATH}/bin:${GOROOT}/bin:${PATH}"

# ---- golangci-lint ----
RUN arch="$(dpkg --print-architecture)" \
    && curl -fsSL "https://github.com/golangci/golangci-lint/releases/download/v${GOLANGCI_LINT_VERSION}/golangci-lint-${GOLANGCI_LINT_VERSION}-linux-${arch}.tar.gz" -o /tmp/golangci-lint.tar.gz \
    && tar -C /tmp -xzf /tmp/golangci-lint.tar.gz \
    && mv /tmp/golangci-lint-${GOLANGCI_LINT_VERSION}-linux-${arch}/golangci-lint /usr/local/bin/ \
    && chmod +x /usr/local/bin/golangci-lint \
    && rm -rf /tmp/golangci-lint*

# ---- OpenTofu CLI ----
# Download the architecture-appropriate OpenTofu archive and install the binary
RUN arch="$(dpkg --print-architecture)" \
    && curl -fsSL "https://github.com/opentofu/opentofu/releases/download/v${OPEN_TOFU_VERSION}/tofu_${OPEN_TOFU_VERSION}_linux_${arch}.zip" -o /tmp/tofu.zip \
    && unzip /tmp/tofu.zip -d /tmp \
    && mv /tmp/tofu /usr/local/bin/tofu \
    && chmod +x /usr/local/bin/tofu \
    && rm -rf /tmp/tofu.zip
