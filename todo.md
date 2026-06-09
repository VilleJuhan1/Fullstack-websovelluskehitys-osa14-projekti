# To-do Kanban Board using [Markdown Kanban by holoooooo](https://marketplace.visualstudio.com/items?itemName=holoooooo.markdown-kanban) for Antigravity IDE

## Backlog

### Language support

  - tags: [frontend]
  - defaultExpanded: false
    ```md
    Add language support for finnish / swedish
    ```

### More categories

  - tags: [backend, postgresql]
  - defaultExpanded: false
    ```md
    Find 1-2 more APIs for new categories for quizzes
    ```

## Planned

### 18 - Backend test coverage

  - due: 2026-06-14
  - tags: [backend, tests]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [ ] Figure out the test coverage toolkit
      - [ ] Add more tests while checking coverage
      - [ ] 80 % backend test coverage
    ```md
    Ensure that backend tests cover main functionalities
    ```

### 19 - Argo CD for automated deployment

  - due: 2026-06-14
  - tags: [kubernetes, minor]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false

### 20 - Frontpage Hub Features

  - due: 2026-06-14
  - tags: [frontpage]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [ ] Argo CD and Grafana links
      - [ ] About
      - [ ] Link to Quiz game
    ```md
    The cloud hub should include links to Argo and Grafana (both using 2fa secure authentication), production version of the quiz game and a short introductory ingress.
    ```

## In progress

### 21 - Ensure every component has a dedicated readme

  - due: 2026-06-25
  - tags: [documentation]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Github workflows
      - [ ] App
      - [x] App/backend
      - [ ] App/frontend
      - [ ] App/frontpage
      - [ ] Infrastructure
      - [ ] Infrastructure/ansible
      - [ ] Infrastructure/docker
      - [ ] Infrastructure/kubernetes
      - [ ] Infrastructure/scripts
      - [ ] Infrastructure/terraform
      - [ ] Infrastructure/venv
      - [ ] Project root
    ```md
    Review the existing documentation and add where missing to transfer from planning phase to live phase
    ```

## Done

### 16 - Plan new features for frontpage

  - due: 2026-06-07
  - tags: [frontpage, plan]
  - priority: low
  - workload: Easy
  - defaultExpanded: false
    ```md
    Cloud LZ (domain root) could use some additional functionalities: Grafana link, blogs, CV, links. Plan the features and actions required to implement them.
    ```

### 07 - Persistent volume for postgresql

  - due: 2026-06-07
  - tags: [kubernetes, postgresql, production, minor]
  - priority: low
  - workload: Hard
  - defaultExpanded: false
  - steps:
      - [x] Create the manifest for Persistent Volume
      - [x] Create the manifest for Persisten Volume Claim
      - [x] Add the mount point to the production Kustomize file
      - [x] Add a backup policy for the Volume Group
    ```md
    Implement persistent volume for production database using the block volume attached to the worker node.
    ```

### 17 - More tests for frontend testing

  - due: 2026-06-14
  - tags: [frontend, patch]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Review vitest coverage
      - [x] Review Playwright e2e test coverage
      - [x] Add tests that cover majority of the frontend functionalities
    ```md
    Need more coverage for frontend tests
    ```

### 12 - Frontend testing

  - due: 2026-06-07
  - tags: [frontend, minor]
  - priority: high
  - workload: Hard
  - defaultExpanded: false
  - steps:
      - [x] Socials bar
      - [x] Settings bar
      - [x] Quiz selection screen
    ```md
    Create an automated testing framework for the frontend
    ```

### 06 - User streak score

  - due: 2026-06-07
  - tags: [frontend, backend, postgresql]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Review score schema and drop total tries etc. if still relevant
      - [x] Adjust migrations if needed
      - [x] Add a resolver that handles streak score queries and mutations. Ensure backend has the features also.
      - [x] Test and deploy on dev
      - [x] Publish as a minor release and deploy to prod
    ```md
    Implement the backend integration for streak score when user is logged in
    ```

### 13 - Automated backups

  - tags: [terraform]
  - priority: medium
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [x] Create a custom volume backup policy and assignment for the block volume
    ```md
    Create an automated backup policy for the kube-worker block volume
    ```

### 15 - Grafana Loki

  - due: 2026-05-31
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Create the PV/PVC
      - [x] Add the NSG rule for internal cluster traffic
      - [x] Add the deployment
      - [x] Add Loki as a datasource
    ```md
    Add another data source for Grafana to review system and kubernetes logs.
    ```

### 14 - Monitoring dashboards

  - due: 2026-06-07
  - tags: [grafana]
  - priority: low
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Dabble with the dashboards until satisfied
      - [x] Create a readme file for configuring the dashboards and alerts
    ```md
    Create one glance dashboards for Grafana to monitor the cluster
    ```

### 11 - VM monitoring with Grafana

  - tags: [patch]
  - priority: low
  - workload: Easy
  - defaultExpanded: false
    ```md
    Use node exporter to gather data from compute nodes
    ```

### 10 - Prometheus & Grafana

  - tags: [kubernetes, minor]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Create manifests
      - [x] Create the Ansible installation steps
      - [x] Test
      - [x] Run linters
    ```md
    Add a monitoring stack to the environment
    ```

### 09 - Lint workflow

  - due: 2026-06-07
  - tags: [github]
  - priority: low
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Ansible lint
      - [x] Kubernetes lint (if exists)
      - [x] Frontend lint
      - [x] Backend lint
      - [x] Frontpage lint
      - [x] Python lint
    ```md
    Add a workflow that runs lint on all subdirectories when doing a pull request.
    ```

### 08 - Validations

  - due: 2026-06-07
  - tags: [frontend, backend]
  - priority: medium
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [x] Validate user email address
      - [x] Validate user passwords
    ```md
    Add validators for email address and passwords
    ```

### 05 - Login and session persistence

  - due: 2026-06-07
  - tags: [frontend, dev, patch]
  - priority: medium
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [x] Implement the login page
      - [x] Implement the token based session persistence using a browser cookie
    ```md
    Add login and session persistence to dev environment using the test user credentials
    ```

### 01 - Example task

  - due: 2026-05-22
  - tags: [documentation]
  - priority: high
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Learn the syntax
      - [x] Convert tasks
    ```md
    Learn to use Kanban extension for Antigravity IDE
    ```

### 04 - Menu page scaling on PC

  - due: 2026-05-31
  - tags: [frontend, patch]
  - priority: medium
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [x] Review the current CSS file and refactor it so that this and future settings components use a similar outer border
    ```md
    The Quiz frontpage is quite small on wide PC screens. Implement a change that will match it with the GuizGame frame.
    ```

### 03 - Settings component

  - due: 2026-05-31
  - tags: [frontend, minor]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Add the placeholder component to the corner and make it open a dropdown menu type list
      - [x] Add the placeholder pages for login, signup etc.
      - [x] Route from the settings component to the pages implemented
    ```md
    Add a floating settings element to the top right corner for future implements of login, signup, sign out, account information etc.
    ```

### 08 - Refactor index.css

  - due: 2026-05-31
  - tags: [frontend]
  - priority: low
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Refactor index.css into individual files for different components for better readability
    ```md
    Refactor index.css into individual files for different components for better readability
    ```

### 02 - Streak score component

  - due: 2026-05-24
  - tags: [frontend, backend, minor]
  - priority: high
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Implement streak score as a stateful component to frontend
      - [x] Implement the graphical representation of streak to QuizGame component
      - [x] Build and deploy to dev
      - [x] Publish as a new minor release when implemented to production
    ```md
    The game will track only streak score for each category and subcategory. Implement the stateful component.
    ```

