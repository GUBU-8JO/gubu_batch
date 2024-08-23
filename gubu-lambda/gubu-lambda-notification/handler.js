import mysql from 'mysql2/promise';

export const handler = async (event) => {
  console.log('알림 시작!');

  // 데이터베이스 연결 설정
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // 다음 결제일이 내일인 결제 이력 가져오기
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [subscriptionHistories] = await connection.execute(
    `SELECT subscription_history.*, user_subscription.user_id AS user_id, user.nickname AS user_nickname, platform.title AS platform_title, user_subscription.period AS period
   FROM subscription_history
   JOIN user_subscription ON subscription_history.user_subscription_id = user_subscription.id
   JOIN user ON user_subscription.user_id = user.id
   JOIN platform ON user_subscription.platform_id = platform.id
   WHERE DATE(subscription_history.next_pay_at) = ? AND subscription_history.stop_request_at IS NULL`,
    [tomorrow],
  );

  console.log('내일인 결제이력', subscriptionHistories);

  if (subscriptionHistories.length > 0) {
    const notifications = subscriptionHistories.map(
      ({ user_nickname, platform_title, user_id, user_subscription_id }) => ({
        user_id,
        user_subscription_id,
        title: `${user_nickname}님 ${platform_title} 결제일 1일 전입니다.`,
        is_read: false,
        created_at: new Date(),
        readed_at: null,
      }),
    );

    await connection.query(
      `INSERT INTO notification (user_id, user_subscription_id, title, is_read, created_at, readed_at)
       VALUES ?`,
      [notifications.map((notification) => Object.values(notification))],
    );
    console.log('알림 발생', notifications);
  } else {
    console.log('알림을 생성할 결제 이력이 없습니다.');
  }

  await connection.end();
};
