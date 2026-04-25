# Fullstack Web Development Part 14: Project

This repository is my showcase project for the University of Helsinki [Fullstack Web Development MOOC](https://fullstackopen.com). The goal of the project is to present the wide array of skills I've learned so far not only in web development, but also for example in container orchestration, ci/cd and systems infrastructure as a whole.

## The App

The app itself will be a game that I already piloted in another course part. However, as it was a mono repo container implementation using node and react, I need to review the whole code and refactor it into separate front- and backends. The code can be used as a game engine for multiple purposes but as an example, the aim of my game is to recognize the flag that is represented in a picture and choose the correct country from the given four possible countries.

## Requirements

- The infrastructure is deployed to Oracle Cloud Infrastructure (OCI) using IaaC (mainly Terraform and Ansible).
- The OCI Landing Zone is hardened and adheres to some Common Internet Security (CIS) Benchmarks.
- The application runs in containers on Kubernetes.
- Kubernetes is installed on hardened Compute VM hosts (OCI free tier) using k3s, a lightweight kubernetes distribution.
- The Kubernetes environment has logging and monitoring tools.
- Automation level is high (testing, CI/CD etc.)
- The frontend is written on React Native so that it can also be compiled into an Android App in a later increment.
- The backend uses GraphQL, which although not necessary, is chosen to showcase the course technologies.
- Instead of javascript, the project will use typescript as a baseline.
- A relational database will be used, but is not in focus
- The architecture of the project is displayed on various levels in mermaid diagrams.
- The app will have user management which requires use of authentication & authorization. Users have two possible access levels: free and premium. Users can upgrade their account using a mock payment provider.

## Use of AI

In this project, I've used the following AI models for dialog and references mainly through VS Code's GitHub Copilot and Gemini extensions. Also Google Antigravity was piloted in the context of this project. LLM models that have been used in the project are:

- Gemini 3.1 Pro
- Claude Haiku 4.5

Some parts of the project codebase are over 90% LLM generated. These files will have a comment on the first line, stating which AI model was used to generate the contents.