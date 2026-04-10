const { SendMessageToRoblox } = require('../MessagingService.js');

module.exports = {
    name: 'setenddate',
    description: "Unix timestamp (seconds) when the gacha banner will end",
    options: [
        {
            name: "date",
            type: "Number",
            description: "End time of gacha (Unix timestamp in seconds)",
            required: true,
        },
    ],

    async execute(interaction) {
        const date = interaction.options.getInteger("date")
        const now = Math.floor(Date.now() / 1000)

        if (!date || typeof date !== "number") {
            return interaction.reply({ content: "Invalid timestamp", ephemeral: true });
        }

        if (date > 1e12) {
            return interaction.reply({
                content: "Please use Unix timestamp in seconds, not milliseconds",
                ephemeral: true,
            });
        }

        // Attempt to set end time with past time
        if (date < now) {
            return interaction.reply({
                content: "Can't set end date with past date",
                ephemeral: true,
            })
        }

        const result = await SendMessageToRoblox(JSON.stringify({
            action: "SetEndDate",
            args: {
                date: interaction.options.getInteger("date"),
            },
        }), "GachaMessage");

        if (result === true) {
            interaction.reply({ content: "Successfully set gacha end date", ephemeral: true });
        }

        else {
            interaction.reply({ content: result, ephemeral: true });
        }
    },
};