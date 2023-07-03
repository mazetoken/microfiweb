document.addEventListener("DOMContentLoaded", async (event) => {
	globalThis.exports = globalThis.exports || {};
	Object.assign(globalThis, await __mainnetPromise);
	Config.DefaultParentDerivationPath = "m/44'/145'/0'/0/0";
	//Config.EnforceCashTokenReceiptAddresses = true;

	document.getElementById("create").onclick = async () => {
		const wallet = await Wallet.named("microfi");
		localStorage.setItem("seed", wallet.mnemonic);
		localStorage.setItem("wif", wallet.privateKeyWif);
		const tokenAddress = await wallet.getTokenDepositAddress();
		let tokensAddressBalance = await wallet.getAllTokenBalances();
		let nftsAddressBalance = await wallet.getAllNftTokenBalances();
		const bchAddress = await wallet.getDepositAddress();
		let bchBalance = await wallet.getBalance();
		
		document.getElementById("bchaddress1").textContent = "BCH address: " + bchAddress;
		document.getElementById("cashtokensaddress1").textContent = "CashTokens address: " + tokenAddress;
		document.getElementById("bchbalance1").textContent = "BCH balance: " + JSON.stringify(bchBalance);
		document.getElementById("mnemonic1").textContent = "Seed phrase: " + wallet.mnemonic;
		document.getElementById("derivation1").textContent = "Derivation path: " + wallet.derivationPath;
		document.getElementById("privatekey1").textContent ="Private key: " + wallet.privateKeyWif;
		document.getElementById("tokens1").textContent = "Tokens: " + JSON.stringify(tokensAddressBalance, null, "\t");
		document.getElementById("nfts1").textContent = "NFTs: " + JSON.stringify(nftsAddressBalance, null, "\t");
	};

	document.getElementById("open").onclick = async () => {
		var wallet = await Wallet.named("microfi");
		const sd = localStorage.getItem("seed");
		const derivationPath = "m/44'/145'/0'/0/0";
		const walletId1 = `seed:mainnet:${sd}:${derivationPath}`;
		const pk = localStorage.getItem("wif");
		if (wallet = sd) {
			var wallet = await Wallet.replaceNamed("microfi", walletId1);
		} else if (wallet = pk) {
			var wallet = await Wallet.fromWIF(pk);
		}
		const tokenAddress = await wallet.getTokenDepositAddress();
		let tokensAddressBalance = await wallet.getAllTokenBalances();
		let nftsAddressBalance = await wallet.getAllNftTokenBalances();
		const bchAddress = await wallet.getDepositAddress();
		let bchBalance = await wallet.getBalance();
		
		document.getElementById("bchaddress2").textContent = "BCH address: " + bchAddress;
		document.getElementById("cashtokensaddress2").textContent = "CashTokens address: " + tokenAddress;
		document.getElementById("bchbalance2").textContent = "BCH balance: " + JSON.stringify(bchBalance);
		document.getElementById("mnemonic2").textContent = "Seed phrase: " + wallet.mnemonic;
		document.getElementById("derivation2").textContent = "Derivation path: " + wallet.derivationPath;
		document.getElementById("privatekey2").textContent ="Private key: " + wallet.privateKeyWif;
		document.getElementById("tokens2").textContent = "Tokens: " + JSON.stringify(tokensAddressBalance, null, "\t");
		document.getElementById("nfts2").textContent = "NFTs: " + JSON.stringify(nftsAddressBalance, null, "\t");
	};

	document.getElementById("login").onclick = async () => {
		const seed = document.querySelector("#importSeedPhrase").value;
		localStorage.setItem("seed", seed);
		const privatekey = document.querySelector("#importPrivateKey").value;
		localStorage.setItem("wif", privatekey);
		document.getElementById("loginConf1").textContent = "You are logged in with seed phrase: " + seed;
		document.getElementById("loginConf2").textContent = "You are logged in with privatekey: " + privatekey;
	}

	document.getElementById("clear").onclick = async () => {
		localStorage.clear();
		document.getElementById("clear1").textContent = "Local storage is cleared. You have to login again.";
	}

	document.getElementById("viewTokens").onclick = async () => {
		const bcmrList = document.querySelector("#bcmrList").value;
		const bcmrCustom = document.querySelector("#bcmrCustom").value;
		if (bcmrUrl = bcmrList) {
		await BCMR.addMetadataRegistryFromUri(bcmrList);
		} else if (bcmrUrl = bcmrCustom) {
		await BCMR.addMetadataRegistryFromUri(bcmrCustom);
		}
		const viewTokenId = document.querySelector("#viewTokenId").value;
		const tokenInfo = BCMR.getTokenInfo(viewTokenId);
		document.getElementById("tokencategory3").textContent = "Category/tokenId: " + tokenInfo.token.category;
		document.getElementById("tokenname3").textContent = "Name: " + tokenInfo.name;
		document.getElementById("tokensymbol3").textContent = "Symbol: " + tokenInfo.token.symbol;
		document.getElementById("tokendecimals3").textContent = "Decimals: " + tokenInfo.token.decimals;
		document.getElementById("tokendescription3").textContent = "Description: " + tokenInfo.description;
		document.getElementById("tokenicon3").src = tokenInfo.uris.icon;
	};

	document.getElementById("viewTokens1").onclick = async () => {
		const viewTokenId1 = document.querySelector("#viewTokenId1").value;
		const authChain = await BCMR.buildAuthChain({
			transactionHash: viewTokenId1,
			followToHead: true
		});
		if (authChain[0]) {
		try {
			await BCMR.addMetadataRegistryFromUri(authChain[0].httpsUrl);
		} catch (error) { alert(error) }
		}
		const tokenInfo = BCMR.getTokenInfo(viewTokenId1);
		document.getElementById("tokencategory4").textContent = "Category/tokenId: " + tokenInfo.token.category;
		document.getElementById("tokenname4").textContent = "Name: " + tokenInfo.name;
		document.getElementById("tokensymbol4").textContent = "Symbol: " + tokenInfo.token.symbol;
		document.getElementById("tokendecimals4").textContent = "Decimals: " + tokenInfo.token.decimals;
		document.getElementById("tokendescription4").textContent = "Description: " + tokenInfo.description;
		document.getElementById("tokenicon4").src = tokenInfo.uris.icon;
	};

	document.getElementById("viewTokens2").onclick = async () => {
		const viewTokenId2 = document.querySelector("#viewTokenId2").value;
		const apiUrl = "https://bcmr.paytaca.com/api/tokens/" + viewTokenId2;
		fetch(apiUrl)
			.then(response => response.json())
			.then(data => document.getElementById("tokenapi").textContent = 
			data.name + " " + data.token.symbol + " " + "| Decimals: " + data.token.decimals + " " + "| Description: " + data.description + " " + " " + "| Web: " + data.uris.web + " " + "| Icon: " + data.uris.icon
			);
	};

	document.getElementById("sendBCH").onclick = async () => {
		try {
		const bchAddress = document.querySelector("#sendAddr").value;
		const bchAmount = document.querySelector("#sendAmount").value;
		const wallet = await Wallet.named("microfi");
		const { txId } = await wallet.send([
			{
			cashaddr: bchAddress,
			value: bchAmount,
			unit: "sat"
			}
		]);
		document.getElementById("bchsent").textContent = "TxId: " + txId;
		} catch (error) { alert(error) }
	};

	document.getElementById("sendTokens").onclick = async () => {
		try {
		const tokenAddress = document.querySelector("#sendAddrToken").value;
		const tokenAmount = document.querySelector("#sendAmountToken").value;
		const token = document.querySelector("#sendTokenId").value;
		const wallet = await Wallet.named("microfi");
		const { txId } = await wallet.send([new TokenSendRequest(
			{
			cashaddr: tokenAddress,
			amount: tokenAmount,
			tokenId: token
			}
		)]);
		document.getElementById("ftsent").textContent = "TxId: " + txId;
		} catch (error) { alert(error) }
	};

	document.getElementById("sendNfts").onclick = async () => {
		try {
		const tokenAddress = document.querySelector("#sendAddrToken1").value;
		const token1 = document.querySelector("#sendNftTokenId").value;
		const nftCommitment = document.querySelector("#nftCommitment").value;
		const wallet = await Wallet.named("microfi");
		const { txId } = await wallet.send([new TokenSendRequest(
			{
			cashaddr: tokenAddress,
			tokenId: token1,
			commitment: nftCommitment,
			capability: NFTCapability.none
			}
		)]);
		document.getElementById("nftsent").textContent = "TxId: " + txId;
		} catch (error) { alert(error) }
	};
});

