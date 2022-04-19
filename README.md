# LEAGUE of Amazing Programmers

[![ci](https://github.com/TritonSE/LAP-Student-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/TritonSE/LAP-Student-Tracker/actions/workflows/ci.yml)

Application for the League of Amazing Programmers to act as a central hub for their school. Features inlcude (but are not limited to) taking student attendance, scheduling classes intelligently, viewing enrollment information, and supporting calendar views to keep track of all events hapening around the League. 

## Setup

Requires:

- NodeJS + NPM
- Docker

First, install all the necessary dependencies:

```bash
$ npm install
```

Next, start the backend's Postgres database:

```bash
$ docker-compose up -d db
```

The database will start and bind to `http://localhost:5432`

Run database migrations to get the database up to date:

```bash
$ npm run migrate
```

Finally, start the server:

```bash
$ npm run dev
```

The web application will start and bind to `http://localhost:3000`
