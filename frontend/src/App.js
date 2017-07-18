import React, { Component } from 'react';
import Form from './Form';
import { BrowserRouter } from 'react-router-dom';
import { BandwidthThemeProvider, Navigation, Page, Spacing } from
  '@bandwidth/shared-components';

class App extends Component {
  render() {
    return (
      <BandwidthThemeProvider>
        <BrowserRouter>
          <div>
            <Navigation
              title="Message Reporting Dashboard"
              links={[
                { to: '/', exact: true, content: 'Home' },
                { to: 'https://bandwidth.com', content: 'Bandwidth' },
              ]}
            />
            <Page>
              <Spacing>
                <Form />
              </Spacing>
            </Page>
          </div>
        </BrowserRouter>
      </BandwidthThemeProvider>
    );
  }
}

export default App;
