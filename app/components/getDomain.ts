"use client"

export function getRootDomain() {
    const hostname = window.location.hostname;
    
    // 检测IP地址（IPv4/IPv6）
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$|^\[?([a-f0-9:]+)\]?$/i;
    if (ipPattern.test(hostname)) {
        // 如果是IP地址直接返回
        return hostname.replace(/[\[\]]/g, ''); // 移除IPv6的方括号
    }

    // 公共后缀列表（根据需求扩展）
    const publicSuffixes = [
        'com', 'org', 'net', 'gov', 'edu', 'co', 
        'uk', 'jp', 'cn', 'io', 'ai', 'app', 'dev',
        'co.uk', 'com.au', 'com.cn', 'org.uk', 'gov.uk'
    ];
    
    const parts = hostname.split('.').reverse();
    
    // 尝试匹配多级后缀（最多三级）
    for (let i = 1; i <= 3 && i <= parts.length; i++) {
        const testSuffix = parts.slice(0, i).reverse().join('.');
        
        if (publicSuffixes.includes(testSuffix)) {
            // 确保还有上级域名
            if (parts[i]) {
                return parts.slice(0, i + 1).reverse().join('.');
            }
            break;
        }
    }
    
    // 默认返回最后两部分（如example.com）
    return parts.slice(0, 2).reverse().join('.');
}