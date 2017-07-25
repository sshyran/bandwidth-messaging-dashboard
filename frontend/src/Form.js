import React, { Component } from 'react';
import { Form, FormBox, TextField, FlexFields, SubmitButtonField, CodeBlock, Table } from '@bandwidth/shared-components';

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
    if (this.state.toNumber) url = url + '&to=' + this.state.to;
    if (this.state.fromDateTime) url = url + '&fromDateTime=' + this.state.fromDateTime;
    if (this.state.toDateTime) url = url + '&toDateTime=' + this.state.toDateTime;
    if (this.state.direction) url = url + '&direction=' + this.state.direction;
    if (this.state.state) url = url + '&state=' + this.state.state;
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
          <FlexFields>
            <TextField
                  label="From Date"
                  input={{
                    value: this.state.fromDateTime,
                    onChange: (ev) => this.setState({ fromDateTime: ev.target.value }),
                  }}
                />
          </FlexFields>
          <FlexFields>
            <TextField
                  label="To Date"
                  input={{
                    value: this.state.toDateTime,
                    onChange: (ev) => this.setState({ toDateTime: ev.target.value }),
                  }}
                />
          </FlexFields>
          <FlexFields>
            <TextField
                  label="Direction"
                  input={{
                    value: this.state.direction,
                    onChange: (ev) => this.setState({ direction: ev.target.value }),
                  }}
                />
          </FlexFields>
          <FlexFields>
            <TextField
                  label="Status"
                  input={{
                    value: this.state.state,
                    onChange: (ev) => this.setState({ state: ev.target.value }),
                  }}
                />
          </FlexFields>
          <SubmitButtonField>
            Find
          </SubmitButtonField>
        </Form>

        {this.state.data &&
          <Table.Simple
            loading="true"
            items=JSON.stringify(this.state.data, null, '  ')
          />
          // <CodeBlock language="json">
          //   {JSON.stringify(this.state.data, null, '  ')}
          // </CodeBlock>
        }

      </FormBox>
    );
  }
}
