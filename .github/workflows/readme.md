# Github Actions Workflows

## Deployed Actions

| Category | File | Description | Trigger |
|----------|------|-------------|---------|
| Tests | [backend-test.yaml](backend-test.yaml) | runs backend tests | push (#backend-test) |
| Tests | [lint.yaml](lint.yaml) | runs linting on code changes | on merge requests |
| Deploy | [changelog.yaml](changelog.yaml) | creates a new release | on merge requests |
| Deploy | [frontpage-deploy.yaml](frontpage-deploy.yaml) | Deploys frontpage | manual deploy |
| Deploy | [manual-deploy.yaml](manual-deploy.yaml) | Deploys backend & frontend | manual deploy |
| Terraform | [terraform-lz-create-or-update.yaml](terraform-lz-create-or-update.yaml) | Creates or updates the landing zone | manual deploy |
| Terraform | [terraform-lz-destroy.yaml](terraform-lz-destroy.yaml) | Destroys the landing zone | manual deploy |