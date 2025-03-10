// GA4 事件追蹤工具

// 檢查 GA4 是否正確載入
const isGtagLoaded = () => {
    if (typeof window === 'undefined') return false;
    return typeof window.gtag === 'function';
};

// 安全地發送事件
const sendEvent = (eventName: string, params: any) => {
    if (!isGtagLoaded()) {
        console.warn('GA4 尚未載入，無法發送事件:', eventName, params);
        return;
    }
    
    try {
        window.gtag('event', eventName, params);
        console.log('GA4 事件已發送:', eventName, params);
    } catch (error) {
        console.error('GA4 事件發送失敗:', error);
    }
};

// 追蹤文章閱讀行為
// 當用戶閱讀文章超過 30 秒時，發送事件到 GA4
// 參數：articleTitle - 文章標題
// 返回：清理函數，用於移除事件監聽器
export const trackArticleRead = (articleTitle: string) => {
    console.log('開始追蹤文章閱讀:', articleTitle);
    let startTime = Date.now();
    let hasTracked = false;
    let timeoutId: NodeJS.Timeout;

    const trackReadingTime = () => {
        if (!hasTracked) {
            const timeSpent = (Date.now() - startTime) / 1000;
            if (timeSpent >= 30) {
                sendEvent('article_read', {
                    article_title: articleTitle,
                    time_spent: Math.round(timeSpent),
                });
                hasTracked = true;
            }
        }
    };

    // 每 5 秒檢查一次閱讀時間
    timeoutId = setInterval(trackReadingTime, 5000);
    console.log('已設置閱讀時間追蹤器');

    // 當用戶離開頁面時也要檢查
    const handleVisibilityChange = () => {
        if (document.hidden) {
            console.log('用戶切換頁面，檢查閱讀時間');
            trackReadingTime();
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
        clearInterval(timeoutId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        trackReadingTime(); // 最後再檢查一次
        console.log('清理文章閱讀追蹤器');
    };
};

// 追蹤頁面捲動深度
// 記錄用戶在頁面上捲動的最大百分比
// 當用戶離開頁面且捲動超過 75% 時發送事件
// 返回：清理函數，用於移除事件監聽器
export const trackScrollDepth = () => {
    console.log('開始追蹤捲動深度');
    let maxScroll = 0;
    let lastTrackedDepth = 0;
    const SCROLL_BREAKPOINTS = [25, 50, 75, 100];

    const calculateScrollPercentage = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        return Math.round((window.scrollY / documentHeight) * 100);
    };

    const handleScroll = () => {
        const currentScroll = calculateScrollPercentage();
        if (currentScroll > maxScroll) {
            maxScroll = currentScroll;
            console.log('當前捲動深度:', maxScroll + '%');
            
            // 檢查是否達到新的捲動里程碑
            SCROLL_BREAKPOINTS.forEach(breakpoint => {
                if (maxScroll >= breakpoint && lastTrackedDepth < breakpoint) {
                    sendEvent('scroll_depth', {
                        depth_percentage: breakpoint,
                    });
                    lastTrackedDepth = breakpoint;
                }
            });
        }
    };

    document.addEventListener('scroll', handleScroll);
    console.log('已設置捲動追蹤器');

    return () => {
        document.removeEventListener('scroll', handleScroll);
        // 最後發送一次最大捲動深度
        if (maxScroll > lastTrackedDepth) {
            sendEvent('scroll_depth', {
                depth_percentage: maxScroll,
            });
        }
        console.log('清理捲動追蹤器');
    };
};

// 追蹤頁面停留時間
// 記錄用戶在頁面上的總停留時間
// 當用戶離開頁面時發送事件
// 返回：清理函數，用於移除事件監聽器
export const trackTimeOnPage = () => {
    console.log('開始追蹤頁面停留時間');
    const startTime = Date.now();
    let lastTrackedTime = 0;
    let timeoutId: NodeJS.Timeout;

    const trackTime = () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        if (timeSpent - lastTrackedTime >= 60) { // 每分鐘發送一次
            sendEvent('time_on_page', {
                time_seconds: timeSpent,
            });
            lastTrackedTime = timeSpent;
        }
    };

    // 每 30 秒檢查一次
    timeoutId = setInterval(trackTime, 30000);
    console.log('已設置時間追蹤器');

    return () => {
        clearInterval(timeoutId);
        // 最後發送一次總時間
        const finalTime = Math.round((Date.now() - startTime) / 1000);
        if (finalTime > lastTrackedTime) {
            sendEvent('time_on_page', {
                time_seconds: finalTime,
            });
        }
        console.log('清理時間追蹤器');
    };
}; 