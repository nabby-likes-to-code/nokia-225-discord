const readline = require("readline");
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

// Ask user for token at startup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your Discord bot token: ", (BOT_TOKEN) => {
    rl.question("Enter the channel ID to send messages to: ", (CHANNEL_ID) => {

        // --- Discord Bot Setup ---
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        client.on("ready", () => {
            console.log(`Bot logged in as ${client.user.tag}`);
        });

        // --- Web Server Setup ---
        const app = express();
        app.use(express.json());

        app.post("/send", (req, res) => {
            const text = req.body.message;

            if (!text) {
                return res.status(400).send("No message provided");
            }

            const channel = client.channels.cache.get(CHANNEL_ID);
            if (!channel) {
                return res.status(500).send("Channel not found");
            }

            channel.send(text);
            res.send("Message sent");
        });

        app.listen(3000, () => {
            console.log("Web server running on http://localhost:3000");
        });

        client.login(BOT_TOKEN);
        rl.close();
    });
});
