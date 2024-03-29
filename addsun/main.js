document
  .getElementById("SetStudentInClass")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const class_name = document.getElementById("class_name").value;
    const student_id = document.getElementById("student_id").value;

    try {
      const response = await fetch(
        "http://localhost:3003/admin/setStudentClass",
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            class_name,
            student_id,
          }),
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        if (responseData && responseData.message) {
          alert("تم اضافة الطالب");
          // Optionally, you can handle success, e.g., redirect to another page
          window.location.href = "../allclasses";
        } else {
          alert("تم اضافة الطالب");
          window.location.href = "../allclasses";
        }
      } else {
        alert(
          responseData && responseData.message
            ? responseData.message
            : "Failed to add student"
        );
      }
      window.location.href = "../allclasses";

    } catch (error) {
      console.error("Adding student failed:", error);
    }
  });

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
    confirmButtonText: "Start",
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
    allowOutsideClick: () => !Swal.isLoading(),
  });

  if (!url.isConfirmed) {
    return;
  }

  const spreadsheetId = url.value;
  const exportURL = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;

  try {
    Swal.showLoading();

    const response = await fetch(exportURL);
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
          title: "Good job!",
          text: "You clicked the button!",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to add one or more students.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Adding students failed:", error);
    } finally {
      Swal.hideLoading();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

