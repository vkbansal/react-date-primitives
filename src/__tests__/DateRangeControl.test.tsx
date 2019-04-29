import * as React from 'react';
import { shallow } from 'enzyme';

import { DateRangeControl, DateRangeControlRenderProps } from '../';
import { isSameMonth, addMonths, addDays, isSameDay } from '../utils';

function getRandomInt(): number {
    return Math.floor(Math.random() * 30 + 1);
}

function getLastArgs(args: any[][]) {
    return args[args.length - 1][0];
}

describe('<DateRangeControl /> tests', () => {
    const month = new Date(Date.UTC(2018, 0 /* Jan */, 1, 0, 0, 0, 0));

    test('Shows current month by default', () => {
        const render = jest.fn();
        shallow(<DateRangeControl render={render} />);
        const today = new Date();

        expect(render).toHaveBeenCalled();

        const args: DateRangeControlRenderProps = getLastArgs(render.mock.calls);

        expect(args.months.length).toBe(2);
        expect(isSameMonth(args.months[0], today)).toBe(true);
    });

    test('Shows given month when `startDate` is specified', () => {
        const render = jest.fn();
        shallow(<DateRangeControl render={render} startDate={month} />);

        expect(render).toHaveBeenCalled();

        const args: DateRangeControlRenderProps = getLastArgs(render.mock.calls);

        expect(args.months.length).toBe(2);
        expect(isSameMonth(args.months[0], month)).toBe(true);
    });

    test('Shows 3 months when `showThreeMonths` is true', () => {
        const render = jest.fn();
        shallow(<DateRangeControl showThreeMonths render={render} startDate={month} />);

        expect(render).toHaveBeenCalled();

        const args: DateRangeControlRenderProps = getLastArgs(render.mock.calls);

        expect(args.months.length).toBe(3);
    });

    test('Navigation works', () => {
        const render = jest.fn();
        shallow(<DateRangeControl render={render} startDate={month} />);

        expect(render).toHaveBeenCalledTimes(1);

        let args: DateRangeControlRenderProps = getLastArgs(render.mock.calls);

        const forwardSteps = getRandomInt();

        Array.from({ length: forwardSteps }, args.moveForward);

        expect(render).toHaveBeenCalledTimes(1 + forwardSteps);

        args = getLastArgs(render.mock.calls);

        expect(isSameMonth(args.months[0], addMonths(month, forwardSteps))).toBe(true);

        const backwardSteps = getRandomInt();

        Array.from({ length: backwardSteps }, args.moveBackward);

        expect(render).toHaveBeenCalledTimes(1 + forwardSteps + backwardSteps);

        args = getLastArgs(render.mock.calls);

        expect(isSameMonth(args.months[0], addMonths(month, forwardSteps - backwardSteps))).toBe(
            true
        );
    });

    describe('Date selection', () => {
        test('selecting a range works width `onDayClick`', () => {
            const render = jest.fn();
            const component = shallow(<DateRangeControl render={render} />);
            const today = new Date();

            expect(render).toHaveBeenCalledTimes(1);

            let args: DateRangeControlRenderProps = getLastArgs(render.mock.calls);

            expect(args.startDate).not.toBeDefined();
            expect(args.endDate).not.toBeDefined();

            const start = getRandomInt();
            const startDate = addDays(today, start);

            args.onDayClick(startDate);

            expect(render).toHaveBeenCalledTimes(2);
            expect(component.state('selectionActive')).toBe(true);

            args = getLastArgs(render.mock.calls);

            expect(isSameDay(startDate, args.startDate!)).toBe(true);
            expect(args.endDate).not.toBeDefined();

            const end = getRandomInt();
            const endDate = addDays(startDate, end);

            args.onDayClick(endDate);

            expect(render).toHaveBeenCalledTimes(3);
            expect(component.state('selectionActive')).toBe(false);

            args = getLastArgs(render.mock.calls);

            expect(isSameDay(startDate, args.startDate!)).toBe(true);
            expect(isSameDay(endDate, args.endDate!)).toBe(true);
        });

        test('re-selecting works when a range is already selected', () => {
            const render = jest.fn();
            const today = new Date();
            const start = getRandomInt();
            const end = getRandomInt();
            const startDate = addDays(today, start);
            const endDate = addDays(startDate, end);
            const component = shallow(<DateRangeControl {...{ render, startDate, endDate }} />);

            expect(render).toHaveBeenCalledTimes(1);

            let args: DateRangeControlRenderProps = render.mock.calls[0][0];

            expect(args.startDate).toBeDefined();
            expect(args.endDate).toBeDefined();

            const start2 = getRandomInt();
            const end2 = getRandomInt();
            const startDate2 = addDays(today, start2);
            const endDate2 = addDays(startDate2, end2);

            args.onDayClick(startDate2);

            expect(render).toHaveBeenCalledTimes(2);
            expect(component.state('selectionActive')).toBe(true);

            args = render.mock.calls[1][0];

            expect(isSameDay(startDate2, args.startDate!)).toBe(true);
            expect(args.endDate).not.toBeDefined();

            args.onDayClick(endDate2);

            expect(render).toHaveBeenCalledTimes(3);
            expect(component.state('selectionActive')).toBe(false);

            args = render.mock.calls[2][0];

            expect(isSameDay(startDate2, args.startDate!)).toBe(true);
            expect(isSameDay(endDate2, args.endDate!)).toBe(true);
        });

        test('allows selection of `endDate` only if the day is same-as/after `startDate`', () => {
            const render = jest.fn();
            const today = new Date();
            shallow(<DateRangeControl render={render} />);

            expect(render).toHaveBeenCalledTimes(1);

            let args: DateRangeControlRenderProps = getLastArgs(render.mock.calls);

            const start = getRandomInt();
            const startDate = addDays(today, start);

            args.onDayClick(startDate);
            args = getLastArgs(render.mock.calls);

            expect(args.endDate).not.toBeDefined();
        });
    });

    describe('Day Hover', () => {
        test('`onDayHover` does not work, if startDate is not selected', () => {
            const render = jest.fn();
            shallow(<DateRangeControl render={render} />);

            expect(render).toHaveBeenCalledTimes(1);

            let args: DateRangeControlRenderProps = getLastArgs(render.mock.calls);

            const n = getRandomInt();

            Array.from({ length: n }, () => {
                args = getLastArgs(render.mock.calls);
                args.onDayHover(addDays(month, getRandomInt()));
            });

            expect(args.startDate).not.toBeDefined();
            expect(args.endDate).not.toBeDefined();

            expect(render).toHaveBeenCalledTimes(1);
        });

        test('endDate updates with `onDayHover`', () => {
            const render = jest.fn();
            const today = new Date();
            shallow(<DateRangeControl render={render} />);

            expect(render).toHaveBeenCalledTimes(1);

            let args: DateRangeControlRenderProps = getLastArgs(render.mock.calls);

            const start = getRandomInt();
            const startDate = addDays(today, start);

            args.onDayClick(startDate);

            const n = getRandomInt();

            Array.from({ length: n }, () => {
                args = getLastArgs(render.mock.calls);
                const endDate = addDays(startDate, getRandomInt());
                args.onDayHover(endDate);

                args = getLastArgs(render.mock.calls);
                expect(isSameDay(endDate, args.endDate!)).toBe(true);
            });
        });

        test('`onDayHover` works only with days same-as/after startDate', () => {
            const render = jest.fn();
            const today = new Date();
            shallow(<DateRangeControl render={render} />);

            expect(render).toHaveBeenCalledTimes(1);

            let args: DateRangeControlRenderProps = getLastArgs(render.mock.calls);

            const start = getRandomInt();
            const startDate = addDays(today, start);

            args.onDayClick(startDate);
            expect(render).toHaveBeenCalledTimes(2);

            const n = getRandomInt();

            Array.from({ length: n }, () => {
                args = getLastArgs(render.mock.calls);
                const endDate = addDays(startDate, -1 * getRandomInt());
                args.onDayHover(endDate);

                args = getLastArgs(render.mock.calls);
                expect(args.endDate).not.toBeDefined();
            });

            expect(render).toHaveBeenCalledTimes(2);
        });
    });
});
