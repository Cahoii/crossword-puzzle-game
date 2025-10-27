// --- GIAI ĐOẠN 1: VẼ GIAO DIỆN ---

// 1. ĐỊNH NGHĨA "ĐỀ BÀI" (PHIÊN BẢN CÔNG KHAI - KHÔNG CÓ ĐÁP ÁN/HINT)
const puzzleData = [
    { 
        row: 1, 
        clue: "Addressing mode where the operand's value is contained within the instruction itself.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 9 
    },
    { 
        row: 2, 
        clue: "Symbolic abbreviations like ADD, SUB, LOAD used to represent machine opcodes.",
        startCol: 6, 
        keywordIndex: 1,
        answerLength: 9 
    },
    { 
        row: 3, 
        clue: "Implicit addressing often involves operations on the top of this LIFO structure.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 5 
    },
    { 
        row: 4, 
        clue: "The most common scheme for representing signed integers in computers.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 14 
    },
    { 
        row: 5, 
        clue: "A high-speed storage location within the CPU used to hold data temporarily.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 8 
    },
    { 
        row: 6, 
        clue: "An integer data type that represents only non-negative values.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 8 
    },
    { 
        row: 7, 
        clue: "A widely used 7-bit character encoding standard.",
        startCol: 5, 
        keywordIndex: 2,
        answerLength: 5 
    },
    { 
        row: 8, 
        clue: "Type of instruction that moves data (e.g., LOAD, STORE). Data ___.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 8 
    },
    { 
        row: 9, 
        clue: "Addressing mode where the address field in the instruction contains the effective address of the operand.",
        startCol: 6, 
        keywordIndex: 1,
        answerLength: 6 
    },
    { 
        row: 10, 
        clue: "The part of a machine instruction that specifies the operation to be performed.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 6 
    },
    { 
        row: 11, 
        clue: "Type of algebra used for logical operations like AND, OR, NOT.",
        startCol: 2, 
        keywordIndex: 5,
        answerLength: 7 
    },
    { 
        row: 12, 
        clue: "Instructions for ___ Control are usually privileged and used by the OS.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 6 
    },
    { 
        row: 13, 
        clue: "The actual memory address of an operand after all addressing mode calculations.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 16 
    },
    { 
        row: 14, 
        clue: "A fundamental unit of data storage, typically consisting of 8 bits.",
        startCol: 5, 
        keywordIndex: 2,
        answerLength: 4 
    },
    { 
        row: 15, 
        clue: "Addressing mode that adds an offset value to a base register's content.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 12 
    },
    { 
        row: 16, 
        clue: "Refers to the byte order (Little or Big) in multi-byte data types.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 10 
    },
    { 
        row: 17, 
        clue: "A logical or arithmetic operation that moves bits left or right within a register.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 5 
    },
    { 
        row: 18, 
        clue: "Instructions used to communicate with peripheral devices.",
        startCol: 7, 
        keywordIndex: 0,
        answerLength: 11 
    },
    { 
        row: 19, 
        clue: "Operations like AND, OR, XOR, NOT fall into this category.",
        startCol: 4, 
        keywordIndex: 3,
        answerLength: 7 
    },
    { 
        row: 20, 
        clue: "A single operation specified by an opcode and possibly operands.",
        startCol: 6, 
        keywordIndex: 1,
        answerLength: 11 
    }
];

// Các hằng số cài đặt
const GRID_COLS = 23;
const KEYWORD_COL = 7; 

// Khai báo biến "thùng"
let gridContainer, clueContainer, jumbledLettersDisplay, 
    guessInput, guessBtn, guessMessage, teamNameInput, startGameBtn,
    infoPanel, timerDisplay, timeRemainingSpan;


// === GIAI ĐOẠN 2: LẬP TRÌNH LOGIC (THEO THỂ LỆ MỚI) ===

// --- 1. CÀI ĐẶT & BIẾN TRẠNG THÁI ---
const PLAYER_START_SCORE = 10;
const POINTS_PER_ROW = 10;
const HINT_1_COST = 4;
const HINT_2_COST = 6;
const GUESS_PENALTY = 10;
const KEY_WORD_ANSWER = "INSTRUCTIONSETDESIGN"; // Đã sửa
const ROWS_TO_GUESS = 15; // 75% của 20 hàng

// === THÊM CÀI ĐẶT TIMER ===
const GAME_DURATION_MINUTES = 1; // 150 phút = 2.5 tiếng
let timerInterval = null; // Biến để giữ ID của bộ đếm giờ

