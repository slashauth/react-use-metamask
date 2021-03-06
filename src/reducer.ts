import { MetaMaskState } from './metamask-context';

type MetaMaskUnavailable = {
  type: 'metaMaskUnavailable';
};
type MetaMaskNotConnected = {
  type: 'metaMaskNotConnected';
  payload: {
    chainId: string;
  };
};
type MetaMaskConnected = {
  type: 'metaMaskConnected';
  payload: {
    accounts: string[];
    chainId: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eth: any;
};
type MetaMaskConnecting = {
  type: 'metaMaskConnecting';
};
type PermissionRejected = {
  type: 'metaMaskPermissionRejected';
};
type AccountsChanged = {
  type: 'metaMaskAccountsChanged';
  payload: string[];
};
type ChainChanged = {
  type: 'metaMaskChainChanged';
  payload: string;
};

export type Action =
  | MetaMaskUnavailable
  | MetaMaskNotConnected
  | MetaMaskConnected
  | MetaMaskConnecting
  | PermissionRejected
  | AccountsChanged
  | ChainChanged;

export function reducer(state: MetaMaskState, action: Action): MetaMaskState {
  switch (action.type) {
    case 'metaMaskUnavailable':
      return {
        chainId: null,
        account: null,
        status: 'unavailable',
      };
    case 'metaMaskNotConnected':
      return {
        chainId: action.payload.chainId,
        account: null,
        status: 'notConnected',
      };
    case 'metaMaskConnected':
      return {
        chainId: action.payload.chainId,
        account: action.payload.accounts[0],
        status: 'connected',
      };
    case 'metaMaskConnecting':
      if (state.status === 'initializing' || state.status === 'unavailable') {
        console.warn(
          `Invalid state transition from "${state.status}" to "connecting". Please, file an issue.`
        );
        return state;
      }
      return {
        ...state,
        account: null,
        status: 'connecting',
      };
    case 'metaMaskPermissionRejected':
      if (state.status === 'initializing' || state.status === 'unavailable') {
        console.warn(
          `Invalid state transition from "${state.status}" to "connecting". Please, file an issue.`
        );
        return state;
      }
      return {
        ...state,
        account: null,
        status: 'notConnected',
      };
    case 'metaMaskAccountsChanged':
      if (state.status !== 'connected') {
        console.warn(
          `Invalid accounts change in "${state.status}". Please, file an issue.`
        );
        return state;
      }
      if (action.payload.length === 0) {
        return {
          ...state,
          account: null,
          status: 'notConnected',
        };
      }
      return {
        ...state,
        account: action.payload[0],
      };
    case 'metaMaskChainChanged':
      if (state.status === 'initializing' || state.status === 'unavailable') {
        console.warn(
          `Invalid chain ID change in "${state.status}". Please, file an issue.`
        );
        return state;
      }
      return {
        ...state,
        chainId: action.payload,
      };
    // no default
  }
}
