# 🧩 Trò chơi Ô Chữ (Crossword Puzzle Game)

Đây là một dự án game ô chữ trên nền tảng web, được xây dựng trong khuôn khổ chương trình OJT (On-the-Job Training) tại JSClub, Đại học FPT.

Trò chơi không chỉ có giao diện tương tác mà còn được xây dựng với kiến trúc **backend-first**, sử dụng Firebase Cloud Functions để đảm bảo tính bảo mật tuyệt đối cho đáp án và gợi ý.

![Giao diện trò chơi](logo.png)
_(Bạn nên thay thế `logo.png` bằng một ảnh chụp màn hình thực tế của trò chơi)_

## 🔥 Các tính năng chính

- **Lưới ô chữ động:** Giao diện được render hoàn toàn bằng JavaScript.
- **Hệ thống tính điểm:**
  - Bắt đầu với **10 điểm**.
  - **+10 điểm** cho mỗi hàng ngang giải đúng.
  - **-4 điểm** khi dùng Gợi ý 1 (Hint 1).
  - **-6 điểm** khi dùng Gợi ý 2 (Hint 2).
  - **-10 điểm** khi "chốt" Key Word sai.
- **Đồng hồ đếm ngược:** Người chơi có 15 phút để hoàn thành.
- **Lưu tiến trình:** Tự động lưu điểm số, các hàng đã giải, và thời gian còn lại vào `localStorage`. Người chơi có thể tải lại trang mà không mất bài.
- **Hệ thống Key Word:** Giải các hàng ngang sẽ hé lộ các chữ cái lộn xộn cho một Key Word cuối cùng.
- **Giao tiếp Bàn phím:** Hỗ trợ di chuyển mượt mà bằng phím mũi tên, tự động nhảy ô, và xóa lùi (backspace).
- **Bảo mật tuyệt đối:** Toàn bộ đáp án và gợi ý được giấu trên server.
- **Bảng xếp hạng:** Tự động lưu tên đội và điểm số cuối cùng lên Firebase Firestore.

---

## 🚀 Cấu trúc Công nghệ (Tech Stack)

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend & Database:** Firebase
  - **Firebase Cloud Functions:** Nơi lưu trữ và xử lý logic kiểm tra đáp án/gợi ý một cách bí mật.
  - **Firebase Firestore:** Cơ sở dữ liệu NoSQL để lưu trữ bảng xếp hạng (tên đội, điểm số).
  - **Firestore Security Rules:** Cấu hình để chống gian lận (chỉ cho phép `create`, không cho phép `read` hay `update`).

---

## 🔒 Kiến trúc Bảo mật (Security Architecture)

Đây là điểm đặc biệt nhất của dự án. Để ngăn chặn người chơi xem đáp án bằng Developer Tools (F12), dự án áp dụng mô hình client-server:

1.  **Client (script.js):**

    - **Không** lưu trữ bất kỳ đáp án hay gợi ý nào.
    - File `script.js` chỉ chứa câu hỏi (clues) và độ dài của từ (`answerLength`) để vẽ lưới.
    - Khi người chơi nhấn "Check" hoặc "Hint", client sẽ gửi một yêu cầu (ví dụ: `{ row: 1, guess: 'ABC' }`) lên Cloud Function.

2.  **Server (Firebase Cloud Functions - `functions/index.js`):**

    - Lưu trữ an toàn toàn bộ `puzzleData` (chứa đáp án) và `KEY_WORD_ANSWER`.
    - **`checkAnswer` (Function):** Nhận yêu cầu từ client, tự kiểm tra đáp án và _chỉ_ trả về `{ correct: true }` hoặc `{ correct: false }`.
    - **`getHint` (Function):** Nhận yêu cầu xin gợi ý, và _chỉ_ trả về nội dung của gợi ý đó.
    - **`checkKeyword` (Function):** Nhận và kiểm tra Key Word.

3.  **Database (Firestore Rules):**
    - Quy tắc bảo mật được thiết lập để người dùng chỉ có thể **ghi** (create) điểm của mình lên bảng xếp hạng, không ai có thể **đọc** (read) hay **xóa** (delete) dữ liệu của người khác.

=> Bằng cách này, đáp án không bao giờ rời khỏi máy chủ, đảm bảo tính công bằng 100%.

---

## 📦 Cài đặt & Chạy dự án

### Yêu cầu

- [Node.js](https://nodejs.org/) (phiên bản 16 trở lên)
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`

### Các bước cài đặt

1.  **Clone Repository:**

    ```sh
    git clone [https://github.com/Cahoii/crossword-puzzle-game.git](https://github.com/Cahoii/crossword-puzzle-game.git)
    cd crossword-puzzle-game
    ```

2.  **Thiết lập Firebase:**

    - Tạo một dự án mới trên [Firebase Console](https://console.firebase.google.com/).
    - Nâng cấp dự án lên gói **Blaze (Pay-as-you-go)**. (Bắt buộc để dùng Cloud Functions, nhưng bạn sẽ không tốn phí với hạn mức miễn phí khổng lồ).
    - Trong dự án, kích hoạt **Firestore Database** và **Functions**.
    - Lấy `firebaseConfig` (một đối tượng JavaScript) từ cài đặt dự án của bạn và dán vào file `index.html` (thay thế cho `firebaseConfig` mẫu).
    - Dán nội dung file `firestore.rules` (trong repo) vào tab "Rules" của Firestore trên console.

3.  **Cài đặt Cloud Functions:**

    - Đi vào thư mục `functions`:
      ```sh
      cd functions
      npm install
      cd ..
      ```

4.  **Deploy dự án:**

    - Đăng nhập Firebase: `firebase login`
    - Deploy Cloud Functions (nơi giấu đáp án):
      ```sh
      firebase deploy --only "functions"
      ```
    - (Tùy chọn) Deploy trang web lên Firebase Hosting:
      ```sh
      firebase deploy --only "hosting"
      ```

5.  **Chạy dự án:**
    - Nếu bạn deploy hosting, hãy truy cập đường link mà Firebase cung cấp.
    - Hoặc, bạn có thể mở file `index.html` trực tiếp trên trình duyệt của mình.

---

## 👨‍💻 Tác giả

- **Phát triển bởi:** [Tên của bạn]
- **GitHub:** [Link GitHub của bạn]
- **Dự án OJT tại:** FPT University - JSClub
