document.addEventListener("DOMContentLoaded", async (event) => {
globalThis.exports = globalThis.exports || {};
Object.assign(globalThis, await __mainnetPromise);
Config.DefaultParentDerivationPath = "m/44'/145'/0'/0/0";
Config.EnforceCashTokenReceiptAddresses = true;
BaseWallet.StorageProvider = IndexedDBProvider;

document.getElementById("create").onclick = async () => {
	const wallet = await TestNetWallet.named("tmicrofi");
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
	var wallet = await TestNetWallet.named("tmicrofi");
	const sd = localStorage.getItem("seed");
	const derivationPath = "m/44'/145'/0'/0/0";
	const walletId1 = `seed:testnet:${sd}:${derivationPath}`;
	const pk = localStorage.getItem("wif");
	const walletId2 = `wif:testnet:${pk}`;
	if (wallet = sd) {
		var wallet = await TestNetWallet.replaceNamed("tmicrofi", walletId1);
	} else if (wallet = pk) {
		var wallet = await TestNetWallet.replaceNamed("tmicrofi", walletId2);
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
	document.getElementById("bchaddress").textContent = "tBCH address: " + bchAddress;
	document.getElementById("bchQr").src = wallet.getDepositQr().src;
	document.getElementById("bchbalance").textContent = "tBCH balance: " + JSON.stringify(bchBalance);
	document.getElementById("pubKey").textContent = "pubKey: " + pubKey;
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

document.getElementById("sendBCH").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	let bchAddress = document.getElementById("sendAddr").value;
	let bchAmount = document.getElementById("sendAmount").value;
	const { txId } = await wallet.send([
		{
			cashaddr: bchAddress,
			value: bchAmount,
			unit: "sats"
		}
	]);
	document.getElementById("bchsent").textContent = "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sendBCHmax").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	let bchAddress = document.getElementById("sendAddr").value;
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
	document.getElementById("bchsent").textContent = "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sendTokens").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	let tokenAddress = document.getElementById("sendAddrToken").value;
	let token = document.getElementById("sendTokenId").value;
	let tokenAmount = document.getElementById("sendAmountToken").value;
	const { txId } = await wallet.send([ new TokenSendRequest(
		{
			cashaddr: tokenAddress,
			amount: tokenAmount,
			tokenId: token
		}
	)
	]);
	document.getElementById("ftsent").textContent = "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sendNfts").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	let tokenAddress1 = document.getElementById("sendAddrToken1").value;
	let token1 = document.getElementById("sendNftTokenId").value;
	let nftCommitment = document.getElementById("nftCommitment").value;
	let capabilityLists = document.getElementById("capabilityLists").value;
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
	document.getElementById("nftsent").textContent = "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("createTokenId").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	async function getValidPreGensis() {
		let walletUtxos = await wallet.getAddressUtxos();
		return walletUtxos.filter(utxo => !utxo.token && utxo.vout === 0);
	}
	let validPreGenesis = await getValidPreGensis();
	console.log(validPreGenesis);
	if (validPreGenesis.length === 0) {
		await wallet.send([{ cashaddr: wallet.tokenaddr, value: 1000, unit: "sats" }]);
		//console.log("Created output with vout zero for token genesis");
		validPreGenesis = await getValidPreGensis();
	}
	const tokenId = validPreGenesis[0].txid;
	document.getElementById("generateId").textContent = "tokenId: " + tokenId;
	} catch (error) { alert(error) }
};

