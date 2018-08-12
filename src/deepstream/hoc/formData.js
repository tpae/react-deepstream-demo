import { compose, withHandlers, withState } from 'recompose';

// Higher-Order function to handle form submissions.
// I made this for this example, not perfect.
// The goal is to avoid using redux, and formData HOC can be reused
// anywhere in the code without modifying underlying architecture.
export default (initialData, onSubmit) => compose(
  withState('formData', 'setFormData', initialData),
  withHandlers({
    setFormValue: props => type => event => {
      const formData = Object.assign({}, props.formData);
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      formData[type] = value;
      props.setFormData(formData);
    },
    onSubmit: props => event => {
      event.preventDefault();
      onSubmit(props);
    }
  })
)
