document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const response = await fetch("http://localhost:3003/user/login",  {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ email, password, userType:"ADMIN"}),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert(responseData.message);
        localStorage.setItem("token", responseData.token);
        window.location.href = "../../allclasses";
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  });
