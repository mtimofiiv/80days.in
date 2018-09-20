---
layout: post
title:  "How to use events for DOM complete"
date:   2018-09-10 11:33:41 +0200
tags: [ 'widgets', 'javascipt', 'frontend' ]
category: tech
masthead: https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Cygnus_Wall.jpg/1024px-Cygnus_Wall.jpg
---
These days in the age of `<script>` tags getting the `async` and `defer` attributes, you might want to include a `.js` file on your site, and then use its methods inline or in another script file.

Take this snippet for example:

```html
<html>
  <head>
    <script src="myscript.js" deferred></script>
  </head>
  <body>
  <script>
  ObjectFromScript.init({ apiKey: 'key' });
  </script>
  </body>
</html>
```

You don't want to run into the problem where your `.init()` function is called before the `ObjectFromScript` is available!

Well, there's a perfect solution to this problem, and that is to use events. If you're not familiar with them, events drive dynamic web features, for example they get fired when users move their mouse, click something, etc. But nothing is stopping you from emitting a custom event when your library loads, to tell scripts relying on it to run their code!

So you might write this in your `.js` file:

```js
const ObjectFromScript = {};

ObjectFromScript.init = () => {
  // do things here
}

const loadedEvent = new Event('mylib.loaded');
document.dispatchEvent(loadedEvent);
```

And then in that same HTML page from before:

```html
<html>
  <head>
    <script src="myscript.js" deferred></script>
  </head>
  <body>
  <script>
  document.addEventListener('mylib.loaded', () => {
    ObjectFromScript.init({ apiKey: 'key' });
  });
  </script>
  </body>
</html>
```

Viola! Now all will work beautifully.
