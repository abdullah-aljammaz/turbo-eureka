async function displayEvents() {
  try {
    const response = await fetch(`http://localhost:3003/teacher/getMyCallouts`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const callouts = await response.json();
    todoList.innerHTML = "";
    callouts.forEach(async (callout) => {
      const father = await fetch(
        `http://localhost:3003/fahter/getById/${callout.father_id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
      const fathers = await father.json();
      const student = await fetch(
        `http://localhost:3003/son/getById/${callout.son_id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
      const students = await student.json();
      const calloutCard = document.createElement("div");
      calloutCard.className = "card";
      calloutCard.innerHTML = `
      <h3>اسم الطالب: ${students.firstname} ${students.lastname}</h3>
      <h3>ولي الامر:${fathers.firstname} ${fathers.lastname}</h3>
      <h3>رقم الجوال:${fathers.phonenumber}</h3>
      <button class="gouot" id="butten" data-call-id="${callout.id}">   سماح</button>
      `;

      todoList.appendChild(calloutCard);
    });
  } catch (error) {
    console.error("Error fetching sons", error);
  }
}

todoList.addEventListener("click", async function (event) {
  const clickedElement = event.target;

  if (clickedElement.classList.contains("gouot")) {
    const callId = clickedElement.dataset.callId;

    const result = await Swal.fire({
      title: "هل انت متاكد من اخراج الطلاب؟",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#218838",
      cancelButtonColor: "#d33",
      cancelButtonText: "الغاء",
      confirmButtonText: "نعم",

    });


    if (result.isConfirmed) {
      try {

        const response = await fetch(`http://localhost:3003/sendout/${callId}`, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });


        if (response.ok) {
          Swal.fire({
            title: "تم ارسال الطالب!",
            // text: "سيتم ارسال ابنك اليك في اسرع وقت",
            icon: "success"
          });
        } else {
          Swal.fire({
            title: "خطاء في الارسال",
            // text: "يبدو انك قمت باستدعاء ابنك سابقا",
            icon: "error"
          });
        }
      } catch (error) {
        console.error("Error calling son", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to call your son. Please try again.",
          icon: "error"
        });
      }
    }
  }
});