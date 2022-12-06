const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Settings = require("../Data/Secret/Settings.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event-channel-init')
		.setDescription("Snowfest entry submission command")
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName("name")
                .setDescription("The name of club using this event channel")
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
                
                
	async execute(interaction) {
        //todo
	},
};