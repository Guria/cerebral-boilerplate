import { inputToState } from 'cerebral-addons';

function reload (input, state, output, { store }) {
  store.findAll(() => true).then(allObjects => {
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

function connect (input, state, output, { store }) {
  store.connect();
}

export default [
  [reload, {
    success: [inputToState('data', 'data')],
    error: []
  }]
];
