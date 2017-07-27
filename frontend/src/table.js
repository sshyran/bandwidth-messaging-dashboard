import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BandwidthThemeProvider, Table, Money, Spacing } from
  '@bandwidth/shared-components';

class App extends Component {
  state = {
    data: [
      { foo: 'bar', bar: 0, baz: { corge: 'bop' } },
      { foo: 'bar2', bar: 3, baz: { iffy: 'plink' } },
      { foo: 'bar3', bar: -2, baz: { pie: 'crom' } },
      { foo: 'bar4', bar: 20, baz: { af: 'ib' } },
      { foo: 'bar5', bar: -3, baz: { wef: 'wvew' } },
      { foo: 'bar6', bar: 22, baz: { zet: 'avf' } },
      { foo: 'bar7', bar: 1, baz: { yui: 'asdf' } },
      { foo: 'bar8', bar: 9, baz: { shew: 'vzx' } },
      { foo: 'bar9', bar: 13, baz: { bizt: 'wrag' } },
      { foo: 'bar10', bar: 18, baz: { wump: 'zgze' } },
      { foo: 'bar11', bar: -88, baz: { oppo: 'awerga' } },
      { foo: 'bar12', bar: 31, baz: { indi: 'asdfac' } },
      { foo: 'bar13', bar: 56, baz: { rib: 'ioo' } },
      { foo: 'bar14', bar: -2, baz: { quo: 'uiio' } },
    ],
  };

  columns = [
    { name: 'foo', displayName: 'F000!!!', sortable: true },
    { name: 'bar', sortable: true },
    { name: 'baz' },
  ];

  handleSortChanged = (headerName, sortOrder) => {
    const basicSort = (a, b) => {
      switch (headerName) {
        case 'foo':
          return a.foo < b.foo ? -1 : 1;
        case 'bar':
          return a.bar - b.bar;
        default:
          return JSON.stringify(a.baz) < JSON.stringify(b.baz) ? -1 : 1;
      }
    };

    this.setState({
      data: this.state.data.sort((a, b) => {
        const basic = basicSort(a, b);
        if (sortOrder) {
          return basic * sortOrder;
        }
        return basic;
      }),
    });
  };

  renderRow = (item) => (
    <Table.Row>
      <Table.Cell>{item.foo}</Table.Cell>
      <Table.Cell><Money value={item.bar} /></Table.Cell>
      <Table.Cell>{JSON.stringify(item.baz)}</Table.Cell>
    </Table.Row>
  );

  render() {
    return (
      <BandwidthThemeProvider>
        <BrowserRouter>
          <Spacing>
            <Table.Simple
              items={this.state.data}
              columns={this.columns}
              renderRow={this.renderRow}
              onSortChanged={this.handleSortChanged}
              renderDetails={(item) => <Spacing>{JSON.stringify(item, null, '\t')}</Spacing>}
            />
            <Table.Simple
              items={this.state.data}
              columns={this.columns}
              onSortChanged={this.handleSortChanged}
            />
            <Table.Simple
              items={this.state.data}
              onSortChanged={this.handleSortChanged}
            />
            <Table.Simple
              items={this.state.data}
              columns={this.columns}
              onSortChanged={this.handleSortChanged}
              loading
            />
          </Spacing>
        </BrowserRouter>
      </BandwidthThemeProvider>
    );
  }
}

export default App;