var parentLat, parentLon; 
      
function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; 
    var dLat = deg2rad(lat2-lat1);  
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    return d * 1000; 
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setParentLocation);
    } else { 
        document.getElementById("message").innerText = "Geolocation is not supported by this browser.";
    }
}

function setParentLocation(position) {
  parentLat = position.coords.latitude;
  parentLon = position.coords.longitude;
}

async function callChild() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function (position) {
          const childLat = 24.7135;
          const childLon = 46.6751;

          if (!parentLat || !parentLon) {
              alert("الرجاء تحديد مكان الأب أولاً. سيتم حساب المسافة بدون تحديد الموقع الحالي.");
              return;
          }

          const distance = getDistance(parentLat, parentLon, childLat, childLon);
          console.log(parentLat, parentLat);

          if (distance >= 500000) {
            console.log(distance);
            Swal.fire({
                icon: "info",
                title: "تنبيه",
                text: "أنت خارج النطاق المسموح لنداء الابن.",
            });
            return; // Stop further execution
        }
      }, function (error) {
        Swal.fire({
          icon: "error",
          title: "حدث خطاء",
          text: "يرجوا التحقق من الموقع الخاص بك!",
        });
          console.error("Error getting location:", error);
          document.getElementById("message").innerText = "Failed to get location.";
      });
  } else {
      document.getElementById("message").innerText = "Geolocation is not supported by this browser.";
  }
}


async function displayEvents() {
  try {
    const response = await fetch(`http://localhost:3003/father/getSonsByFather`, {
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
          <button class="gouot" data-son-id="${son.id}" onclick="callChild()" >انا جاهز لإستلام ابني</button>
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
  getLocation();
  displayEvents();
});
