import React from 'react';
import { Comment, Form, Button } from 'semantic-ui-react';
import moment from 'moment';
import PropTypes from 'prop-types';

export default Board;

Board.propTypes = {
  messages: PropTypes.array,
  formData: PropTypes.object,
  setFormValue: PropTypes.func
};

Board.defaultProps = {
  messages: [],
  formData: {},
  setFormValue: () => {}
};

function Board (props) {
  return (
    <Comment.Group minimal>
      {props.messages.length > 0 && props.messages.map((message, i) =>
        <BoardMessage key={i} name={message.name} content={message.content} createdAt={message.createdAt} />
      )}
      <Form onSubmit={props.onSubmit}>
        <Form.Input
          placeholder='Name'
          value={props.formData.name}
          onChange={props.setFormValue('name')} />
        <Form.TextArea
          rows='2'
          placeholder='You got something to say?'
          value={props.formData.content}
          onChange={props.setFormValue('content')} />
        <Button content='Write Message' labelPosition='left' icon='edit' primary />
      </Form>
    </Comment.Group>
  )
}

function BoardMessage (props) {
  return (
    <Comment>
      <Comment.Avatar as='a' src={`https://robohash.org/${props.name}.png`} />
      <Comment.Content>
        <Comment.Author as='a'>
          {props.name}
        </Comment.Author>
        <Comment.Metadata>
          <span>{moment(props.createdAt).fromNow()}</span>
        </Comment.Metadata>
        <Comment.Text>{props.content}</Comment.Text>
      </Comment.Content>
    </Comment>
  )
}
