let options = [];
let isPicking = false;
let history = [];

const MAX_OPTIONS = 10;
const STORAGE_KEY_OPTIONS = 'lunchPickerOptions';
const STORAGE_KEY_HISTORY = 'lunchPickerHistory';

document.addEventListener('DOMContentLoaded', function() {
    loadOptions();
    renderOptions();
    loadHistory();
});

function toggleConfig() {
    const configSection = document.getElementById('configSection');
    const isHidden = configSection.style.display === 'none';
    configSection.style.display = isHidden ? 'block' : 'none';
}

function addOption(value = '') {
    if (options.length >= MAX_OPTIONS) {
        alert(`最多只能添加${MAX_OPTIONS}个选项哦！`);
        return;
    }
    
    options.push(value || `选项 ${options.length + 1}`);
    renderOptions();
    updateOptionCount();
}

function removeOption(index) {
    options.splice(index, 1);
    renderOptions();
    updateOptionCount();
}

function updateOption(index, value) {
    options[index] = value;
}

function renderOptions() {
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    
    options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
            <input type="text" 
                   value="${option}" 
                   onchange="updateOption(${index}, this.value)"
                   placeholder="输入选项名称"
                   maxlength="20">
            <button onclick="removeOption(${index})">×</button>
        `;
        container.appendChild(div);
    });
    
    updateOptionCount();
}

function updateOptionCount() {
    document.getElementById('optionCount').textContent = options.length;
}

function startPicking() {
    if (isPicking) return;
    
    const validOptions = options.filter(opt => opt.trim() !== '');
    
    if (validOptions.length === 0) {
        alert('请先添加至少一个选项！');
        toggleConfig();
        return;
    }
    
    isPicking = true;
    const button = document.getElementById('pickButton');
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    
    button.disabled = true;
    button.textContent = '🎲 选择中...';
    resultBox.classList.add('active');
    
    let count = 0;
    const maxCount = 15 + Math.floor(Math.random() * 10);
    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * validOptions.length);
        resultText.textContent = validOptions[randomIndex];
        resultBox.classList.add('rolling-animation');
        
        setTimeout(() => {
            resultBox.classList.remove('rolling-animation');
        }, 100);
        
        count++;
        
        if (count >= maxCount) {
            clearInterval(interval);
            
            setTimeout(() => {
                const finalIndex = Math.floor(Math.random() * validOptions.length);
                const finalResult = validOptions[finalIndex];
                
                resultText.textContent = finalResult;
                resultBox.classList.remove('active');
                
                addToHistory(finalResult);
                
                button.disabled = false;
                button.textContent = '🎲 再选一次！';
                isPicking = false;
            }, 200);
        }
    }, 80);
}

function saveOptions() {
    localStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(options));
    alert('✅ 配置已保存！');
}

function loadOptions() {
    const saved = localStorage.getItem(STORAGE_KEY_OPTIONS);
    if (saved) {
        options = JSON.parse(saved);
    } else {
        options = ['米线', '湘喜天下', '湘了个西', '鸡公煲', '猪脚饭', '武汉非遗', '飞哥'];
    }
}

function loadPreset(type) {
    const presets = {
        chinese: ['红烧肉饭', '宫保鸡丁', '麻婆豆腐', '糖醋里脊', '回锅肉', '鱼香肉丝', '水煮肉片', '东坡肉'],
        fast: ['麦当劳', '肯德基', '必胜客', '汉堡王', '赛百味', '沙县小吃', '黄焖鸡米饭', '兰州拉面'],
        healthy: ['沙拉轻食', '糙米饭+蔬菜', '蒸蛋羹+清炒时蔬', '杂粮粥', '全麦三明治', '水果酸奶碗', '蔬菜汤', '清蒸鱼']
    };
    
    if (presets[type]) {
        options = [...presets[type]];
        renderOptions();
        alert(`已加载预设！共 ${options.length} 个选项`);
    }
}

function addToHistory(item) {
    const today = new Date().toLocaleDateString('zh-CN');
    history.push({
        item: item,
        time: new Date().toLocaleTimeString('zh-CN'),
        date: today
    });
    
    if (history.length > 50) {
        history = history.slice(-50);
    }
    
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    updateHistoryDisplay();
}

function loadHistory() {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
        history = JSON.parse(saved);
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    document.getElementById('historyCount').textContent = history.length;
}

function clearHistory() {
    if (confirm('确定要清空所有历史记录吗？')) {
        history = [];
        localStorage.removeItem(STORAGE_KEY_HISTORY);
        updateHistoryDisplay();
        alert('历史记录已清空！');
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        console.log('应用已加载完成');
    });
}
