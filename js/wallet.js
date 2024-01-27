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
	const wallet = await Wallet.named("microfi");
	localStorage.setItem("seed", wallet.mnemonic);
	localStorage.setItem("wif", wallet.privateKeyWif);
	alert("Done. You can open the wallet. Save the seed phrase and private key.");
	document.getElementById("alert1").textContent = "Done. You can open the wallet. Save the seed phrase and private key.";
};

document.getElementById("import").onclick = async () => {
	const seedphrase = document.getElementById("importSeedPhrase").value;
	localStorage.setItem("seed", seedphrase);
	const privatekey = document.getElementById("importPrivateKey").value;
	localStorage.setItem("wif", privatekey);
	alert("Done. The wallet is imported. You can open the wallet.");
	document.getElementById("alert1").textContent = "Done. The wallet is imported. You can open the wallet.";
}

document.getElementById("open").onclick = async () => {
	try {
	var wallet = await Wallet.named("microfi");
	const sd = localStorage.getItem("seed");
	const derivationPath = "m/44'/145'/0'/0/0";
	const walletId1 = `seed:mainnet:${sd}:${derivationPath}`;
	const pk = localStorage.getItem("wif");
	const walletId2 = `wif:mainnet:${pk}`;
	if (wallet = sd) {
		var wallet = await Wallet.replaceNamed("microfi", walletId1);
	} else if (wallet = pk) {
		var wallet = await Wallet.replaceNamed("microfi", walletId2);
	}
	let bchAddress = await wallet.getDepositAddress();
	let pubKey = await wallet.getPublicKeyCompressed(true);
	let bchBalance = await wallet.getBalance();
	let tokenAddress = await wallet.getTokenDepositAddress();
	let tokenBalance = await wallet.getAllTokenBalances();
	let nftBalance = await wallet.getAllNftTokenBalances();

	const jsonString1 = JSON.stringify(tokenBalance); 
	const jsonObject1 = JSON.parse(jsonString1);
	const container1 = document.getElementById("container1");
	for (const key in jsonObject1) {
	if (jsonObject1.hasOwnProperty(key)) {	
		const keyElement = document.createElement("span");

		let apiUrl = "https://bcmr.paytaca.com/api/tokens/" + key;
		fetch(apiUrl)
		.then(response => response.json())
		.then(data => keyElement.textContent = data.token.symbol + " " + key + ": ");
		
		//let apiUrl1 = "https://scaling.cash/.well-known/bitcoin-cash-metadata-registry.json";
		//await BCMR.addMetadataRegistryFromUri(apiUrl1);
		//let data = BCMR.getTokenInfo(key);
		//keyElement.textContent = data.token.symbol + " " + key + ": ";

		keyElement.textContent = key + ': ';
		const valueElement = document.createElement("span");
		valueElement.textContent = jsonObject1[key];
		const lineBreak = document.createElement("br");
		container1.appendChild(keyElement);
		container1.appendChild(valueElement);
		container1.appendChild(lineBreak);
	};
	};
	

	const jsonString2 = JSON.stringify(nftBalance); 
	const jsonObject2 = JSON.parse(jsonString2);
	const container2 = document.getElementById("container2");
	for (const key in jsonObject2) {
	if (jsonObject2.hasOwnProperty(key)) {
		const keyElement = document.createElement("span");

		let apiUrl2 = "https://bcmr.paytaca.com/api/tokens/" + key;
		fetch(apiUrl2)
		.then(response => response.json())
		.then(data => keyElement.textContent = data.token.symbol + " " + key + ": ");

		//let apiUrl3 = "https://scaling.cash/.well-known/bitcoin-cash-metadata-registry.json";
		//await BCMR.addMetadataRegistryFromUri(apiUrl3);
		//let data = BCMR.getTokenInfo(key);
		//keyElement.textContent = data.token.symbol + " " + key + ": ";

		keyElement.textContent = key + ": ";
		const valueElement = document.createElement("span");
		valueElement.textContent = jsonObject2[key];
		const lineBreak = document.createElement("br");
		container2.appendChild(keyElement);
		container2.appendChild(valueElement);
		container2.appendChild(lineBreak);
	};
	};
	

	document.getElementById("derivation").textContent = "Derivation path: " + wallet.derivationPath;
	document.getElementById("mnemonic").textContent = "Seed phrase: " + wallet.mnemonic;
	document.getElementById("privatekey").textContent ="Private key: " + wallet.privateKeyWif;
	document.getElementById("pubKey").textContent = "Public Key compressed: " + pubKey;
	document.getElementById("bchaddress").textContent = "BCH address: " + bchAddress;
	document.getElementById("bchQr").src = wallet.getDepositQr().src;
	document.getElementById("bchbalance").textContent = "BCH balance: " + JSON.stringify(bchBalance);
	document.getElementById("cashtokensaddress").textContent = "CashTokens address: " + tokenAddress;
	document.getElementById("tokenQr").src = wallet.getTokenDepositQr().src;
	//document.getElementById("tokensbalance").textContent = "tokenId(category): amount: " + JSON.stringify(tokenBalance, null, "\t");
	//document.getElementById("nftsbalance").textContent = "NFT Id(category): amount: " + JSON.stringify(nftBalance, null, "\t");
	//document.getElementById("exp").src = "https://explorer.salemkode.com/address/" + bchAddress;

	} catch (error) { alert(error) }
};

