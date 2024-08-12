require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const schedule = require('node-schedule');

// 환경변수
const token = process.env.DISCORD_TOKEN;
const channelId = process.env.CHANNEL_ID;
const roleId = process.env.DISCORD_ROLE_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log('준비완료');
    sendBreakReminder();
});

// 알림 시간 설정 
const getEndBreakTime = (hour, minute) => {
    const now = new Date();
    const endBreak = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    endBreak.setMinutes(endBreak.getMinutes() + 15);
    return endBreak;
};

// 랜덤 메시지 생성 함수
const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
};

// 스케줄링 
const scheduleBreakReminder = (channel, hour, minute, message, endBreakMessage) => {
    const now = new Date();
    const endBreakTime = getEndBreakTime(hour, minute);
    
    // 현재 시간이 스케줄 시간 이후인 경우 스케줄 설정을 건너뜁니다.
    if (now < endBreakTime) {
        // 쉬는 시간 시작 알림
        schedule.scheduleJob({ hour, minute }, () => {
            channel.send(message);
        });
        
        if(endBreakMessage){
            // 쉬는 시간 종료 알림
            schedule.scheduleJob(endBreakTime, () => {
                channel.send(endBreakMessage);
            });
        }
    }
};

// 쉬는 시간 알림 
async function sendBreakReminder() {
    try {
        const channel = await client.channels.fetch(channelId);

        if (!channel) {
            console.error('채널을 찾을 수 없습니다.');
            return;
        }

        const times = [
            { hour: 9, minute: 45 },
            { hour: 10, minute: 45 },
            { hour: 11, minute: 45 },
            { hour: 13, minute: 45 },
            { hour: 14, minute: 45 },
            { hour: 15, minute: 45 },
            { hour: 16, minute: 45 },
        ];

        const breakMessages = [
            `<@&${roleId}> 쉬는 시간입니다! 15분 동안 머리를 식혀봐요^^.:melting_face:`,
            `<@&${roleId}> 잠시 쉬어가세요! 잠깐이라도 눈을 감아보세요.:zzz:`,
            `<@&${roleId}> 잠깐의 휴식은 큰 도움이 될 거에요! 스트레칭 한번 해보세요.:muscle:`,
        ];

        const endBreakMessages = [
            `<@&${roleId}> 쉬는 시간이 끝났어요 ~!:raised_hands:`,
            `<@&${roleId}> 다시 일어설 시간입니다! 화이팅!:muscle:`,
            `<@&${roleId}> 이제 다시 집중할 시간이에요!:alarm_clock:`,
        ];

        times.forEach(time => {
            if (time.hour === 11 && time.minute === 45) {
                scheduleBreakReminder(
                    channel,
                    time.hour,
                    time.minute,
                    `<@&${roleId}> 점심 시간입니다! 식사 맛있게 하세요 ^^.:poultry_leg: :smile:`,
                    null
                );
            } else {
                scheduleBreakReminder(
                    channel,
                    time.hour,
                    time.minute,
                    getRandomMessage(breakMessages),
                    getRandomMessage(endBreakMessages)
                );
            }
        });
    } catch (error) {
        console.error('알림 설정 중 오류 발생:', error);
    }
}

client.login(token);
