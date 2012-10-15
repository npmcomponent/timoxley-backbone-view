
# backbone-view

  Backbone View [Component](https://github.com/component/component/wiki/Components)

## Installation

    $ component install timoxley/backbone-view

## Example

```js

var BackboneView = require('timoxley/backbone-view')

var DocumentRow = BackboneView.extend({

  tagName: "li",

  className: "document-row",

  events: {
    "click .icon":          "open",
    "click .button.edit":   "openEditDialog",
    "click .button.delete": "destroy"
  },

  render: function() {
    ...
  }

});

```

## API

See documentation for [Backbone.View](http://backbonejs.org/#View)

## Roadmap

Currently, this component depends on [component/jquery](https://github.com/component/jquery),
[component/underscore](https://github.com/component/underscore)
 and
[timoxley/backbone-events](https://github.com/timoxley/backbone-events). In future I
would like to phase out fat dependencies like these for more focussed components
such as [component/dom](https://github.com/component/dom),
[component/inherit](https://github.com/component/inherit) and
[component/emitter](https://github.com/component/emitter).

## License

[MIT](https://github.com/timoxley/backbone-view/blob/master/LICENSE)
