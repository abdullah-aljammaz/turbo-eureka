document.getElementById("createClass").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission

  const className = document.getElementById("class_name").value;
  const teacherId = document.getElementById("teacher_id").value;
  console.log(className);
  console.log(teacherId);
  try {
    const response = await fetch("http://localhost:3003/admin/createClass", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        className,
        teacherId
      }),
    });
    
    const responseData = await response.json();
    if (response.ok) {
      alert("تم انشاء المعسكر");
      window.location.href = "../allclasses";
      
      // Optionally, you can handle success, e.g., redirect to another page
    } else {
      alert("تم انشاء المعسكر");
    }
  } catch (error) {
    console.error("Adding son failed:", error);
  }
});
