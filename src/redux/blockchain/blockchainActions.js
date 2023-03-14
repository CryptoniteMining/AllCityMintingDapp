// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Walletsdk from "@coinbase/wallet-sdk";

// log
import { fetchData } from "../data/dataActions";

const INFURA_ID = "";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // required
      rpc: {
        1: "https://mainnet.infura.io/v3/a36cccb119624eaa8ac337a0b8ffce41", // Mainnet
      },
    },
  },
  Walletsdk: {
    package: Walletsdk, // Required
    options: {
      appName: "Rooks", // Required
      infuraId: "", // Required unless you provide a JSON RPC url; see rpc below
      rpc: "https://mainnet.infura.io/v3/a36cccb119624eaa8ac337a0b8ffce41", // Optional if infuraId is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      appLogoUrl: null, // Optional. Application logo image URL. favicon is used if unspecified
      darkMode: false, // Optional. Use dark theme, defaults to false
    },
  },
  'custom-coinbase': {
    display: {
        name: 'Coinbase',
        description: 'Scan with WalletLink to connect',
    },
    options: {
        appName: 'Rooks', // Your app name
        networkUrl: "https://mainnet.infura.io/v3/a36cccb119624eaa8ac337a0b8ffce41",
        chainId: 1,
    },
    package: Walletsdk,
    connector: async (_, options) => {
      const { appName, chainId } = options;
      const Walletsdk = new Walletsdk({appName});
      const provider = Walletsdk.makeWeb3Provider(chainId);
      await provider.enable();
      return provider;
    },
},
};

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    try {
      const abiResponse = await fetch("/config/abi.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const abi = await abiResponse.json();
      const configResponse = await fetch("/config/config.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const CONFIG = await configResponse.json();
      localStorage.removeItem("walletconnect");
      localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: false, // optional
        providerOptions, // required
      });
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      console.log("web", web3);
      Web3EthContract.setProvider(provider);
      const accounts = await web3.eth.getAccounts();
      const networkId = await provider.request({
        method: "net_version",
      });
      console.log("networkId", networkId);
      if (networkId == CONFIG.NETWORK.ID) {
        const SmartContractObj = new Web3EthContract(
          abi,
          CONFIG.CONTRACT_ADDRESS
        );
        dispatch(
          connectSuccess({
            account: accounts[0],
            smartContract: SmartContractObj,
            web3: web3,
          })
        );
        // Add listeners start
        provider.on("accountsChanged", (accounts) => {
          dispatch(updateAccount(accounts[0]));
        });
        provider.on("chainChanged", () => {
          window.location.reload();
        });
        // Add listeners end
      } else {
        dispatch(connectFailed(`To continue, change network to ${CONFIG.NETWORK.NAME}.`));
      }
    } catch (err) {
      console.log("error", err, " message", err.message);
      if (
        typeof err !== "undefined" &&
        typeof err.message !== "undefined" &&
        err.message.includes("User Rejected")
      ) {
        dispatch(connectFailed("User rejected the request"));
      } else if (
        (typeof err === "string" || err instanceof String) &&
        err.includes("Modal closed by user")
      ) {
        dispatch(connectFailed("Modal closed by user"));
      } else {
        dispatch(connectFailed("Something went wrong."));
      }
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