document.getElementById("refresh").onclick = async () => {
	location.reload();
}

document.getElementById("clear").onclick = async () => {
	indexedDB.deleteDatabase("bitcoincash");
	//localStorage.clear();
	localStorage.removeItem("seed");
	localStorage.removeItem("wif");
	alert("Seed phrase / private key were removed. You have to import a wallet again.");
	document.getElementById("alert2").textContent = "Seed phrase / private key were removed. You have to import a wallet again.";
	location.reload();
}

document.getElementById("viewTokens1").onclick = async () => {
	let viewTokenId1 = document.getElementById("viewTokenId").value;
	const authChain = await BCMR.buildAuthChain(
		{
			transactionHash: viewTokenId1,
			followToHead: true
		}
	)
	if (authChain.at(-1)) {
	try {
		await BCMR.addMetadataRegistryFromUri(authChain.at(-1).httpsUrl);
	} catch (error) { alert(error) }
	}
	let tokenInfo = BCMR.getTokenInfo(viewTokenId1);
	document.getElementById("tokencategory").textContent = "Category/tokenId: " + tokenInfo.token.category;
	document.getElementById("tokenname").textContent = "Name: " + tokenInfo.name;
	document.getElementById("tokensymbol").textContent = "Symbol: " + tokenInfo.token.symbol;
	document.getElementById("tokendecimals").textContent = "Decimals: " + tokenInfo.token.decimals;
	document.getElementById("tokendescription").textContent = "Description: " + tokenInfo.description;

	const viewIcon = tokenInfo.uris.icon;
	const HttpsPrefix = "https://";
	const IpfsPrefix = "ipfs://";
	if (viewIcon.startsWith(HttpsPrefix)) {
		document.getElementById("tokenicon").src = viewIcon;
	} else if (viewIcon.startsWith(IpfsPrefix)) {
		document.getElementById("tokenicon").src = "https://dweb.link/ipfs/" + viewIcon.substr(7, viewIcon.length);
	}

	//document.getElementById("tokenicon").src = tokenInfo.uris.icon;
	document.getElementById("explorer").textContent = "https://explorer.salemkode.com/token/" + viewTokenId1;
};

document.getElementById("viewTokens2").onclick = async () => {
	let viewTokenId2 = document.getElementById("viewTokenId").value;
	let apiUrl = "https://bcmr.paytaca.com/api/tokens/" + viewTokenId2;
	let explorer = "https://explorer.salemkode.com/token/" + viewTokenId2;
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => document.getElementById("tokenapi").textContent = "Name: " + data.name + " " + "| Symbol: " + data.token.symbol + " " + "| Decimals: " + data.token.decimals + " " + "| Description: " + data.description + " " + " " + "| Web: " + data.uris.web + " " + "| Icon: " + data.uris.icon + " " + "| Explorer: " + explorer);
};

document.getElementById("viewTokens3").onclick = async () => {
	let viewTokenId3 = document.getElementById("viewTokenId").value;
	let bcmrList = document.getElementById("bcmrList").value;
	if (bcmrUrl = bcmrList) {
	try {
		await BCMR.addMetadataRegistryFromUri(bcmrList);
	} catch (error) { alert(error) }
	}
	let bcmrCustom = document.getElementById("bcmrCustom").value;
	if (bcmrUrl = bcmrCustom) {
	try {
		await BCMR.addMetadataRegistryFromUri(bcmrCustom);
	} catch (error) { alert(error) }
	}
	let tokenInfo = BCMR.getTokenInfo(viewTokenId3);
	document.getElementById("tokencategory").textContent = "Category/tokenId: " + tokenInfo.token.category;
	document.getElementById("tokenname").textContent = "Name: " + tokenInfo.name;
	document.getElementById("tokensymbol").textContent = "Symbol: " + tokenInfo.token.symbol;
	document.getElementById("tokendecimals").textContent = "Decimals: " + tokenInfo.token.decimals;
	document.getElementById("tokendescription").textContent = "Description: " + tokenInfo.description;

	const viewIcon = tokenInfo.uris.icon;
	const HttpsPrefix = "https://";
	const IpfsPrefix = "ipfs://";
	if (viewIcon.startsWith(HttpsPrefix)) {
		document.getElementById("tokenicon").src = viewIcon;
	} else if (viewIcon.startsWith(IpfsPrefix)) {
		document.getElementById("tokenicon").src = "https://dweb.link/ipfs/" + viewIcon.substr(7, viewIcon.length);
	}

	//document.getElementById("tokenicon").src = tokenInfo.uris.icon;
	document.getElementById("explorer").textContent = "https://explorer.salemkode.com/token/" + viewTokenId3;
};

