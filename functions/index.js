exports.getHint = functions.https.onCall((data, context) => {
  try {
    const rowNum = parseInt(data.rowNum, 10);
    const hintNum = parseInt(data.hintNum, 10);

    // puzzleData và KEY_WORD_ANSWER đã có sẵn ở đầu file này
    const rowData = puzzleData.find((r) => r.row === rowNum);

    if (!rowData) {
      // Nếu client gửi một số hàng không tồn tại
      throw new functions.https.HttpsError("not-found", "Row not found.");
    }

    let hintText = "";
    if (hintNum === 1 && rowData.hint1) {
      hintText = rowData.hint1;
    } else if (hintNum === 2 && rowData.hint2) {
      hintText = rowData.hint2;
    } else {
      // Client xin hint số 3 hoặc hint không tồn tại
      throw new functions.https.HttpsError("invalid-argument", "Invalid hint number.");
    }

    // Trả về CHỈ text của hint đó
    return { hintText: hintText };

  } catch (error) {
    console.error("Lỗi khi getHint:", error);
    throw new functions.https.HttpsError("internal", "Server error.");
  }
});