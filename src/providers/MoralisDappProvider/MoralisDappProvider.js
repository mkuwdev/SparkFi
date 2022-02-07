import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState();
  const [contractABI, setContractABI] = useState('[	{		"anonymous": false,		"inputs": [			{				"indexed": true,				"internalType": "bytes32",				"name": "contentId",				"type": "bytes32"			},			{				"indexed": false,				"internalType": "string",				"name": "contentUri",				"type": "string"			}		],		"name": "ContentAdded",		"type": "event"	},	{		"anonymous": false,		"inputs": [			{				"indexed": true,				"internalType": "bytes32",				"name": "ventureId",				"type": "bytes32"			},			{				"indexed": true,				"internalType": "address",				"name": "investor",				"type": "address"			},			{				"indexed": true,				"internalType": "uint256",				"name": "amount",				"type": "uint256"			}		],		"name": "Invested",		"type": "event"	},	{		"anonymous": false,		"inputs": [			{				"indexed": true,				"internalType": "bytes32",				"name": "proposalId",				"type": "bytes32"			},			{				"indexed": true,				"internalType": "bytes32",				"name": "ventureId",				"type": "bytes32"			},			{				"indexed": true,				"internalType": "address",				"name": "approver",				"type": "address"			}		],		"name": "ProposalApproved",		"type": "event"	},	{		"anonymous": false,		"inputs": [			{				"indexed": false,				"internalType": "bytes32",				"name": "proposalId",				"type": "bytes32"			},			{				"indexed": true,				"internalType": "bytes32",				"name": "ventureId",				"type": "bytes32"			},			{				"indexed": false,				"internalType": "bytes32",				"name": "contentId",				"type": "bytes32"			},			{				"indexed": true,				"internalType": "address",				"name": "recipient",				"type": "address"			},			{				"indexed": true,				"internalType": "uint256",				"name": "amount",				"type": "uint256"			}		],		"name": "ProposalCreated",		"type": "event"	},	{		"anonymous": false,		"inputs": [			{				"indexed": true,				"internalType": "bytes32",				"name": "proposalId",				"type": "bytes32"			},			{				"indexed": true,				"internalType": "bytes32",				"name": "ventureId",				"type": "bytes32"			}		],		"name": "ProposalFinalized",		"type": "event"	},	{		"anonymous": false,		"inputs": [			{				"indexed": true,				"internalType": "bytes32",				"name": "ventureId",				"type": "bytes32"			},			{				"indexed": true,				"internalType": "address",				"name": "ventureManager",				"type": "address"			},			{				"indexed": false,				"internalType": "bytes32",				"name": "contentId",				"type": "bytes32"			},			{				"indexed": true,				"internalType": "uint256",				"name": "minimum",				"type": "uint256"			}		],		"name": "VentureCreated",		"type": "event"	},	{		"inputs": [			{				"internalType": "bytes32",				"name": "_ventureId",				"type": "bytes32"			},			{				"internalType": "bytes32",				"name": "_proposalId",				"type": "bytes32"			}		],		"name": "approveProposal",		"outputs": [],		"stateMutability": "nonpayable",		"type": "function"	},	{		"inputs": [			{				"internalType": "bytes32",				"name": "_ventureId",				"type": "bytes32"			},			{				"internalType": "string",				"name": "_contentUri",				"type": "string"			},			{				"internalType": "uint256",				"name": "_value",				"type": "uint256"			},			{				"internalType": "address",				"name": "_recipient",				"type": "address"			}		],		"name": "createProposal",		"outputs": [],		"stateMutability": "nonpayable",		"type": "function"	},	{		"inputs": [			{				"internalType": "string",				"name": "_contentUri",				"type": "string"			},			{				"internalType": "uint256",				"name": "_minimum",				"type": "uint256"			}		],		"name": "createVenture",		"outputs": [],		"stateMutability": "nonpayable",		"type": "function"	},	{		"inputs": [			{				"internalType": "bytes32",				"name": "_ventureId",				"type": "bytes32"			},			{				"internalType": "bytes32",				"name": "_proposalId",				"type": "bytes32"			}		],		"name": "finalizeProposal",		"outputs": [],		"stateMutability": "nonpayable",		"type": "function"	},	{		"inputs": [			{				"internalType": "bytes32",				"name": "_contentId",				"type": "bytes32"			}		],		"name": "getContent",		"outputs": [			{				"internalType": "string",				"name": "",				"type": "string"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [			{				"internalType": "bytes32",				"name": "_ventureId",				"type": "bytes32"			}		],		"name": "getVenture",		"outputs": [			{				"internalType": "address",				"name": "",				"type": "address"			},			{				"internalType": "bytes32",				"name": "",				"type": "bytes32"			},			{				"internalType": "uint256",				"name": "",				"type": "uint256"			}		],		"stateMutability": "view",		"type": "function"	},	{		"inputs": [			{				"internalType": "bytes32",				"name": "_ventureId",				"type": "bytes32"			}		],		"name": "invest",		"outputs": [],		"stateMutability": "payable",		"type": "function"	},	{		"inputs": [],		"name": "name",		"outputs": [			{				"internalType": "string",				"name": "",				"type": "string"			}		],		"stateMutability": "view",		"type": "function"	}]');
  const [contractAddress, setContractAddress] = useState("0xc63853cF2286a02afb985722eF6e344e62f92f21");
  const [selectedVentureId, setSelectedVentureId] = useState("");
  
  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
    });

    Moralis.onAccountsChanged(function (address) {
      setWalletAddress(address[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChainId(web3.givenProvider?.chainId));
  useEffect(
    () => setWalletAddress(web3.givenProvider?.selectedAddress || user?.get("ethAddress")),
    [web3, user]
  );

  return (
    <MoralisDappContext.Provider value={{ walletAddress, chainId, contractABI, setContractABI, contractAddress, setContractAddress, selectedVentureId, setSelectedVentureId }}>
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
