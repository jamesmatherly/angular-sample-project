# AngularSampleProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.7.

This project is meant as a learning exercise in Angular development, CI/CD implementation, and AWS integration.

The current iteration of the website as it appears in this repo can be found [here](http://jameslearnscloud.com)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Current unresolved issues

- ECS unable to drain and spin up new task on deploy.
    - Cause: ECS service does not have an instance available as the one it is using already has the container deployed to it
    - Potential solution 1: For *n* desired task replications, add *n+1* instances to cluster.
    - Potential solution 2: Use dynamic ports so that the new container does not collide with the previous one.

- Load balancing not switching automatically.
    - Cause: Load balancer technically does switch, but it must drain the old before registering the new as it is technically the same instance.
    - Potential solution 1: Add a target group to the load balancer for each instance in cluster and have more than 1 instance. Health checks should handle the rest
    - Potential solution 2: Use the AWS CLI to fetch the IP of the current task. Drain the old one from the load balancer and register the new one. Manually re-registering is much faster.
