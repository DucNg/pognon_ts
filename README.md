This application allow you to manage expenses with other persons.

It's anonymous.

Backend is in Go and uses Echo. Frontend is in React and uses Material-UI.

# Installation

```shell
git clone https://github.com/DucNg/pognon_ts.git
cd pognon_ts
```

## Dev environment

### Backend

**Required: Go >= 1.15**

```shell
go run main.go -allow-cors
```

Access backend on http://localhost:8080/

### Frontend

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

## Prod environment

### Backend

**Required: Go >= 1.15**

```shell
go run main.go
```

### Frontend

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
