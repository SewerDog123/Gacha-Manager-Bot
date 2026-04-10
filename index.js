// Bot.js
const { Client, GatewayIntentBits, Collection, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        // GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.name, command);
}

// Slash command deployment
async function deployCommands() {
    const commands = [];

    for (const command of client.commands.values()) {
        // if (!command.name || !command.description || typeof command.execute !== 'function') {
        //     continue;
        // }
        
        const builder = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);

        if (Array.isArray(command.options)) {
            for (const option of command.options) {
                if (option.type === "String") { // String
                    builder.addStringOption(opt =>
                        opt
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.required ?? false)
                    );
                } 
                else if (option.type === "Number") { // Integer
                    builder.addIntegerOption(opt =>
                        opt
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.required ?? false)
                    );
                }

                else if (option.type === "Boolean") { // Boolean
                    builder.addBooleanOption(opt => 
                        opt
                        .setName(option.name)
                        .setDescription(option.description)
                        .setRequired(option.required ?? false)
                    );
                }

                else {
                    console.log(`Unsupported option type ${option.type} in command ${command.name}`);
                }
            }
        }

        commands.push(builder.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log("Deploying commands..");
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID,
            ),
            { body: commands }
        );
        console.log("Command deployed");
    } catch (error) {
        console.error(error);
    }
}

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    deployCommands();
});

// Execute command
client.on('interactionCreate', async interaction => {
   if (!interaction.isCommand()) return;

   const command = client.commands.get(interaction.commandName)
   if (!command) {
        return interaction.reply({ content: 'Command not found!', ephemeral: true });
   };

   try {
    await command.execute(interaction);
   }catch(err) {
      console.error(err);
   }
});

client.login(process.env.TOKEN);