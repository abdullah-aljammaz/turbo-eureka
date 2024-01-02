import jwt_decode from 'jwt-decode';

document.getElementById("SetStudentInClass").addEventListener("submit", async function (event) {
  event.preventDefault();

  const class_name = document.getElementById("class_name").value;
  const student_id = document.getElementById("student_id").value;

  try {
    const response = await fetch("http://localhost:3003/admin/setStudentClass", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_name,
        student_id
      }),
    });
    const responseData = await response.json();
    if (response.ok) {
      if (responseData && responseData.message) {
        alert(responseData.message);
        // Optionally, you can handle success, e.g., redirect to another page
      } else {
        alert("Student added successfully");
      }
    } else {
      alert(responseData && responseData.message ? responseData.message : "Failed to add student");
    }
    window.location.reload()
  } catch (error) {
    console.error("Adding student failed:", error);
  }
});
