// Lấy tham chiếu đến ô input và danh sách task
const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

/**
 * Hàm thêm task mới vào danh sách
 */
function addTask() {
    // Lấy giá trị nhập trong ô input và loại bỏ khoảng trắng đầu cuối
    const taskText = inputBox.value.trim();

    // Nếu không nhập gì, báo lỗi và dừng hàm
    if (taskText === '') {
        alert("You must write something!");
        return; // Dừng hàm không thêm task rỗng
    }

    // Tạo phần tử li mới đại diện cho task
    const li = document.createElement("li");

    // Lấy thời gian hiện tại dưới dạng chuỗi (ví dụ: "6/1/2025, 10:30:00 AM")
    const now = new Date();
    const timeStr = now.toLocaleString();

    // Đặt nội dung HTML cho li:
    // - Icon dấu check (xanh lá)
    // - Nội dung task
    // - Dòng thời gian với icon đồng hồ nhỏ
    // - Dấu "×" để xóa task
    li.innerHTML = `
        <i class="fas fa-check-circle" style="color: green; margin-right: 8px;"></i>
        ${taskText}
        <br>
        <small style="color: gray; font-size: 12px;">
            <i class="fas fa-clock"></i> ${timeStr}
        </small>
        <span>\u00d7</span>
    `;

    // Thêm li mới vào cuối danh sách task
    listContainer.appendChild(li);

    // Xóa nội dung trong ô input sau khi thêm task
    inputBox.value = "";

    // Lưu trạng thái danh sách vào localStorage
    saveData();
}

/**
 * Bắt sự kiện click trên toàn bộ danh sách task
 * - Nếu click vào dấu × (span), sẽ xóa task tương ứng
 * - Nếu click vào task (trừ icon check, đồng hồ), toggle trạng thái checked (đã làm)
 */
listContainer.addEventListener("click", function(e) {
    // Nếu click vào dấu × (thẻ span)
    if (e.target.tagName === "SPAN") {
        // Xóa task cha (li chứa span)
        e.target.parentElement.remove();

        // Cập nhật lại dữ liệu lưu trữ
        saveData();

        // Dừng hàm để tránh xử lý tiếp toggle checked
        return;
    }

    // Tìm phần tử li gần nhất chứa phần tử được click
    const li = e.target.closest("li");

    // Nếu không tìm thấy li (click ở vùng ngoài task), không làm gì
    if (!li) return;

    // Nếu click vào icon check hoặc icon đồng hồ thì không toggle checked
    // Vì những icon này không phải phần thân task muốn toggle
    if (e.target.classList.contains('fa-check-circle') || e.target.classList.contains('fa-clock')) {
        return;
    }

    // Nếu click vào phần text task (hoặc vùng khác thuộc li), toggle trạng thái checked
    li.classList.toggle("checked");

    // Lưu trạng thái mới
    saveData();
});

/**
 * Lưu nội dung hiện tại của danh sách task vào localStorage
 * Dữ liệu được lưu ở dạng HTML string (innerHTML)
 */
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

/**
 * Hiển thị lại danh sách task khi trang được tải lại
 * Lấy dữ liệu từ localStorage nếu có
 */
function showTask() {
    const savedData = localStorage.getItem("data");

    if (savedData) {
        listContainer.innerHTML = savedData;
    }
}

/**
 * Xóa toàn bộ danh sách task
 * Có cảnh báo xác nhận trước khi xóa
 */
function clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        // Xóa tất cả nội dung trong list container
        listContainer.innerHTML = "";

        // Cập nhật dữ liệu lưu trữ (rỗng)
        saveData();
    }
}

// Bắt sự kiện nhấn phím Enter trong ô input để gọi hàm addTask()
inputBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Khi trang load xong, hiển thị lại danh sách task đã lưu
showTask();
