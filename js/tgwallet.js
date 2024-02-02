document.addEventListener("DOMContentLoaded", async (event) => {
globalThis.exports = globalThis.exports || {};
Object.assign(globalThis, await __mainnetPromise);
Config.DefaultParentDerivationPath = "m/44'/145'/0'/0/0";
Config.EnforceCashTokenReceiptAddresses = true;
BaseWallet.StorageProvider = IndexedDBProvider;

BigInt.prototype.toJSON = function () {
	return this.toString();
};

document.getElementById("create").onclick = async () => {
	try {
	const wallet = await Wallet.named("tgmicrofi");
	localStorage.setItem("seed", wallet.mnemonic);
	localStorage.setItem("wif", wallet.privateKeyWif);
	alert("Done. You can open the wallet. Save the seed phrase and private key.");
	document.getElementById("alert1").textContent = "Done. You can open the wallet. Save the seed phrase and private key.";
	} catch (error) { alert(error) }
};

document.getElementById("import").onclick = async () => {
	try {
	const seedphrase = document.getElementById("importSeedPhrase").value;
	localStorage.setItem("seed", seedphrase);
	const privatekey = document.getElementById("importPrivateKey").value;
	localStorage.setItem("wif", privatekey);
	alert("Done. The wallet is imported. You can open the wallet.");
	document.getElementById("alert1").textContent = "Done. The wallet is imported. You can open the wallet.";
	} catch (error) { alert(error) }
}

document.getElementById("open").onclick = async () => {
	try {
	var wallet = await Wallet.named("tgmicrofi");
	const sd = localStorage.getItem("seed");
	const derivationPath = "m/44'/145'/0'/0/0";
	const walletId1 = `seed:mainnet:${sd}:${derivationPath}`;
	const pk = localStorage.getItem("wif");
	const walletId2 = `wif:mainnet:${pk}`;
	if (wallet = sd) {
		var wallet = await Wallet.replaceNamed("tgmicrofi", walletId1);
	} else if (wallet = pk) {
		var wallet = await Wallet.replaceNamed("tgmicrofi", walletId2);
	}
	let bchAddress = await wallet.getDepositAddress();
	let pubKey = await wallet.getPublicKeyCompressed(true);
	let bchBalance = await wallet.getBalance();
	let tokenAddress = await wallet.getTokenDepositAddress();
	let tokenBalance = await wallet.getAllTokenBalances();
	let nftBalance = await wallet.getAllNftTokenBalances();
	
	document.getElementById("derivation").textContent = "Derivation path: " + wallet.derivationPath;
	document.getElementById("mnemonic").textContent = "Seed phrase: " + wallet.mnemonic;
	document.getElementById("privatekey").textContent ="Private key: " + wallet.privateKeyWif;
	document.getElementById("pubKey").textContent = "Public Key compressed: " + pubKey;
	document.getElementById("bchaddress").textContent = "BCH address: " + bchAddress;
	document.getElementById("bchQr").src = wallet.getDepositQr().src;
	document.getElementById("bchbalance").textContent = "BCH balance: " + JSON.stringify(bchBalance);

	document.getElementById("sendBCH").onclick = async () => {
	try {
	let bchAmount = document.getElementById("sendAmount").value;
	let opMessage = document.getElementById("opmessage").value;
	let opreturnData = OpReturnData.from(opMessage);
	const { txId } = await wallet.send([
		{
			cashaddr: bchAddress1,
			value: bchAmount,
			unit: "sats"
		},
		opreturnData,
	]);
	document.getElementById("bchsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
	};
	document.getElementById("sendBCHmax").onclick = async () => {
		try {
		let bchAddress2 = document.getElementById("sendAddr").value;
		let bchBalanceMax = await wallet.getBalance();
		bchBalanceObj = Object.values({...bchBalanceMax});
		let bchBalMax = bchBalanceObj[1];
		let opMessage = document.getElementById("opmessage").value;
		let opreturnData = OpReturnData.from(opMessage);
		const { txId } = await wallet.send([
			{
				cashaddr: bchAddress2,
				value: bchBalMax - 546,
				unit: "sats"
			},
			opreturnData,
		]);
		document.getElementById("bchsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
		} catch (error) { alert(error) }
	};

	document.getElementById("cashtokensaddress").textContent = "CashTokens address: " + tokenAddress;
	document.getElementById("tokenQr").src = wallet.getTokenDepositQr().src;
	
	const jsonString1 = JSON.stringify(tokenBalance); 
	const jsonObject1 = JSON.parse(jsonString1);
	const container1 = document.getElementById("container1");
	for (let key in jsonObject1) {
	if (jsonObject1.hasOwnProperty(key)) {	
		let keyElement = document.createElement("span");

		fetch("https://bcmr.paytaca.com/api/tokens/" + key)
		.then(response => response.json())
		.then(data => keyElement.textContent = data.token.symbol + " " + "&#11088;" + key + ": ");

		fetch("https://darklabs.pages.dev/api/token/" + key + ".json")
		.then(response => response.json())
		.then(data1 => keyElement.textContent = data1.token.symbol + " " + "&#11088;" + key + ": ");

		keyElement.textContent = key + ': ';
		let valueElement = document.createElement("span");
		valueElement.textContent = jsonObject1[key];
		const lineBreak = document.createElement("br");
		container1.appendChild(keyElement);
		container1.appendChild(valueElement);
		container1.appendChild(lineBreak);
	};
	};

	document.getElementById("sendTokens").onclick = async () => {
		try {
		let tokenAddress1 = document.getElementById("sendAddrToken1").value;
		let tokenAmount = document.getElementById("sendAmountToken").value;
		let token = document.getElementById("sendTokenId").value;
		let opMessage1 = document.getElementById("opmessage1").value;
		let opreturnData1 = OpReturnData.from(opMessage1);
		const { txId } = await wallet.send([ new TokenSendRequest(
			{
				cashaddr: tokenAddress1,
				amount: BigInt(tokenAmount),
				tokenId: token,
				value: 800
			}
		),
		opreturnData1,
		]);
		document.getElementById("ftsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
		} catch (error) { alert(error) }
	};
	
	const jsonString2 = JSON.stringify(nftBalance); 
	const jsonObject2 = JSON.parse(jsonString2);
	const container2 = document.getElementById("container2");
	for (let key in jsonObject2) {
	if (jsonObject2.hasOwnProperty(key)) {
		let keyElement = document.createElement("span");

		fetch("https://bcmr.paytaca.com/api/tokens/" + key)
		.then(response => response.json())
		.then(data => keyElement.textContent = data.token.symbol + " " + "&#11088;" + key + ": ");

		fetch("https://darklabs.pages.dev/api/token/" + key + ".json")
		.then(response => response.json())
		.then(data1 => keyElement.textContent = data1.token.symbol + " " + "&#11088;" + key + ": ");

		keyElement.textContent = key + ": ";
		let valueElement = document.createElement("span");
		valueElement.textContent = jsonObject2[key];
		const lineBreak = document.createElement("br");
		container2.appendChild(keyElement);
		container2.appendChild(valueElement);
		container2.appendChild(lineBreak);
	};
	};
	document.getElementById("sendNfts").onclick = async () => {
		try {
		let tokenAddress2 = document.getElementById("sendAddrToken2").value;
		let token1 = document.getElementById("sendNftTokenId").value;
		let nftCommitment = document.getElementById("nftCommitment").value;
		let capabilityLists = document.getElementById("capabilityLists").value;
		let capabilitySend = capabilityLists.substr(14, capabilityLists.length);
		let opMessage2 = document.getElementById("opmessage2").value;
		let opreturnData2 = OpReturnData.from(opMessage2);
		const { txId } = await wallet.send([ new TokenSendRequest(
			{
				cashaddr: tokenAddress2,
				tokenId: token1,
				commitment: nftCommitment,
				capability: capabilitySend,
				value: 800
			}
		),
		opreturnData2,
		]);
		document.getElementById("nftsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
		} catch (error) { alert(error) }
	};
	} catch (error) { alert(error) }
};

document.getElementById("refresh").onclick = async () => {
	location.reload();
}

document.getElementById("clear").onclick = async () => {
	indexedDB.deleteDatabase("bitcoincash");
	localStorage.removeItem("seed");
	localStorage.removeItem("wif");
	alert("Seed phrase / private key were removed. You have to import a wallet again.");
	document.getElementById("alert2").textContent = "Seed phrase / private key were removed. You have to import a wallet again.";
	location.reload();
}

document.getElementById("burnFt").onclick = async () => {
	try {
	const wallet = await Wallet.named("tgmicrofi");
	let burnTokenId = document.getElementById("burnTokenId").value;
	let burnAmount = document.getElementById("burnAmount").value;
	let burnResponse = await wallet.tokenBurn(
		{
			tokenId: burnTokenId,
			amount: BigInt(burnAmount),
			value: 800
		},
		"burn",
	);
	const { txId } = burnResponse;
	document.getElementById("burnFtTx").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("burnNft").onclick = async () => {
	try {
	const wallet = await Wallet.named("tgmicrofi");
	let burnNftTokenId = document.getElementById("burnNftId").value;
	let capabilityList = document.getElementById("capabilityList").value;
	let capabilityBurn = capabilityList.substr(14, capabilityList.length);
	let burnCommitment = document.getElementById("burnCommitment").value;
	const burnResponse = await wallet.tokenBurn(
		{
			tokenId: burnNftTokenId,
			capability: capabilityBurn,
			commitment: burnCommitment,
			value: 800
		},
		"burn",
	);
	const { txId } = burnResponse;
	document.getElementById("burnNftTx").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};
});