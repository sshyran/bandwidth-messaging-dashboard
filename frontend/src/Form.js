import React, { Component } from 'react';
import { Form, FormBox, TextField, FlexFields, SubmitButtonField, CodeBlock, Table, Pagination} from '@bandwidth/shared-components';
const qs = require('qs');

export default class App extends Component {
  state = {
    loading: false,
    messages: null,
    page: 0,
  };


  handleSubmit = (ev) => {
    ev.preventDefault();
    this.setState({ loading: true });
    var url = '/api/messages?';
    if (this.state.fromNumber) url   = url + '&from=' + this.state.fromNumber;
    if (this.state.toNumber) url     = url + '&to=' + this.state.toNumber;
    if (this.state.fromDateTime) url = url + '&fromDateTime=' + this.state.fromDateTime;
    if (this.state.toDateTime) url   = url + '&toDateTime=' + this.state.toDateTime;
    if (this.state.direction) url    = url + '&direction=' + this.state.direction;
    if (this.state.state) url        = url + '&state=' + this.state.state;
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        loading: false,
        messages  : json.messages,
        sortKey   : json.sortKey,
        page      : 0,
        pageSize  : 15,
        pageCount : 2,
      });
    });
  };

  fetchNewMessages = () => {
    const params = qs.stringify(this.state.sortKey)
    console.log(params);
    var url = `/api/messages?${params}`;
    console.log(url);
    return fetch(url)
    .then( res => res.json());
  };

  pageChange = (pageNumber) => {
    this.setState({ loading: true });
    const numberOfMessages = this.state.messages.length;
    const fetchNextPage = ((pageNumber * this.state.pageSize) >= numberOfMessages)
    if (fetchNextPage) {
      this.fetchNewMessages()
      .then( json => {
        this.setState({
          messages  : [...this.state.messages, ...json.messages],
          pageCount : this.state.pageCount + 1,
          page      : pageNumber,
          pageSize  : 15,
          sortKey   : json.sortKey,
          loading   : false
        });
      });
    }
    else {
      this.setState({
        loading : false,
        page    : pageNumber,
      })
    }
  }


  renderRow = (item) => (
    <Table.Row>
      <Table.Cell> {item.callbackUrl} </Table.Cell>
      <Table.Cell> {item.direction} </Table.Cell>
      <Table.Cell> {item.from} </Table.Cell>
      <Table.Cell> {item.id} </Table.Cell>
      <Table.Cell> {item.messageId} </Table.Cell>
      <Table.Cell> {item.state} </Table.Cell>
      <Table.Cell> {item.text} </Table.Cell>
      <Table.Cell> {item.media} </Table.Cell>
      <Table.Cell> {item.time} </Table.Cell>
      <Table.Cell> {item.to} </Table.Cell>
      <Table.Cell> {item.skipMMSCarrierValidation} </Table.Cell>
      <Table.Cell> {item.receiptRequested} </Table.Cell>
      <Table.Cell> {item.deliveryState} </Table.Cell>
      <Table.Cell> {item.deliveryCode} </Table.Cell>
      <Table.Cell> {item.deliveryDescription} </Table.Cell>
    </Table.Row>
  );

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



        {this.state.messages &&
          <Table.Simple
            loading={this.state.loading}
            columns={[
              {name: "callbackUrl" },
              {name: "direction" },
              {name: "from" },
              {name: "id" },
              {name: "messageId" },
              {name: "state" },
              {name: "text" },
              {name: "media" },
              {name: "time" },
              {name: "to" },
              {name: "skipMMSCarrierValidation" },
              {name: "receiptRequested" },
              {name: "deliveryState" },
              {name: "deliveryCode" },
              {name: "deliveryDescription" }
            ]}
            items={this.state.messages.slice(this.state.pageSize * this.state.page, this.state.pageSize * (this.state.page + 1))}
            renderRow={this.renderRow}
          />
          // <CodeBlock language="json">
          //   {JSON.stringify(this.state.data, null, '  ')}
          // </CodeBlock>
        }

        <Pagination pageCount={this.state.pageCount} currentPage={this.state.page} onPageSelected={this.pageChange} />

      </FormBox>
    );
  }
}
