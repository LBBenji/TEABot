const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('SnowfestRegister')
		.setDescription("Snowfest Club's registration command"),
	async execute(interaction) {
		await interaction.reply('...');
	},
};