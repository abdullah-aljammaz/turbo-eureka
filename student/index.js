async function displayEvents() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("class_name");
  try {
    const response = await fetch(`http://localhost:3003/class/getClassByName?class_name=${eventId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const $classs = await response.json();

    todoList.innerHTML = "";
    $classs.forEach(($class) => {
      let students = $class.students;
      students.forEach(async (student) => {
        const getfatherById = await fetch(`http://localhost:3003/teacher/getfatherById/${student.father_id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const fathers = await getfatherById.json();
        const $classCard = document.createElement("div");
        $classCard.className = "card";
        $classCard.innerHTML = `
          <h3>الاسم:${student.firstname} ${student.lastname}</h3>
          <h3>العمر: ${new Date().getFullYear() - student.yearofbirth}</h3>
          <h3>اسم ولي الأمر: ${fathers.firstname} ${fathers.lastname}</h3>
          <h3>رقم الجوال: ${fathers.phonenumber}</h3>
        `;

        todoList.appendChild($classCard);
      });
    });
  } catch (error) {
    console.error("Error fetching $classs", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayEvents();
});