const { SlashCommandBuilder, SlashCommandAttachmentOption, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Settings = require("../Data/Secret/Settings.json")
const fs = require("fs");

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
        const datacatch = fs.readFileSync('./Data/entries.json');
        const obj = JSON.parse(datacatch);
        const verifyChannel = interaction.guild.channels.cache.find(channel=> channel.id === Settings.VerifChannelId)
        
        if (!verifyChannel) return interaction.reply({ content: 'There is an error with server configuration and cannnot proceed. contact TEA managers to solve this issue.', ephemeral: true })
            .catch(err => console.error('Error to send interaction reply.', err));

        
        
        const Now = new Date();
        const EntryId = `${Now.getTime()}${sender.user.id}`

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(EntryId)
                    .setLabel('Validate')
                    .setStyle(ButtonStyle.Success)
            );

        const sent = await verifyChannel.send({
            content: `New Entry Submission from **${sender.user.tag}** for **prize#${prizeId}** of ***${clubname}***`,
            files: [entryPic.url],
            components: [row]
        }).catch(err => console.error('Error to send channel message.', err));

        if (!sent) {
            return interaction.reply({ content: 'There was an error to send a channel message.' })
                .catch(err => console.error('Error to send interaction reply.', err));
        }

        const submitData = {
            EntryId,
            user: sender.user.tag,
            clubname,
            prizeId,
            sslink: entryPic.url,
            verifmsgId: sent.id,
            validated: false
        };

        obj.entries.push(submitData);

        fs.writeFileSync('./Data/entries.json', JSON.stringify(obj, null, ' '))

        console.log(`[📣] A new entry has been created by ${submitData.user} for ${submitData.clubname} with prize number ${submitData.prizeId}}`);
        interaction.reply(`Entry successfully sumbmited!\nYou will appear in the entry list once one of the event managers will have approved it`)
            .catch(err => console.error('Error to send interaction reply.', err));
	},
};