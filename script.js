// --- GIAI ĐOẠN 1: VẼ GIAO DIỆN ---

// 1. ĐỊNH NGHĨA "ĐỀ BÀI" (ĐÃ CẬP NHẬT HINT)
const puzzleData = [
    { 
        row: 1, 
        answer: "DONVIHANHCHINH", 
        clue: "Gợi ý chính cho hàng 1...", 
        hint1: "Gợi ý phụ 1 (4 điểm)", 
        hint2: "Gợi ý phụ 2 (6 điểm)",
        startCol: 4,
        keywordIndex: 3 // Chữ 'V'
    },
    { 
        row: 2, 
        answer: "HANOI", 
        clue: "Gợi ý chính cho hàng 2...", 
        hint1: "Gợi ý phụ 1 (4 điểm)", 
        hint2: "Gợi ý phụ 2 (6 điểm)",
        startCol: 3, 
        keywordIndex: 4 // Chữ 'I'
    },
    { 
        row: 3, 
        answer: "HUE", 
        clue: "Gợi ý chính cho hàng 3...", 
        hint1: "Gợi ý phụ 1 (4 điểm)", 
        hint2: "Gợi ý phụ 2 (6 điểm)",
        startCol: 5, 
        keywordIndex: 2 // Chữ 'E'
    },
    { 
        row: 4, 
        answer: "CANTHO", 
        clue: "Gợi ý chính cho hàng 4...", 
        hint1: "Gợi ý phụ 1 (4 điểm)", 
        hint2: "Gợi ý phụ 2 (6 điểm)",
        startCol: 4, 
        keywordIndex: 3 // Chữ 'T'
    },
    { 
        row: 5, 
        answer: "HAIPHONG", 
        clue: "Gợi ý chính cho hàng 5...", 
        hint1: "Gợi ý phụ 1 (4 điểm)", 
        hint2: "Gợi ý phụ 2 (6 điểm)",
        startCol: 2, 
        keywordIndex: 5 // Chữ 'O'
    },
    { 
        row: 6, 
        answer: "DANANG", 
        clue: "Gợi ý chính cho hàng 6...", 
        hint1: "Gợi ý phụ 1 (4 điểm)", 
        hint2: "Gợi ý phụ 2 (6 điểm)",
        startCol: 7, 
        keywordIndex: 0 // Chữ 'A'
    },
    { 
        row: 7, 
        answer: "HOCHIMINH", 
        clue: "Gợi ý chính cho hàng 7...", 
        hint1: "Gợi ý phụ 1 (4 điểm)", 
        hint2: "Gợi ý phụ 2 (6 điểm)",
        startCol: 3, 
        keywordIndex: 4 // Chữ 'M'
    }
];

// Các hằng số cài đặt
const GRID_COLS = 17;
const KEYWORD_COL = 7; 

// Khai báo biến "thùng"
let gridContainer, clueContainer, jumbledLettersDisplay, 
    guessInput, guessBtn, guessMessage;


// === GIAI ĐOẠN 2: LẬP TRÌNH LOGIC (THEO THỂ LỆ MỚI) ===

// --- 1. CÀI ĐẶT & BIẾN TRẠNG THÁI ---
const PLAYER_START_SCORE = 10;
const POINTS_PER_ROW = 10;
const HINT_1_COST = 4;
const HINT_2_COST = 6;
const GUESS_PENALTY = 10;
const KEY_WORD_ANSWER = "VIETNAM"; // <-- !!! THAY ĐÁP ÁN ĐÚNG VÀO ĐÂY
const ROWS_TO_GUESS = 6; // 75% của 7 hàng là 5.25, làm tròn lên 6

const STORAGE_KEY = 'crosswordProgress';

let playerScore = PLAYER_START_SCORE;
let gameProgress = {}; 
let foundKeywordLetters = []; // Mảng chứa các chữ cái lộn xộn

// --- 2. LOGIC LƯU/TẢI (localStorage) ---

