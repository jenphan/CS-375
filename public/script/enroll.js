function showInputBox() {
  document.getElementById("addCourse").style.display = "block";
}

document.getElementById("enrollSubmit").addEventListener("click", () => {
    let courseCode = document.getElementById("courseCode").value.trim();
    console.log(courseCode);
    if(!courseCode){
        alert("No code entered");
        return false;
    }
        
    fetch("/course/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({code: courseCode}),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || "Network response was not ok");
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
          alert("Enrolled successfully!");
          window.location.href = "./student.html";
        }).catch((error) => {
            console.error("Error:", error);
            alert(`Course creation failed: ${error.message}`);
        });

});