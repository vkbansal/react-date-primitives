// import * as React from 'react';
import { DayOfMonth } from 'react-date-primitives';
import styled from 'react-emotion';
import { CSSObject } from 'create-emotion';

/**
 * These are internal modules to `react-date-primitives` and are used only for demo purposes only.
 * Please do not use in production. This might break in future without any notice.
 *
 * Use your favourite date library (eg: moment, date-fns, etc.) instead.
 */
import { isSameDay } from 'react-date-primitives/esm/components/utils';

const bgColor = '#d9534f';
const bgColorHover = '#eee';
const color = '#333';
const colorHover = color;
const colorSelected = '#fff';
const colorOutsideMonth = '#ddd';

export const Wrapper = styled('div')({
    display: 'inline-flex',
    border: '1px solid #eee'
});

export const LHS = styled('div')({
    background: bgColor,
    padding: '12px',
    width: '300px',
    textAlign: 'center',
    display: 'grid',
    gridTemplateColumns: '100%',
    gridTemplateRows: '25% 35% auto',
    justifyItems: 'center',
    alignItems: 'center',
    lineHeight: 1
});

export const LHSDay = styled('div')({
    color: '#fff'
});

export const LHSDate = styled('div')({
    fontSize: '4.5em',
    fontWeight: 'bold',
    color: '#fff'
});

export const LHSMonthAndYear = styled('div')({
    fontSize: '24px',
    opacity: 0.3,
    textTransform: 'uppercase',
    alignSelf: 'start'
});

export const RHS = styled('div')({
    margin: '12px',
    textAlign: 'center',
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 38px)',
    gridTemplateRows: 'repeat(8, 38px)',
    justifyItems: 'center',
    lineHeight: '38px',
    alignItems: 'center'
});

export const RHSMonthName = styled('div')({
    fontWeight: 'bold',
    textAlign: 'left',
    justifySelf: 'left',
    paddingLeft: '10px',
    gridColumnStart: 1,
    gridColumnEnd: 6
});

export interface ButtonProps {
    direction: 'left' | 'right';
}

export const Button = styled('button')(
    {
        width: '28px',
        height: '28px',
        display: 'block',
        position: 'relative',
        cursor: 'pointer',
        border: 'none',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        borderRadius: '4px',
        transition: 'background-color 0.1s ease-in-out',
        overflow: 'hidden',
        outline: 'none',
        '&:hover': {
            backgroundColor: bgColorHover
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'block',
            backgroundImage: 'url(./chevron.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '50%',
            backgroundPosition: '50%'
        }
    },
    (props: ButtonProps) => ({
        '&::before': {
            transform: props.direction === 'right' ? 'rotate(-90deg)' : 'rotate(90deg)'
        }
    })
);

const cellCSS: CSSObject = {
    width: '100%',
    height: '100%',
    color
};

export const Cell = styled('div')(cellCSS);

const today = new Date();

export const Day = styled('div')(cellCSS, (args: DayOfMonth) => {
    const isToday = isSameDay(today, args.date);

    return {
        borderRadius: '4px',
        fontWeight: isToday || args.selected ? 'bold' : 'normal',
        transition: 'background-color 0.1s ease-in-out',
        background: args.selected ? bgColor : 'transparent',
        color: (() => {
            if (!args.inCurrentMonth) {
                return colorOutsideMonth;
            }

            if (isToday && !args.selected) return bgColor;

            if (args.selected) return colorSelected;

            return color;
        })(),
        cursor: 'pointer',
        '&:hover': {
            color: (() => {
                if (!args.inCurrentMonth) {
                    return colorOutsideMonth;
                }

                if (isToday && !args.selected) return bgColor;

                if (args.selected) return colorSelected;

                return colorHover;
            })(),
            background: (() => {
                if (!args.inCurrentMonth) {
                    return 'transparent';
                }

                if (args.selected) {
                    return bgColor;
                }

                return bgColorHover;
            })()
        }
    };
});
