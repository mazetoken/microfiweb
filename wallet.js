document.addEventListener("DOMContentLoaded", async (event) => {
globalThis.exports = globalThis.exports || {};
Object.assign(globalThis, await __mainnetPromise);
Config.DefaultParentDerivationPath = "m/44'/145'/0'/0/0";
Config.EnforceCashTokenReceiptAddresses = true;
BaseWallet.StorageProvider = IndexedDBProvider;

document.getElementById("create").onclick = async () => {
	var wallet = await Wallet.named("microfi");
	localStorage.setItem("seed", wallet.mnemonic);
	localStorage.setItem("wif", wallet.privateKeyWif);
	alert("Done. You can open the wallet. Save the seed phrase and private key.");
	document.getElementById("alert1").textContent = "Done. You can open the wallet. Save the seed phrase and private key.";
};

document.getElementById("import").onclick = async () => {
	let seedphrase = document.querySelector("#importSeedPhrase").value;
	localStorage.setItem("seed", seedphrase);
	let privatekey = document.querySelector("#importPrivateKey").value;
	localStorage.setItem("wif", privatekey);
	alert("Done. The wallet is imported. You can open the wallet.");
	document.getElementById("alert1").textContent = "Done. The wallet is imported. You can open the wallet.";
}

document.getElementById("open").onclick = async () => {
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

	document.getElementById("derivation").textContent = "Derivation path: " + wallet.derivationPath;
	document.getElementById("mnemonic").textContent = "Seed phrase: " + wallet.mnemonic;
	document.getElementById("privatekey").textContent ="Private key: " + wallet.privateKeyWif;
	document.getElementById("bchaddress").textContent = "BCH address: " + bchAddress;
	document.getElementById("bchQr").src = wallet.getDepositQr().src;
	document.getElementById("bchbalance").textContent = "BCH balance: " + JSON.stringify(bchBalance);
	document.getElementById("pubKey").textContent = "Public Key compressed: " + pubKey;
	document.getElementById("cashtokensaddress").textContent = "CashTokens address: " + tokenAddress;
	document.getElementById("tokenQr").src = wallet.getTokenDepositQr().src;
	document.getElementById("tokensbalance").textContent = "tokenId(category): amount: " + JSON.stringify(tokenBalance, null, "\t");
	document.getElementById("nftsbalance").textContent = "NFT Id(category): amount: " + JSON.stringify(nftBalance, null, "\t");
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
	let viewTokenId1 = document.querySelector("#viewTokenId").value;
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
	let viewTokenId2 = document.querySelector("#viewTokenId").value;
	let apiUrl = "https://bcmr.paytaca.com/api/tokens/" + viewTokenId2;
	let explorer = "https://explorer.salemkode.com/token/" + viewTokenId2;
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => document.getElementById("tokenapi").textContent = "Name: " + data.name + " " + "| Symbol: " + data.token.symbol + " " + "| Decimals: " + data.token.decimals + " " + "| Description: " + data.description + " " + " " + "| Web: " + data.uris.web + " " + "| Icon: " + data.uris.icon + " " + "| Explorer: " + explorer);
};

document.getElementById("viewTokens3").onclick = async () => {
	let viewTokenId3 = document.querySelector("#viewTokenId").value;
	let bcmrList = document.querySelector("#bcmrList").value;
	if (bcmrUrl = bcmrList) {
	try {
		await BCMR.addMetadataRegistryFromUri(bcmrList);
	} catch (error) { alert(error) }
	}
	let bcmrCustom = document.querySelector("#bcmrCustom").value;
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
	var wallet = await Wallet.named("microfi");
	let bchAddress = document.querySelector("#sendAddr").value;
	let bchAmount = document.querySelector("#sendAmount").value;
	const { txId } = await wallet.send([
		{
			cashaddr: bchAddress,
			value: bchAmount,
			unit: "sats"
		}
	]);
	document.getElementById("bchsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sendBCHmax").onclick = async () => {
	try {
	var wallet = await Wallet.named("microfi");
	let bchAddress = document.querySelector("#sendAddr").value;
	let bchBalanceMax = await wallet.getBalance();
	bchBalanceObj = Object.values({...bchBalanceMax});
	let bchBalMax = bchBalanceObj[1];
	const { txId } = await wallet.send([
		{
			cashaddr: bchAddress,
			value: bchBalMax - 546,
			unit: "sats"
		}
	]);
	document.getElementById("bchsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sendTokens").onclick = async () => {
	try {
	var wallet = await Wallet.named("microfi");
	let tokenAddress = document.querySelector("#sendAddrToken").value;
	let token = document.querySelector("#sendTokenId").value;
	let tokenAmount = document.querySelector("#sendAmountToken").value;
	const { txId } = await wallet.send([ new TokenSendRequest(
		{
			cashaddr: tokenAddress,
			amount: tokenAmount,
			tokenId: token
		}
	)
	]);
	document.getElementById("ftsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sendNfts").onclick = async () => {
	try {
	var wallet = await Wallet.named("microfi");
	let tokenAddress1 = document.querySelector("#sendAddrToken1").value;
	let token1 = document.querySelector("#sendNftTokenId").value;
	let nftCommitment = document.querySelector("#nftCommitment").value;
	let capabilityLists = document.querySelector("#capabilityLists").value;
	let capabilitySend = capabilityLists.substr(14, capabilityLists.length);
	const { txId } = await wallet.send([ new TokenSendRequest(
		{
			cashaddr: tokenAddress1,
			tokenId: token1,
			commitment: nftCommitment,
			capability: capabilitySend
		}
	)
	]);
	document.getElementById("nftsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("burnFt").onclick = async () => {
	try {
	var wallet = await Wallet.named("microfi");
	let burnTokenId = document.querySelector("#burnTokenId").value;
	let burnAmount = document.querySelector("#burnAmount").value;
	let burnResponse = await wallet.tokenBurn(
		{
			tokenId: burnTokenId,
			amount: burnAmount
		},
		"burn",
	);
	const { txId } = burnResponse;
	document.getElementById("burnFtTx").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("burnNft").onclick = async () => {
	try {
	var wallet = await Wallet.named("microfi");
	let burnNftTokenId = document.querySelector("#burnNftId").value;
	let capabilityList = document.querySelector("#capabilityList").value;
	let capabilityBurn = capabilityList.substr(14, capabilityList.length);
	let burnCommitment = document.querySelector("#burnCommitment").value;
	const burnResponse = await wallet.tokenBurn(
		{
			tokenId: burnNftTokenId,
			capability: capabilityBurn,
			commitment: burnCommitment
		},
		"burn",
	);
	const { txId } = burnResponse;
	document.getElementById("burnNftTx").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("balancePw").onclick = async () => {
	try {
	let sweepPk = document.querySelector("#sweepPk").value;
	let tempWallet = await Wallet.fromWIF(sweepPk);
	let bchBalancePw = await tempWallet.getBalance();
	let tokenBalancePw = await tempWallet.getAllTokenBalances();
	document.getElementById("bchbalancePw").textContent = "BCH balance: " + JSON.stringify(bchBalancePw);
	document.getElementById("tokenbalancePw").textContent = "Token balance: " + JSON.stringify(tokenBalancePw);
	} catch (error) { alert(error) }
};

document.getElementById("sweepPw").onclick = async () => {
	try {
	var wallet = await Wallet.named("microfi");
	let sweepPk = document.querySelector("#sweepPk").value;
	let recipientPw = document.querySelector("#recipientAddress").value;
	let tempWallet = await Wallet.fromWIF(sweepPk);
	let bchBalancePw = await tempWallet.getBalance();
	bchBalanceObj = Object.values({...bchBalancePw});
	let bchBal = bchBalanceObj[1];
	let tokenBalancePw = await tempWallet.getAllTokenBalances();
	tokenCategoriesObj = Object.keys({...tokenBalancePw});
	let tokenCat = tokenCategoriesObj[0];
	tokenAmountsObj = Object.values({...tokenBalancePw});
	let tokenAmo = tokenAmountsObj[0];
	const { txId } = await tempWallet.sendMax([
		{
			cashaddr: recipientPw,
			value: bchBal - 546,
			unit: "sats",
		},
		new TokenSendRequest(
		{
			cashaddr: recipientPw,
			amount: tokenAmo,
			tokenId: tokenCat
		}
		)
	]);
	document.getElementById("swept").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sweepPwBch").onclick = async () => {
	try {
	var wallet = await Wallet.named("microfi");
	let sweepPk = document.querySelector("#sweepPk").value;
	let recipientPw = document.querySelector("#recipientAddress").value;
	var tempWallet = await Wallet.fromWIF(sweepPk);
	let bchBalancePw = await tempWallet.getBalance();
	bchBalanceObj = Object.values({...bchBalancePw});
	let bchBal = bchBalanceObj[1];
	const { txId } = await tempWallet.sendMax([
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
	let wAddress = document.querySelector("#wAddress").value;
	let wallet = await Wallet.watchOnly(wAddress);
	let wbchBalance = await wallet.getBalance();
	let wtokenBalance = await wallet.getAllTokenBalances();
	let wnftBalance = await wallet.getAllNftTokenBalances();
	document.getElementById("wbchbalance").textContent = "BCH balance: " + JSON.stringify(wbchBalance);
	document.getElementById("wtokens").textContent = "tokenId(category): amount: " + JSON.stringify(wtokenBalance, null, "\t");
	document.getElementById("wnfts").textContent = "NFT Id(category): amount: " + JSON.stringify(wnftBalance, null, "\t");
};

document.getElementById("createPaymentRequest").onclick = async () => {
	let pAddress = document.querySelector("#address").value;
	let pAmount = document.querySelector("#amount").value;
	let pLabel = document.querySelector("#label").value;
	let pUrl = pAddress + "?amount=" + pAmount + "&label=" + pLabel;">";
	document.getElementById("payurl").textContent = pUrl;
};
document.getElementById("usePaymentRequest").onclick = async () => {
	let uPayUrl = document.querySelector("#upayurl").value;
	document.getElementById("usepayurl").textContent = uPayUrl;
	location.href = uPayUrl;
};

document.getElementById("signM").onclick = async () => {
	var wallet = await Wallet.named("microfi");
	let sMessage = document.querySelector("#smessage").value;
	wallet.cashaddr;
	sign = (await wallet.sign(sMessage)).signature;
	document.getElementById("signMessage").textContent = sign;
};
document.getElementById("verifyM").onclick = async () => {
	let vAddress = document.querySelector("#vaddress").value;
	let signatureHash = document.querySelector("#signH").value;
	let someWallet = await Wallet.watchOnly(vAddress);
	let verifyResult = await someWallet.verify(vAddress, signatureHash);
	document.getElementById("verifyMessage").textContent = verifyResult.valid;
};

document.getElementById("sendOp").onclick = async () => {
	try {
	var wallet = await Wallet.named("microfi");
	let opMessage = document.querySelector("#opmessage").value;
	let tokenAddress2 = "bitcoincash:zr8j9fzlmsdfy52n37pg2frqaddsjs99qy6pkdq0c5";
	let tokenId4 = "b69f76548653033603cdcb81299e3c1d1f3d61ad66e7ba0e6569b493605b4cbe";
	let chunks = ["XMI", opMessage];
	let opreturnData = OpReturnData.fromArray(chunks);
	const { txId } = await wallet.send([ opreturnData, new TokenSendRequest(
		{
			cashaddr: tokenAddress2,
			amount: 1,
			tokenId: tokenId4
		}
	)
	]);
	document.getElementById("opsent").textContent = "https://explorer.bitcoinunlimited.info/tx/" + txId;
	} catch (error) { alert(error) }
};