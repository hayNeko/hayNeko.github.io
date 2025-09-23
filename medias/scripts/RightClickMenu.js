const menu = document.createElement('div');
menu.className = 'custom-context-menu';
menu.innerHTML = `
            <div class="menu-item" data-action="copy">Copy</div>
            <div class="menu-item" data-action="paste">Paste</div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="refresh">Refresh</div>
            <div class="menu-item" data-action="back">Back</div>
        `;
document.body.appendChild(menu);

// 显示菜单函数
function showMenu(x, y) {
    // 确保菜单不会超出屏幕边界
    const menuRect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (x + menuRect.width > windowWidth) {
        x = windowWidth - menuRect.width - 10;
    }

    if (y + menuRect.height > windowHeight) {
        y = windowHeight - menuRect.height - 10;
    }

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('active');
}

// 隐藏菜单函数
function hideMenu() {
    menu.classList.remove('active');
}

// 监听右键点击事件
document.addEventListener('contextmenu', function (e) {
    // 阻止默认右键菜单
    e.preventDefault();

    // 显示自定义菜单
    showMenu(e.pageX, e.pageY);
});

// 点击其他地方隐藏菜单
document.addEventListener('click', function (e) {
    if (e.button !== 2) { // 不是右键点击
        hideMenu();
    }
});

// 菜单项点击事件
menu.addEventListener('click', function (e) {
    if (e.target.classList.contains('menu-item')) {
        const action = e.target.getAttribute('data-action');

        // 根据不同的动作执行不同的操作
        switch (action) {
            case 'copy':
                // 复制选中的文字到剪切板
                const selectedText = window.getSelection().toString();
                if (selectedText) {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(selectedText).then(() => {
                        }).catch(err => {
                            console.error('Clipboard API 复制失败: ', err);
                            fallbackCopyText(selectedText);
                        });
                    } else {
                        fallbackCopyText(selectedText);
                    }
                }

                break;
            case 'paste':
                break;
            case 'refresh':
                window.location.reload();
                break;
            case 'back':
                break;
        }

        hideMenu();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        hideMenu();
    }
});

function copySelectedText() {
    const selectedText = window.getSelection().toString();

    if (!selectedText) {
        showNotification('请先选中要复制的文本', 'warning');
        return;
    }

    // 使用现代Clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(selectedText)
            .then(() => {
            })
            .catch(err => {
                fallbackCopyText(selectedText);
            });
    } else {
        fallbackCopyText(selectedText);
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('文本已成功复制到剪贴板', 'success');
        } else {
            showNotification('复制失败，请手动复制文本', 'error');
        }
    } catch (err) {
        showNotification('复制失败，请手动复制文本', 'error');
    }

    document.body.removeChild(textArea);
}