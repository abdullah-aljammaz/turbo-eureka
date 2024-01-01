
async function displayEvents() {
  try {
    const response = await fetch(`http://localhost:3003/getSonsByFather`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const sons = await response.json();

    todoList.innerHTML = "";
    sons.forEach((son) => {
      const sonCard = document.createElement("div");
      sonCard.className = "card";
      sonCard.innerHTML = `
        <h3>الاسم:${son.firstname} ${son.lastname}</h3>
        <h3>العمر:${new Date().getFullYear() - son.yearofbirth}</h3>
        ${son.class_name !== null ? `<h3>المعسكر:${son.class_name}</h3>` : ''}
        <div class="butten" ${son.class_id === null ? 'style="display: none;"' : ''}>
          <button class="tfasel">تفاصيل المعسكر</button>
          <button class="gouot" data-son-id="${son.id}">انا جاهز لإستلام ابني</button>
        </div>
      `;

      todoList.appendChild(sonCard);
    });
  } catch (error) {
    console.error("Error fetching sons", error);
  }
}

todoList.addEventListener("click", async function (event) {
  const clickedElement = event.target;

  if (clickedElement.classList.contains("gouot")) {
    const sonId = clickedElement.dataset.sonId;

    const result = await Swal.fire({
      title: "هل متاكد من استدعاء ابنك؟",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#218838",
      cancelButtonColor: "#d33",
      cancelButtonText: "الغاء",
      confirmButtonText: "نعم",

    });


    if (result.isConfirmed) {
      try {

        const response = await fetch(`http://localhost:3003/callMySon/${sonId}`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });


        if (response.ok) {
          Swal.fire({
            title: "تم الاستدعاء!",
            text: "سيتم ارسال ابنك اليك في اسرع وقت",
            icon: "success"
          });
        } else {
          Swal.fire({
            title: "خطاء في الاستدعاء",
            text: "يبدو انك قمت باستدعاء ابنك سابقا",
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