# To-do Kanban Board using [Markdown Kanban by holoooooo](https://marketplace.visualstudio.com/items?itemName=holoooooo.markdown-kanban) for Antigravity IDE

## Backlog

### Frontend testing

  - tags: [frontend, minor]
  - priority: high
  - workload: Hard
  - defaultExpanded: false

### Argo CD for automated deployment

  - tags: [kubernetes, minor]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false

### Prometheus & Grafana

  - tags: [kubernetes, minor]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false

### VM monitoring with Grafana

  - tags: [ansible, minor]
  - priority: low
  - workload: Easy
  - defaultExpanded: false

## Planned

### 04 - Menu page scaling on PC

  - due: 2026-05-31
  - tags: [frontend, patch]
  - priority: medium
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [ ] Review the current CSS file and refactor it so that this and future settings components use a similar outer border
    ```md
    The Quiz frontpage is quite small on wide PC screens. Implement a change that will match it with the GuizGame frame.
    ```

### 05 - Login and session persistence

  - due: 2026-06-07
  - tags: [frontend, dev, patch]
  - priority: medium
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [ ] Implement the login page
      - [ ] Implement the token based session persistence using a browser cookie
    ```md
    Add login and session persistence to dev environment using the test user credentials
    ```

### 06 - User streak score

  - due: 2026-06-07
  - tags: [frontend, backend, postgresql]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [ ] Review score schema and drop total tries etc. if still relevant
      - [ ] Adjust migrations if needed
      - [ ] Add a resolver that handles streak score queries and mutations. Ensure backend has the features also.
      - [ ] Test and deploy on dev
      - [ ] Publish as a minor release and deploy to prod
    ```md
    Implement the backend integration for streak score when user is logged in
    ```

### 07 - Persistent volume for postgresql

  - due: 2026-06-07
  - tags: [kubernetes, postgresql, production, minor]
  - priority: low
  - workload: Hard
  - defaultExpanded: false
  - steps:
      - [ ] Create the manifest for Persistent Volume
      - [ ] Create the manifest for Persisten Volume Claim
      - [ ] Add the mount point to the production Kustomize file
      - [ ] Add a backup policy for the Volume Group
    ```md
    Implement persistent volume for production database using the block volume attached to the worker node.
    ```

### 08 - Refactor index.css

  - due: 2026-05-31
  - tags: [frontend]
  - priority: low
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [ ] Refactor index.css into individual files for different components for better readability
    ```md
    Refactor index.css into individual files for different components for better readability
    ```

## In progress

### 03 - Settings component

  - due: 2026-05-31
  - tags: [frontend, minor]
  - priority: medium
  - workload: Normal
  - defaultExpanded: false
  - steps:
      - [x] Add the placeholder component to the corner and make it open a dropdown menu type list
      - [ ] Add the placeholder pages for login, signup etc.
      - [ ] Route from the settings component to the pages implemented
    ```md
    Add a floating settings element to the top right corner for future implements of login, signup, sign out, account information etc.
    ```

## Done

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

