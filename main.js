const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (!message.content.startsWith('!play')) return;
  
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return message.reply('Please join a voice channel first!');
  }
  
  const args = message.content.split(' ');
  const song = args[1];
  
  voiceChannel.join().then(connection => {
    const stream = ytdl(song, { filter: 'audioonly' });
    const dispatcher = connection.play(stream);
    
    dispatcher.on('end', () => {
      voiceChannel.leave();
    });
  });
});

client.login('YOUR_BOT_TOKEN');
