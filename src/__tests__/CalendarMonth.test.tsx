import * as React from 'react';
import { shallow } from 'enzyme';

import { CalendarMonth, CalendarMonthRenderProps } from '../CalendarMonth';
import { addDays, addMonths } from '../utils';

describe('<CalenderMonth /> tests', () => {
    const month = new Date(Date.UTC(2017, 0 /* Jan */, 1, 0, 0, 0, 0));

    test('calls render props with given month and its days', () => {
        const render = jest.fn();
        shallow(<CalendarMonth month={month} render={render} />);

        expect(render).toHaveBeenCalledTimes(1);
        const args: CalendarMonthRenderProps = render.mock.calls[0][0];
        expect(args.days).toMatchSnapshot();
        expect(args.dropdownMonths).not.toBeDefined();
        expect(args.dropdownYears).not.toBeDefined();
    });

    test('render prop has proper days selected when given', () => {
        const render = jest.fn();
        shallow(
            <CalendarMonth
                month={month}
                minDate={addDays(month, 5)}
                startDate={addDays(month, 10)}
                endDate={addDays(month, 20)}
                maxDate={addDays(month, 25)}
                render={render}
            />
        );

        const args: CalendarMonthRenderProps = render.mock.calls[0][0];
        expect(args.days).toMatchSnapshot();
    });

    test('minDate and maxDate get priorty over startDate and endDate', () => {
        const render = jest.fn();
        shallow(
            <CalendarMonth
                month={month}
                minDate={addDays(month, 10)}
                startDate={addDays(month, 5)}
                endDate={addDays(month, 25)}
                maxDate={addDays(month, 20)}
                render={render}
            />
        );

        const args: CalendarMonthRenderProps = render.mock.calls[0][0];
        expect(args.days).toMatchSnapshot();
        expect(args.days[1][0]).toMatchObject({
            selected: false,
            inRange: false
        });
    });

    test('showDropdowns gives apt props', () => {
        const render = jest.fn();
        shallow(<CalendarMonth showDropdowns month={month} render={render} />);

        const args: CalendarMonthRenderProps = render.mock.calls[0][0];
        expect(args.dropdownMonths).toMatchSnapshot();
        expect(args.dropdownYears).toMatchSnapshot();
    });

    test('dropdowns are updated when minDate, maxDate are given', () => {
        const render = jest.fn();
        const component = shallow(<CalendarMonth showDropdowns month={month} render={render} />);

        let args: CalendarMonthRenderProps = render.mock.calls[0][0];
        expect(args.dropdownMonths).toMatchSnapshot();
        expect(args.dropdownYears).toMatchSnapshot();

        component.setProps({
            minDate: addMonths(month, 2),
            maxDate: addMonths(month, 10)
        });

        args = render.mock.calls[1][0];
        expect(args.dropdownMonths[1]).toMatchObject({
            disabled: true
        });

        expect(args.dropdownMonths[11]).toMatchObject({
            disabled: true
        });
        expect(args.dropdownYears.length).toBe(1);

        expect(args.dropdownMonths).toMatchSnapshot();
        expect(args.dropdownYears).toMatchSnapshot();
    });
});
