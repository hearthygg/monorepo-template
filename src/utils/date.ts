import { format, differenceInDays } from 'date-fns';

// 格式化日期
export const formatDate = (date: Date, formatString: string = 'yyyy-MM-dd') => {
  return format(date, formatString);
};

// 计算两个日期之间的天数差
export const daysBetween = (date1: Date, date2: Date) => {
  return differenceInDays(date1, date2);
};
