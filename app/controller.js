import Controller from 'cerebral';
import Model from 'cerebral-baobab';

const model = Model({
  title: 'You can change the url too!',
  data: {},
  color: '#333'
});

export default Controller(model);