document.getElementById("createTokens").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	let cashtokensAddress = await wallet.getTokenDepositAddress();
	//const fetchLocation = "https://" + document.getElementById("tokenUri").value;
	//const url = document.getElementById("tokenUri").value;
	//const response = await fetch(fetchLocation);
	//const bcmrContent = await response.text();
	//const document_hash = sha256.hash(utf8ToBin(bcmrContent));
	let symbol = document.getElementById("tokenSymbol1").value;
	let name = document.getElementById("tokenName1").value;
	let tokenAmount = document.getElementById("tokenAmount").value;
	let opreturnData;
	//const chunks = ["BCMR", document_hash, url, symbol, name];
	const chunks = [symbol, name];
	opreturnData = OpReturnData.fromArray(chunks);
	const genesisResponse = await wallet.tokenGenesis(
		{
			cashaddr: cashtokensAddress,
			amount: tokenAmount,
			value: 800
		},
		opreturnData
	);
	const tokenId = genesisResponse.tokenIds[0];
	const { txId } = genesisResponse;
	document.getElementById("createFt").textContent = "tokenId: " + tokenId + " " + "txId: " + "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("createGroupTokens").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	let cashtokensAddress = await wallet.getTokenDepositAddress();
	let sfAmount = document.getElementById("sfAmount").value;
	//let fetchLocation = "https://" + document.getElementById("tokenUriSf").value;
	//let url = document.getElementById("tokenUriSf").value;
	//let response = await fetch(fetchLocation);
	//let bcmrContent = await response.text();
	//let document_hash = sha256.hash(utf8ToBin(bcmrContent));
	//const chunks = ["BCMR", document_hash, url];
	let symbol = document.getElementById("tokenSymbol2").value;
	let name = document.getElementById("tokenName2").value;
	const chunks = [symbol, name];
	const opreturnData = OpReturnData.fromArray(chunks);
	const genesisResponse = await wallet.tokenGenesis(
		{
			cashaddr: cashtokensAddress,
			amount: sfAmount,
			commitment: "00",
			capability: NFTCapability.minting,
			value: 800
		}, 
		opreturnData
	);
	const tokenId = genesisResponse.tokenIds[0];
	const { txId } = genesisResponse;
	document.getElementById("createGroup").textContent = "Group tokenId: " + tokenId + " " + "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("mintNft").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	let cashtokensAddress = await wallet.getTokenDepositAddress();
	let tokenId1 = document.getElementById("mnftId").value;
	let mnftCommitment = document.getElementById("mnftCommitment").value;
	let commitmentHex = mnftCommitment.toString(16);
	let capabilityList1 = document.getElementById("capabilityList1").value;
	let capabilityMint = capabilityList1.substr(14, capabilityList1.length);
	const response1 = await wallet.tokenMint(
		tokenId1,
		[
		new TokenMintRequest({
			cashaddr: cashtokensAddress,
			commitment: commitmentHex,
			capability: capabilityMint,
			value: 800
		}),
		],
		true,
	);
	const { txId } = response1;
	document.getElementById("mintGroup").textContent = "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("burnFt").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	let burnTokenId = document.getElementById("burnTokenId").value;
	let burnAmount = document.getElementById("burnAmount").value;
	let burnResponse = await wallet.tokenBurn(
		{
			tokenId: burnTokenId,
			amount: burnAmount
		},
		"burn",
	);
	const { txId } = burnResponse;
	document.getElementById("burnFtTx").textContent = "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("burnNft").onclick = async () => {
	try {
	const wallet = await TestNetWallet.named("tmicrofi");
	let burnNftTokenId = document.getElementById("burnNftId").value;
	let burnCommitment = document.getElementById("burnCommitment").value;
	let capabilityList2 = document.getElementById("capabilityList2").value;
	let capabilityBurn = capabilityList2.substr(14, capabilityList2.length);
	const burnResponse = await wallet.tokenBurn(
		{
			tokenId: burnNftTokenId,
			commitment: burnCommitment,
			capability: capabilityBurn
		},
		"burn",
	);
	const { txId } = burnResponse;
	document.getElementById("burnNftTx").textContent = "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("balancePw").onclick = async () => {
	try {
	let sweepPk = document.getElementById("sweepPk").value;
	const tempWallet = await TestNetWallet.fromWIF(sweepPk);
	let bchBalancePw = await tempWallet.getBalance();
	let tokenBalancePw = await tempWallet.getAllTokenBalances();
	document.getElementById("bchbalancePw").textContent = "tBCH balance: " + JSON.stringify(bchBalancePw);
	document.getElementById("tokenbalancePw").textContent = "Token balance: " + JSON.stringify(tokenBalancePw);
	} catch (error) { alert(error) }
};

document.getElementById("sweepPw").onclick = async () => {
	try {
	//var wallet = await TestNetWallet.named("tmicrofi");
	let sweepPk = document.getElementById("sweepPk").value;
	let recipientPw = document.getElementById("recipientAddress").value;
	const tempWallet = await TestNetWallet.fromWIF(sweepPk);
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
			amount: tokenAmo,
			tokenId: tokenCat
		}
		)
	]);
	document.getElementById("swept").textContent = "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};

document.getElementById("sweepPwBch").onclick = async () => {
	try {
	//var wallet = await TestNetWallet.named("tmicrofi");
	let sweepPk = document.getElementById("sweepPk").value;
	let recipientPw = document.getElementById("recipientAddress").value;
	const tempWallet = await TestNetWallet.fromWIF(sweepPk);
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
	document.getElementById("swept").textContent = "https://chipnet.imaginary.cash/tx/" + txId;
	} catch (error) { alert(error) }
};
});

document.getElementById("spy").onclick = async () => {
	let wAddress = document.getElementById("wAddress").value;
	let wWallet = await TestNetWallet.watchOnly(wAddress);
	let wbchBalance = await wWallet.getBalance();
	let wtokenBalance = await wWallet.getAllTokenBalances();
	let wnftBalance = await wWallet.getAllNftTokenBalances();
	document.getElementById("wbchbalance").textContent = "tBCH balance: " + JSON.stringify(wbchBalance);
	document.getElementById("wtokens").textContent = "tokenId(category): amount: " + JSON.stringify(wtokenBalance, null, "\t");
	document.getElementById("wnfts").textContent = "NFT Id(category): amount: " + JSON.stringify(wnftBalance, null, "\t");
};

document.getElementById("signM").onclick = async () => {
	const wallet = await TestNetWallet.named("tmicrofi");
	let sMessage = document.getElementById("smessage").value;
	wallet.cashaddr;
	sign = (await wallet.sign(sMessage)).signature;
	document.getElementById("signMessage").textContent = sign;
};
document.getElementById("verifyM").onclick = async () => {
	let vAddress = document.getElementById("vaddress").value;
	let signatureHash = document.getElementById("signH").value;
	const someWallet = await TestNetWallet.watchOnly(vAddress);
	let verifyResult = await someWallet.verify(vAddress, signatureHash);
	document.getElementById("verifyMessage").textContent = verifyResult.valid;
};

document.getElementById("notarize").onclick = async () => {
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
			const wallet = await TestNetWallet.named("tmicrofi");
			wallet.cashaddr;
			sign = (await wallet.sign(hashHex)).signature;
			let opTitle = document.getElementById("optitle").value;
			let titleHash = sha256.hash(utf8ToBin(opTitle));
			let documentHash = hexToBin(hashHex);
			let chunks = ["Microfi_Notary", opTitle, titleHash, documentHash, sign];
			let opreturnData = OpReturnData.fromArray(chunks);
			const { txId } = await wallet.send([ opreturnData ]);
			document.getElementById("notarized").textContent = "txId: " + "https://chipnet.imaginary.cash/tx/" + txId;
			document.getElementById("dHash").textContent = "Document hash: " + hashHex;
			document.getElementById("signature").textContent = "Wallet signature of document hash: " + sign;
		})
	}
};