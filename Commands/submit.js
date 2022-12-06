const { SlashCommandBuilder, SlashCommandAttachmentOption } = require('discord.js');
const Settings = require("../Data/Secret/Settings.json")
const fs = require("fs");

const entryjsonstream = fs.createWriteStream("./Data/entries.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription("Snowfest entry submission command")
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName("name")
                .setDescription("The name of club tied to that entry")
                .setRequired(true)
                .setChoices(
                    {name: 'Goog Club', value: 'Goog Club'}
                )) 
        .addIntegerOption(option => 
            option.setName("number")
                .setDescription("The prize number tied to that entry")
                .setRequired(true)
                .setMaxValue(7)
                .setMinValue(1))
        .addAttachmentOption((new SlashCommandAttachmentOption() 
                .setName("screenshot")
                .setDescription("Screenshot of the entry sign")
                .setRequired(true)
        )),
                
                
	async execute(interaction) {
        const clubname = interaction.options.getString('name');
        const prizeId = interaction.options.getInteger('number');
        const entryPic = interaction.options.getAttachment('screenshot');
        const sender = interaction.member;
        const obj = {
            entries: []
        }
        let verifyChannel = interaction.guild.channels.cache.find(channel=> channel.id === Settings.VerifChannelId)

		await interaction.reply(`Entry successfully sumbmited!\nYou will appear in the entry list once one of the event managers will have approved it`);

        let sent = await verifyChannel.send({
            content: `New Entry Submission from **${sender.user.tag}** for **prize#${prizeId}** of ***${clubname}***`,
            files: [entryPic.url]
        })
        let sentid = sent.id;

        obj.entries.push({
            user: sender.user.tag,
            clubname: clubname,
            prizeId: prizeId,
            sslink: entryPic.url,
            verifmsgId: sentid,
            validated: false
        });
        entryjsonstream.write(JSON.stringify(obj), function (err) {
            if (err) throw err;
            console.log("new entry submitted")
        })

        sent.react('✅')
	},
};