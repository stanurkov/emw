# Electron multi-window


<!-- [![MIT][mit-image]][mit-url] -->

> A simple example for Electron JS on utilizing multiple windows controlled from a single panel


<!-- [mit-image]: https://github.com/stanurkov/observed-object/blob/master/mit.svg -->
<!-- [mit-url]: https://gitlab.com/stanurkov/emw/blob/master/LICENSE -->


## Introduction

Here is another experiment on creating cross-platform applications based on Electron JS 


#### Installation

Pre-requisites: NodeJS and Yarn package manager should be installed on your system

When you have your system ready, proceed with Node JS environment setup:

```sh
cd emw
yarn install
```

#### Running a developer's build

Electron JS applications currently require two processes to be run simultaneously. 

The first one is Front-end packaging served by WebPack dev-server:

```sh
yarn start
```

The second one is Electron JS itself. So, open a new terminal window and 

```sh
cd emw/
yarn electron
```

