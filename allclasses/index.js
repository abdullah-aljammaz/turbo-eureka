async function displayEvents() {
  try {
    const response = await fetch(`http://localhost:3003/admin/getAllClasses`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const $classs = await response.json();

    todoList.innerHTML = "";
    $classs.forEach(async ($class) => {
      const students = await fetch(`http://localhost:3003/class/getAllStudentByClassName/${$class.name}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const allStudents = await students.json();


      const teachersResponse = await fetch(`http://localhost:3003/class/getAllTeacherByClassName/${$class.name}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const allTeachers = await teachersResponse.json();
      let teacher_fname = allTeachers[0].firstname
      let teacher_lname = allTeachers[0].lastname
      
      const $classCard = document.createElement("div");
      $classCard.className = "card";
      $classCard.innerHTML = `

      <h3>اسم المدرب: ${teacher_fname} ${teacher_lname}</h3>
      <h3>المعسكر: ${$class.name}</h3>
      <h3 >عدد الطلاب: ${allStudents.numberOfStudents} </h3>
    <div class="butten"> <a href="/student/index.html?class_name=${$class.name}"> <button class="tfasel">تفاصيل المعسكر</button> </a>
  </div>
      
      `;

      todoList.appendChild($classCard);
    });
  } catch (error) {
    console.error("Error fetching $classs", error);
  }
}

todoList.addEventListener("click", async function (event) {
  const clickedElement = event.target;

  if (clickedElement.classList.contains("gouot")) {
      const sonId = clickedElement.dataset.sonId;

      // Check if the parent's location is available
      if (!parentLat || !parentLon) {
          return;
      }

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
              const response = await fetch(
                  `http://localhost:3003/son/call/${sonId}`,
                  {
                      method: "POST",
                      headers: {
                          Authorization: "Bearer " + localStorage.getItem("token"),
                      },
                  }
              );

              if (response.ok) {
                  Swal.fire({
                      title: "تم الاستدعاء!",
                      text: "سيتم ارسال ابنك اليك في اسرع وقت",
                      icon: "success",
                  });
              } else {
                  Swal.fire({
                      title: "خطاء في الاستدعاء",
                      text: "يبدو انك قمت باستدعاء ابنك سابقا يجب الانتظار 5 دقائق",
                      icon: "error",
                  });
              }
          } catch (error) {
              console.error("Error calling son", error);
              Swal.fire({
                  title: "Error!",
                  text: "Failed to call your son. Please try again.",
                  icon: "error",
              });
          }
      }
  }
});
document.addEventListener("DOMContentLoaded", function () {
  displayEvents();
});