function saveProgress() {
    const dataToSave = {
        score: playerScore,
        progress: gameProgress,
        letters: foundKeywordLetters,
        uessInputValue: guessInput ? guessInput.value : '', // Lưu giá trị ô đoán
        guessInputDisabled: guessInput ? guessInput.disabled : false, // Lưu trạng thái khóa ô đoán
        guessBtnDisabled: guessBtn ? guessBtn.disabled : false, // Lưu trạng thái khóa nút đoán
        guessMessageText: guessMessage ? guessMessage.textContent : '' // Lưu thông báo
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

function loadProgress() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        const data = JSON.parse(savedData);
        playerScore = data.score || PLAYER_START_SCORE;
        gameProgress = data.progress || {};
        foundKeywordLetters = data.letters || [];
        
        updateUIFromProgress();
        // Khôi phục trạng thái phần đoán KEY WORD
        if (guessInput) {
            guessInput.value = data.guessInputValue || '';
            guessInput.disabled = data.guessInputDisabled || false;
        }
        if (guessBtn) {
            guessBtn.disabled = data.guessBtnDisabled || false;
        }
        if (guessMessage) {
            guessMessage.textContent = data.guessMessageText || '';
        }
    }
    document.getElementById('score-display').textContent = playerScore;
}

function updateUIFromProgress() {
    // Cập nhật hiển thị chữ cái lộn xộn
    updateJumbledLettersDisplay(); 

    puzzleData.forEach(rowData => {
        const rowNum = rowData.row;
        const progress = gameProgress[rowNum];

        const hint1Btn = document.querySelector(`.hint-btn[data-row="${rowNum}"][data-hint="1"]`);
        const hint2Btn = document.querySelector(`.hint-btn[data-row="${rowNum}"][data-hint="2"]`);
        const checkBtn = document.querySelector(`.check-btn[data-row="${rowNum}"]`);
        const clearBtn = document.querySelector(`.clear-btn[data-row="${rowNum}"]`);

        if (progress) {
            // 1. Nếu đã giải
            if (progress.solved) {
                const answerChars = rowData.answer.split('');
                for (let i = 0; i < answerChars.length; i++) {
                    const input = document.getElementById(`input-${rowNum}-${i}`);
                    if (input) {
                        input.value = answerChars[i];
                        input.disabled = true;
                        input.classList.add('correct');
                    }
                }
                
                // Khóa các nút
                if (checkBtn) checkBtn.disabled = true;
                if (hint1Btn) hint1Btn.disabled = true;
                if (hint2Btn) hint2Btn.disabled = true;
                if (clearBtn) clearBtn.disabled = true;

                // Hiển thị thời gian
                const timeEl = document.getElementById(`time-${rowNum}`);
                if (timeEl && progress.time) {
                    timeEl.textContent = progress.time;
                }
            }

            // 2. Cập nhật trạng thái nút Hint (ngay cả khi chưa giải)
            if (progress.hint1Purchased) {
                const hintText1 = document.getElementById(`hint-1-${rowNum}`);
                if (hintText1) hintText1.style.display = 'block';
                if (hint1Btn) hint1Btn.disabled = true;
                // Kích hoạt nút Hint 2 (nếu chưa giải)
                if (hint2Btn && !progress.solved) {
                    hint2Btn.disabled = false;
                }
            }
            if (progress.hint2Purchased) {
                const hintText2 = document.getElementById(`hint-2-${rowNum}`);
                if (hintText2) hintText2.style.display = 'block';
                if (hint2Btn) hint2Btn.disabled = true;
            }
        }
    });
}

// --- 3. LOGIC XỬ LÝ NÚT BẤM ---

// Cập nhật hiển thị các chữ cái lộn xộn
function updateJumbledLettersDisplay() {
    if (!jumbledLettersDisplay) return;
    jumbledLettersDisplay.innerHTML = '';
    const shuffledLetters = [...foundKeywordLetters].sort(() => Math.random() - 0.5);
    
    shuffledLetters.forEach(char => {
        const letterEl = document.createElement('span');
        letterEl.className = 'letter';
        letterEl.textContent = char.toUpperCase();
        jumbledLettersDisplay.appendChild(letterEl);
    });
}

// Thêm chữ cái vào mảng lộn xộn
function addJumbledLetter(rowNum, rowData) {
    const keywordChar = rowData.answer[rowData.keywordIndex].toUpperCase();
    
    if (!foundKeywordLetters.includes(keywordChar)) {
        foundKeywordLetters.push(keywordChar);
    }
    
    updateJumbledLettersDisplay();
}

