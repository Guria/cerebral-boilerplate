var Store = require('hoodie-client-store');
var inputToState = require('cerebral-addons/inputToState');

function Hoodie(controller, options) {
  options = options || {};
  var store = options.store || new Store('local');
  var signals = hoodieSignals(options.path || ['data']);

  controller.signal('hoodie.attached', signals.attached);
  controller.signal('hoodie.storeChanged', signals.storeChanged);

  function onStoreChange (action, doc) {
    controller.signals.hoodie.storeChanged({
      action: action,
      doc: doc
    });
  }

  function onStoreClear (action, doc) {
    controller.signals.hoodie.storeChanged({
      action: 'clear'
    });
  }

  store.on('change', onStoreChange);
  store.on('clear', onStoreClear);

  controller.signals.hoodie.attached({
    connect: options.connect
  });

  return controller.services.hoodie = {
    store: store,
    detach: function detach () {
      store.off('change', onStoreChange);
      store.off('clear', onStoreClear);
    }
  };

}

Hoodie.CustomStore = Store;
module.exports = Hoodie;

function hoodieSignals(path) {

  function connect (input, state, output, services) {
    var store = services.hoodie.store;

    if (input.connect) {
      store.connect();
    }
  }

  function checkAction (input, state, output) {
    output[input.action]();
  }
  checkAction.outputs = ['add', 'update', 'remove', 'clear'];

  function setHoodieDoc (input, state) {
    state.set(path.concat([input.doc.type, input.doc.id]), input.doc);
  }

  function unsetHoodieDoc (input, state) {
    state.unset(path.concat([input.doc.type, input.doc.id]));
  }

  function clearHoodiePath (input, state) {
    state.set(path, {});
  }

  function reload (input, state, output, services) {
    var store = services.hoodie.store;

    store.findAll(function () {
      return true;
    }).then(function(allObjects) {
      let data = allObjects.reduce((data, object) => {
        data[object.type] = data[object.type] || {};
        data[object.type][object.id] = object;
        return data;
      }, {});
      output.success({
        data
      });
    });
  }

  return {
    attached: [
      [reload, {
        success: [inputToState('data', path), connect],
        error: []
      }]
    ],

    storeChanged: [
      checkAction, {
        add: [setHoodieDoc],
        update: [setHoodieDoc],
        remove: [unsetHoodieDoc],
        clear: [clearHoodiePath]
      }
    ]
  };
}
