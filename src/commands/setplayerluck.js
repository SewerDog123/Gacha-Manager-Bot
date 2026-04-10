const { SendMessageToRoblox } = require('../MessagingService.js');

module.exports = {
    name: 'setplayerluck',
    description: "Set specific player's luck with player userid.",
    options: [
        {
            name: "userid",
            type: "Number",
            description: "Player's userid",
            required: true,
        },

        {
            name: "luck",
            type: "Number",
            description: "Luck amount",
            required: true,
        },
    ],

    async execute(interaction) {
        const result = await SendMessageToRoblox(JSON.stringify({
            action: "SetPlayerLuck",
            args: {
                userid: interaction.options.getInteger("userid"),
                luck: interaction.options.getInteger("luck"),
            },
        }), "GachaMessage");

        if (result === true) {
            interaction.reply({ content: "Successfully set player's luck!", ephemeral: true });
        }

        else {
            interaction.reply({ content: result, ephemeral: true });
        }
    },
};