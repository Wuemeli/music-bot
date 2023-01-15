const Discord = require('discord.js');
const client = new Discord.Client();
const ytSearch = require('youtube-search');

let queue = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (!message.content.startsWith('!play')) return;
  
  const args = message.content.split(' ');
  const searchString = args.slice(1).join(' ');
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return message.reply('Please join a voice channel first!');
  }
  
  let opts = {
    maxResults: 1,
    key: 'YOUR_YOUTUBE_API_KEY'
  };
  
  try {
    let searchResults = await ytSearch(searchString, opts);
    let song = searchResults[0];
    if(queue.has(message.guild.id)){
      queue.get(message.guild.id).songs.push(song);
      return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
    }else{
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 2,
        playing: true
      };
      queue.set(message.guild.id, queueConstruct);
      queueConstruct.songs.push(song);
      
      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`I could not join the voice channel: ${error}`);
        queue.delete(message.guild.id);
        return message.channel.send(`I could not join the voice channel: ${error}`);
      }
    }
  } catch (error) {
    console.error(error);
    return message.reply('I was unable to obtain any search results.');
  }
});

function play(guild, song){
    //function that plays the song using the youtube api
}

client.login('YOUR_BOT_TOKEN');
