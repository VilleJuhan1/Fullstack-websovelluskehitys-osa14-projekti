# Python virtual environment installation and configuration for OCI-CLI and Terraform.

## Create and activate the virtual environment and install dependencies
```bash
# Run in Infrastructure/venv folder
python3.12 -m venv oci-automation
source oci-automation/bin/activate
which python # check that the python binary is from the virtual environment path
python --version # check python version
python -m pip install --upgrade pip # upgrade pip
python -m pip install -r requirements.txt # install dependencies
```

## Optional: Add an alias to your shell configuration file, ie. .zshrc, .bashrc etc. to activate the virtual environment easily
```bash
alias oci="source /<your path here>/oci-automation/bin/activate"
```

## Install Terraform

To install Terraform, you can follow the instructions on the official Terraform website or run the install_terraform.sh script *after* configuring the required variables and installing the virtual environment. The script does not install Terraform per se, but unzips the binaries to the virtual environment directory. When activating the venv, the binary is added to the path.

```bash
chmod +x install_terraform.sh
./install_terraform.sh
```

## Optional: Deactivate the virtual environment
```bash
deactivate
```