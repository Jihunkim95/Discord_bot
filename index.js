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
    endBreak.setMinutes(endBreak.getMinutes() + 10);
    return endBreak;
};

// 랜덤 메시지 생성 함수
const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
};

// 스케줄링 
const scheduleBreakReminder = (channel, hour, minute, message) => {
    schedule.scheduleJob({ hour, minute }, () => {
        channel.send(message);
    });
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
            { hour: 9, minute: 50 },
            { hour: 10, minute: 50 },
            { hour: 11, minute: 50 },
            { hour: 13, minute: 50 },
            { hour: 14, minute: 50 },
            { hour: 15, minute: 50 },
            { hour: 16, minute: 50 },
        ];

        const breakMessages = [
            `<@&${roleId}> 쉬는 시간입니다! 10분 동안 머리를 식혀봐요^^.:melting_face:`,
            `<@&${roleId}> 잠시 쉬어가세요! 잠깐이라도 눈을 감아보세요.:zzz:`,
            `<@&${roleId}> 잠깐의 휴식은 큰 도움이 될 거에요! 스트레칭 한번 해보세요.:muscle:`,
        ];

        const endBreakMessages = [
            `<@&${roleId}> 쉬는 시간이 끝났어요 ~!:raised_hands:`,
            `<@&${roleId}> 다시 일어설 시간입니다! 화이팅!:muscle:`,
            `<@&${roleId}> 이제 다시 집중할 시간이에요!:alarm_clock:`,
        ];

        times.forEach(time => {
            if (time.hour === 11 && time.minute === 50) {
                scheduleBreakReminder(
                    channel,
                    time.hour,
                    time.minute,
                    `<@&${roleId}> 점심 시간입니다! 식사 맛있게 하세요 ^^.:poultry_leg: :smile:`
                );
            } else {
                scheduleBreakReminder(
                    channel,
                    time.hour,
                    time.minute,
                    getRandomMessage(breakMessages) // 랜덤으로 쉬는 시간 메시지 선택
                );

                const endBreakTime = getEndBreakTime(time.hour, time.minute);
                schedule.scheduleJob(endBreakTime, () => {
                    channel.send(getRandomMessage(endBreakMessages)); // 랜덤으로 쉬는 시간 종료 메시지 선택
                });
            }
        });
    } catch (error) {
        console.error('알림 설정 중 오류 발생:', error);
    }
}

client.login(token);
