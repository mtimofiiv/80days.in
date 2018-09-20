---
layout: post
title:  "3 tips on building a modern embedded widget"
date:   2018-09-10 11:33:41 +0200
tags: [ 'widgets', 'javascipt', 'frontend' ]
masthead: https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Cygnus_Wall.jpg/1024px-Cygnus_Wall.jpg
---
Working for one client, I had to write a widget that would JustWork™ in clients' websites, adapting to their colour schemes and not interfering in their own scripts. It's actually not that hard when you identify the requirements of what you're doing! I thought I'd share my learnings with the community.

## 1. You don't need to use an `<iframe>` anymore

Iframes have been around for a long time, and many people will advise you to use these to create a universal widget due to the fact that it basically incapsulates your content within your own page. While this is true, and Iframes may be the answer if you need to still support really ancient browsers, they are also not very good for customisation.

For example, techniques to auto-style your widget based on the surrounding page's CSS will not work because your widget is locked in your frame. Also, your widget will take some hoops to jump over in order to dynamically resize it, such as with a chat widget that is docked on the bottom of the screen (like [Chatlio's](https://chatlio.com/) or [Intercom's](https://www.intercom.com/)).

The ideal method to embed your widget is like this:

```html
<div id="my-widget-root"></div>
<script src="https://mydomain.com/scripts/widget.js"></script>
<script>
MyWidget.init({ element: '#my-widget-root' });
</script>
```

This way, your client can specify the mount point via a selector, and your `MyWidget.init()` method might also take additional options (such as changing the locale, overriding the colour scheme, turning on debugging mode, etc).

Then, in your `init()` method, you simply need to do something like:

```js
const init = ({ element }) => {
  const mountOn = document.querySelector(element);
  /* code to mount your widget */
}
```

Your client can also trigger this widget at their leisure, such as perhaps when a user clicks a navigational tab. You also have access to the page's scope so if you wanted to, you could for example set an event listener on any other element of the page. Neat, right? Don't abuse this, that would be evil.

## 2. Adapt to the surrounding page's styling

Some people have white backgrounds and black text, some people visa versa, and everything in between exists too! So instead of explicitly forcing people to style your widget, why not try to automate as much as possible?

You might not get 100% of the styling, that is true. But even if you adapt to the correct background and text colours, those are things your users do not have to go through styling.

The difficulty is that in CSS, the parent of the parent of the parent (or even further up the stack) might contain the styling property you want. The following function is something I wrote that will recursively keep climbing up the DOM tree and look for the first node it can find which defines the given styling property.

```js
/**
  Gets a specified styling prop from the first parent element on which its set

  @param {DOMNode} el - the DOM node you'd like to start searching on
  @param {String} property - the styling property to look for, default is `color` - also useful is `backgroundColor`, but can also be used for borders, etc.

  @return {String} the value of the prop
**/
const getParentStyleProp = (el, property = 'color') => {
  const currentElement = el.constructor.toString().indexOf('HTMLDivElement') > -1 ? el : document.querySelector(el);
  if (!currentElement) return null;

  const computedStyle = document.defaultView.getComputedStyle(currentElement);
  const theProp = computedStyle.getPropertyValue(property);

  if (theProp && theProp !== 'transparent' && theProp !== 'rgba(0, 0, 0, 0)') {
    return theProp;
  }

  return currentElement.parentElement ? getParentStyleProp(currentElement.parentElement) : null;
};
```

You can use this like so:

```js
const myElement = document.getElementById('my-widget-root');
getParentStyleProp(myElement); //=> returns the first available text colour
```

The result of this function can be used in lots of ways – for example, lets say you want to give your buttons a background colour derived from the colour of the links on the page. Or you want to change the colour of a border to match the border of its containing element. All of that is possible!

**Bonus: you can use SVG graphics to make your widgets have dynamic images in them that can adapt colour based on their surroundings as well!**

## 3. Namespace CSS and encapsulate JS

What does that mean? Well, the last thing you or your client wants is to have your widget break their site. CSS selectors that are too general might interfere with their site's styling, and worse your JS might throw errors or re-define global scope variables that their site uses! Talk about a bad experience!

Take the following CSS:

```css
.widget { color: black; }
.widget a { color: #cecece; }
```

Perhaps this might seem fine if your widget's container class is `widget`, but what if your client has other elements on the page with that class?

```css
.mycompany-widget { color: black; }
.mycompany-widget a { color: #cecece; }
```

This might seem super simple, but by doing this from the beginning, you can save yourself headaches later.

Now, as for JS, take this piece of code:

```js
const headerColor = '#383838';
MyWidget.setHeaderColor(headerColor);
```

This will break horribly if there is already variable on the page with the name `headerColor` because you're trying to re-assign it. But even if it was re-assignable you would be overriding a global variable on the page!

```js
(function() {
  const headerColor = '#383838';
  MyWidget.setHeaderColor(headerColor);
})();
```

By wrapping the code in a self-running function, you are guaranteeing that your `headerColor` will co-exist peacefully with the `headerColor` that may or may not be in global scope.

In conclusion, the future is beautiful, and frontend development has grown a lot since the old days. By making modern design decisions you are going to save yourself pain and suffering later on.
