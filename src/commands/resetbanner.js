const { SendMessageToRoblox } = require('../MessagingService.js');

module.exports = {
    name: 'resetbanner',
    description: 'Reset current banner and generate a new one.',
    options: [
        {
            name: "include_timer",
            type: "Boolean",
            description: "Test",
            required: false,
        },
    ],

    async execute(interaction) {
        const seed = Date.now();
        const result = await SendMessageToRoblox(JSON.stringify({
            action: "ResetBanner",
            args: {
                seed: seed,
                include_timer: interaction.options.getBoolean("include_timer") ?? false,
            },
        }), "GachaMessage");

        if (result === true) {
            interaction.reply({ content: 'Successfully reset the banner!', ephemeral: true });
        }

        else {
            interaction.reply({ content: result, ephemeral: true });
        }
    },
};