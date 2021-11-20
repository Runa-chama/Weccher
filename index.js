const http = require('http');
http.createServer(function(req, res) {
  res.write("online");
  res.end();
}).listen(8080);
/*
If this program is run on replit the above program need.
Make a web page to receive a ping to wake up this program.
*/

const discord = require('discord.js');
const client = new discord.Client();
const request = require('request');
const fs = require('fs');
const subJS = require('./sub');//sub script

const prefix = "!w";
const theme_color = "#03e8fc";

client.on('ready', () => {
  console.log('ready');
  client.user.setActivity(prefix, { type: 'WATCHING' });
})

client.on('message', async message => {
  if (message.content.startsWith(prefix)) {//Is this a command?
    const command_options = message.content.slice(prefix.length).trim().split(/ +/g);
    const message_channel_id = message.channel.id;
    let got_JSON;
    let address = encodeURI(command_options[1]);

    console.log("options:" + command_options);

    message.channel.startTyping();

    if (command_options[0] == 'help') {//help command
      const help_message = JSON.parse(fs.readFileSync('./help.json', 'utf8'));
      message.reply(help_message);
      message.channel.stopTyping();
      return;
    }
    const options_map = {
      url: 'https://script.google.com/macros/s/AKfycbwAr3seBQUIOIF-p4dxP5KuGCfhAnwxdfTTTOCynNHOOZbvavWHWxUMyoUK50NW1FMk/exec?address=' + address + '',
      method: 'GET'
    }
    request(options_map, function(error, response, body) {//request to get lat,lng
      if (body == "Error") {
        client.channels.cache.get(message_channel_id).send("情報を取得できませんでした。");
        return;
      }
      
      let position = body;
      const result = JSON.parse(position);
      let lat = result.lat;
      let lng = result.lng;
      let formated_address = result.formated_address;
      console.log("lat:" + lat + "\nlng:" + lng);

      const options_weather = {
        url: 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng + '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FTokyo',
        method: 'GET'
      }

      request(options_weather, function(error, response, body) {//request to get weather
        //Infomations
        const weather_info = JSON.parse(body);
        const times = weather_info.daily.time;
        const weather_codes = weather_info.daily.weathercode;
        const temp_maxs = weather_info.daily.temperature_2m_max;
        const temp_mins = weather_info.daily.temperature_2m_min;
        const precipitation_sums = weather_info.daily.precipitation_sum;

        console.log(body);
        switch (command_options[0]) {

          case "t": {//today
            const time = times[0];
            const today_weather_code = weather_codes[0];
            const today_weather = subJS.c_w(today_weather_code);
            const today_temp_max = temp_maxs[0];
            const today_temp_min = temp_mins[0];
            const precipitation_sum = precipitation_sums[0];
            message.reply({
              embed: {
                title: formated_address + "周辺の気象",
                color: theme_color,
                fields: [
                  {
                    name: time,
                    value: "**天候**　" + today_weather + "\n**最高気温**　" + today_temp_max + "℃\n**最低気温**　" + today_temp_min + "℃\n**合計降水量　**" + precipitation_sum + "mm"
                  }
                ]
              }
            });
          }
          break;

          case "0": //Get weather [n]day after
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
            {
              const time = times[command_options[0]];
              const weather_code = weather_codes[command_options[0]];
              const weather = subJS.c_w(weather_code);
              const temp_max = temp_maxs[command_options[0]];
              const temp_min = temp_mins[command_options[0]];
              const precipitation_sum = precipitation_sums[command_options[0]];
              message.reply({
                embed: {
                  title: formated_address + "周辺の気象",
                  color: theme_color,
                  fields: [
                    {
                      name: time,
                      value: "**天候**　" + weather + "\n**最高気温**　" + temp_max + "℃\n**最低気温**　" + temp_min + "℃\n**合計降水量　**" + precipitation_sum + "mm"
                    }
                  ]
                }
              });
            }
            break;

          case "7": //A week after
          case "w": {
            const weathers = [];
            for (let i = 0; i < 7; i++) {//change weathercodes to words
              weathers.push(subJS.c_w(weather_codes[i]));
            }
            //Change array to text
            const times_sent = times.join();
            const weathers_sent = weathers.join();
            const temps_max_sent = temp_maxs.join();
            const temps_min_sent = temp_mins.join();
            const precipotation_sums_sent = precipitation_sums.join();
            console.log("times_sent:" + times_sent);
            const gas_url = encodeURI('https://script.google.com/macros/s/AKfycbyrdibjueeiaONsYxc6ri5QKNtOrZJ1SZA6cqidnt_0BfN5SS3ac2HYHSHGRi2iWFKNYA/exec?t=' + times_sent + "&w=" + weathers_sent + "&tmax=" + temps_max_sent + "&tmin=" + temps_min_sent + "&pre=" + precipotation_sums_sent);
            console.log(gas_url);
            const options_week = {
              url: gas_url,
              method: 'GET'
            }
            request(options_week, function(error, response, body) {
              const file_url = body;
              message.reply({
                embed: {
                  image: {
                    url: file_url + '&png'
                  },
                  title: formated_address + "周辺の1週間の気象",
                  color: theme_color
                }
              });
            })
          }
          break;

          default:
            client.channels.cache.get(message_channel_id).send("不明なコマンドです。```" + prefix + " help```でヘルプを表示します。");
        }
      })
    })
    message.channel.stopTyping();
  }
})

client.login(process.env.TOKEN);

