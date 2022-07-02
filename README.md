# Handlers.js

> Handlers.js is a unified and lightweight web application framework for multiple platforms.

```ts
import handlerJS from "./";

const App = new handlerJS();

App.binding(
 "/",
 App.create("ANY", async () => "Hello World!")
);

App.useMappingAdapter();
App.listen(8080);
```