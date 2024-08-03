<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📝API와 배치 의존관계 분리

### 배치(Batch)

```
💡 배치 란 일괄처리를 뜻하며,
컴튜터는 혼자 일괄처리를 할 수 없기 때문에 스케줄을 사용하여 일정 주기를 정해준다.
```

### 🔥의존관계 분리하지 않을 경우 발생하는 문제점🔥

### 1. API 장애로 배치 작업 중단

- API와 배치 작업이 동일한 프로그램에서 실행될 경우, API에서 장애가 발생한다면 배치 작업도 중단된다.

### 2. 배치 작업 장애로 API 요청 불가

- 배치 작업에서 장애가 발생하면 전체 프로그램이 중단되면서 API 요청도 처리할 수 없게 된다.

### 3. API 처리 속도 저하에 따른 배치작업 실패

- API 요청 수가 증가함에 따라 API의 처리 속도가 느려지면, 전체적인 프로그램에 영향을 주어 배치 작업 또한 제대로 실행되지 않게 된다.

### 4. 중복처리로 인한 리소스낭비

- 요청 수의 증가로 api 서버를 하나 추가하게 되면, 2개의 배치가 각각 동일한 데이터를 처리하게 되면서 중복된 작업이 발생하며 이를 다시 데이터베이스에 삽입(insert)해줘야 하기 때문에 되어 리소스 낭비가 된다.

### 5. 비용 낭비 발생

- API 서버는 요청 수 증가에 맞춰 복제하여 쉽게 확장할 수 있지만,
  배치는 주로 대량의 데이터 처리 작업을 하는 경우가 많아 하드웨어를 업그레이드 해줘야하는 경우 같은 프로그램안에 있다면 API도 함께 업그레이드해줘야 해서 비용낭비가 발생한다.

<br>

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
