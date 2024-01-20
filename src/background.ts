chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    if (tab.url && tab.url.startsWith('https://www.geoguessr.com/results')) {
      chrome.tabs.sendMessage(tabId, 'on_results_page');
    }
  }
});