import { DayOfMonth } from 'react-date-primitives';
import styled from '@emotion/styled';
/**
 * These are internal modules to `react-date-primitives` and are used only for demo purposes only.
 * Please do not use in production. This might break in future without any notice.
 *
 * Use your favourite date library (eg: moment, date-fns, etc.) instead.
 */
import { isSameDay } from 'react-date-primitives/esm/utils';

const bgColor = '#d9534f';
const bgColorHover = '#eee';
const color = '#333';
const colorHover = color;
const colorSelected = '#fff';
const colorOutsideMonth = '#ddd';

export const Wrapper = styled.div`
    display: inline-flex;
    border: 1px solid #eee;
`;

export const LHS = styled.div`
    background: ${bgColor};
    padding: 12px;
    width: 300px;
    text-align: center;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 25% 35% auto;
    justify-items: center;
    align-items: center;
    line-height: 1;
`;

export const LHSDay = styled.div`
    color: #fff;
`;

export const LHSDate = styled.div`
    font-size: 4.5em;
    font-weight: bold;
    color: #fff;
`;

export const LHSMonthAndYear = styled.div`
    font-size: 24px;
    opacity: 0.6;
    text-transform: uppercase;
    align-self: start;
    color: #fff;
`;

export const RHS = styled.div`
    margin: 12px;
    text-align: center;
    display: grid;
    grid-template-columns: repeat(7, 38px);
    grid-template-rows: repeat(8, 38px);
    justify-items: center;
    line-height: 38px;
    align-items: center;
`;

export const RHSMonthName = styled.div`
    font-weight: bold;
    text-align: left;
    justify-self: left;
    padding-left: 10px;
    grid-column: 1 / 6;
`;

export interface ButtonProps {
    direction: 'left' | 'right';
}

export const Button = styled.button<ButtonProps>`
    width: 28px;
    height: 28px;
    display: block;
    position: relative;
    cursor: pointer;
    border: none;
    font-weight: bold;
    background-color: transparent;
    border-radius: 4px;
    transition: background-color 0.1s ease-in-out;
    overflow: hidden;
    outline: none;
    line-height: 1;

    &:hover {
        background-color: ${bgColorHover}
    }
}`;

export const Cell = styled.div`
    width: 100%;
    height: 100%;
    color: ${color};
`;

const today = new Date();

export const Day = styled.div<DayOfMonth & { selected: boolean }>`
    width: 100%;
    height: 100%;
    color: ${color};
    border-radius: 4px;
    transition: background-color 0.1s ease-in-out;
    cursor: pointer;
    font-weight: ${(props) => (isSameDay(today, props.date) || props.selected ? 'bold' : 'normal')};
    background: ${(props) => (props.selected ? bgColor : 'transparent')};
    color: ${(props) => {
        const isToday = isSameDay(today, props.date);

        if (!props.inCurrentMonth) {
            return colorOutsideMonth;
        }

        if (isToday && !props.selected) return bgColor;

        if (props.selected) return colorSelected;

        return color;
    }};

    &:hover {
        color: ${(props) => {
            const isToday = isSameDay(today, props.date);

            if (!props.inCurrentMonth) {
                return colorOutsideMonth;
            }

            if (isToday && !props.selected) return bgColor;

            if (props.selected) return colorSelected;

            return colorHover;
        }};
        background: ${(props) => {
            if (!props.inCurrentMonth) {
                return 'transparent';
            }

            if (props.selected) {
                return bgColor;
            }

            return bgColorHover;
        }};
    }
`;
