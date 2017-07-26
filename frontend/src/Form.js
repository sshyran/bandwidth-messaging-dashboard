import React, { Component } from 'react';
import { Form, FormBox, TextField, FlexFields, SubmitButtonField, CodeBlock, Table, Pagination} from '@bandwidth/shared-components';

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
    if (this.state.toNumber) url     = url + '&to=' + this.state.to;
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
        page      : this.state.page,
        pageSize  : 15,
        pageCount : 2,
      });
    });
  };

  fetchNewMessages = () => {
    var url = `/api/messages?sortKeyLT=${this.state.sortKey}`;
    console.log(url);
    return fetch(url)
    .then( res => res.json());
  };

  pageChange = (pageNumber) => {
    this.setState({ loading: true });
    const numberOfMessages = this.state.messages.length;
    console.log(numberOfMessages);
    console.log(pageNumber);
    console.log(this.state.pageSize);
    const fetchNextPage = ((pageNumber * this.state.pageSize) >= numberOfMessages)
    console.log(fetchNextPage);
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
            columns={[{
              name: 'text', displayName: 'Text',
            }]}
            items={this.state.messages.slice(this.state.pageSize * this.state.page, this.state.pageSize * (this.state.page + 1))}
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
