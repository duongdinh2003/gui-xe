document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("vehicleForm");
  const vehicleDataDiv = document.getElementById("vehicleData");

  // Kiểm tra và lấy dữ liệu đã lưu từ localStorage
  let vehicleData = JSON.parse(localStorage.getItem("vehicleData")) || [];

  // Hiển thị dữ liệu đã lưu
  function displayVehicleData() {
    vehicleDataDiv.innerHTML = "";
    vehicleData.forEach((item, index) => {
      const vehicleInfo = document.createElement("div");
      vehicleInfo.classList.add("vehicle-info");
      vehicleInfo.innerHTML = `
                <div>
                    <strong>Biển số xe:</strong> ${item.licensePlate}<br>
                    <strong>Mã số gửi xe:</strong> ${item.vehicleId}<br>
                    <strong>Thời gian lấy xe:</strong> ${item.time}<br>
                </div>
                <div class="export-container">
                    <button onclick="deleteVehicleData(${index})">Xóa</button>
                </div>
            `;
      vehicleDataDiv.appendChild(vehicleInfo);
    });
  }

  // Lưu thông tin xe
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const licensePlate = document.getElementById("licensePlate").value;
    const vehicleId = document.getElementById("vehicleId").value;
    const time = document.getElementById("time").value;

    const vehicle = {
      licensePlate,
      vehicleId,
      time,
    };

    vehicleData.push(vehicle);
    localStorage.setItem("vehicleData", JSON.stringify(vehicleData));
    form.reset(); // Xóa form sau khi lưu
    displayVehicleData(); // Cập nhật hiển thị thông tin
  });

  // Xóa thông tin xe
  window.deleteVehicleData = function (index) {
    vehicleData.splice(index, 1);
    localStorage.setItem("vehicleData", JSON.stringify(vehicleData));
    displayVehicleData(); // Cập nhật hiển thị thông tin
  };

  // Hiển thị dữ liệu ngay khi tải trang
  displayVehicleData();
});

document.getElementById("exportExcel").addEventListener("click", function () {
  const vehicleData = JSON.parse(localStorage.getItem("vehicleData")) || [];

  if (vehicleData.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  // Chuyển đổi dữ liệu thành định dạng bảng cho Excel
  const worksheetData = vehicleData.map((item, index) => ({
    STT: index + 1,
    "Biển số xe": item.licensePlate,
    "Mã số gửi xe": item.vehicleId,
    "Thời gian lấy xe": item.time,
  }));

  // Tạo workbook và worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(worksheetData);

  // Tính toán độ rộng cột dựa trên độ dài dữ liệu
  const columnWidths = [
    {
      wch: Math.max(
        4,
        ...worksheetData.map((row) => row["STT"].toString().length)
      ),
    }, // STT
    {
      wch: Math.max(
        10,
        ...worksheetData.map((row) => row["Biển số xe"].length)
      ),
    }, // Biển số xe
    {
      wch: Math.max(
        12,
        ...worksheetData.map((row) => row["Mã số gửi xe"].length)
      ),
    }, // Mã số gửi xe
    {
      wch: Math.max(
        20,
        ...worksheetData.map((row) => row["Thời gian lấy xe"].length)
      ),
    }, // Thời gian lấy xe
  ];

  ws["!cols"] = columnWidths;

  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(wb, ws, "Danh sách gửi xe");

  // Xuất file Excel
  XLSX.writeFile(wb, "DanhSachGuiXe.xlsx");
});
