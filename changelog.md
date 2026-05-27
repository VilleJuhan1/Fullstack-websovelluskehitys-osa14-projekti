# Project Changelog

| Version | Date | Title | Description | Quiz Image Dev Tag | Quiz Image Prod Tag |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1.0.0 | 2026-05-16 | Initial release | The first version of the app is online and available to users | brave-whale-43f0d5e | happy-wolf-77d7f62 |
| 1.0.1 | 2026-05-16 | Fix for dynamic changelog creation | Changed the logic on how the workflow pulls the latest images from Kustomize files.  | brave-whale-43f0d5e | happy-wolf-77d7f62 |
| 1.0.2 | 2026-05-16 | Fixes to release workflow | Configured time to display properly or changelog.  | brave-whale-43f0d5e | happy-wolf-77d7f62 |
| 1.1.0 | 2026-05-16 | Added a landing page for the sandbox environment | As the apps are deployed in their own subdomains, created a generic landing page to replace the unsafe nginx welcome page for main domain.  | brave-whale-43f0d5e | happy-wolf-77d7f62 |
| 1.1.1 | 2026-05-16 | Fixed a lint error | Workflow got stuck on some lint errors... My bad! Now fixed.  | brave-whale-43f0d5e | happy-wolf-77d7f62 |
| 1.1.2 | 2026-05-17 | Code review and documentation | Did a code review for the whole repository. Also changed the landing page layout slightly.  | brave-whale-43f0d5e | happy-wolf-77d7f62 |
| 1.1.3 | 2026-05-18 | Testing categories for Quiz game | Added a dropdown menu and logic for using the object categories provided by the backend data to have only questions related to that category (ie. Europe or 1996 Red/Blue Pokemon).  | obvious-wolf-f17f49a | happy-wolf-77d7f62 |
| 1.1.4 | 2026-05-18 | Just some documentation | Courselog update  | obvious-wolf-f17f49a| happy-wolf-77d7f62 |
| 1.1.5 | 2026-05-18 | Changelog workflow fixes | Fixed the changelog workflow that was applying latest to backend dev image in the changelog.md. Also added a small scaling test for frontend to better accommodate different screens.  | obvious-wolf-f17f49a | happy-wolf-77d7f62 |
| 1.1.6 | 2026-05-19 | Mobile layout tweaks | Made the homepage and quizpage components snap into corners and scale to the mobile screen, maybe.  | clever-lion-39c7526 | happy-wolf-77d7f62 |
| 1.1.7 | 2026-05-19 | Mobile layout fixes | Made some more tweaks to the mobile layout.  | clever-owl-233b3cb | happy-wolf-77d7f62 |
| 1.1.8 | 2026-05-20 | Two ingress controllers | Added another ingress controller so there's one for each node. Also pinned PostgreSQL pod on worker node.  | clever-owl-233b3cb | happy-wolf-77d7f62 |
| 1.1.9 | 2026-05-21 | Limits and requests | Added limits and requests for the app deployment: frontend, backend, postgres. Also horizontal autoscaling for production.  | clever-fox-00e92f3 | happy-wolf-77d7f62 |
| 1.1.10 | 2026-05-21 | Fixed deprecated syntax on kustomize files | Restarted app with newest images, did some kustomize rewrites with more modern syntax.  | clever-fox-00e92f3 | gentle-fox-2bb928b |
| 1.1.11 | 2026-05-22 | Kanban board for planning | Added a Kanban board for planning and keeping track of tasks. It uses the Markdown Kanban extension by holoooo for a graphical representation.  | clever-fox-00e92f3 | gentle-fox-2bb928b |
| 1.1.12 | 2026-05-23 | Streak score component |  | clever-fox-911dbb1 | gentle-fox-2bb928b |
| 1.2.0 | 2026-05-23 | Streak score to production | Added the streak score component also on production build.  | clever-fox-911dbb1 | brave-whale-834a168 |
| 1.2.1 | 2026-05-23 | Settings component placeholder | Settings component placeholder with no actual functionality to be tested on dev.  | clever-lion-62088d5 | brave-whale-834a168 |
| 1.3.0 | 2026-05-25 | Settings button and login framework | Added a settings button to top right corner and placeholders for login and signup pages. Also refactored the index.css for frontend into individual components.  | mighty-wolf-3dfd69a | brave-whale-834a168 |
| 1.3.1 | 2026-05-25 | Frontpage title move | Changed the positioning on domain root / landing page components.  | mighty-wolf-3dfd69a | brave-owl-173043c |
| 1.4.0 | 2026-05-27 | Login and signup | Users can be created although there's no validation yet. One can also login with a test user on dev. Sessions persist.  | clever-owl-65e4b5a | brave-owl-173043c |
| 1.4.1 | 2026-05-27 | Deployed to main | Deployed the latest features (login and signup) to main also.  | clever-owl-65e4b5a | mighty-whale-3160171 |
