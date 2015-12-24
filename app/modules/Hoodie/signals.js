import mounted from './signals/mounted';
import storeChanged from './signals/storeChanged';

import Store from 'hoodie-client-store';
import humbleLocalStorage from 'humble-localstorage';
import randomString from 'random-string';

// treat hash value as store id if not looks like a routable path
if (location.hash.length > 1 && location.hash[1] !== '/') {
  humbleLocalStorage.setItem('_storeId', location.hash.slice(1));
  location.hash = '';
}

var storeId = humbleLocalStorage.getItem('_storeId');
if (!storeId) {
  storeId = 'store-' + randomString({length: 7}).toLowerCase();
  humbleLocalStorage.setItem('_storeId', storeId);
}

var CustomStore = Store.defaults({
  remoteBaseUrl: location.origin + '/api'
});

export default (controller) => {

  let store = window.store = controller.services.store = new CustomStore(storeId);
  store.on('change', (action, doc) => { controller.signals.hoodie.storeChanged({ action, doc }); });
  store.on('clear', (action, doc) => { controller.signals.hoodie.storeChanged({ action: 'clear' }); });

  controller.signal('hoodie.mounted', mounted);
  controller.signal('hoodie.storeChanged', storeChanged);

  controller.signals.hoodie.mounted();

};
