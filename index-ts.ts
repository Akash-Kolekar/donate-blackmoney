import {
  createWalletClient,
  custom,
  parseEther,
  formatEther,
  defineChain,
  createPublicClient,
  WalletClient,
  PublicClient,
  Hash,
  Chain,
  Address,
} from "viem";
import "viem/window";
import { abi, contractAddress } from "./constants-ts.ts";

// DOM Elements
const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const fundButton = document.getElementById("fundButton") as HTMLButtonElement;
const ethAmountInput = document.getElementById("ethAmount") as HTMLInputElement;
const balanceButton = document.getElementById("balanceButton") as HTMLButtonElement;
const withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement;

console.log("Hi")
// Global variables
let walletClient: WalletClient;
let publicClient: PublicClient;

async function connect(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    await walletClient.requestAddresses();
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

async function fund(): Promise<void> {
  const ethAmount: string = ethAmountInput.value;
  console.log(`Funding with ${ethAmount}...`);

  if (typeof window.ethereum !== "undefined") {
    try {
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });
      connectButton.innerHTML = "Connected";

      const [account] = await walletClient.requestAddresses();
      const currentChain: Chain = await getCurrentChain(walletClient);

      console.log("Processing transaction...");
      publicClient = createPublicClient({
        transport: custom(window.ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi,
        functionName: "fund",
        account,
        chain: currentChain,
        value: parseEther(ethAmount),
      });

      const hash: Hash = await walletClient.writeContract(request);
      console.log("Transaction processed: ", hash);
    } catch (error) {
      console.log(error);
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask";
  }
}

async function getBalance(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    connectButton.innerHTML = "Connected";

    const [account] = await walletClient.requestAddresses();

    const balanceOfUser = await publicClient.getBalance({
      address: account,
    });
    const balance = await publicClient.getBalance({
      address: contractAddress as Address,
    });

    console.log(formatEther(balanceOfUser));
    console.log(formatEther(balance));
  }
}

async function withdraw(): Promise<void> {
  try {
    if (typeof window.ethereum !== "undefined") {
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });
      const [account] = await walletClient.requestAddresses();
      const currentChain: Chain = await getCurrentChain(walletClient);

      console.log("Processing transaction...");
      publicClient = createPublicClient({
        transport: custom(window.ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi,
        functionName: "withdraw",
        account,
        chain: currentChain,
      });

      const hash: Hash = await walletClient.writeContract(request);
      console.log("Withdrawal transaction processed: ", hash);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getCurrentChain(client: WalletClient): Promise<Chain> {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  });
  return currentChain;
}

// Event listeners
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;