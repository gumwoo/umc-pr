// 이 파일은 더 이상 사용되지 않습니다.
// 시스템이 Prisma ORM으로 마이그레이션되었습니다.
// mysql2 패키지를 제거하려면 다음 명령어를 실행하세요:
// npm uninstall mysql2

// 이전 구성:
// =========================================
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
// 
// dotenv.config();
// 
// export const pool = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   port: process.env.DB_PORT || 3306,
//   database: process.env.DB_NAME || "umc_7th",
//   password: process.env.DB_PASSWORD || "password",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
// =========================================

// 대신 src/prisma.js 파일을 사용하세요.