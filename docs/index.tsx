import * as React from 'react';
import { render } from 'react-dom';

import code from 'raw-loader!./examples/SimpleDateRangePicker.tsx';
import { SimpleDatePicker } from './examples/SimpleDatePicker';
import { SimpleDateRangePicker } from './examples/SimpleDateRangePicker';

function App() {
    return (
        <div>
            <SimpleDateRangePicker />
            <pre>{code}</pre>
        </div>
    );
}

render(<App />, document.getElementById('main'));
