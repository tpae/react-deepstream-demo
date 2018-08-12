import { compose } from 'recompose';
import withList from './deepstream/hoc/withList';
import formData from './deepstream/hoc/formData';
import Board from './Board';

const enhance = compose(
  // board is the list key in Deepstream, and is passed in as messages as props
  withList('board', 'messages', {
    // handler function addMessage is passed into the component as props
    addMessage: (client, list, props) => (name, message) => {
      // create a unique id
      const messageId = client.getUid();
      // create a new record
      const record = client.record.getRecord(messageId);
      // when record is ready
      record.whenReady(record => {
        // set record data using messageType
        record.set(messageType(name, message));
        // when list is ready
        list.whenReady(list => {
          // add entry to the message
          list.addEntry(messageId);
        })
      })
    }
  }),
  formData(props => ({ name: '', content: '' }), props => {
    if (props.formData.name !== '' && props.formData.content !== '') {
      props.addMessage(props.formData.name, props.formData.content);
      props.setFormData({ name: props.formData.name, content: '' });
    }
  })
)

function messageType (name, content) {
  return {
    name,
    content,
    createdAt: Date.now()
  };
};

export default enhance(Board)
