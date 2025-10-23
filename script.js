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
    // 1. Tạo hàng Header (Tạo mới, 1, 2, 3...)
    // Ô "Tạo mới"
    let headerCell = document.createElement('div');
    headerCell.className = 'grid-cell header';
    gridContainer.appendChild(headerCell);

    // Các ô số từ 1 đến 17
    for (let i = 1; i <= GRID_COLS; i++) {
        let cell = document.createElement('div');
        cell.className = 'grid-cell header';
        cell.textContent = i;
        gridContainer.appendChild(cell);
    }

    // 2. Tạo các hàng ô chữ (7 hàng)
    puzzleData.forEach(rowData => {
        // Ô "-> 1", "-> 2"...
        let clueNumCell = document.createElement('div');
        clueNumCell.className = 'grid-cell clue-number';
        clueNumCell.innerHTML = `${rowData.row}`; 
        gridContainer.appendChild(clueNumCell);

        // Tạo 17 ô (hoặc là ô trống, hoặc là ô input)
        let charIndex = 0; // Để đếm vị trí chữ cái trong từ
        for (let col = 1; col <= GRID_COLS; col++) {
            let cell = document.createElement('div');
            
            // Tính toán xem từ này có bao nhiêu chữ cái
            const wordLength = rowData.answer.length;
            // Tính cột kết thúc
            const endCol = rowData.startCol + wordLength - 1;

            // Nếu cột 'col' nằm trong khoảng [startCol, endCol]
            if (col >= rowData.startCol && col <= endCol) {
                // Đây là ô nhập liệu
                let input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'char-input';
                // Đặt ID cho từng input để dễ dàng truy cập sau này
                // Ví dụ: "input-1-0" (hàng 1, chữ 0), "input-1-1" (hàng 1, chữ 1)
                input.id = `input-${rowData.row}-${charIndex}`; 
                
                // Nếu ô này là ô từ khóa dọc (cột 7)
                if (col === KEYWORD_COL) {
                    input.classList.add('keyword-char');
                }
                
                cell.className = 'grid-cell'; // Ô này chứa input
                cell.appendChild(input);
                charIndex++; // Tăng index của chữ cái
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
        hintText.textContent = rowData.hint; // Đặt nội dung hint sẵn
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