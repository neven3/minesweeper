import { spawn } from 'child_process';
import React from 'react';
import { CellState, CellValue } from '../../types';
import './Button.scss';

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
}

const Button: React.FC<ButtonProps> = ({ row, col, state, value }) => {
    return (
        <div
            className={`Button${state === CellState.visible ? ' visible' : ''}`}
        >
            {renderCellContent(state, value)}
        </div>
    );
};

export default Button;

function renderCellContent(state: number, value: number): React.ReactNode {
    if (state === CellState.visible) {
        switch (value) {
            case CellValue.one:
                return (<span>1</span>);
            case CellValue.two:
                return (<span>2</span>);
            case CellValue.bomb:
                return (<span role="img" aria-label="bomb">💣</span>);
            default:
                return (<span></span>);
        }
    } else if (state === CellState.flagged) {
        return (<span role="img" aria-label="flag">🏴‍☠️</span>);
    }
}