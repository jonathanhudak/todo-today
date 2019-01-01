import React, { createContext, useReducer } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

export const Store = createContext();
const reducer = (oldState, newState) => ({ ...oldState, ...newState });

function StoreProvider({ children, currentDay }) {
  const [state, setState] = useReducer(reducer, {
    currentDay: currentDay || moment(),
  });
  const store = { state, setState };
  return <Store.Provider value={store}>{children}</Store.Provider>;
}

export default function AppProviders({ children, ...restProps }) {
  return <StoreProvider {...restProps}>{children}</StoreProvider>;
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
