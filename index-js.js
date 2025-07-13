import {
	createWalletClient,
	custom,
	parseEther,
	formatEther,
	defineChain,
	createPublicClient,
} from "https://esm.sh/viem";
import "https://esm.sh/viem/window";
import { abi, contractAddress } from "./constants-js.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
const viewFundedAmount = document.getElementById("viewFundedAmount");
const addressInput = document.getElementById("addressInput");

let walletClient;
let publicClient;

async function connect() {
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

async function fund() {
	const ethAmount = ethAmountInput.value;
	console.log(`Funding with ${ethAmount}...`);

	if (typeof window.ethereum !== "undefined") {
		try {
			walletClient = createWalletClient({
				transport: custom(window.ethereum),
			});
			connectButton.innerHTML = "Connected";

			const [account] = await walletClient.requestAddresses();
			const currentChain = await getCurrentChain(walletClient);

			console.log("Processing transaction...");
			publicClient = createPublicClient({
				transport: custom(window.ethereum),
			});
			const { request } = await publicClient.simulateContract({
				address: contractAddress,
				abi,
				functionName: "fund",
				account,
				chain: currentChain,
				value: parseEther(ethAmount),
			});
			const hash = await walletClient.writeContract(request);
			console.log("Transaction processed: ", hash);
		} catch (error) {
			console.log(error);
		}
	} else {
		fundButton.innerHTML = "Please install MetaMask";
	}
}

async function getBalance() {
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
			address: contractAddress,
		});
		console.log(formatEther(balanceOfUser));
		console.log(formatEther(balance));
	}
}

async function withdraw() {
	try {
		if (typeof window.ethereum !== "undefined") {
			walletClient = createWalletClient({
				transport: custom(window.ethereum),
			});
			const [account] = await walletClient.requestAddresses();
			const currentChain = await getCurrentChain(walletClient);

			console.log("Processing transaction...");
			publicClient = createPublicClient({
				transport: custom(window.ethereum),
			});

			const { request } = await publicClient.simulateContract({
				address: contractAddress,
				abi: abi,
				functionName: "withdraw",
				account, // can write directly account because the parameter name and the argument is same and same for above abi variable too
				chain: currentChain,
				value: parseEther("0"), //optional since default is 0, you can delete this parameter from here
			});

			const hash = await walletClient.writeContract(request);
			console.log("Withdrawal transaction proceed: ", hash);
		}
	} catch (error) {
		console.log(error);
	}
}

async function getAddressToAmount() {
	try {
		if (typeof window.ethereum !== "undefined") {
			const userAddress = addressInput.value;

			walletClient = createWalletClient({
				transport: custom(window.ethereum),
			});

			publicClient = createPublicClient({
				transport: custom(window.ethereum),
			});

			const currentChain = await getCurrentChain(walletClient);
			const [account] = await walletClient.requestAddresses();

			const { request } = await publicClient.simulateContract({
				address: contractAddress,
				abi: abi,
				functionName: "getAddressToAmountFunded",
				account,
				args: [userAddress],
				chain: currentChain,
			});

			const fundedAmount = await publicClient.readContract(request);
			console.log("Funded amount: ", formatEther(fundedAmount));
			viewFundedAmount.innerHTML = `${formatEther(fundedAmount)}`;
		}
	} catch (error) {
		console.log(error);
		viewFundedAmount.innerHTML = "Error fetching amount";
	}
}

async function getCurrentChain(client) {
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
viewFundedAmount.onclick = getAddressToAmount;
