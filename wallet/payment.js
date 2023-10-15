document.getElementById("createPaymentRequest").onclick = async () => {
	let pAddress = document.getElementById("address").value;
	let pAmount = document.getElementById("amount").value;
	let pLabel = document.getElementById("label").value;
	let pUrl = pAddress + "?amount=" + pAmount + "&label=" + pLabel;">";
	document.getElementById("payurl").textContent = pUrl;
	document.getElementById("qr1").addEventListener("codeRendered", () => {
	document.getElementById("qr1").animateQRCode("MaterializeIn");
	});
	document.getElementById("qr1").contents = pUrl;
};

document.getElementById("usePaymentRequest").onclick = async () => {
	let uPayUrl = document.querySelector("#upayurl").value;
	document.getElementById("usepayurl").textContent = uPayUrl;
	location.href = uPayUrl;
};