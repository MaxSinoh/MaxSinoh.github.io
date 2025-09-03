// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const dictionaryList = document.getElementById('dictionaryList');
    const alphaFilter = document.getElementById('alphaFilter');

    let dictionaryData = []; // 用于存储加载的词典数据

    // 使用Papa Parse加载CSV文件
    Papa.parse('dict.csv', {
        download: true,
        header: true, // 第一行作为标题
        skipEmptyLines: true,
        complete: function(results) {
            if (results.data && results.data.length > 0) {
                dictionaryData = results.data;
                renderDictionary(dictionaryData);
                createAlphaFilter();
                console.log('词典数据加载成功，共', dictionaryData.length, '个词条');
            } else {
                dictionaryList.innerHTML = '<p>词典数据为空或格式错误。</p>';
            }
        },
        error: function(error) {
            console.error('加载CSV文件失败:', error);
            dictionaryList.innerHTML = '<p>加载词典数据失败，请检查dictionary.csv文件。</p>';
        }
    });

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
            
            // 构建词条HTML内容
            let entryHTML = `
                <h3>${escapeHtml(entry.headword)} <span class="pos">${escapeHtml(entry.pos)}</span></h3>
                <div class="ipa">${escapeHtml(entry.ipa)}</div>
                <div class="translation">${escapeHtml(entry.translation)}</div>
            `;
            
            // 如果有词源，添加词源部分
            if (entry.etymology && entry.etymology.trim() !== '') {
                entryHTML += `<div class="etymology"><small>词源: ${escapeHtml(entry.etymology)}</small></div>`;
            }
            
            // 如果有例句，添加例句部分
            if (entry.example && entry.example.trim() !== '') {
                let exampleHTML = `<div class="example">"${escapeHtml(entry.example)}"`;
                if (entry.exampleTranslation && entry.exampleTranslation.trim() !== '') {
                    exampleHTML += `<br><small>${escapeHtml(entry.exampleTranslation)}</small>`;
                }
                exampleHTML += '</div>';
                entryHTML += exampleHTML;
            }
            
            entryEl.innerHTML = entryHTML;
            dictionaryList.appendChild(entryEl);
        });
    }

    // 创建A-Z筛选按钮
    function createAlphaFilter() {
        // 清空现有的按钮
        alphaFilter.innerHTML = '';
        
        // 生成A-Z的字母按钮
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const button = document.createElement('button');
            button.textContent = letter;
            button.addEventListener('click', function() {
                filterByLetter(letter);
            });
            alphaFilter.appendChild(button);
        }
        
        // 添加"全部"按钮
        const allButton = document.createElement('button');
        allButton.textContent = '全部';
        allButton.addEventListener('click', function() {
            renderDictionary(dictionaryData);
            searchInput.value = ''; // 清空搜索框
        });
        alphaFilter.appendChild(allButton);
    }

    // 根据首字母筛选
    function filterByLetter(letter) {
        const filteredData = dictionaryData.filter(entry => 
            entry.headword && entry.headword.toUpperCase().startsWith(letter)
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
            (entry.headword && entry.headword.toLowerCase().includes(searchTerm)) || 
            (entry.translation && entry.translation.toLowerCase().includes(searchTerm)) ||
            (entry.ipa && entry.ipa.toLowerCase().includes(searchTerm)) ||
            (entry.etymology && entry.etymology.toLowerCase().includes(searchTerm)) ||
            (entry.example && entry.example.toLowerCase().includes(searchTerm))
        );

        renderDictionary(filteredData);
    }

    // 简单的HTML转义函数，防止XSS
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});