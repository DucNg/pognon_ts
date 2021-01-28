# Pognon_ts

This application allow you to manage expenses with other persons.

It's anonymous.

Backend is in Go and uses Echo. Frontend is in React and uses Material-UI.

![logo](logo.svg)

## Features

* Multiple buyers
* Multiple persons benefits from the payment
* Calculate debts and credits
* Equal share for each participants

## TODO

* Add members
* Transaction details
* Save URL for previously created pognon
* Currencies
* Reactive

## Installation

```shell
git clone https://github.com/DucNg/pognon_ts.git
cd pognon_ts
```

### Dev environment

#### Backend

**Required: Go >= 1.15**

```shell
go run . -allow-cors
```

Access backend on http://localhost:8080/

#### Frontend

**Required: yarn or npm**

```shell
cd pognon-web-ui

yarn install
yarn start
# or
npm install
npm start
```

Access frontend on http://localhost:3000/

### Prod environment

[See CI](https://github.com/DucNg/pognon_ts/blob/master/.github/workflows/main.yml) or manualy with the following:

#### Backend

**Required: Go >= 1.15**

```shell
go run .
```

#### Frontend

**Required: yarn or npm**

```shell
cd pognon-web-ui

yarn install
yarn build
# or
npm install
npm build
```

Website will be available on http://localhost:8080/
