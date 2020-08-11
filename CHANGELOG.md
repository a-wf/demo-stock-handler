# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.0.5]

### Added

- some integration tests (new coverage: 81%)

## [v1.0.4] - 2020-08-09

### Added

- some unit tests (coverage: 76%)

## [v1.0.3] - 2020-08-09

### Added

- jsDoc description
- README.md
- Dockerfile
- docker-compose.yaml

## [v1.0.2] - 2020-08-08

### Changed

- optimise some queries algorithm
- rename fields of the datamodel

## [v1.0.1] - 2020-08-08

### Fixed

- fix bug about error handler & middleware
- fix bug about ObjectId format check
- fix duplicate key errors

## [v1.0.0] - 2020-08-08

### Added

- service logic (/services/queries.js)

## [v0.2.0] - 2020-08-08

### Added

- express server + routes + security middleware
- datamodel design (with mongoose schema)
- rate-limiter support (with rate-limiter-flexible)
- logger support (with winston)

## [v0.1.0] - 2020-08-07

### Added

- mongodb support (with mongoose)
- API design (openapi format)
- configuration support (with dotenv)

## [Created] - 2020-08-07

- eslint support
- prettier support
- using yarn
