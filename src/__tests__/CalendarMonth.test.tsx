import * as React from 'react';
import { shallow } from 'enzyme';

import { CalendarMonth, CalendarMonthRenderProps } from '../';
import { addDays, addMonths } from '../components/utils';

describe('<CalenderMonth /> tests', () => {
    const month = new Date(Date.UTC(2017, 0 /* Jan */, 1, 0, 0, 0, 0));

    test('calls render props with given month and its days', () => {
        const render = jest.fn();
        shallow(<CalendarMonth month={month} render={render} />);

        expect(render).toHaveBeenCalledTimes(1);
        const args: CalendarMonthRenderProps = render.mock.calls[0][0];
        expect(args.days).toMatchSnapshot();
        expect(args.monthsDropdown).not.toBeDefined();
        expect(args.yearsDropdown).not.toBeDefined();
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
        // srd in snapshot means selected, inRange, disabled
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
        // srd in snapshot means selected, inRange, disabled
        expect(args.days).toMatchSnapshot();
    });

    test('showDropdowns gives apt props', () => {
        const render = jest.fn();
        shallow(<CalendarMonth showDropdowns month={month} render={render} />);

        const args: CalendarMonthRenderProps = render.mock.calls[0][0];
        expect(args.monthsDropdown).toMatchSnapshot();
        expect(args.yearsDropdown).toMatchSnapshot();
    });

    test('dropdowns are updated when minDate, maxDate are given', () => {
        const render = jest.fn();
        const component = shallow(<CalendarMonth showDropdowns month={month} render={render} />);

        let args: CalendarMonthRenderProps = render.mock.calls[0][0];
        expect(args.monthsDropdown).toMatchSnapshot();
        expect(args.yearsDropdown).toMatchSnapshot();

        component.setProps({
            minDate: addMonths(month, 2),
            maxDate: addMonths(month, 10)
        });

        args = render.mock.calls[1][0];
        expect(args.monthsDropdown[1]).toMatchObject({
            disabled: true
        });

        expect(args.monthsDropdown[11]).toMatchObject({
            disabled: true
        });
        expect(args.yearsDropdown.length).toBe(1);

        expect(args.monthsDropdown).toMatchSnapshot();
        expect(args.yearsDropdown).toMatchSnapshot();
    });
});
