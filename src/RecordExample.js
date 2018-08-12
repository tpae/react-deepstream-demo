import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { compose, withState } from 'recompose';
import withRecord from './deepstream/hoc/withRecord';

const enhance = compose(
  withState('messageData', 'setMessageData', ''),
  withRecord('recordexample', 'message', {
    onSubmit: (client, record, props) => e => {
      e.preventDefault();
      record.whenReady(record => {
        record.set({ message: props.messageData });
        props.setMessageData('');
      });
    }
  })
)

export default enhance(RecordExample);

function RecordExample (props) {
  return (
    <div>
      <h3>{props.message && props.message.message}</h3>
      <Form onSubmit={props.onSubmit}>
        <Form.TextArea
          rows='2'
          placeholder='Something goes here'
          value={props.messageData}
          onChange={e => props.setMessageData(e.target.value)} />
        <Button>Submit</Button>
      </Form>
    </div>
  )
}
