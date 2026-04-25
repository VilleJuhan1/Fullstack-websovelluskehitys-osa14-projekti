#!/bin/bash

# Check the available versions from https://releases.hashicorp.com/terraform/

# 1. The variables for the script, remember to match your system
TF_VERSION="1.14.9" # Latest stable version on 2026-04-25
OS="darwin" # Use "darwin" for macOS and "linux" for linux
ARCH="arm64" # Use "arm64" for Apple Silicon and "amd64" for x86_64 processor architectures
BINARY_NAME="terraform_${TF_VERSION}_${OS}_${ARCH}.zip"
CHECKSUM_FILE="terraform_${TF_VERSION}_SHA256SUMS"
VENV_BIN="./oci-automation/bin"

# 2. Ensure we are in a python virtual environment to prevent package conflicts
if [ ! -d "$VENV_BIN" ]; then
    echo "Error: Virtual environment directory '$VENV_BIN' not found."
    exit 1
fi

echo "--- Starting Terraform Installation for venv ---"

# 3. Download the Terraform binary and checksum file
echo "Downloading Terraform v$TF_VERSION..."
curl -sL -O "https://releases.hashicorp.com/terraform/${TF_VERSION}/${BINARY_NAME}"
curl -sL -O "https://releases.hashicorp.com/terraform/${TF_VERSION}/${CHECKSUM_FILE}"

# 4. Check the downloaded binary against the downloaded checksum file
echo "Verifying checksum..."
grep "$BINARY_NAME" "$CHECKSUM_FILE" | sha256sum -c -

if [ $? -eq 0 ]; then
    echo "Checksum verification successful!"
else
    echo "Error: Checksum verification FAILED! The download may be corrupted or tampered with."
    exit 1
fi

# 5. Extract and install the binary to provided path (VENV_BIN)
echo "Installing to $VENV_BIN..."
unzip -o "$BINARY_NAME" -d "$VENV_BIN"
chmod +x "$VENV_BIN/terraform"

# 6. Cleanup the downloaded files
rm "$BINARY_NAME" "$CHECKSUM_FILE"

echo "--- Installation Complete ---"
"$VENV_BIN/terraform" -version