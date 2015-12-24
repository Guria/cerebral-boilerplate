function checkAction (input, state, output) {
  output[input.action]();
}
checkAction.outputs = ['add', 'update', 'remove', 'clear'];

function set (input, state) {
  state.set(['data', input.doc.type, input.doc.id], input.doc);
}

function unset (input, state) {
  state.unset(['data', input.doc.type, input.doc.id]);
}

function clear (input, state) {
  state.set(['data'], {});
}

export default [
  checkAction, {
    add: [set],
    update: [set],
    remove: [unset],
    clear: [clear]
  }
];
