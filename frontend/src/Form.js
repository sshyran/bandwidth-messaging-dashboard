import React, { Component } from 'react';
import { Form, FormBox, TextField, FlexFields, SubmitButtonField, CodeBlock, Table, Accordion } from '@bandwidth/shared-components';

export default class GithubForm extends Component {
  state = {
    githubUser: '',
    loading: false,
    data: null,
  };

  handleSubmit = (ev) => {
    ev.preventDefault();

    this.setState({ loading: true });
    var url = '/api/messages?';
    if (this.state.fromNumber) url = url + '&from=' + this.state.fromNumber;
    if (this.state.fromNumber) url = url + '&to=' + this.state.fromNumber;
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      //${this.state.githubUser}
      this.setState({ data: json, loading: false });
    });
  };


  render() {
    return (
      <FormBox>
        <Form onSubmit={this.handleSubmit}>
          <FlexFields>
            <TextField
                  label="Sender Phone Number"
                  input={{
                    value: this.state.fromNumber,
                    onChange: (ev) => this.setState({ fromNumber: ev.target.value }),
                  }}
                />
          </FlexFields>
          <FlexFields>
            <TextField
                  label="Recpient Phone Number"
                  input={{
                    value: this.state.toNumber,
                    onChange: (ev) => this.setState({ toNumber: ev.target.value }),
                  }}
                />
          </FlexFields>
          <SubmitButtonField>
            Find
          </SubmitButtonField>
        </Form>

        {this.state.data &&
          <CodeBlock language="json">
            {JSON.stringify(this.state.data, null, '  ')}
          </CodeBlock>
        }

      </FormBox>
    );
  }
}
