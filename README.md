# Knowledge Hub API

# Docker Hub image 
**Repository:** https://hub.docker.com/r/notev1l/nodejs-2026q1-knowledge-hub-app

```bash
docker pull notev1l/nodejs-2026q1-knowledge-hub-app
```

Final application image size is: ~352MB

## Requirements

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Installation

#### Clone the repository:
```
git clone https://github.com/notev1l/nodejs-2026q1-knowledge-hub.git
cd nodejs-2026q1-knowledge-hub
```

#### Install dependencies:
```bash
npm install
```

## Running application

#### Development:
```
npm run start:dev
```

#### Production:
```
npm start
```

The server will start on `http://localhost:4000`.

After starting the app on port 4000 (the default port), the OpenAPI documentation will be available at http://localhost:4000/doc/

# Endpoints

| Resource   | Base Route  |
|------------|-------------|
| Users      | `/user`      |
| Articles   | `/article`   |
| Categories | `/category`  |
| Comments   | `/comment`   |

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

To run refresh token tests

```
npm run test:refresh
```

To run RBAC (role-based access control) tests

```
npm run test:rbac
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
