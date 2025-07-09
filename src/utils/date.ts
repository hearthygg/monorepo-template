import { format, differenceInDays, parseISO, isDate, isToday, isYesterday, differenceInMinutes } from 'date-fns';

// 计算两个日期之间的天数差
export const daysBetween = (date1: Date, date2: Date) => {
  return differenceInDays(date1, date2);
};

/**
 * 万能时间解析
 * @param input 支持Date对象、时间戳（秒/毫秒）、ISO字符串、本地字符串
 * @returns Date对象或null
 */
export function parseDate(input: string | number | Date | null | undefined): Date | null {
  if (!input) return null;
  if (isDate(input)) return input as Date;

  if (typeof input === 'number') {
    // 判断是秒还是毫秒
    return input > 1e12 ? new Date(input) : new Date(input * 1000);
  }

  if (typeof input === 'string') {
    // ISO格式
    if (/T\d{2}:\d{2}:\d{2}/.test(input)) {
      return parseISO(input);
    }
    // 2024-07-03 20:34:56 这种格式
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(input)) {
      return new Date(input.replace(/-/g, '/'));
    }
    // 2024-07-03
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return new Date(input.replace(/-/g, '/'));
    }
    // 其他字符串直接尝试new Date
    const d = new Date(input);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

/**
 * 聊天消息友好时间显示
 * @param input 时间
 * @returns 格式化字符串
 */
export function formatChatTime(input: string | number | Date): string {
  const date = parseDate(input);
  if (!date) return '';
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return `昨天 ${format(date, 'HH:mm')}`;
  }
  return format(date, 'yyyy-MM-dd HH:mm');
}

/**
 * 判断两条消息是否需要显示时间
 * @param prevTime 上一条消息时间
 * @param currTime 当前消息时间
 * @param threshold 分隔阈值（分钟），默认5分钟
 */
export function shouldShowTime(prevTime: string | number | Date | null, currTime: string | number | Date, threshold = 5): boolean {
  if (!prevTime) return true; // 第一条消息一定显示
  const prev = parseDate(prevTime);
  const curr = parseDate(currTime);
  if (!prev || !curr) return true;
  return differenceInMinutes(curr, prev) >= threshold;
}

/**
 * 格式化时间
 * @param input 支持Date对象、时间戳、字符串
 * @param fmt 格式字符串，默认 'yyyy-MM-dd HH:mm:ss'
 * @returns 格式化后的字符串
 */
export function formatDate(input: string | number | Date | null | undefined, fmt = 'yyyy-MM-dd HH:mm:ss'): string {
  const date = parseDate(input);
  if (!date) return '';
  return format(date, fmt);
}

/**
 * 获取时间戳（毫秒）
 */
export function toTimestamp(input: string | number | Date | null | undefined): number | null {
  const date = parseDate(input);
  return date ? date.getTime() : null;
}

/**
 * 获取时间戳（秒）
 */
export function toTimestampSec(input: string | number | Date | null | undefined): number | null {
  const date = parseDate(input);
  return date ? Math.floor(date.getTime() / 1000) : null;
}
