import React, { Component } from 'react';
import { Form, FormBox, Flow, Input, Select, SubmitButtonField, Table, Pagination} from '@bandwidth/shared-components';
import qs from 'qs';

export default class App extends Component {
  state = {
    loading   : false,
    messages  : null,
    page      : 0,
    pageSize  : 15,
    pageCount : 0,
  };


  handleSubmit = (ev) => {
    ev.preventDefault();
    this.setState({
      loading: true,
      messages  : null,
      page      : 0,
      pageSize  : 15,
      pageCount : 0,
    });
    var url = '/api/messages?';
    if (this.state.fromNumber) url   = url + '&from=' + this.state.fromNumber;
    if (this.state.toNumber) url     = url + '&to=' + this.state.toNumber;
    if (this.state.fromDateTime) url = url + '&fromDateTime=' + this.state.fromDateTime;
    if (this.state.toDateTime) url   = url + '&toDateTime=' + this.state.toDateTime;
    if (this.state.direction) url    = url + '&direction=' + this.state.direction;
    if (this.state.state) url        = url + '&state=' + this.state.state;

    fetch(url)
    .then((response) => {return response.json()})
    //   {
    //   if (response.status >= 400) {
    //     console.log(response);
    //     const err = new Error(response.message).status(response.status);
    //     throw err;
    //   }
    //   response.json()
    // })
    .then((json) => {
      if (json.messages === undefined) {
        this.setState({
          loading   : false,
          messages  : null,
          pageCount : 0,
          page      : 0,
        });
        return;
      }
      else if (json.messages.length === 0){
        this.setState({
          loading   : false,
          messages  : [{}],
          pageCount : 0,
          page      : 0,
        });
        return;
      }
      let pageCount;
      if (json.messages.length < this.state.pageSize) {
        pageCount = 1;
      }
      else {
        pageCount = 2;
      }
      this.setState({
        loading  : false,
        messages : json.messages,
        sortKey  : json.sortKey,
        pageCount
      });
    });
    // .catch( err => {
    //   console.log(err)
    // });
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
        let pageCount;
        if (json.messages.length < this.state.pageSize) {
          pageCount = this.state.pageCount;
        }
        else {
          pageCount = this.state.pageCount + 1;
        }
        this.setState({
          messages  : [...this.state.messages, ...json.messages],
          page      : pageNumber,
          sortKey   : json.sortKey,
          loading   : false,
          pageCount,
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
      <Table.Cell> {item.from} </Table.Cell>
      <Table.Cell> {item.to} </Table.Cell>
      <Table.Cell> {item.direction} </Table.Cell>
      <Table.Cell> {item.messageId} </Table.Cell>
      <Table.Cell> {item.state} </Table.Cell>
      <Table.Cell> {item.time} </Table.Cell>
    </Table.Row>
  );

  render() {
    return (
      <FormBox>
        <Form onSubmit={this.handleSubmit}>
          <Flow>
            <Flow.Row>
              <Flow.Item
                label="Sender Phone Number"
                helpText="Like: +14443332222"
              >
                <Input
                  value= {this.state.fromNumber}
                  onChange= {(ev) => this.setState({ fromNumber: ev.target.value })}
                />
              </Flow.Item>
              <Flow.Item
                label="Recpient Phone Number"
                helpText= "Like: +14443332222"
              >
                <Input
                  value= {this.state.toNumber}
                  onChange= {(ev) => this.setState({ toNumber: ev.target.value })}
                />
              </Flow.Item>
              <Flow.Item
                label="Direction"
                helpText="Direction of message"
              >
                <Select
                  label="Direction"
                  options={['in', 'out']}
                  value={this.state.direction}
                  onChange={(ev) => this.setState({ direction: ev })}
                />
              </Flow.Item>
            </Flow.Row>
            <Flow.Row>
              <Flow.Item
                label="From Date"
                helpText= "Like: yyyy-MM-dd"
              >
                <Input
                  value= {this.state.fromDateTime}
                  onChange={(ev) => this.setState({ fromDateTime: ev.target.value })}
                />
              </Flow.Item>
              <Flow.Item
                label="To Date"
                helpText= "Like: yyyy-MM-dd"
              >
                <Input
                  value = {this.state.toDateTime}
                  onChange={(ev) => this.setState({ toDateTime: ev.target.value })}
                />
              </Flow.Item>
              <Flow.Item
                label="Message State"
                helpText="Values are: received, queued, sending, sent, error"
              >
                <Select
                  label="State"
                  options={['received','queued','sending','sent','error',]}
                  value={this.state.state}
                  onChange={(ev) => this.setState({ state: ev })}
                />
              </Flow.Item>
            </Flow.Row>
          </Flow>
          <SubmitButtonField>
            Find
          </SubmitButtonField>
        </Form>

        {this.state.messages &&
          <Table.Simple
            loading={this.state.loading}
            columns={[
              {name: "from"},
              {name: "to"},
              {name: "direction"},
              {name: "messageId"},
              {name: "state"},
              {name: "time"}
            ]}
            items={this.state.messages.slice(this.state.pageSize * this.state.page, this.state.pageSize * (this.state.page + 1))}
            renderRow={this.renderRow}
          />
        }

        <Pagination pageCount={this.state.pageCount} currentPage={this.state.page} onPageSelected={this.pageChange} />

      </FormBox>
    );
  }
}
