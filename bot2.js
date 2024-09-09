require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const schedule = require('node-schedule');
const path = require('path');

// 환경변수
const token = process.env.DISCORD_TOKEN_2;
const channelId = process.env.CHANNEL_ID_2;
const roleId = process.env.DISCORD_ROLE_ID_2;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log('척추요정 봇 준비완료');
    scheduleHourlyImageMessages();  // 1시간마다 무작위 시간에 메시지 전송
    sendMessageEvery10Seconds();    // 10초마다 메시지 전송
});

// 랜덤 이미지 생성 함수
const getRandomImage = (images) => {
    return images[Math.floor(Math.random() * images.length)];
};

// 1시간 내에 무작위 시간에 메시지를 전송하는 함수
const sendRandomImageWithinHour = (channel, hour) => {
    const randomDelay = Math.floor(Math.random() * 10000); // 0 ~ 10000 밀리초 (무작위 시간)
    setTimeout(() => {
        const breakImages = [
            path.join(__dirname, 'asset', 'disk1.jpeg'),
            path.join(__dirname, 'asset', 'disk2.jpeg'),
            path.join(__dirname, 'asset', 'disk3.jpg'),
            path.join(__dirname, 'asset', 'disk4.jpg')
        ];

        channel.send({
            content: `척추 Test! (1시간 내 랜덤)`,
            files: [getRandomImage(breakImages)]
        }).then(() => {
            console.log(`메시지 전송 완료: ${hour}시`);
        }).catch((error) => {
            console.error('메시지 전송 중 오류 발생:', error);
        });
    }, randomDelay);
};

// 오전 9시부터 오후 6시까지 1시간마다 무작위로 이미지를 보내는 스케줄 설정
async function scheduleHourlyImageMessages() {
    try {
        const channel = await client.channels.fetch(channelId);

        if (!channel) {
            console.error('채널을 찾을 수 없습니다.');
            return;
        }

        const permissions = channel.permissionsFor(client.user);
        if (!permissions.has('SendMessages')) {
            console.error('봇에게 메시지 전송 권한이 없습니다.');
            return;
        } else if (!permissions.has('AttachFiles')) {
            console.error('봇에게 파일 첨부 권한이 없습니다.');
            return;
        } else {
            console.log('봇이 해당 채널에 대한 충분한 권한을 가지고 있습니다.');
        }

        const startHour = 9; // 오전 9시
        const endHour = 18; // 오후 6시

        for (let hour = startHour; hour < endHour; hour++) {
            schedule.scheduleJob({ hour, minute: 0 }, () => {
                sendRandomImageWithinHour(channel, hour);
            });
        }
    } catch (error) {
        console.error('알림 설정 중 오류 발생:', error);
    }
}

client.login(token);


// // 10초마다 메시지를 전송하는 함수
// const sendMessageEvery10Seconds = async () => {
//     try {
//         const channel = await client.channels.fetch(channelId);
//         if (!channel) {
//             console.error('채널을 찾을 수 없습니다.');
//             return;
//         }

//         setInterval(() => {
//             const breakImages = [
//                 path.join(__dirname, 'asset', 'disk1.jpeg'),
//                 path.join(__dirname, 'asset', 'disk2.jpeg'),
//                 path.join(__dirname, 'asset', 'disk3.jpg'),
//                 path.join(__dirname, 'asset', 'disk4.jpg')
//             ];

//             channel.send({
//                 content: `척추 Test - 10초마다!`,
//                 files: [getRandomImage(breakImages)]
//             }).then(() => {
//                 console.log('10초마다 메시지가 전송되었습니다.');
//             }).catch((error) => {
//                 console.error('메시지 전송 중 오류 발생:', error);
//             });
//         }, 10000); // 10초마다 메시지 전송
//     } catch (error) {
//         console.error('알림 설정 중 오류 발생:', error);
//     }
// };
