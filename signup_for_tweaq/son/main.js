document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission

  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const year = document.getElementById("yearofbirth").value;
  let yearofbirth = Number(year)
  try {
    const response = await fetch("http://localhost:3003/son/addSon", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        yearofbirth,
      }),
    });
    
    const responseData = await response.json();
    if (response.ok) {
      alert(responseData.message);
      window.location.href = "../../main";
      
      // Optionally, you can handle success, e.g., redirect to another page
    } else {
      alert(responseData.message);
    }
  } catch (error) {
    console.error("Adding son failed:", error);
  }
});
