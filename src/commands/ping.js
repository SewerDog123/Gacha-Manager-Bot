const { SendMessageToRoblox } = require('../MessagingService.js');

module.exports = {
    name: 'ping',
    description: "Check bot latency",

    async execute(interaction) {
       const sent = await interaction.reply({
          content: "Pinging..",
          fetchReply: true,
       })

       const latency = sent.createdTimestamp - interaction.createdTimestamp;
       await interaction.editReply(`Pong! ${latency}ms`);
    },
};