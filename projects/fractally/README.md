<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

-   [Setup](#setup)
-   [Running locally](#running-locally)
-   [Electron App](#electron-app)
    -   [Runing electron app on dev mode](#runing-electron-app-on-dev-mode)
    -   [Packaging the electron app for distribution](#packaging-the-electron-app-for-distribution)
-   [Misc. commands](#misc-commands)
-   [Repo structure](#repo-structure)
    -   [Apps](#apps)
    -   [Publishable packages](#publishable-packages)
-   [Fractally Architecture](#fractally-architecture)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setup

This repo uses [pnpm](https://pnpm.io/)

```sh
# Install pnpm with your preferred method: https://pnpm.io/installation.
npm i -g pnpm

# Install all dependencies.
pnpm i
```

## Running locally

```sh
# this will spin up the required apps to run
pnpm dev

# then just go to the local website
open http://localhost:3000

# running graphql workspace
open http://localhost:3010/graphql

# running Storybook to elaborate, play and have better visualization of the UI components
cd packages/components
pnpm storybook
```

## Electron App

Electron is separate from the monorepo workspace due to many restrictions and conflicts; also because the build is completely different.

### Runing electron app on dev mode

```sh
# open electron folder and install dependencies
cd electron
yarn

# make sure you have the local environment running with `pnpm dev` and then:
yarn dev
```

### Packaging the electron app for distribution

```sh
# make sure you have built and export the webapp first
cd apps/webapp
pnpm build
pnpm export
cd ../../electron
yarn copy-next

# finally build the executables in the `electron/dist` folder
docker run -v "$(pwd)":/project \
    electronuserland/builder:wine \
    /bin/bash -c "yarn --link-duplicates --pure-lockfile && yarn dist-electron --win --linux"
```

## Misc. commands

```sh
# when changing the core api `apps/core`, in case new graphql resolvers are added or updated
# add new query/mutation operations on the: apps/webapp/src/operations.graphql
# and then run the following command to generate new react-query hooks:
cd apps/webapp
pnpm generate:gql

# to generate this file table of contents (TOC)
pnpm doctoc
```

## Repo structure

### Apps

Contains all the Fractally applications such as the core server, nextjs web app and electron app.

### Publishable packages

The [`packages`](packages) folder contains examples of packages you would usually end up publishing to `npm`. Therefore, the configs and build process are tailored to producing publishable artifacts that will depend on other packages from the monorepo.

## Fractally Architecture

TODO: Write how the apps interact with each other here. And possibly, insert a diagram to make it easier to reason.
