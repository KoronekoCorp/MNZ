export function convertTimestamp(timestamp: number) {
    const currentTime = Date.now();
    const timeDifference = currentTime - timestamp;

    // 转换为分钟前
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    if (minutesAgo < 60) {
        return minutesAgo === 1 ? '1 分钟前' : minutesAgo + ' 分钟前';
    }

    // 转换为小时前
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hoursAgo < 24) {
        return hoursAgo === 1 ? '1 小时前' : hoursAgo + ' 小时前';
    }

    // 转换为天前
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (daysAgo < 30) {
        return daysAgo === 1 ? '1 天前' : daysAgo + ' 天前';
    }

    // 转换为月前
    const monthsAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
    if (monthsAgo < 12) {
        return monthsAgo === 1 ? '1 个月前' : monthsAgo + ' 个月前';
    }

    // 转换为年前
    const yearsAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30 * 12));
    return yearsAgo === 1 ? '1 年前' : yearsAgo + ' 年前';
}