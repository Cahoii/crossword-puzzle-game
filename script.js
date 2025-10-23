// --- GIAI ĐOẠN 1: VẼ GIAO DIỆN ---

// 1. ĐỊNH NGHĨA "ĐỀ BÀI" (Dựa trên ảnh bạn cung cấp)
// Chúng ta sẽ dùng mảng (Array) để lưu dữ liệu
// keywordIndex: là vị trí của chữ cái (bắt đầu từ 0) trong từ ngang
//              giao với từ khóa dọc.
const puzzleData = [
    { 
        row: 1, 
        answer: "DONVIHANHCHINH", 
        clue: "Gợi ý chính cho hàng 1...", 
        hint: "Gợi ý phụ (hint) cho hàng 1...",
        startCol: 4, // Bắt đầu ở cột 4
        keywordIndex: 3 // Chữ 'V' (ở cột 7) là chữ thứ 4 (index 3)
    },
    { 
        row: 2, 
        answer: "HANOI", 
        clue: "Gợi ý chính cho hàng 2...", 
        hint: "Gợi ý phụ (hint) cho hàng 2...",
        startCol: 3, 
        keywordIndex: 4 // Chữ 'I' (ở cột 7) là chữ thứ 5 (index 4)
    },
    { 
        row: 3, 
        answer: "HUE", 
        clue: "Gợi ý chính cho hàng 3...", 
        hint: "Gợi ý phụ (hint) cho hàng 3...",
        startCol: 5, 
        keywordIndex: 2 // Chữ 'E' (ở cột 7) là chữ thứ 3 (index 2)
    },
    { 
        row: 4, 
        answer: "CANTHO", 
        clue: "Gợi ý chính cho hàng 4...", 
        hint: "Gợi ý phụ (hint) cho hàng 4...",
        startCol: 4, 
        keywordIndex: 3 // Chữ 'T' (ở cột 7) là chữ thứ 4 (index 3)
    },
    { 
        row: 5, 
        answer: "HAIPHONG", 
        clue: "Gợi ý chính cho hàng 5...", 
        hint: "Gợi ý phụ (hint) cho hàng 5...",
        startCol: 2, 
        keywordIndex: 5 // Chữ 'O' (ở cột 7) là chữ thứ 6 (index 5)
    },
    { 
        row: 6, 
        answer: "DANANG", 
        clue: "Gợi ý chính cho hàng 6...", 
        hint: "Gợi ý phụ (hint) cho hàng 6...",
        startCol: 7, 
        keywordIndex: 0 // Chữ 'A' (ở cột 7) là chữ thứ 1 (index 0)
    },
    { 
        row: 7, 
        answer: "HOCHIMINH", 
        clue: "Gợi ý chính cho hàng 7...", 
        hint: "Gợi ý phụ (hint) cho hàng 7...",
        startCol: 3, 
        keywordIndex: 4 // Chữ 'M' (ở cột 7) là chữ thứ 5 (index 4)
    },
    { 
        row: 8, 
        answer: "HOCHIMINH", 
        clue: "Gợi ý chính cho hàng 8...", 
        hint: "Gợi ý phụ (hint) cho hàng 8...",
        startCol: 3, 
        keywordIndex: 4 // Chữ 'M' (ở cột 7) là chữ thứ 5 (index 4)
    }

];

// Các hằng số cài đặt
const GRID_COLS = 17; // Tổng số cột
const KEYWORD_COL = 7; // Cột dọc chứa từ khóa

// Lấy các "thùng" rỗng từ HTML
const gridContainer = document.getElementById('crossword-grid');
const clueContainer = document.getElementById('clue-area');


/**
 * Hàm "vẽ" toàn bộ lưới ô chữ
 */
