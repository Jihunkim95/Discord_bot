require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const schedule = require('node-schedule');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID;
const roleId = process.env.DISCORD_ROLE_ID;

client.once('ready', () => {
    console.log('준비완료');
    sendBreakReminder();
});

async function sendBreakReminder() {
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
        console.error('채널을 찾을 수 없습니다.');
        return;
    }

    const times = [
        { hour: 9, minute: 50 },
        { hour: 10, minute: 50 },
        { hour: 11, minute: 50 },
        { hour: 13, minute: 50 },
        { hour: 14, minute: 50 },
        { hour: 15, minute: 50 },
        { hour: 16, minute: 50 },
        // { hour: 17, minute: 50 },
    ];

    times.forEach(time => {
        if (time.hour === 11 && time.minute === 50) {
            schedule.scheduleJob({ hour: time.hour, minute: time.minute }, () => {
                channel.send(`<@&${roleId}> 점심 시간입니다! 식사 맛있게 하세요 ^^.:poultry_leg: :smile: `);
            });
        } else {
            schedule.scheduleJob({ hour: time.hour, minute: time.minute }, () => {
                channel.send(`<@&${roleId}> 쉬는 시간입니다! 10분 동안 머리를 식혀봐요^^.:melting_face: `);
            });
    
            schedule.scheduleJob({ hour: time.hour, minute: time.minute + 10 }, () => {
                channel.send(`<@&${roleId}> 쉬는 시간이 끝났어요 ~!:raised_hands: `);
                // channel.send('test' + minute);
            });
        }
    });
}

client.login(token);
