import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 로그 레벨
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// 로그 디렉토리 경로
const LOG_DIR = path.join(__dirname, '..', '..', 'logs');

// 로그 디렉토리가 없으면 생성
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * 현재 날짜와 시간을 포맷팅하여 반환
 * @returns {string} 포맷팅된 날짜 시간 문자열
 */
const getFormattedDate = () => {
  const now = new Date();
  return now.toISOString();
};

/**
 * 로그 파일 이름 생성 (날짜별)
 * @returns {string} 로그 파일 경로
 */
const getLogFilePath = () => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  return path.join(LOG_DIR, `${dateStr}.log`);
};

/**
 * 로그 메시지를 파일에 기록
 * @param {string} level 로그 레벨
 * @param {string} message 로그 메시지
 * @param {Object} meta 추가 정보 (선택사항)
 */
const writeToLogFile = (level, message, meta = {}) => {
  const timestamp = getFormattedDate();
  const logFilePath = getLogFilePath();
  
  // 로그 형식: [TIMESTAMP] [LEVEL] MESSAGE (META)
  let logEntry = `[${timestamp}] [${level}] ${message}`;
  
  // 메타 데이터가 있으면 추가
  if (Object.keys(meta).length > 0) {
    logEntry += ` ${JSON.stringify(meta)}`;
  }
  
  logEntry += '\n';
  
  // 로그 파일에 추가
  fs.appendFileSync(logFilePath, logEntry);
  
  // 콘솔에도 출력 (개발 환경에서 유용)
  console.log(logEntry);
};

/**
 * 로그 객체
 */
const logger = {
  /**
   * ERROR 레벨 로그
   * @param {string} message 로그 메시지
   * @param {Object} meta 추가 정보 (선택사항)
   */
  error: (message, meta = {}) => {
    writeToLogFile(LOG_LEVELS.ERROR, message, meta);
  },
  
  /**
   * WARN 레벨 로그
   * @param {string} message 로그 메시지
   * @param {Object} meta 추가 정보 (선택사항)
   */
  warn: (message, meta = {}) => {
    writeToLogFile(LOG_LEVELS.WARN, message, meta);
  },
  
  /**
   * INFO 레벨 로그
   * @param {string} message 로그 메시지
   * @param {Object} meta 추가 정보 (선택사항)
   */
  info: (message, meta = {}) => {
    writeToLogFile(LOG_LEVELS.INFO, message, meta);
  },
  
  /**
   * DEBUG 레벨 로그
   * @param {string} message 로그 메시지
   * @param {Object} meta 추가 정보 (선택사항)
   */
  debug: (message, meta = {}) => {
    writeToLogFile(LOG_LEVELS.DEBUG, message, meta);
  }
};

export default logger;
