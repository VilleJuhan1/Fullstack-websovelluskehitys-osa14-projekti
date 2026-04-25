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

## Configure OCI CLI
```bash
# Create an ecdsa 384 bit encrypted ssh-keypair. It needs to be a .pem file for OCI.
openssl genrsa -out ~/.oci/oci_api_key.pem 4096
openssl rsa -pubout -in ~/.oci/oci_api_key.pem -out ~/.oci/oci_api_key_public.pem

# Review the fingerprint
openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c

# Add OCI_API_KEY on a new line in your private key file as a safety measure like this:
-----END PRIVATE KEY-----
OCI_API_KEY

# Option 1
# Initialize the ~/.oci/config configuration file
[DEFAULT]
user=ocid1.user.oc1..your_user_ocid
fingerprint=your_calculated_fingerprint
tenancy=ocid1.tenancy.oc1..your_tenancy_ocid
region=us-ashburn-1
key_file=~/.oci/oci_api_key.pem

# Option 2
# Use the configuration wizard for configuring the ~/.oci/config file
oci setup config

# Add your public key to your profile in the OCI console.

# Test your setup (remember to have your venv activated all the time)
oci iam region-subscription list --output table
```