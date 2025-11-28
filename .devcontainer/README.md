# Dev Container

This development container provides a consistent, reproducible environment for working on the cloud-resume project.

## What Gets Installed

### Base Image
- Ubuntu 24.04 devcontainer image with non-root `vscode` user

### Core OS Tools (via Dockerfile)
- `ca-certificates`, `curl`, `unzip`, `jq`, `less`, `build-essential`

### Languages & Runtimes (via devcontainer features)
- **Node.js** 24.11.1 with pnpm 9.15.0
- **Python** 3.12 with uv 0.9.11 for dependency management
- **Go** 1.25.4 with golangci-lint 2.6.2

### Security & Supply Chain Tools
- **Grype** 0.104.1 – vulnerability scanner
- **Syft** 1.38.0 – SBOM generator

### Infrastructure as Code
- **OpenTofu** 1.9.0
- **AWS CLI** (latest)

### Global CLI Tools (via post-create.sh)
- `@openai/codex`
- `@google/gemini-cli`
- `@fission-ai/openspec@latest`

### VS Code Extensions
- **Frontend**: Svelte, Prettier, Tailwind CSS
- **Documentation**: Terraform (HashiCorp), Markdown Mermaid
- **Languages**: Python, Pylance, Go
- **Testing**: Playwright
- **Git/CI**: GitLens, GitHub Actions

## Git Commit Signing

This container is configured to use **SSH-based commit signing**. The assumption is that the signing key is provided by **1Password** via the 1Password SSH agent.

When running in **DevPod** with 1Password SSH agent integration, commit signing works automatically—DevPod forwards your local SSH agent (including 1Password-managed keys) into the container.

### Running Without DevPod or 1Password SSH Agent

If you're not using DevPod or don't have SSH managed by 1Password, you'll need to configure commit signing manually:

#### Option 1: Disable Commit Signing
```bash
git config --local commit.gpgsign false
```

#### Option 2: Use Your Own SSH Key
1. Ensure your SSH key is available inside the container (mount or copy it)
2. Set your signing key:
   ```bash
   git config --local user.signingkey ~/.ssh/id_ed25519.pub
   ```

#### Option 3: Use GPG Signing Instead
1. Install GPG and import your key
2. Reconfigure git to use GPG:
   ```bash
   git config --local gpg.format openpgp
   git config --local user.signingkey YOUR_GPG_KEY_ID
   ```

#### Option 4: Forward Your Local SSH Agent
If you're using VS Code Remote Containers or another tool, ensure SSH agent forwarding is enabled:
1. Start your local SSH agent: `eval "$(ssh-agent -s)"`
2. Add your key: `ssh-add ~/.ssh/id_ed25519`
3. Ensure your devcontainer tool forwards the `SSH_AUTH_SOCK` environment variable

## Post-Create Setup

The `post-create.sh` script runs automatically after the container is created and:
1. Installs frontend dependencies (if `frontend/` exists with `package.json`)
2. Sets up Python virtual environment in `api/` (if present)
3. Configures SSH-based git commit signing
4. Installs global CLI tools via pnpm