const STORAGE_KEY = 'crosswordProgress';

let playerScore = PLAYER_START_SCORE;
let gameProgress = {}; 
let foundKeywordLetters = []; // Mảng chứa các chữ cái lộn xộn

// --- 2. LOGIC LƯU/TẢI (localStorage) (ĐÃ CẬP NHẬT) ---

function saveProgress() {
    const dataToSave = {
        score: playerScore,
        progress: gameProgress,
        letters: foundKeywordLetters,
        // === THÊM CÁC DÒNG MỚI ===
        teamName: teamNameInput ? teamNameInput.value : '', // Lưu tên đội
        gameStarted: localStorage.getItem('gameEndTime') !== null, // Lưu trạng thái game đã bắt đầu chưa
        guessInputValue: guessInput ? guessInput.value : '', // Lưu giá trị ô đoán
        guessInputDisabled: guessInput ? guessInput.disabled : false, // Lưu trạng thái khóa ô đoán
        guessBtnDisabled: guessBtn ? guessBtn.disabled : false, // Lưu trạng thái khóa nút đoán
        guessMessageText: guessMessage ? guessMessage.textContent : '' // Lưu thông báo
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

function loadProgress() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const gameEndTime = localStorage.getItem('gameEndTime'); // Lấy thời gian kết thúc

    if (savedData) {
        const data = JSON.parse(savedData);
        playerScore = data.score || PLAYER_START_SCORE;
        gameProgress = data.progress || {};
        foundKeywordLetters = data.letters || [];
        
        // Nếu game đã bắt đầu (có endTime) HOẶC đã lưu trạng thái bắt đầu
        if (gameEndTime || data.gameStarted) {
             // Hiển thị phần chơi
            showGameArea();
            // Khôi phục tên đội và khóa ô nhập
            if (teamNameInput) {
                teamNameInput.value = data.teamName || '';
                teamNameInput.disabled = true;
            }
            if (startGameBtn) {
                 startGameBtn.disabled = true;
                 startGameBtn.textContent = "Đã bắt đầu";
            }

            // Cập nhật giao diện từ tiến độ đã lưu
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

            // Nếu game đã bắt đầu VÀ chưa thắng/chưa hết giờ, khởi động lại timer
            const gameAlreadyWon = guessBtn ? guessBtn.disabled : false;
             if (gameEndTime && !gameAlreadyWon) {
                 const now = new Date().getTime();
                 if (now >= parseInt(gameEndTime, 10)) {
                     endGameByTimeout(); 
                     updateTimerDisplay(); // Cập nhật hiển thị thành 00:00
                 } else {
                     if (timerInterval) clearInterval(timerInterval); 
                     updateTimerDisplay(); // Hiển thị thời gian còn lại lần đầu
                     timerInterval = setInterval(checkGameTimer, 1000); // Bắt đầu kiểm tra + cập nhật
                 }
             } else {
                 updateTimerDisplay(); // Vẫn hiển thị thời gian (dù là 00:00 hoặc sau khi thắng)
             }

        } else {
             // Game chưa bắt đầu, giữ ẩn các phần tử
             hideGameArea(); // Đảm bảo mọi thứ bị ẩn
             if (teamNameInput) teamNameInput.value = data.teamName || ''; // Chỉ khôi phục tên
        }
    } else {
        // Không có dữ liệu lưu, ẩn game area
        hideGameArea();
    }
    // Luôn cập nhật điểm ban đầu (chỉ khi infoPanel đã được gán VÀ hiện)
    if (infoPanel && infoPanel.style.display !== 'none') {
        document.getElementById('score-display').textContent = playerScore;
    }
}

// === CÁC HÀM HELPER MỚI CHO VIỆC ẨN/HIỆN VÀ TIMER ===
// Hàm hiển thị khu vực chơi game (SỬA LỖI)
function showGameArea() {
    // Hiện các thành phần chính
     document.querySelectorAll('.info-panel, .crossword-grid, .clue-area, .jumbled-letters-container, .keyword-guess-container, #timer-display').forEach(el => {
         if (el) { // Kiểm tra xem element có tồn tại không
             el.style.display = ''; // Bỏ display: none
             el.classList.remove('game-area-hidden'); // Xóa class ẩn
             
             // Gán lại display đúng nếu cần thiết (dựa vào cấu trúc CSS của bạn)
             if (el.id === 'crossword-grid') el.style.display = 'grid';
             else if (el.classList.contains('clue-area')) el.style.display = 'flex';
             // Các element khác dùng display mặc định (block, flex, inline...) là được
             // Nếu dùng flexbox cho info-panel hoặc timer-display, thì đặt lại ở đây
             else if (el.classList.contains('info-panel')) el.style.display = ''; // Hoặc flex nếu cần
             else if (el.id === 'timer-display') el.style.display = ''; // Hoặc flex nếu cần
             else if (el.classList.contains('jumbled-letters-container')) el.style.display = ''; // Block mặc định
             else if (el.classList.contains('keyword-guess-container')) el.style.display = ''; // Block mặc định
         }
     });
     // Cập nhật lại điểm số (vì infoPanel đã hiện)
     if (infoPanel) document.getElementById('score-display').textContent = playerScore;
     // Cập nhật lại timer display lần đầu
     updateTimerDisplay();
}
// Hàm ẩn khu vực chơi game
function hideGameArea() {
     document.querySelectorAll('.info-panel, .crossword-grid, .clue-area, .jumbled-letters-container, .keyword-guess-container, #timer-display').forEach(el => {
          if (el) el.style.display = 'none'; // Đặt lại display none
     });
}

/**
 * Hàm này được gọi khi hết giờ
 */
function endGameByTimeout() {
    console.log("HẾT GIỜ!");
    alert("Đã hết 150 phút! Bạn không thể tiếp tục nộp bài.");
    freezeGame(); // Đóng băng game
    if (guessMessage) {
        guessMessage.textContent = "Đã hết giờ! Bạn không thể nộp đáp án.";
        guessMessage.style.color = "#c0392b"; 
    }
    updateTimerDisplay(); // Cập nhật lần cuối thành 00:00
    try {
        // Lấy tên đội (kể cả khi ô input đã bị khóa)
        const teamName = teamNameInput ? teamNameInput.value.trim() : 'Unknown Team (Timeout)'; 
        // Nếu tên đội rỗng (ví dụ: người chơi chưa kịp nhập trước khi hết giờ), đặt tên mặc định
        const finalTeamName = teamName === "" ? 'Chưa nhập tên (Timeout)' : teamName;

        const timeoutTime = firebase.firestore.FieldValue.serverTimestamp(); // Lấy timestamp của server

        // Ghi vào collection 'completions' với trạng thái 'timeout'
        db.collection('completions').add({
            team: finalTeamName,
            time: timeoutTime,
            finalScore: playerScore, // Điểm số lúc hết giờ
            status: "timeout" // Đánh dấu là hết giờ
        })
        .then((docRef) => {
            console.log("Đã ghi lại trạng thái Timeout, ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Lỗi khi ghi trạng thái Timeout: ", error);
            // Có thể thêm thông báo lỗi cho người dùng nếu cần
        });

    } catch (e) {
        console.error("Lỗi Firebase khi ghi Timeout: ", e);
        // Có thể thêm thông báo lỗi cho người dùng nếu cần
    }
}

/**
 * Hàm CẬP NHẬT HIỂN THỊ đồng hồ đếm ngược
 */
function updateTimerDisplay() {
    if (!timeRemainingSpan) return; // Nếu chưa load xong

    const endTime = localStorage.getItem('gameEndTime');
    if (!endTime) {
        timeRemainingSpan.textContent = "--:--"; // Chưa bắt đầu
        return;
    }

    const now = new Date().getTime();
    const timeLeft = parseInt(endTime, 10) - now;

    if (timeLeft <= 0) {
        timeRemainingSpan.textContent = "00:00"; // Hết giờ
    } else {
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        // Định dạng MM:SS
        timeRemainingSpan.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}


/**
 * Hàm này được gọi 1 giây 1 lần để kiểm tra và CẬP NHẬT TIMER
 */
function checkGameTimer() {
    const endTime = localStorage.getItem('gameEndTime');
    if (!endTime) return; 

    const now = new Date().getTime();
    
    if (now >= parseInt(endTime, 10)) {
        endGameByTimeout(); 
        if (timerInterval) clearInterval(timerInterval); 
    } else {
        // Cập nhật hiển thị thời gian còn lại
        updateTimerDisplay(); 
    }
}

/** * Hàm bắt đầu game và timer (ĐÃ CẬP NHẬT)
 */
function startGame() {
    const teamName = teamNameInput ? teamNameInput.value.trim() : '';
    if (!teamNameInput || teamName === "") {
        alert("Vui lòng nhập Tên Đội!");
        teamNameInput.focus();
        return;
    }

    // Khóa ô tên và nút bắt đầu
    teamNameInput.disabled = true;
    startGameBtn.disabled = true;
    startGameBtn.textContent = "Đã bắt đầu";

    // Chỉ đặt timer nếu chưa có
    let endTime = localStorage.getItem('gameEndTime');
    if (!endTime) {
        console.log("Bắt đầu đếm giờ: " + GAME_DURATION_MINUTES + " phút.");
        const now = new Date().getTime();
        const deadline = now + (GAME_DURATION_MINUTES * 60 * 1000);
        localStorage.setItem('gameEndTime', deadline);
        endTime = deadline; // Gán lại endTime
        
        // Lưu lại trạng thái game đã bắt đầu và tên đội
        saveProgress(); 
    }

    // Hiển thị khu vực chơi game (SAU KHI ĐÃ ĐẶT TIMER VÀ LƯU)
    showGameArea();

    // Bắt đầu kiểm tra và cập nhật timer
    const now = new Date().getTime();
     if (now >= parseInt(endTime, 10)) {
         endGameByTimeout(); 
         updateTimerDisplay(); // Hiện 00:00
     } else {
         if (timerInterval) clearInterval(timerInterval); 
         updateTimerDisplay(); // Hiển thị lần đầu
         timerInterval = setInterval(checkGameTimer, 1000); // Bắt đầu kiểm tra + cập nhật mỗi giây
     }
}
// === KẾT THÚC CÁC HÀM HELPER MỚI ===


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
    // SỬA LỖI: Kiểm tra keywordIndex hợp lệ
    if (rowData.keywordIndex < 0 || rowData.keywordIndex >= rowData.answer.length) {
        console.error(`Lỗi dữ liệu hàng ${rowNum}: keywordIndex ${rowData.keywordIndex} không hợp lệ cho đáp án "${rowData.answer}"`);
        return;
    }
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
        if (!input) { // Thêm kiểm tra lỗi
             console.error(`Không tìm thấy input: input-${rowNum}-${i}`);
             continue; // Bỏ qua nếu input không tồn tại
        }
        userInput += input.value;
        inputElements.push(input);
    }
    
    if (userInput.toUpperCase() === rowData.answer.toUpperCase()) {
        // --- ĐÚNG ---
        playerScore += POINTS_PER_ROW;
        document.getElementById('score-display').textContent = playerScore;

        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN');
        const timeEl = document.getElementById(`time-${rowNum}`); // Lấy element trước khi gán
        if (timeEl) timeEl.textContent = timeString;

        inputElements.forEach(input => {
            input.disabled = true;
            input.classList.add('correct');
        });
        event.target.disabled = true;
        
        // Sửa lỗi: querySelector có thể trả về null
        const hint1Btn = document.querySelector(`.hint-btn[data-row="${rowNum}"][data-hint="1"]`);
        if (hint1Btn) hint1Btn.disabled = true;
        const hint2Btn = document.querySelector(`.hint-btn[data-row="${rowNum}"][data-hint="2"]`);
        if (hint2Btn) hint2Btn.disabled = true;
        const clearBtn = document.querySelector(`.clear-btn[data-row="${rowNum}"]`);
        if (clearBtn) clearBtn.disabled = true;


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
// Xử lý nút Hint 1 (ĐÃ CẬP NHẬT để gọi Cloud Function)
function handleHint1Click(event) {
    const hintButton = event.target;
    const rowNum = hintButton.dataset.row;

    if (playerScore < HINT_1_COST) {
        alert("Không đủ điểm để mua hint 1!");
        return;
    }
    if (!confirm(`Dùng ${HINT_1_COST} điểm để xem Gợi ý 1?`)) return;

    // Tạm khóa nút
    hintButton.disabled = true;

    // Gọi Cloud Function tên là 'getHint'
    const getHintFunc = functions.httpsCallable('getHint');
    getHintFunc({ rowNum: rowNum, hintNum: 1 })
        .then((result) => {
            // Server trả về hint text
            const hintText = result.data.hintText;

            // Trừ điểm và cập nhật UI
            playerScore -= HINT_1_COST;
            document.getElementById('score-display').textContent = playerScore;

            const hintText1 = document.getElementById(`hint-1-${rowNum}`);
            if (hintText1) {
                hintText1.textContent = hintText; // Gán text từ server
                hintText1.style.display = 'block';
            }

            // Mở khóa nút Hint 2
            const hint2Btn = document.querySelector(`.hint-btn[data-row="${rowNum}"][data-hint="2"]`);
            if (hint2Btn) hint2Btn.disabled = false;

            if (!gameProgress[rowNum]) gameProgress[rowNum] = {};
            gameProgress[rowNum].hint1Purchased = true;
            saveProgress();
        })
        .catch((error) => {
            console.error("Lỗi khi gọi getHint 1:", error);
            alert("Đã xảy ra lỗi khi lấy gợi ý. Vui lòng thử lại.");
            hintButton.disabled = false; // Mở khóa lại nút nếu lỗi
        });
}

// Xử lý nút Hint 2
// Xử lý nút Hint 2 (ĐÃ CẬP NHẬT để gọi Cloud Function)
function handleHint2Click(event) {
    const hintButton = event.target;
    const rowNum = hintButton.dataset.row;

    if (playerScore < HINT_2_COST) {
        alert("Không đủ điểm để mua hint 2!");
        return;
    }
    if (!confirm(`Dùng ${HINT_2_COST} điểm để xem Gợi ý 2?`)) return;

    // Tạm khóa nút
    hintButton.disabled = true;

    // Gọi Cloud Function tên là 'getHint'
    const getHintFunc = functions.httpsCallable('getHint');
    getHintFunc({ rowNum: rowNum, hintNum: 2 })
        .then((result) => {
            // Server trả về hint text
            const hintText = result.data.hintText;

            // Trừ điểm và cập nhật UI
            playerScore -= HINT_2_COST;
            document.getElementById('score-display').textContent = playerScore;

            const hintText2 = document.getElementById(`hint-2-${rowNum}`);
            if (hintText2) {
                hintText2.textContent = hintText; // Gán text từ server
                hintText2.style.display = 'block';
            }

            if (!gameProgress[rowNum]) gameProgress[rowNum] = {};
            gameProgress[rowNum].hint2Purchased = true;
            saveProgress();
        })
        .catch((error) => {
            console.error("Lỗi khi gọi getHint 2:", error);
            alert("Đã xảy ra lỗi khi lấy gợi ý. Vui lòng thử lại.");
            hintButton.disabled = false; // Mở khóa lại nút nếu lỗi
        });
}

/**
 * Đóng băng toàn bộ trò chơi sau khi đoán đúng KEY WORD hoặc hết giờ
 */
function freezeGame() {
    // 1. Vô hiệu hóa tất cả các ô input trên lưới (trừ những ô đã đúng)
    document.querySelectorAll('.char-input:not(.correct)').forEach(input => {
        input.disabled = true;
    });

    // 2. Vô hiệu hóa tất cả các nút hành động (trừ những nút đã bị khóa)
    document.querySelectorAll('.check-btn:not(:disabled), .hint-btn:not(:disabled), .clear-btn:not(:disabled)').forEach(button => {
        button.disabled = true;
    });
    
    // 3. Vô hiệu hóa khu vực đoán
    if (guessInput) guessInput.disabled = true;
    if (guessBtn) guessBtn.disabled = true;
    if (teamNameInput) teamNameInput.disabled = true; 
    if (startGameBtn) startGameBtn.disabled = true; // Khóa nút bắt đầu nếu game đang chạy
}


// Xử lý nút Chốt KEY WORD (Đã cập nhật đầy đủ)
function handleGuessKeyword() {
    // 1. Lấy tên đội và kiểm tra
    const teamName = teamNameInput ? teamNameInput.value.trim() : 'Unknown Team'; 

    if (!teamNameInput || teamName === "") { 
        guessMessage.textContent = "Vui lòng nhập Tên Đội của bạn trước khi chốt!";
        alert("Vui lòng nhập Tên Đội của bạn!");
        if (teamNameInput) teamNameInput.focus(); 
        return; 
    }

    // 2. Kiểm tra điều kiện đoán
    const solvedRows = Object.values(gameProgress).filter(p => p.solved).length;

    if (solvedRows < ROWS_TO_GUESS || playerScore < 10) {
        guessMessage.textContent = `Bạn cần giải ít nhất ${ROWS_TO_GUESS} hàng ngang và có ít nhất 10 điểm để đoán!`;
        return;
    }

    const guess = guessInput.value.toUpperCase().trim();
    if (guess === KEY_WORD_ANSWER) {
        // --- ĐÚNG KEY WORD ---

        // 1. Ghi lại thời gian chi tiết
        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN'); 

        // 2. Thông báo
        alert("CHÍNH XÁC! Bạn đã tìm ra KEY WORD!");
        guessMessage.textContent = `CHÚC MỪNG ${teamName}! BẠN ĐÃ TÌM RA KEY WORD: ${KEY_WORD_ANSWER} (Vào lúc: ${timeString}) với số điểm cuối: ${playerScore}`;

        // 3. Vô hiệu hóa khu vực đoán và tên đội
        guessInput.disabled = true;
        guessBtn.disabled = true;
        if (teamNameInput) teamNameInput.disabled = true; 

        // 4. Đóng băng toàn bộ trò chơi
        freezeGame();
        
        // === DỪNG TIMER KHI THẮNG ===
        if (timerInterval) clearInterval(timerInterval); 

        // 5. GỬI DỮ LIỆU LÊN FIREBASE
        try {
            const completionTime = firebase.firestore.FieldValue.serverTimestamp(); 
            db.collection('completions').add({
                team: teamName,
                time: completionTime,
                finalScore: playerScore,
                guess: guess
            })
            .then((docRef) => {
                console.log("Đã ghi lại thời gian hoàn thành, ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Lỗi khi gửi kết quả lên Firebase: ", error);
                guessMessage.textContent += " -- Lỗi! Không gửi được kết quả (kiểm tra console).";
                alert("Lỗi khi gửi kết quả lên server. Vui lòng báo BTC!");
            });

        } catch (e) {
            console.error("Lỗi khởi tạo Firebase hoặc Firestore: ", e);
            alert("Lỗi kết nối đến server Firebase. Vui lòng báo cho BTC!");
        }
        
        // 6. Lưu tiến trình lần cuối (trạng thái đã khóa)
        saveProgress(); 

    } else {
        // --- SAI KEY WORD ---
        playerScore -= GUESS_PENALTY;
        document.getElementById('score-display').textContent = playerScore;
        saveProgress(); // Lưu lại điểm sau khi bị trừ
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
                    // SỬA LỖI: Kiểm tra input có tồn tại không trước khi dùng closest
                    if (input) {
                        const parentRow = input.closest('.grid-cell').parentElement;
                        if (parentRow) {
                             const allInputs = parentRow.querySelectorAll('input:not(:disabled)');
                             if(allInputs.length > 0) firstInput = allInputs[0];
                        }
                    }
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


// --- CHẠY HÀM KHI TẢI TRANG (ĐÃ CẬP NHẬT HOÀN TOÀN) ---
document.addEventListener('DOMContentLoaded', () => {
    // Gán giá trị cho các biến DOM
    gridContainer = document.getElementById('crossword-grid');
    clueContainer = document.getElementById('clue-area');
    jumbledLettersDisplay = document.getElementById('jumbled-letters-display');
    guessInput = document.getElementById('keyword-guess-input');
    guessBtn = document.getElementById('keyword-guess-btn');
    guessMessage = document.getElementById('guess-message');
    teamNameInput = document.getElementById('team-name-input');
    startGameBtn = document.getElementById('start-game-btn');
    infoPanel = document.querySelector('.info-panel'); // SỬA LỖI: Dùng querySelector
    timerDisplay = document.getElementById('timer-display'); // Lấy div timer
    timeRemainingSpan = document.getElementById('time-remaining'); // Lấy span thời gian

    // 1. Vẽ giao diện (luôn vẽ, nhưng ban đầu bị ẩn)
    renderGameBoard();
    renderClueArea();
    
    // 2. Tải tiến độ (Hàm này sẽ quyết định ẩn/hiện game và khởi động lại timer nếu cần)
    loadProgress();
    
    // 3. Gắn logic cho nút Chốt KEY WORD
    if (guessBtn) {
        guessBtn.addEventListener('click', handleGuessKeyword);
    }
    
    // 4. Gắn logic cho nút BẮT ĐẦU GAME
    // Chỉ gắn nếu nút chưa bị khóa (nghĩa là game chưa bắt đầu từ lần tải trước)
    if (startGameBtn && !startGameBtn.disabled) {
        startGameBtn.addEventListener('click', startGame);
    }
});