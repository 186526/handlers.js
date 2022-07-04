# Handlers.js

> Handlers.js is a unified and lightweight web application framework for multiple platforms.

```ts
import handlerJS from "handlers.js";

const App = new handlerJS();

App.binding(
 "/",
 App.create("ANY", async () => "Hello World!")
);

App.useMappingAdapter();
App.listen(8080);
```

## Installation

```bash
# Use Yarn
yarn add handlers.js
# Use NPM
npm install handlers.js
```
