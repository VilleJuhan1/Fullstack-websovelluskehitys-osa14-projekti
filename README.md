# Fullstack Web Development Part 14: Project

This repository is my thesis for the University of Helsinki [Fullstack Web Development MOOC](https://fullstackopen.com). The goal of the project is to showcase the wide array of skills I've learned so far not only in web development, but also for example in container orchestration, ci/cd and systems infrastructure as a whole.

## The App

The app itself will be a game that I already piloted in another course part. However, as it was a mono repo container implementation using node and react, I need to review the whole code and refactor it into separate front and backends. The code can be used for multiple purposes but as an example, the aim of my game is to recognize the flag that is represented in a picture and choose the correct option from four possible candidates.

## Initial requirements

- The infrastructure is deployed to OCI using IaaC (mainly Terraform and Ansible).
- The OCI LZ is hardened and adheres to some CIS LVL standards.
- The application runs in containers on Kubernetes.
- Kubernetes is installed on hardened VM hosts (free tier) using some lighter version, ie. k3s.
- The Kubernetes environment has logging and monitoring tools.
- Automation level is high (testing, CI/CD etc.)
- The frontend, most likely a game of sorts, is written on React Native so that it can also be compiled into an Android App in a later increment.
- The backend uses GraphQL, which although not necessary, is chosen to showcase the course technologies.
- Instead of javascript, the project will use typescript as a baseline.
- A relational database will be used, but is not in focus
- The architecture of the project is displayed on various levels in mermaid diagrams.