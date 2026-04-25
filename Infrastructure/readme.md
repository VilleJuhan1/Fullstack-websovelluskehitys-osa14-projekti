# Infrastructure

The project will, hopefully, be deployed to OCI using free tier tenancy. Below are some initial plans on how to organize the assets there.

## Compartments
```text
└── root (Tenancy)
    └── Thesis-project (Parent Compartment)
        |
        │
        ├── 1. Network (Child Compartment)
        │    └── Resources: VCN, Public & Private Subnets, IGW, NAT GW, Route Tables, NSGs
        │
        └── 2. Compute (Child Compartment)
        │    └── Resources: VM Instances, Boot/Block Volumes
        │
        └── 3. Security & Access (Child Compartment)
             └── Resources: OCI Bastion Service, Load Balancer, Certificates, Vault/KMS
```

## IAM

As this is a solo project, there's not much need to fine-tune IAM policies on tenancy level. However for service accounts and pipelines to operate in the scope they're planned to, compartment admin role must be created.

## IAM

As this is a solo project, there's not much need to fine-tune IAM policies on tenancy level. However for service accounts and pipelines to operate in the scope they're planned to, compartment admin role must be created.

```text
└── Tenancy (Root)
    ├── Administrators Group (Solo Developer)
    │    └── Full access to all tenancy resources
    │
    └── Service Accounts & Pipelines Group
         └── Compartment Admin Policy
              └── Scoped access to 'Thesis-project' Compartment
```

### Service account policies

```text
Allow group ServiceAccountsGroup to manage all-resources in compartment 'Thesis-project'
```

## Layout


## Layout

The architectural layout is shown in a separate file here.