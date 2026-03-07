// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved preference (default: dark)
const savedTheme = localStorage.getItem('lotto-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('lotto-theme', next);
});

// ===== LOTTO LOGIC =====
const container = document.getElementById('lottoContainer');
const btn = document.getElementById('generateBtn');

/**
 * 번호 대역에 따른 색상 클래스 반환
 * 1~10: Yellow, 11~20: Blue, 21~30: Red, 31~40: Gray, 41~45: Green
 */
function getLottoColorClass(num) {
    if (num <= 10) return 'color-1';
    if (num <= 20) return 'color-2';
    if (num <= 30) return 'color-3';
    if (num <= 40) return 'color-4';
    return 'color-5';
}

/**
 * 1~45 사이에서 중복 없는 6개 번호를 오름차순으로 반환
 */
function getLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

// ===== COPY & TOAST =====
let toastTimer = null;

/**
 * 화면 하단에 토스트 메시지를 잠깐 표시
 */
function showToast(message) {
    let toast = document.getElementById('copyToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copyToast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

/**
 * 특정 게임의 번호를 클립보드에 복사
 */
function copyNumbers(numbers, btn) {
    const text = numbers.join(', ');
    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓';
        btn.classList.add('copied');
        showToast(`📋 ${text} 복사됐습니다!`);
        setTimeout(() => {
            btn.textContent = '📋';
            btn.classList.remove('copied');
        }, 2000);
    });
}

/**
 * 5게임의 번호를 순차적으로 애니메이션과 함께 렌더링
 */
async function generateLotto() {
    container.innerHTML = '';
    btn.disabled = true;
    btn.textContent = '행운 추출 중...';

    for (let i = 0; i < 5; i++) {
        // Game row 생성
        const row = document.createElement('div');
        row.className = 'game-row';
        row.style.animationDelay = `${i * 0.1}s`;

        // 게임 레이블 (A~E)
        const label = document.createElement('div');
        label.className = 'game-label';
        label.textContent = `GAME ${String.fromCharCode(65 + i)}`;
        row.appendChild(label);

        const numbers = getLottoNumbers();
        container.appendChild(row);

        // 번호 공을 하나씩 애니메이션으로 추가
        for (let j = 0; j < 6; j++) {
            await new Promise(r => setTimeout(r, 60));
            const ball = document.createElement('div');
            ball.className = `ball ${getLottoColorClass(numbers[j])}`;
            ball.textContent = numbers[j];
            row.appendChild(ball);
            // 다음 프레임에 show 클래스를 추가해 애니메이션 트리거
            setTimeout(() => ball.classList.add('show'), 10);
        }

        // 모든 공이 나온 후 복사 버튼 추가
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '📋';
        copyBtn.title = '번호 복사';
        copyBtn.addEventListener('click', () => copyNumbers(numbers, copyBtn));
        row.appendChild(copyBtn);

        await new Promise(r => setTimeout(r, 100));
    }

    btn.disabled = false;
    btn.textContent = '다른 번호 생성';
}

btn.addEventListener('click', generateLotto);

