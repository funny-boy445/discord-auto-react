import fetch from 'node-fetch';

const authorization = ""; // Put auth key for discord user here
const channel = ""; // Put channel ID here
const checkReactDelay = 1000;
const reactDelay = 333;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function AutoReact() {
	let reactData = await fetch(`https://discord.com/api/v9/channels/${channel}/messages?limit=1`, {
	    "headers": {
		"Authorization": authorization,
	    },
	    "method": "GET",
	})
		.then(res => res.json())
		.then(json => {
			if (json[0]["reactions"] == undefined)
				return;
			let toReturn = [];
			for (let i = 0; i < json[0]["reactions"].length; i++) {
				let emojiCode = "";
				let buffer = Buffer.from(json[0]["reactions"][i]["emoji"]["name"]);
				for (let j = 0; j < buffer.length; j++)
					emojiCode += '%' + buffer[j].toString(16);
				emojiCode = emojiCode.toUpperCase();
				toReturn.push([emojiCode, json[0]["id"]]);
			}
			return toReturn;
		});

	for (let i = 0; i < reactData.length; i++) {
		await fetch(`https://discord.com/api/v9/channels/${channel}/messages/${reactData[i][1]}/reactions/${reactData[i][0]}/%40me?location=Message&burst=false`, {
		    "headers": {
			"Authorization": authorization,
		    },
		    "method": "PUT",
		});
		await sleep(reactDelay);
	}
}

setInterval(AutoReact, checkReactDelay);