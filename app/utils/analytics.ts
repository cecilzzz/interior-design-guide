// GA4 事件追蹤工具

// 追蹤文章閱讀行為
// 當用戶閱讀文章超過 30 秒時，發送事件到 GA4
// 參數：articleTitle - 文章標題
// 返回：清理函數，用於移除事件監聽器
export const trackArticleRead = (articleTitle: string) => {
    let startTime = Date.now();  // 記錄開始閱讀的時間
    let hasTracked = false;      // 避免重複追蹤的標記
  
    // 當用戶切換頁面或最小化視窗時觸發
    const handleVisibilityChange = () => {
      if (document.hidden && !hasTracked) {
        const timeSpent = (Date.now() - startTime) / 1000;  // 計算閱讀時間（秒）
        if (timeSpent >= 30) {  // 只有閱讀超過 30 秒才算有效
          window.gtag('event', 'article_read', {
            article_title: articleTitle,
            time_spent: Math.round(timeSpent),
          });
          hasTracked = true;  // 標記已追蹤，避免重複發送
        }
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 返回清理函數，在組件卸載時調用
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  };
  
  // 追蹤頁面捲動深度
  // 記錄用戶在頁面上捲動的最大百分比
  // 當用戶離開頁面且捲動超過 75% 時發送事件
  // 返回：清理函數，用於移除事件監聽器
  export const trackScrollDepth = () => {
    let maxScroll = 0;        // 記錄最大捲動百分比
    let hasTracked = false;   // 避免重複追蹤的標記
  
    // 計算當前捲動百分比
    const calculateScrollPercentage = () => {
      const windowHeight = window.innerHeight;  // 視窗高度
      const documentHeight = document.documentElement.scrollHeight - windowHeight;  // 可捲動的總高度
      const scrolled = window.scrollY;  // 已捲動的距離
      return Math.round((scrolled / documentHeight) * 100);  // 轉換為百分比
    };
  
    // 監聽捲動事件，更新最大捲動值
    const handleScroll = () => {
      const currentScroll = calculateScrollPercentage();
      if (currentScroll > maxScroll) {
        maxScroll = currentScroll;
      }
    };
  
    // 當用戶離開頁面時，如果捲動超過 75% 就發送事件
    const handleVisibilityChange = () => {
      if (document.hidden && !hasTracked && maxScroll >= 75) {
        window.gtag('event', 'scroll_depth', {
          depth_percentage: maxScroll,
        });
        hasTracked = true;
      }
    };
  
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    // 返回清理函數，在組件卸載時調用
    return () => {
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  };
  
  // 追蹤頁面停留時間
  // 記錄用戶在頁面上的總停留時間
  // 當用戶離開頁面時發送事件
  // 返回：清理函數，用於移除事件監聽器
  export const trackTimeOnPage = () => {
    const startTime = Date.now();  // 記錄進入頁面的時間
    let hasTracked = false;        // 避免重複追蹤的標記
  
    // 當用戶離開頁面時，發送停留時間
    const handleVisibilityChange = () => {
      if (document.hidden && !hasTracked) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);  // 計算停留時間（秒）
        window.gtag('event', 'time_on_page', {
          time_seconds: timeSpent,
        });
        hasTracked = true;
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    // 返回清理函數，在組件卸載時調用
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }; 