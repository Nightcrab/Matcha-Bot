const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
var config = require("./config.json");
var data = require("./data.json");
var newIDs = [];

function findpm (id) {

	let pm = data.permanent_messages;
	for (var n in pm)
	{
		if (pm[n].id == id) {
			return pm[n];
		}
	}
}

bot.on('ready', () => 
{
	let pm = data.permanent_messages;
	var funcs = [];
	for (i=0;i<pm.length;i++) 
	{
		funcs.push(function (M) {
			let channel = bot.channels.get(pm[M].channel);
			if (pm[M].id == "")
			{
				if (pm[M].embed.exists)
				{
					let props = pm[M].embed;
					let embed = new Discord.RichEmbed()
						.setColor(props.color)
						.setAuthor(props.author)
						.setDescription(props.desc)
						.setImage(props.img)
						.setTitle(props.title);
					channel.send({embed}).then(function(m){pm[M].id = m.id;saveData()});
					return;
				}
				channel.send(pm[M].content).then(function(m){pm[M].id = m.id;saveData()});
				return;
			}
			else
			{
				channel.fetchMessage(pm[M].id).then((message) =>
				{

					if (message.embeds.length != 0)
					{
						let props = findpm(message.id).embed;
						let embed = new Discord.RichEmbed()
							.setColor(props.color)
							.setAuthor(props.author)
							.setDescription(props.desc)
							.setImage(props.img)
							.setTitle(props.title);
						//message.delete();
						if (pm[M].refresh) 
						{
							message.delete();
							return message.channel.send({embed}).then(function(m){pm[M].id = m.id;saveData()});
						}
						message.channel.edit({embed});
					}
					else if (message.content != pm[M].content) {
						//message.delete();
						if (pm[M].refresh) 
						{
							message.delete();
							return message.channel.send(pm[M].content).then(function(m){pm[M].id = m.id;saveData()});
						}
						message.channel.edit(pm[M].content);
					}
				});
			}
		});
	}
	for (i=0;i<funcs.length;i++)
	{
		funcs[i](i);
	}
});

bot.on('message', (msg) => 
{

});

function saveData() {
	fs.writeFileSync("./data.json", JSON.stringify(data, null, 4));
}

bot.login(config.token);