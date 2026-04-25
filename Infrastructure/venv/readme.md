# Python virtual environment installation and configuration for OCI-CLI and Terraform.

## How to create and activate the virtual environment and install dependencies
```bash
# Run in Infrastructure/venv folder
python3 -m venv oci-automation
source oci-automation/bin/activate
python -m pip install -r requirements.txt
```

## Optional: Create an alias to activate the virtual environment
```bash
alias oci="source /<your path here>/oci-automation/bin/activate"
```

## How to deactivate the virtual environment
```bash
deactivate
```

## How to install Terraform

To install Terraform, you can follow the instructions on the official Terraform website or run the install_terraform.sh script *after* configuring the required variables and installing the virtual environment. The script does not install Terraform per se, but unzips the binaries to the virtual environment directory. When activating the venv, the binary is added to the path.

```bash
chmod +x install_terraform.sh
./install_terraform.sh
```
