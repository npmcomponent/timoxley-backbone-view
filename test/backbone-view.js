var view;
var BackboneView = require('backbone-view');
var BackboneEvents = require('timoxley-backbone-events');
var assert = require('timoxley-assert');
var $ = require('component-jquery');
var _ = require('component-underscore');

describe("BackboneView", function() {
  beforeEach(function() {
    view = new BackboneView({
      id        : 'test-view',
      className : 'test-view'
    });
  });


it("constructor", function() {
  assert.equal(view.el.id, 'test-view');
  assert.equal(view.el.className, 'test-view');
  assert.equal(view.options.id, 'test-view');
  assert.equal(view.options.className, 'test-view');
});

it("jQuery", function() {
  var view = new BackboneView;
  view.setElement('<p><a><b>test</b></a></p>');
  assert.strictEqual(view.$('a b').html(), 'test');
});

it("make", function() {
  var div = view.make('div', {id: 'test-div'}, "one two three");

  assert.equal(div.tagName.toLowerCase(), 'div');
  assert.equal(div.id, 'test-div');
  assert.equal($(div).text(), 'one two three');
});

it("make can take falsy values for content", function() {
  var div = view.make('div', {id: 'test-div'}, 0);
  assert.equal($(div).text(), '0');

  var div = view.make('div', {id: 'test-div'}, '');
  assert.equal($(div).text(), '');
});

it("initialize", function() {
  var View = BackboneView.extend({
    initialize: function() {
      this.one = 1;
    }
  });

  assert.strictEqual(new View().one, 1);
});

it("delegateEvents", function() {
  var counter1 = 0, counter2 = 0;

  var view = new BackboneView({el: '<p><a id="test"></a></p>'});
  view.increment = function(){ counter1++; };
  view.$el.on('click', function(){ counter2++; });

  var events = {'click #test': 'increment'};

  view.delegateEvents(events);
  view.$('#test').trigger('click');
  assert.equal(counter1, 1);
  assert.equal(counter2, 1);

  view.$('#test').trigger('click');
  assert.equal(counter1, 2);
  assert.equal(counter2, 2);

  view.delegateEvents(events);
  view.$('#test').trigger('click');
  assert.equal(counter1, 3);
  assert.equal(counter2, 3);
});

it("delegateEvents allows functions for callbacks", function() {
  var view = new BackboneView({el: '<p></p>'});
  view.counter = 0;

  var events = {
    click: function() {
      this.counter++;
    }
  };

  view.delegateEvents(events);
  view.$el.trigger('click');
  assert.equal(view.counter, 1);

  view.$el.trigger('click');
  assert.equal(view.counter, 2);

  view.delegateEvents(events);
  view.$el.trigger('click');
  assert.equal(view.counter, 3);
});

it("undelegateEvents", function() {
  var counter1 = 0, counter2 = 0;

  var view = new BackboneView({el: '<p><a id="test"></a></p>'});
  view.increment = function(){ counter1++; };
  view.$el.on('click', function(){ counter2++; });

  var events = {'click #test': 'increment'};

  view.delegateEvents(events);
  view.$('#test').trigger('click');
  assert.equal(counter1, 1);
  assert.equal(counter2, 1);

  view.undelegateEvents();
  view.$('#test').trigger('click');
  assert.equal(counter1, 1);
  assert.equal(counter2, 2);

  view.delegateEvents(events);
  view.$('#test').trigger('click');
  assert.equal(counter1, 2);
  assert.equal(counter2, 3);
});

it("_ensureElement with DOM node el", function() {
  var View = BackboneView.extend({
    el: document.body
  });

  assert.equal(new View().el, document.body);
});

it("_ensureElement with string el", function() {
  var View = BackboneView.extend({
    el: "body"
  });
  assert.strictEqual(new View().el, document.body);

  View = BackboneView.extend({
    el: "#testElement > h1"
  });
  assert.strictEqual(new View().el, $("#testElement > h1").get(0));

  View = BackboneView.extend({
    el: "#nonexistent"
  });
  assert.ok(!new View().el);
});

it("with className and id functions", function() {
  var View = BackboneView.extend({
    className: function() {
      return 'className';
    },
    id: function() {
      return 'id';
    }
  });

  assert.strictEqual(new View().el.className, 'className');
  assert.strictEqual(new View().el.id, 'id');
});

it("with attributes", function() {
  var View = BackboneView.extend({
    attributes: {
      id: 'id',
      'class': 'class'
    }
  });

  assert.strictEqual(new View().el.className, 'class');
  assert.strictEqual(new View().el.id, 'id');
});

it("with attributes as a function", function() {
  var View = BackboneView.extend({
    attributes: function() {
      return {'class': 'dynamic'};
    }
  });

  assert.strictEqual(new View().el.className, 'dynamic');
});

it("multiple views per element", function() {
  var count = 0;
  var $el = $('<p></p>');

  var View = BackboneView.extend({
    el: $el,
    events: {
      click: function() {
        count++;
      }
    }
  });

  var view1 = new View;
  $el.trigger("click");
  assert.equal(1, count);

  var view2 = new View;
  $el.trigger("click");
  assert.equal(3, count);

  view1.delegateEvents();
  $el.trigger("click");
  assert.equal(5, count);
});

it("custom events, with namespaces", function() {
  var count = 0;

  var View = BackboneView.extend({
    el: $('body'),
    events: function() {
      return {"fake$event.namespaced": "run"};
    },
    run: function() {
      count++;
    }
  });

  var view = new View;
  $('body').trigger('fake$event').trigger('fake$event');
  assert.equal(count, 2);

  $('body').unbind('.namespaced');
  $('body').trigger('fake$event');
  assert.equal(count, 2);
});

it("#1048 - setElement uses provided object.", function() {
  var $el = $('body');

  var view = new BackboneView({el: $el});
  assert.ok(view.$el === $el);

  view.setElement($el = $($el));
  assert.ok(view.$el === $el);
});

it("#986 - Undelegate before changing element.", function() {
  var button1 = $('<button></button>');
  var button2 = $('<button></button>');

  var View = BackboneView.extend({
    events: {
      click: function(e) {
        assert.ok(view.el === e.target);
      }
    }
  });

  var view = new View({el: button1});
  view.setElement(button2);

  button1.trigger('click');
  button2.trigger('click');
});

it("#1172 - Clone attributes object", function() {
  var View = BackboneView.extend({
    attributes: {foo: 'bar'}
  });

  var view1 = new View({id: 'foo'});
  assert.strictEqual(view1.el.id, 'foo');

  var view2 = new View();
  assert.ok(!view2.el.id);
});

it("#1228 - tagName can be provided as a function", function() {
  var View = BackboneView.extend({
    tagName: function() {
      return 'p';
    }
  });

  assert.ok(new View().$el.is('p'));
});

it("dispose", function() {
  var View = BackboneView.extend({
    events: {
      click: function() { assert.ok(false); }
    },
    initialize: function() {
      this.model.on('all x', function(){ assert.ok(false); }, this);
      this.collection.on('all x', function(){ assert.ok(false); }, this);
    }
  });

  var view = new View({
    model: new _.extend({}, BackboneEvents),
    collection: new _.extend({}, BackboneEvents)
  });

  view.dispose();
  view.model.trigger('x');
  view.collection.trigger('x');
  view.$el.click();
});

it("dispose with non Backbone objects", function() {
  var view = new BackboneView({model: {}, collection: {}});
  view.dispose();
});

it("view#remove calls dispose.", function() {
  var view = new BackboneView();

  view.dispose = function() { assert.ok(true); };
  view.remove();
});

it("Provide function for el.", function() {
  var View = BackboneView.extend({
    el: function() {
      return "<p><a></a></p>";
    }
  });

  var view = new View;
  assert.ok(view.$el.is('p:has(a)'));
});
});
