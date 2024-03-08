document.getElementById("createBCMR").onclick = async () => {
  try {
  let now = new Date();
  let registryName1 = document.getElementById("registryName1").value;
  let registryDescription1 = document.getElementById("registryDescription1").value;
  //let registryUri1 = document.getElementById("registryUri1").value;
  let tokenCategory1 = document.getElementById("tokenCategory1").value;
  let name1 = document.getElementById("name1").value;
  let description1 = document.getElementById("description1").value;
  let decimals1 = document.getElementById("decimals1").value;
  let symbol1 = document.getElementById("symbol1").value;
  let icon1 = document.getElementById("icon1").value;
  let website1 = document.getElementById("website1").value;
  console.log(registryName1 + registryDescription1 + tokenCategory1 + name1 + description1 + decimals1 + symbol1 +icon1 + website1);
      
    let obj =
      {
        "$schema": "https://cashtokens.org/bcmr-v2.schema.json",
        "version": { "major": 1, "minor": 1, "patch": 0 },
        "latestRevision": now.toISOString(),
        "registryIdentity": {
            "name": registryName1,
            "description": registryDescription1
        },
        "identities": {
            [tokenCategory1]: {
                [now.toISOString()]: {
                    "name": name1,
                    "description": description1,
                    "token": {
                        "category": tokenCategory1,
                        "decimals": JSON.parse(decimals1),
                        "symbol": symbol1
                    },
                    "uris": {
                        "icon": icon1,
                        "web": website1
                    }
                }
            }
        },
        "license": "CC0-1.0"
      }
    
    let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));


    let a = document.createElement("a");
    a.href = "data:" + data;
    a.download = "bitcoin-cash-metadata-registry.json";
    a.innerText = " metadata JSON";
    
    let container = document.getElementById("metadatajson");
    container.appendChild(a);
  } catch (error) { alert(error) }
};

document.getElementById("encodeBCMR").onclick = async () => {
	try {
	const fileInput = document.getElementById("metafile");
	const file = fileInput.files[0];
	const reader = new FileReader();

  reader.readAsText(file);

	reader.onload = async function() {
		const buffer = reader.result;
    console.log(buffer);
    // Define the string
    let decodedStringBtoA = buffer;

    // Encode the String
    let encodedStringBtoA = btoa(decodedStringBtoA);
    console.log(encodedStringBtoA);

  document.getElementById("encodedBCMR").textContent = "data:@file/json;base64," + encodedStringBtoA;
	}
	} catch (error) { alert(error) }
};