document.getElementById("createPaymentRequest").onclick = async () => {
    const pAddress = document.querySelector("#address").value;
    const pAmount = document.querySelector("#amount").value;
    const pLabel = document.querySelector("#label").value;
    const pUrl = pAddress + "?amount=" + pAmount + "&label=" + pLabel;">";
    document.getElementById("payurl").textContent = pUrl;
    //location.href = pUrl;
    };
    document.getElementById("usePaymentRequest").onclick = async () => {
    const uPayUrl = document.querySelector("#upayurl").value;
    //const upUrl = uPayUrl;
    document.getElementById("usepayurl").textContent = uPayUrl;
    location.href = uPayUrl;
};

document.getElementById("signM").onclick = async () => {
    const sMessage = document.querySelector("#smessage").value;
    const wallet = await Wallet.named("microfi");
    wallet.cashaddr;
    sign = (await wallet.sign(sMessage)).signature;
    document.getElementById("signMessage").textContent = sign;
    };
    document.getElementById("verifyM").onclick = async () => {
    const vAddress = document.querySelector("#vaddress").value;
    const signatureHash = document.querySelector("#signH").value;
    someWallet = await Wallet.watchOnly(vAddress);
    verifyResult = await someWallet.verify(vAddress, signatureHash);
    document.getElementById("verifyMessage").textContent = verifyResult.valid;
};