document.getElementById("sendBCH").onclick = async () => {
	try {
	const wallet = await Wallet.named("microfi");
	let bchAddress1 = document.getElementById("sendAddr").value;
	let bchAmount = document.getElementById("sendAmount").value;
	let opMessage = document.getElementById("opmessage").value;
	//let chunks = ["Message_", opMessage];
	//let opreturnData = OpReturnData.fromArray(chunks);
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
	const wallet = await Wallet.named("microfi");
	let bchAddress2 = document.getElementById("sendAddr").value;
	let bchBalanceMax = await wallet.getBalance();
	bchBalanceObj = Object.values({...bchBalanceMax});
	let bchBalMax = bchBalanceObj[1];
	let opMessage = document.getElementById("opmessage").value;
	//let chunks = ["Message_", opMessage];
	//let opreturnData = OpReturnData.fromArray(chunks);
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

document.getElementById("sendTokens").onclick = async () => {
	try {
	const wallet = await Wallet.named("microfi");
	let tokenAddress1 = document.getElementById("sendAddrToken1").value;
	let tokenAmount = document.getElementById("sendAmountToken").value;
	let token = document.getElementById("sendTokenId").value;
	let opMessage1 = document.getElementById("opmessage1").value;
	//let chunks = ["Message_", opMessage1];
	//let opreturnData = OpReturnData.fromArray(chunks);
	let opreturnData = OpReturnData.from(opMessage1);
	const { txId } = await wallet.send([ new TokenSendRequest(
		{
			cashaddr: tokenAddress1,
			amount: BigInt(tokenAmount),
			tokenId: token,
			value: 800
		}
	),
	opreturnData,
	]);
	document.getElementById("ftsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sendNfts").onclick = async () => {
	try {
	const wallet = await Wallet.named("microfi");
	let tokenAddress2 = document.getElementById("sendAddrToken2").value;
	let token1 = document.getElementById("sendNftTokenId").value;
	let nftCommitment = document.getElementById("nftCommitment").value;
	let capabilityLists = document.getElementById("capabilityLists").value;
	let capabilitySend = capabilityLists.substr(14, capabilityLists.length);
	let opMessage2 = document.getElementById("opmessage2").value;
	//let chunks = ["Message_", opMessage2];
	//let opreturnData = OpReturnData.fromArray(chunks);
	let opreturnData = OpReturnData.from(opMessage2);
	const { txId } = await wallet.send([ new TokenSendRequest(
		{
			cashaddr: tokenAddress2,
			tokenId: token1,
			commitment: nftCommitment,
			capability: capabilitySend,
			value: 800
		}
	),
	opreturnData,
	]);
	document.getElementById("nftsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("createTokenId").onclick = async () => {
	try {
	const wallet = await Wallet.named("microfi");
	async function getValidPreGensis() {
		let walletUtxos = await wallet.getAddressUtxos();
		return walletUtxos.filter(utxo => !utxo.token && utxo.vout === 0);
	}
	let validPreGenesis = await getValidPreGensis();
	console.log(validPreGenesis);
	if (validPreGenesis.length === 0) {
		await wallet.send([{ cashaddr: wallet.tokenaddr, value: 800, unit: "sats" }]);
		validPreGenesis = await getValidPreGensis();
	}
	const tokenId = validPreGenesis[0].txid;
	document.getElementById("generateId").textContent = "tokenId: " + tokenId;
	} catch (error) { alert(error) }
};

document.getElementById("createTokens").onclick = async () => {
	try {
	const wallet = await Wallet.named("microfi");
	let tokenAddress = await wallet.getTokenDepositAddress();

	let url = document.getElementById("tokenUriFT").value;
	let HttpsPrefix = "https://";
	let IpfsPrefix = "ipfs://";
	if (url.startsWith(HttpsPrefix)) {
		fetchLocation = url;
	} else if (url.startsWith(IpfsPrefix)) {
		fetchLocation = "https://dweb.link/ipfs/" + url.substr(7, url.length);
	}
	//let fetchLocation = "https://" + url;
	// let fetchLocation ="https://dweb.link/ipfs/" + url;
	let bcmrUrl;
	if (url.startsWith(HttpsPrefix)) {
		bcmrUrl = url.substr(8, url.length);
	} else if (url.startsWith(IpfsPrefix)) {
		bcmrUrl = url.substr(7, url.length);
	}
	let response = await fetch(fetchLocation);
	let bcmrContent = await response.text();
	let document_hash = sha256.hash(utf8ToBin(bcmrContent));
	let opreturnData1;
	const chunks1 = ["BCMR", document_hash, bcmrUrl];
	opreturnData1 = OpReturnData.fromArray(chunks1);

	let name = document.getElementById("tokenName1").value;
	let symbol = document.getElementById("tokenSymbol1").value;
	let tokenAmount1 = document.getElementById("tokenAmount1").value;
	let tokenUri1 = document.getElementById("tokenUri1").value;
	let tokenDecimals1 = document.getElementById("tokenDecimals1").value;
	let genesisText1 = document.getElementById("genesisText1").value;
	let opreturnData2;
	const chunks2 = [name, symbol, tokenUri1, tokenDecimals1, genesisText1];
	opreturnData2 = OpReturnData.fromArray(chunks2);
	const genesisResponse = await wallet.tokenGenesis(
		{
			cashaddr: tokenAddress,
			amount: BigInt(tokenAmount1),
			value: 800
		},
		opreturnData1,
		opreturnData2
	);
	const tokenId = genesisResponse.tokenIds[0];
	const { txId } = genesisResponse;
	document.getElementById("createFt").textContent = "tokenId: " + tokenId + " " + "txId: " + "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

//document.getElementById("authHeadTransfer").onclick = async () => {
	//try {
	//const wallet = await Wallet.named("microfi");
	//let tokenAddressA = await wallet.getTokenDepositAddress();
	//let tokenIdA = document.getElementById("tokenIdA").value;
	//let tokenBalanceA = await wallet.getTokenBalance(tokenIdA);
	//const authWallet = await Wallet.newRandom();
	//let newAuthAddress = await authWallet.getTokenDepositAddress();
	//let authPk = authWallet.privateKeyWif;
	//let utxos = wallet.getTokenUtxos(tokenIdA);
	//utxos.forEach(utxo => {
		//if(utxo.txid == authHeadTxId && utxo.vout == 0) {
		//authUtxo;
		//}
	//});
	//const opreturnData = OpReturnData.from("AuthHeadTransfer");
	//const { txId } = await wallet.send([ 
		//{ 
		//cashaddr: newAuthAddress,
		//value: 546,
		//unit: "sats"
		//},
		//new TokenSendRequest(
		//{
		//cashaddr: tokenAddressA,
		//amount: BigInt(tokenBalanceA),
		//tokenId: tokenIdA,
		//value: 800
		//}
		//),
		//opreturnData
	//], { ensureUtxos: [authUtxo] }
	//);
	
	//document.getElementById("authTransfer").textContent = "tokenId: " + tokenIdA + " " + "txId: " + "https://bch.loping.net/tx/" + txId + " " + " AuthHead Wallet private key: " + authPk + " " + "Save the private key!" + newAuthAddress;
	//} catch (error) { alert(error) }
//};


document.getElementById("burnFt").onclick = async () => {
	try {
	const wallet = await Wallet.named("microfi");
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
	const wallet = await Wallet.named("microfi");
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

document.getElementById("balancePw").onclick = async () => {
	try {
	let sweepPk = document.getElementById("sweepPk").value;
	const tempWallet = await Wallet.fromWIF(sweepPk);
	let bchBalancePw = await tempWallet.getBalance();
	let tokenBalancePw = await tempWallet.getAllTokenBalances();
	document.getElementById("bchbalancePw").textContent = "BCH balance: " + JSON.stringify(bchBalancePw);
	document.getElementById("tokenbalancePw").textContent = "Token balance: " + JSON.stringify(tokenBalancePw);
	} catch (error) { alert(error) }
};

document.getElementById("sweepPw").onclick = async () => {
	try {
	let sweepPk = document.getElementById("sweepPk").value;
	let recipientPw = document.getElementById("recipientAddress").value;
	const tempWallet = await Wallet.fromWIF(sweepPk);
	let bchBalancePw = await tempWallet.getBalance();
	bchBalanceObj = Object.values({...bchBalancePw});
	let bchBal = bchBalanceObj[1];
	let tokenBalancePw = await tempWallet.getAllTokenBalances();
	tokenCategoriesObj = Object.keys({...tokenBalancePw});
	let tokenCat = tokenCategoriesObj[0];
	tokenAmountsObj = Object.values({...tokenBalancePw});
	let tokenAmo = tokenAmountsObj[0];
	const { txId } = await tempWallet.send([
		{
			cashaddr: recipientPw,
			value: bchBal - 546,
			unit: "sats",
		},
		new TokenSendRequest(
		{
			cashaddr: recipientPw,
			amount: BigInt(tokenAmo),
			tokenId: tokenCat,
			value: 800
		}
		)
	]);
	document.getElementById("swept").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sweepPwBch").onclick = async () => {
	try {
	let sweepPk = document.getElementById("sweepPk").value;
	let recipientPw = document.getElementById("recipientAddress").value;
	const tempWallet = await Wallet.fromWIF(sweepPk);
	let bchBalancePw = await tempWallet.getBalance();
	bchBalanceObj = Object.values({...bchBalancePw});
	let bchBal = bchBalanceObj[1];
	const { txId } = await tempWallet.send([
		{
			cashaddr: recipientPw,
			value: bchBal - 546,
			unit: "sats"
		}
	]);
	document.getElementById("swept").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};
});

document.getElementById("spy").onclick = async () => {
	let wAddress = document.getElementById("wAddress").value;
	const wWallet = await Wallet.watchOnly(wAddress);
	let wbchBalance = await wWallet.getBalance();
	let wtokenBalance = await wWallet.getAllTokenBalances();
	let wnftBalance = await wWallet.getAllNftTokenBalances();
	document.getElementById("wbchbalance").textContent = "BCH balance: " + JSON.stringify(wbchBalance);
	document.getElementById("wtokens").textContent = "tokenId(category): amount: " + JSON.stringify(wtokenBalance, null, "\t");
	document.getElementById("wnfts").textContent = "NFT Id(category): amount: " + JSON.stringify(wnftBalance, null, "\t");
};

document.getElementById("signM").onclick = async () => {
	const wallet = await Wallet.named("microfi");
	let sMessage = document.getElementById("smessage").value;
	wallet.cashaddr;
	sign = (await wallet.sign(sMessage)).signature;
	document.getElementById("signMessage").textContent = sign;
};
document.getElementById("verifyM").onclick = async () => {
	let vAddress = document.getElementById("vaddress").value;
	let signatureHash = document.getElementById("signH").value;
	const someWallet = await Wallet.watchOnly(vAddress);
	let verifyResult = await someWallet.verify(vAddress, signatureHash);
	document.getElementById("verifyMessage").textContent = verifyResult.valid;
};

document.getElementById("notarize").onclick = async () => {
	try {
	const fileInput = document.getElementById("opfile");
	const file = fileInput.files[0];
	const reader = new FileReader();

	reader.readAsArrayBuffer(file);

	reader.onload = async function() {
		const buffer = reader.result;
		crypto.subtle.digest('SHA-256', buffer)
		.then(async function(hash) {
			const hashArray = Array.from(new Uint8Array(hash));
			const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
			//console.log(hashHex);
			const wallet = await Wallet.named("microfi");
			wallet.cashaddr;
			sign = (await wallet.sign(hashHex)).signature;
			let opTitle = document.getElementById("optitle").value;
			let titleHash = sha256.hash(utf8ToBin(opTitle));
			let documentHash = hexToBin(hashHex);
			let tokenAddress3 = "bitcoincash:zr8j9fzlmsdfy52n37pg2frqaddsjs99qy6pkdq0c5";
			let tokenId4 = "b69f76548653033603cdcb81299e3c1d1f3d61ad66e7ba0e6569b493605b4cbe";
			let chunks = ["Microfi_Notary_", opTitle, titleHash, documentHash, sign];
			let opreturnData = OpReturnData.fromArray(chunks);
			//const { txId } = await wallet.send([ opreturnData ]);
			const { txId } = await wallet.send([ opreturnData, new TokenSendRequest(
				{
					cashaddr: tokenAddress3,
					amount: 1n,
					tokenId: tokenId4,
					value: 800
				}
			)
			]);
			document.getElementById("notarized").textContent = "txId: " + "https://explorer.bitcoinunlimited.info/tx/" + txId;
			document.getElementById("dHash").textContent = "Document hash: " + hashHex;
			document.getElementById("signature").textContent = "Wallet signature of document hash: " + sign;
		})
	}
	} catch (error) { alert(error) }
};