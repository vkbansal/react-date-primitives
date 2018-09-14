import * as React from 'react';
import { render } from 'react-dom';

import { SimpleDatePicker } from './SimpleDatePicker';

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center'
};

const App = () => (
    <div style={styles}>
        <SimpleDatePicker />
    </div>
);

render(<App />, document.getElementById('root'));
