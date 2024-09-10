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
    scheduleSpecificTimesMessages();  // 특정 시간에 메시지 전송
});

// 랜덤 이미지 생성 함수
const getRandomImage = (images) => {
    return images[Math.floor(Math.random() * images.length)];
};

// 랜덤 메시지 생성 함수
const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
};

// 특정 시간에 이미지를 전송하는 함수
const sendImageAtSpecificTime = (channel) => {
    const breakImages = [
        path.join(__dirname, 'asset', 'disk1.jpeg'),
        path.join(__dirname, 'asset', 'disk2.jpeg'),
        path.join(__dirname, 'asset', 'disk3.jpg'),
        path.join(__dirname, 'asset', 'disk4.jpg')
    ];

    const Messages = [
        `<@&${roleId}> 척추요정 등장 ! :star2:`,
        `<@&${roleId}> 띵동:bell: 안녕하세요 ! 자세보러 왔어요 :laughing: `,
        `<@&${roleId}> 척추 요정의 하루 미션: 일어나서 척추를 펴고 기지개를 펴세요! :dart: 성공하면 기분도 최고!`,
        `<@&${roleId}> 오늘도 굽은 척추는 안녕! :man_in_lotus_position: :person_in_lotus_position: 허리를 쫙~ 펴주세요! :laughing: `,
    ];

    channel.send({
        content: getRandomMessage(Messages),
        files: [getRandomImage(breakImages)]
    }).then(() => {
        console.log(`메시지 전송 완료: 정해진 시간`);
    }).catch((error) => {
        console.error('메시지 전송 중 오류 발생:', error);
    });
};

// 오전 10시 30분, 오후 3시 30분에 메시지를 전송하는 스케줄 설정
async function scheduleSpecificTimesMessages() {
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

        // 오전 10시 30분에 메시지 전송 스케줄 설정
        schedule.scheduleJob({ hour: 10, minute: 30 }, () => {
            sendImageAtSpecificTime(channel);
        });

        // 오후 3시 30분에 메시지 전송 스케줄 설정
        schedule.scheduleJob({ hour: 15, minute: 30 }, () => {
            sendImageAtSpecificTime(channel);
        });

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
