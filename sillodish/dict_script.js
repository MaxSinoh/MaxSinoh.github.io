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

    // 创建A-Z筛选按钮
    function createAlphaFilter() {
        // 生成A-Z的字母
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = document.createElement('button');
            button.textContent = letter;
            button.addEventListener('click', function() {
                filterByLetter(letter);
            });
            alphaFilter.appendChild(button);
        }
        // 再加一个“全部”的按钮
        const allButton = document.createElement('button');
        allButton.textContent = '全部';
        allButton.addEventListener('click', function() {
            renderDictionary(dictionaryData);
        });
        alphaFilter.appendChild(allButton);
    }

    // 根据首字母筛选
    function filterByLetter(letter) {
        const filteredData = dictionaryData.filter(entry => 
            entry.headword.toUpperCase().startsWith(letter)
        );
        renderDictionary(filteredData);
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