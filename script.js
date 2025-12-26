const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const BOT_TOKEN = "MTQ1Mzk4NTk0ODg4MTY1MzgyMA.G3gnUr.0YMh3If04WdztadSU-QGK-9YtZq1CkLMMZNolA";   // ← replace this
const CHANNEL_ID = "229545531104296960";     // ← replace this

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

// Endpoint your HTML will call
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

// Start web server
app.listen(3000, () => {
    console.log("Web server running on http://localhost:3000");
});

// Start bot
client.login(BOT_TOKEN);