// Xử lý nút Check
function handleCheckClick(event) {
    const rowNum = event.target.dataset.row;
    const rowData = puzzleData.find(r => r.row == rowNum);
    if (!rowData) return;

    let userInput = "";
    const inputElements = [];
    for (let i = 0; i < rowData.answer.length; i++) {
        const input = document.getElementById(`input-${rowNum}-${i}`);
        userInput += input.value;
        inputElements.push(input);
    }
    
    if (userInput.toUpperCase() === rowData.answer.toUpperCase()) {
        // --- ĐÚNG ---
        playerScore += POINTS_PER_ROW;
        document.getElementById('score-display').textContent = playerScore;

        const now = new Date();
        const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        document.getElementById(`time-${rowNum}`).textContent = timeString;

        inputElements.forEach(input => {
            input.disabled = true;
            input.classList.add('correct');
        });
        event.target.disabled = true;
        document.querySelector(`.hint-btn[data-row="${rowNum}"][data-hint="1"]`).disabled = true;
        document.querySelector(`.hint-btn[data-row="${rowNum}"][data-hint="2"]`).disabled = true;
        document.querySelector(`.clear-btn[data-row="${rowNum}"]`).disabled = true;

        if (!gameProgress[rowNum]) gameProgress[rowNum] = {};
        gameProgress[rowNum].solved = true;
        gameProgress[rowNum].time = timeString;
        
        addJumbledLetter(rowNum, rowData);
        saveProgress();
        
    } else {
        // --- SAI ---
        alert("Đáp án chưa chính xác. Vui lòng thử lại!");
    }
}

// Xử lý nút Hint 1
function handleHint1Click(event) {
    const rowNum = event.target.dataset.row;
    if (playerScore < HINT_1_COST) {
        alert("Không đủ điểm để mua hint 1!");
        return;
    }
    if (!confirm(`Dùng ${HINT_1_COST} điểm để xem Gợi ý 1?`)) return;

    playerScore -= HINT_1_COST;
    document.getElementById('score-display').textContent = playerScore;

    document.getElementById(`hint-1-${rowNum}`).style.display = 'block';
    event.target.disabled = true;
    
    document.querySelector(`.hint-btn[data-row="${rowNum}"][data-hint="2"]`).disabled = false;

    if (!gameProgress[rowNum]) gameProgress[rowNum] = {};
    gameProgress[rowNum].hint1Purchased = true;
    saveProgress();
}

// Xử lý nút Hint 2
function handleHint2Click(event) {
    const rowNum = event.target.dataset.row;
    if (playerScore < HINT_2_COST) {
        alert("Không đủ điểm để mua hint 2!");
        return;
    }
    if (!confirm(`Dùng ${HINT_2_COST} điểm để xem Gợi ý 2?`)) return;

    playerScore -= HINT_2_COST;
    document.getElementById('score-display').textContent = playerScore;

    document.getElementById(`hint-2-${rowNum}`).style.display = 'block';
    event.target.disabled = true;

    if (!gameProgress[rowNum]) gameProgress[rowNum] = {};
    gameProgress[rowNum].hint2Purchased = true;
    saveProgress();
}

// ========================================================
// === HÀM MỚI ĐỂ ĐÓNG BĂNG TRÒ CHƠI ===
// ========================================================
/**
 * Đóng băng toàn bộ trò chơi sau khi đoán đúng KEY WORD
 */
function freezeGame() {
    // 1. Vô hiệu hóa tất cả các ô input trên lưới
    document.querySelectorAll('.char-input').forEach(input => {
        input.disabled = true;
    });

    // 2. Vô hiệu hóa tất cả các nút hành động (Check, Hint, Clear)
    document.querySelectorAll('.check-btn, .hint-btn, .clear-btn').forEach(button => {
        button.disabled = true;
    });
    
    // 3. Vô hiệu hóa khu vực đoán (đã làm trong handleGuessKeyword,
    //    nhưng làm lại ở đây cho chắc chắn)
    if (guessInput) guessInput.disabled = true;
    if (guessBtn) guessBtn.disabled = true;
}


