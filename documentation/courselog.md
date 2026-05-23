# Course log

## April 2026
| Date          | Log entry                                             | Hours spent   |
| ------------- | ----------------------------------------------------- | ------------- |
| April 17th | Officially started the project | 2 |
| April 19th | Created the foundation for the Apollo server | 2 |
| April 20th | MVP for backend with logging | 2 |
| April 21st | Added a smoke test and a simple pipeline | 2 |
| April 23rd | Planned the infrastructure layout for the OCI deployment | 1,5 |
| April 25th | Continued planning and cut all non free-tier resources, generated terraform code for the project LZ | 2,5 |
| April 25th | Python virtual environment installation | 1             |
| April 25th | OCI-CLI configuration tested and instructed           | 1,5           |
| April 25th | Refactored the LZ terraform code to account multiple projects and created a github action to deploy (or plan atleast for now)    | 1,5           |
| April 26th | Fixed the code so that the actual terraform commands can be run and did some other minor changes | 2            |
| April 26th | Created the LZ resources, made some changes ie. service account privileges. Github pipeline was tested | 2 |
| April 27th | Generated the app compartment Terraform code via rigorous dialog with Gemini  | 2 |
| April 28th | Started working with Ansible. Deployed the project terraform code but faced problems deploying the compute instances due to insufficient ARM capacity. | 2 |
| April 28th | Debugged OCI Bastion and Ansible. | 1,5 |
| April 29th | Some minor changes and fixing an issue with the OCI  | 1 |
| April 29th | Did some network debugging by deploying the environment. Still issues. Destroyed it for the night. | 1,5 |
| April 30th | Did research on OCI network infrastructure and came up with a new plan, but didn't have time to implement it | 1 |
| |  | **29** | 

## May 2026
| Date          | Log entry                                             | Hours spent   |
| ------------- | ----------------------------------------------------- | ------------- |
| May 1st | Drew the new network layout and refactored the project compartment terraform code | 2 | 
| May 1st | Worked on the k3s cluster, can't get bastion tunnel to work with kubectl but otherwise the cluster looks great | 4 |
| May 2nd | Got the Nginx test page working via the LB, reviewed all SL/NSG rules, added descriptions and removed overlapping rules. | 2 |
| May 3rd | Researched about implementing OCI Cloud Guard, but it's no longer available for free users. Reviewed documentation. Kubernetes planning. | 1,5 |
| May 4th | Back to work with the backend. Refactored the schema and worked with the helper script | 2 |
| May 6th | Changed the backend to connect to a postgres database (docker for dev) | 2,5 |
| May 7th | Backend production build works in containers with postgres | 1,5 |
| May 8th | Backend E2E tests locally and in the pipeline | 2 |
| May 9th | Skeleton framework for frontend, yay! Fetches data properly and renders basic quizzes. | 6 |
| May 12th | Added some user management elements to the backend, also implemented login mutation | 2,5 |
| May 13th | Backend development with scores table and user tests, frontend bottom bar with social links | 2,5 |
| May 14th | Made quite a lot of progress in CI/CD deployment, but still has manual steps | 5 |
| May 14th | Initial steps for enabling https in the future | 2 |
| May 15th | Researched domains and certificates. Bought a domain. Used the domain provider's DNS service to link it to the NLB via A-record. Added cert manager to cluster. | 5 |
| May 16th | Created a workflow and a process for semantic versioning and changelog. Also added a landing page for the main domain as the apps are in separate subdomains. | 6 |
| May 17th | Reviewed all files and added more comments. Need proper docstrings later. | 2 | 
| May 18th | Added categories to the Quiz | 3 | 
| May 19th | Finally quite satisfied with the mobile layout. Vite config allows for local mobile testing also now. | 2 | 
| May 20th | Now there's two ingresses, one on each node, to match backend sets. Also postgres is pinned on worker node for production DB PVC/PV. | 1 |
| May 21st | Added pod autoscaling for production plus limits and requests for both dev and frontend pods, deployed new versions etc. | 2 |
| May 22nd | Added a kanban board to keep track of project tasks. | 2 |
| May 23rd | Finished task '02 - Streak score component' by implementing it on the frontend. | 3 | 
| May 23rd | Started task '03 - Settings component' and implemented an initial cogwheel dropdown menu | 2 |