const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Tests Slash command'),
	async execute(interaction) {
		await interaction.reply('The first slash command is working! GG!');
	},
};