// ========================================================
// === HÀM CẬP NHẬT ĐỂ ĐÓNG BĂNG TRÒ CHƠI ===
// ========================================================
// Xử lý nút Chốt KEY WORD
function handleGuessKeyword() {
    // 1. Kiểm tra điều kiện
    const solvedRows = Object.values(gameProgress).filter(p => p.solved).length;
    
    if (solvedRows < ROWS_TO_GUESS || playerScore < 10) {
        guessMessage.textContent = `Bạn cần giải ít nhất ${ROWS_TO_GUESS} hàng ngang và có ít nhất 10 điểm để đoán!`;
        return;
    }

    const guess = guessInput.value.toUpperCase().trim();
    if (guess === KEY_WORD_ANSWER) {
        // --- ĐÚNG KEY WORD ---
        
        // 1. Ghi lại thời gian
        const now = new Date();
        const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        // 2. Thông báo
        alert("CHÍNH XÁC! Bạn đã tìm ra KEY WORD!");
        guessMessage.textContent = `CHÚC MỪNG! BẠN ĐÃ TÌM RA KEY WORD: ${KEY_WORD_ANSWER} (Vào lúc: ${timeString}) với số điểm: ${playerScore}`;
        
        // 3. Vô hiệu hóa khu vực đoán
        guessInput.disabled = true;
        guessBtn.disabled = true;

        // 4. Đóng băng toàn bộ trò chơi
        freezeGame();
        
        // (Chúng ta có thể save() lần cuối nếu muốn)
        saveProgress(); 

    } else {
        // --- SAI KEY WORD ---
        playerScore -= GUESS_PENALTY;
        document.getElementById('score-display').textContent = playerScore;
        saveProgress();
        guessMessage.textContent = `SAI! Bạn bị trừ ${GUESS_PENALTY} điểm.`;
        alert(`SAI! Bạn bị trừ ${GUESS_PENALTY} điểm.`);
    }
}


// --- QUAY LẠI GIAI ĐOẠN 1 (Hàm vẽ) ---

