'use client';
import React, { useReducer } from 'react';

const ACTIONS = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  INCREASE_BY_FIVE: 'increase-by-five',
};

function reducer(value, action) {
  switch (action.type) {
    case ACTIONS.INCREASE:
      return value + 1;
    case ACTIONS.DECREASE:
      return value - 1;
    case ACTIONS.INCREASE_BY_FIVE:
      return value + action.payload;
  }
}

export default function page() {
  const [value, dispatch] = useReducer(reducer, 0);

  return (
    <div>
      <button onClick={() => dispatch({ type: ACTIONS.INCREASE })}>
        Increase
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DECREASE })}>
        Decrease
      </button>
      <button
        onClick={() => dispatch({ type: ACTIONS.INCREASE_BY_FIVE, payload: 5 })}
      >
        Add 5
      </button>

      {value}
    </div>
  );
}
