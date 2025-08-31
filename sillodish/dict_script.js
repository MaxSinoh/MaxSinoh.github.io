let dictionaryData = [];

// 使用Papa Parse读取CSV
Papa.parse('dict.csv', {
    download: true,
    header: true, // 第一行作为标题
    skipEmptyLines: true,
    complete: function(results) {
        dictionaryData = results.data;
        renderDictionary(dictionaryData);
        createAlphaFilter();
    },
    error: function(error) {
        console.error('加载CSV文件失败:', error);
    }
});
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const dictionaryList = document.getElementById('dictionaryList');
    const alphaFilter = document.getElementById('alphaFilter');

    // 初始渲染所有词条
    renderDictionary(dictionaryData);

    // 创建A-Z的筛选按钮
    createAlphaFilter();

    // 添加搜索事件监听（输入即搜）
    searchInput.addEventListener('input', function() {
        filterDictionary();
    });

    // 渲染词典列表的函数
    function renderDictionary(data) {
        dictionaryList.innerHTML = ''; // 清空当前列表

        if (data.length === 0) {
            dictionaryList.innerHTML = '<p>没有找到匹配的词条。</p>';
            return;
        }

        data.forEach(entry => {
            const entryEl = document.createElement('div');
            entryEl.className = 'entry';
            entryEl.innerHTML = `
                <h3>${entry.headword} <span class="pos">${entry.pos}</span></h3>
                <div class="ipa">${entry.ipa}</div>
                <div class="translation">${entry.translation}</div>
                ${entry.etymology ? `<div class="etymology"><small>词源: ${entry.etymology}</small></div>` : ''}
                ${entry.example ? `<div class="example">"${entry.example}"<br><small>${entry.exampleTranslation}</small></div>` : ''}
            `;
            dictionaryList.appendChild(entryEl);
        });
    }

    // 根据搜索框输入筛选
    function filterDictionary() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            renderDictionary(dictionaryData);
            return;
        }

        const filteredData = dictionaryData.filter(entry => 
            entry.headword.toLowerCase().includes(searchTerm) || 
            entry.translation.toLowerCase().includes(searchTerm) ||
            entry.ipa.toLowerCase().includes(searchTerm)
        );

        renderDictionary(filteredData);
    }
});