function renderGameBoard() {
    // 1. Tạo hàng Header
    let headerCell = document.createElement('div');
    headerCell.className = 'grid-cell header corner';
    headerCell.textContent = '';
    gridContainer.appendChild(headerCell);

    for (let i = 1; i <= GRID_COLS; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell header';
        cell.textContent = i;
        gridContainer.appendChild(cell);
    }

    // 2. Tạo các hàng ô chữ
    puzzleData.forEach(rowData => {
        let clueNumCell = document.createElement('div');
        clueNumCell.className = 'grid-cell header';
        clueNumCell.textContent = rowData.row;
        gridContainer.appendChild(clueNumCell);

        let charIndex = 0;
        for (let col = 1; col <= GRID_COLS; col++) {
            let cell = document.createElement('div');
            const wordLength = rowData.answer.length;
            const endCol = rowData.startCol + wordLength - 1;

            if (col >= rowData.startCol && col <= endCol) {
                let input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'char-input';
                input.id = `input-${rowData.row}-${charIndex}`;
                if (col === KEYWORD_COL) {
                    input.classList.add('keyword-char');
                }

                // GHI ĐÈ KHI NHẬP
                input.addEventListener('beforeinput', (e) => {
                    if (e.inputType === 'insertText') {
                        const target = e.target;
                        if (target.value.length === target.maxLength) {
                            target.value = '';
                        }
                    }
                });
                
                // TỰ ĐỘNG DI CHUYỂN
                input.addEventListener('input', (e) => {
                    if (e.target.value.length === 1) {
                        const currentId = e.target.id;
                        const parts = currentId.split('-');
                        const currentRowNum = parseInt(parts[1]);
                        const currentCharIndex = parseInt(parts[2]);
                        const nextCharIndex = currentCharIndex + 1;
                        const nextInputId = `input-${currentRowNum}-${nextCharIndex}`;
                        const nextInput = document.getElementById(nextInputId);

                        if (nextInput) {
                            nextInput.focus();
                        } else {
                            const currentRowDataIndex = puzzleData.findIndex(r => r.row === currentRowNum);
                            if (currentRowDataIndex < puzzleData.length - 1) {
                                const nextRowData = puzzleData[currentRowDataIndex + 1];
                                const nextRowNum = nextRowData.row;
                                const firstInputOfNextRowId = `input-${nextRowNum}-0`;
                                const firstInputOfNextRow = document.getElementById(firstInputOfNextRowId);
                                if (firstInputOfNextRow) {
                                    firstInputOfNextRow.focus();
                                }
                            }
                        }
                    }
                });
                
                // DI CHUYỂN BẰNG MŨI TÊN + BACKSPACE
                const currentCellCol = col;
                const currentCellCharIndex = charIndex;
                input.addEventListener('keydown', (e) => {
                    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Backspace"].includes(e.key)) {
                        return;
                    }
                    if (e.key !== "Backspace") e.preventDefault();
                    
                    const parts = e.target.id.split('-');
                    const currentRowNum = parseInt(parts[1]);

                    switch (e.key) {
                        case "ArrowLeft": {
                            const prevCharIndex = currentCellCharIndex - 1;
                            const prevInputId = `input-${currentRowNum}-${prevCharIndex}`;
                            const prevInput = document.getElementById(prevInputId);
                            if (prevInput) prevInput.focus();
                            break;
                        }
                        case "ArrowRight": {
                            const nextCharIndex = currentCellCharIndex + 1;
                            const nextInputId = `input-${currentRowNum}-${nextCharIndex}`;
                            const nextInput = document.getElementById(nextInputId);
                            if (nextInput) nextInput.focus();
                            break;
                        }
                        case "ArrowUp": {
                            const currentRowDataIndex = puzzleData.findIndex(r => r.row === currentRowNum);
                            if (currentRowDataIndex > 0) {
                                const prevRowData = puzzleData[currentRowDataIndex - 1];
                                const targetCharIndex = currentCellCol - prevRowData.startCol;
                                if (targetCharIndex >= 0 && targetCharIndex < prevRowData.answer.length) {
                                    const prevInputId = `input-${prevRowData.row}-${targetCharIndex}`;
                                    const prevInput = document.getElementById(prevInputId);
                                    if (prevInput) prevInput.focus();
                                }
                            }
                            break;
                        }
                        case "ArrowDown": {
                            const currentRowDataIndex = puzzleData.findIndex(r => r.row === currentRowNum);
                            if (currentRowDataIndex < puzzleData.length - 1) {
                                const nextRowData = puzzleData[currentRowDataIndex + 1];
                                const targetCharIndex = currentCellCol - nextRowData.startCol;
                                if (targetCharIndex >= 0 && targetCharIndex < nextRowData.answer.length) {
                                    const nextInputId = `input-${nextRowData.row}-${targetCharIndex}`;
                                    const nextInput = document.getElementById(nextInputId);
                                    if (nextInput) nextInput.focus();
                                }
                            }
                            break;
                        }
                        case "Backspace": {
                            if (e.target.value.length === 0) {
                                e.preventDefault(); 
                                const prevCharIndex = currentCellCharIndex - 1;
                                const prevInputId = `input-${currentRowNum}-${prevCharIndex}`;
                                const prevInput = document.getElementById(prevInputId);
                                if (prevInput) {
                                    prevInput.value = '';
                                    prevInput.focus();
                                }
                            }
                            break;
                        }
                    }
                });

                cell.className = 'grid-cell';
                cell.appendChild(input);
                charIndex++;
            } else {
                cell.className = 'grid-cell empty';
            }
            gridContainer.appendChild(cell);
        }
    });
}

/**
 * Hàm "vẽ" khu vực câu hỏi (CẬP NHẬT LOGIC HINT)
 */
