document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("extractDataButton").addEventListener("click", function () {
    extractData();
  });
});

function extractSpreadsheetId(url) {
  const regex = /\/d\/([^/]+)\//;
  const match = url.match(regex);
  return match ? match[1] : null;
}


async function extractData() {
  const url = await Swal.fire({
    title: "Enter Google Sheet URL",
    input: "text",
    icon: "question",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "send",
    confirmButtonColor: "#3085d6",
    preConfirm: (url) => {
      const spreadsheetId = extractSpreadsheetId(url);
      if (!spreadsheetId) {
        Swal.fire({
          title: "Invalid URL",
          text: "The provided Google Sheet URL is not in the correct format. Please enter a valid URL.",
          icon: "error",
        });
        return false;
      }
      return spreadsheetId;
    },
    allowOutsideClick: false,
  });

  if (!url.isConfirmed) {
    return;
  }

  const customOverlay = createCustomOverlay(); // Create a custom overlay with a spinner
  document.body.appendChild(customOverlay);

  const spreadsheetId = url.value;
  const exportURL = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;

  try {
    const response = await fetch(exportURL);

    if (response.status === 400 || response.status === 401 || response.status === 402 || response.status === 403) {
      Swal.fire({
        title: "Invalid URL",
        text: "The provided Google Sheet URL is not in the correct format. Please enter a valid URL.",
        icon: "error",
      });
      return false;
    }

    const data = await response.blob();
    const buf = new Uint8Array(await new Response(data).arrayBuffer());

    const workbook = XLSX.read(buf, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const studentsData = jsonData.map((rows) => ({
        student_id: rows.student_id,
        class_name: rows.class_name,
    }));

    try {
      const responses = await Promise.all(
        studentsData.map((student) =>
          fetch("http://localhost:3003/admin/setStudentClass", {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(student),
          })
        
          )
      );

      const allStudentsSuccess = responses.every((response) => response.ok);

      if (allStudentsSuccess) {
        Swal.fire({
          title: "Success!",
          text: "All students have been successfully added.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to add one or more students. Please check the data and try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Adding students failed:", error);
    } finally {
      customOverlay.remove();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    customOverlay.remove();
  }
}

function createCustomOverlay() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";

  const spinner = document.createElement("div");
  spinner.style.border = "16px solid #f3f3f3";
  spinner.style.borderRadius = "50%";
  spinner.style.borderTop = "16px solid #3498db";
  spinner.style.width = "120px";
  spinner.style.height = "120px";
  spinner.style.position = "absolute";
  spinner.style.top = "50%";
  spinner.style.left = "50%";
  spinner.style.transform = "translate(-50%, -50%)";
  spinner.style.animation = "spin 2s linear infinite"; // Apply spinning animation

  overlay.appendChild(spinner);
  return overlay;
}