function renderGameBoard() {
    // 1. Tạo hàng Header
    // Ô góc trên-trái (để trống)
    let headerCell = document.createElement('div');
    headerCell.className = 'grid-cell header corner';
    headerCell.textContent = '';
    gridContainer.appendChild(headerCell);

    // Các ô số từ 1 đến 17
    for (let i = 1; i <= GRID_COLS; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell header';
        cell.textContent = i;
        gridContainer.appendChild(cell);
    }

    // 2. Tạo các hàng ô chữ
    puzzleData.forEach(rowData => {
        // Ô "1", "2"... (STT hàng)
        let clueNumCell = document.createElement('div');
        clueNumCell.className = 'grid-cell header';
        clueNumCell.textContent = rowData.row;
        gridContainer.appendChild(clueNumCell);

        // Tạo 17 ô (hoặc là ô trống, hoặc là ô input)
        let charIndex = 0; // Để đếm vị trí chữ cái trong từ
        for (let col = 1; col <= GRID_COLS; col++) {
            let cell = document.createElement('div');

            const wordLength = rowData.answer.length;
            const endCol = rowData.startCol + wordLength - 1;

            if (col >= rowData.startCol && col <= endCol) {
                // Đây là ô nhập liệu
                let input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'char-input';
                input.id = `input-${rowData.row}-${charIndex}`;

                if (col === KEYWORD_COL) {
                    input.classList.add('keyword-char');
                }

                // KHỐI MÃ: GHI ĐÈ KHI NHẬP (Đã có)
                input.addEventListener('beforeinput', (e) => {
                    if (e.inputType === 'insertText') {
                        const target = e.target;
                        if (target.value.length === target.maxLength) {
                            target.value = '';
                        }
                    }
                });
                
                // KHỐI MÃ: TỰ ĐỘNG DI CHUYỂN KHI NHẬP (Đã có)
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
                
                // KHỐI MÃ: DI CHUYỂN BẰNG MŨI TÊN (Cập nhật)
                const currentCellCol = col;
                const currentCellCharIndex = charIndex;

                input.addEventListener('keydown', (e) => {
                    // THÊM "Backspace" VÀO DANH SÁCH PHÍM CẦN XỬ LÝ
                    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Backspace"].includes(e.key)) {
                        return;
                    }

                    // CHỈ preventDefault cho mũi tên
                    if (e.key !== "Backspace") {
                        e.preventDefault();
                    }

                    const parts = e.target.id.split('-');
                    const currentRowNum = parseInt(parts[1]);

                    switch (e.key) {
                        // ... (case "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown" giữ nguyên) ...
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

                        // ==========================================================
                        // === KHỐI MÃ MỚI: LOGIC CHO "BACKSPACE THÔNG MINH" ===
                        // ==========================================================
                        case "Backspace": {
                            // Chỉ can thiệp nếu ô hiện tại rỗng
                            if (e.target.value.length === 0) {
                                // Ngăn trình duyệt nhảy về trang trước
                                e.preventDefault(); 
                                
                                // Tìm ô bên trái
                                const prevCharIndex = currentCellCharIndex - 1;
                                const prevInputId = `input-${currentRowNum}-${prevCharIndex}`;
                                const prevInput = document.getElementById(prevInputId);
                                
                                if (prevInput) {
                                    prevInput.value = ''; // Xóa chữ ở ô trước đó
                                    prevInput.focus(); // Di chuyển con trỏ về ô đó
                                }
                            }
                            break;
                        }
                        // === KẾT THÚC KHỐI MÃ MỚI ===
                    }
                });

                cell.className = 'grid-cell';
                cell.appendChild(input);
                charIndex++;
            } else {
                // Đây là ô trống
                cell.className = 'grid-cell empty';
            }
            gridContainer.appendChild(cell);
        }
    });
}

/**
 * Hàm "vẽ" khu vực câu hỏi
 */
function renderClueArea() {
    puzzleData.forEach(rowData => {
        // Tạo một 'div' cho cả hàng câu hỏi
        let rowDiv = document.createElement('div');
        rowDiv.className = 'clue-row';
        rowDiv.id = `clue-row-${rowData.row}`;

        // Phần chính: Gợi ý, nút Hint, nút Check
        let mainDiv = document.createElement('div');
        mainDiv.className = 'clue-row-main';

        // Gợi ý chính
        mainDiv.innerHTML = `<span class="clue-text">${rowData.row}. ${rowData.clue}</span>`;

        // Nút Hint
        let hintBtn = document.createElement('button');
        hintBtn.className = 'hint-btn';
        hintBtn.textContent = 'Mua Hint (-5đ)';
        hintBtn.dataset.row = rowData.row; // Lưu số hàng vào nút
        mainDiv.appendChild(hintBtn);
        
        // Nút Check
        let checkBtn = document.createElement('button');
        checkBtn.className = 'check-btn';
        checkBtn.textContent = 'Check';
        checkBtn.dataset.row = rowData.row; // Lưu số hàng vào nút
        mainDiv.appendChild(checkBtn);

        // ==========================================================
        // === KHỐI MÃ MỚI: THÊM NÚT XÓA VÀ LOGIC ===
        // ==========================================================
        let clearBtn = document.createElement('button');
        clearBtn.className = 'clear-btn';
        clearBtn.innerHTML = '🗑️'; // Icon thùng rác
        clearBtn.title = 'Xóa hàng này'; // Tooltip
        clearBtn.dataset.row = rowData.row;

        // Thêm logic xóa ngay tại đây
        clearBtn.addEventListener('click', () => {
            const rowNum = clearBtn.dataset.row;
            // Lấy data của hàng này (chỉ cần chiều dài 'answer' là đủ)
            const rowInfo = puzzleData.find(r => r.row == rowNum);
            if (!rowInfo) return;

            let firstInput = null; // Để lưu ô đầu tiên

            // Xóa tất cả input của hàng này
            for (let i = 0; i < rowInfo.answer.length; i++) {
                const inputId = `input-${rowNum}-${i}`;
                const input = document.getElementById(inputId);
                if (input) {
                    input.value = '';
                    if (i === 0) {
                        firstInput = input; // Lưu lại ô đầu tiên
                    }
                }
            }
            
            // Focus vào ô đầu tiên của hàng sau khi xóa
            if (firstInput) {
                firstInput.focus();
            }
        });
        
        mainDiv.appendChild(clearBtn); // Thêm nút vào
        // === KẾT THÚC KHỐI MÃ MỚI ===

        // Nơi hiển thị thời gian
        let timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        timeSpan.id = `time-${rowData.row}`;
        mainDiv.appendChild(timeSpan);
        
        rowDiv.appendChild(mainDiv);
        
        // Phần phụ: Nơi hiển thị Hint (ban đầu bị ẩn)
        let hintText = document.createElement('div');
        hintText.className = 'hint-text';
        hintText.id = `hint-${rowData.row}`;
        hintText.textContent = rowData.hint;
        rowDiv.appendChild(hintText);

        clueContainer.appendChild(rowDiv);
    });
}


// --- CHẠY HÀM KHI TẢI TRANG ---
// "DOMContentLoaded" đảm bảo trang web đã tải xong HTML mới chạy JavaScript
document.addEventListener('DOMContentLoaded', () => {
    renderGameBoard();
    renderClueArea();
    
    // Giai đoạn 2 (Logic) sẽ được thêm vào đây...
});