function renderClueArea() {
    puzzleData.forEach(rowData => {
        let rowDiv = document.createElement('div');
        rowDiv.className = 'clue-row';
        rowDiv.id = `clue-row-${rowData.row}`;

        let mainDiv = document.createElement('div');
        mainDiv.className = 'clue-row-main';

        // Gợi ý chính
        mainDiv.innerHTML = `<span class="clue-text">${rowData.row}. ${rowData.clue}</span>`;

        // === NÚT HINT 1 ===
        let hint1Btn = document.createElement('button');
        hint1Btn.className = 'hint-btn hint-1';
        hint1Btn.textContent = `Hint 1 (-${HINT_1_COST}đ)`;
        hint1Btn.dataset.row = rowData.row;
        hint1Btn.dataset.hint = "1"; // Đánh dấu đây là nút hint 1
        mainDiv.appendChild(hint1Btn);
        hint1Btn.addEventListener('click', handleHint1Click);
        
        // === NÚT HINT 2 ===
        let hint2Btn = document.createElement('button');
        hint2Btn.className = 'hint-btn hint-2';
        hint2Btn.textContent = `Hint 2 (-${HINT_2_COST}đ)`;
        hint2Btn.dataset.row = rowData.row;
        hint2Btn.dataset.hint = "2"; // Đánh dấu đây là nút hint 2
        hint2Btn.disabled = true; // Bị khóa ban đầu
        mainDiv.appendChild(hint2Btn);
        hint2Btn.addEventListener('click', handleHint2Click);
        
        // Nút Check
        let checkBtn = document.createElement('button');
        checkBtn.className = 'check-btn';
        checkBtn.textContent = 'Check';
        checkBtn.dataset.row = rowData.row;
        mainDiv.appendChild(checkBtn);
        checkBtn.addEventListener('click', handleCheckClick);

        // Nút Xóa (Clear)
        let clearBtn = document.createElement('button');
        clearBtn.className = 'clear-btn';
        clearBtn.innerHTML = '🗑️';
        clearBtn.title = 'Xóa hàng này';
        clearBtn.dataset.row = rowData.row;
        clearBtn.addEventListener('click', () => {
            const rowNum = clearBtn.dataset.row;
            const rowInfo = puzzleData.find(r => r.row == rowNum);
            if (!rowInfo) return;
            if (gameProgress[rowNum] && gameProgress[rowNum].solved) return; // Không cho xóa hàng đã giải

            let firstInput = null;
            for (let i = 0; i < rowInfo.answer.length; i++) {
                const inputId = `input-${rowNum}-${i}`;
                const input = document.getElementById(inputId);
                if (input && !input.disabled) { // Chỉ xóa ô chưa khóa
                    input.value = '';
                    if (i === 0) firstInput = input;
                } else if (i === 0 && !firstInput) { // Sửa lỗi: tìm ô đầu tiên có thể focus
                     const allInputs = input.closest('.grid-cell').parentElement.querySelectorAll('input:not(:disabled)');
                     if(allInputs.length > 0) firstInput = allInputs[0];
                }
            }
            if (firstInput) firstInput.focus();
        });
        mainDiv.appendChild(clearBtn);

        // Nơi hiển thị thời gian
        let timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        timeSpan.id = `time-${rowData.row}`;
        mainDiv.appendChild(timeSpan);
        
        rowDiv.appendChild(mainDiv);
        
        // Nơi hiển thị Hint 1
        let hint1Text = document.createElement('div');
        hint1Text.className = 'hint-text';
        hint1Text.id = `hint-1-${rowData.row}`; // ID riêng cho hint 1
        hint1Text.textContent = rowData.hint1;
        rowDiv.appendChild(hint1Text);

        // Nơi hiển thị Hint 2
        let hint2Text = document.createElement('div');
        hint2Text.className = 'hint-text';
        hint2Text.id = `hint-2-${rowData.row}`; // ID riêng cho hint 2
        hint2Text.textContent = rowData.hint2;
        rowDiv.appendChild(hint2Text);

        clueContainer.appendChild(rowDiv);
    });
}


// --- CHẠY HÀM KHI TẢI TRANG (CẬP NHẬT) ---
document.addEventListener('DOMContentLoaded', () => {
    // === LỖI ĐÃ SỬA ===
    // Gán giá trị cho các biến "thùng" SAU KHI DOM đã tải
    gridContainer = document.getElementById('crossword-grid');
    clueContainer = document.getElementById('clue-area');
    jumbledLettersDisplay = document.getElementById('jumbled-letters-display');
    guessInput = document.getElementById('keyword-guess-input');
    guessBtn = document.getElementById('keyword-guess-btn');
    guessMessage = document.getElementById('guess-message');
    
    // 1. Vẽ giao diện
    renderGameBoard();
    renderClueArea();
    
    // 2. Tải tiến độ
    loadProgress();
    
    // 3. Gắn logic cho nút Chốt KEY WORD
    if (guessBtn) {
        guessBtn.addEventListener('click', handleGuessKeyword);
    }
});