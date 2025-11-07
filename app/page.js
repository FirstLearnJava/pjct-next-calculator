'use client';
import styles from './page.module.scss';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import React, { useEffect, useReducer } from 'react';
import { actions } from './utils/actions';

function reducer(state, { type, payload }) {
  switch (type) {
    case actions.ADD_DIGIT:
      if (state.overwrite) {
        return { ...state, currentOperand: payload.digit, overwrite: false };
      }
      if (payload.digit === '0' && state.currentOperand === '0') return state;
      if (payload.digit === ',') {
        if (state.currentOperand == null) {
          return { ...state, currentOperand: '0,' };
        }
        if (state.currentOperand.includes(',')) {
          return state;
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };
    case actions.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case actions.CLEAR:
      return {};
    case actions.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case actions.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand.replace(',', '.'));
  const current = parseFloat(currentOperand.replace(',', '.'));
  if (isNaN(prev) || isNaN(current)) return '';
  let computation = '';
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '÷':
      computation = prev / current;
      break;
  }

  computation = Math.round(computation * 100000000) / 100000000;
  return computation.toString().replace('.', ',');
}

const INTEGER_FORMATTER = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(',');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)},${decimal}`;
}

export default function HomePage() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {},
  );

  useEffect(() => {
    document.addEventListener('keyup', dispatchKey);
    document.addEventListener('keydown', deleteKey);

    function deleteKey(e) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        dispatch({ type: actions.DELETE_DIGIT });
      }
    }

    function dispatchKey(e) {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        const digit = e.key;
        dispatch({ type: actions.ADD_DIGIT, payload: { digit } });
      }

      if (e.key === ',' || e.key === '.') {
        const digit = ',';
        dispatch({ type: actions.ADD_DIGIT, payload: { digit } });
      }

      if (['*', '+', '-'].includes(e.key)) {
        const operation = e.key;
        dispatch({ type: actions.CHOOSE_OPERATION, payload: { operation } });
      }

      if (e.key === '÷' || e.key === '/') {
        const operation = '÷';
        dispatch({ type: actions.CHOOSE_OPERATION, payload: { operation } });
      }

      if (e.key === 'Enter' || e.key === '=') {
        dispatch({ type: actions.EVALUATE });
      }
    }

    return () => {
      document.removeEventListener('keyup', dispatchKey),
        document.removeEventListener('keydown', deleteKey);
    };
  }, []);

  return (
    <div className={styles.title}>
      Online Calculator
      <div className={styles.calculatorGrid}>
        <div className={styles.output}>
          <div className={styles.previousOperand}>
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className={styles.currentOperand}>
            {formatOperand(currentOperand)}
          </div>
        </div>
        <button
          className={styles.spanTwo}
          onClick={() => dispatch({ type: actions.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: actions.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="," dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className={styles.spanTwo}
          onClick={() => dispatch({ type: actions.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}
