
function handleSubmit(event) {
	event.preventDefault();
	handleLogin();
}

document.addEventListener("DOMContentLoaded", function() {
	document.querySelector(".submit-btn").addEventListener("click", async function(event) {
		event.preventDefault();

		let usernameInput = document.getElementById("email"); // Correct field ID
		let passwordInput = document.getElementById("password");

		if (!usernameInput || !passwordInput) {
			console.error("Username or password input field not found!");
			/*alert("Username or password field is missing.");*/
			return;
		}

		let userData = {
			email: usernameInput.value.trim(), // Match with Java Servlet
			password: passwordInput.value.trim()
		};

		console.log("Sending request data:", JSON.stringify(userData)); // Debugging log

		try {
			const response = await fetch("http://localhost:8080/Database/LoginServlet", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include", // Important: Allows cookies to be sent
				body: JSON.stringify(userData),
			});

			const text = await response.text(); // Get raw response text

			try {
				const responseData = JSON.parse(text); // Try parsing JSON
				if (response.ok) {
					/*alert("Signup Successful! Redirecting...");*/
					window.location.href = "dashboard.html";
				} else {
					/*alert(`Sign Up failed: ${responseData.error || "Unknown error"}`);*/
				}
			} catch (jsonError) {
				console.error("Unexpected response:", text);
				/*alert("Server error. Please check logs.");*/
			}

		} catch (error) {
			console.error("Error:", error);
			/*alert("Network error. Check your connection.");*/
		}
	});
});




function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showValidationErrors(email, password) {
	const emailGroup = document.getElementById("email").parentNode;
	const passwordGroup = document.getElementById("password").parentNode;

	if (!isValidEmail(email)) {
		emailGroup.classList.add("error");
	} else {
		emailGroup.classList.remove("error");
	}

	if (password.length < 6) {
		passwordGroup.classList.add("error");
	} else {
		passwordGroup.classList.remove("error");
	}

}


document.getElementById("loginForm").addEventListener("submit", handleSubmit);

window.onload = function () {
    fetch("http://localhost:8080/Database/CheckAuthServlet", {
        method: "GET",
        credentials: "include", // 🔥 Sends cookies to check authentication
    })
    .then(response => response.json())
    .then(data => {
        if (data.authenticated && window.location.pathname.endsWith("Login.html")) {
            window.location.href = "dashboard.html"; // Redirect if already logged in
        }
    })
    .catch(error => console.error("Auth check failed:", error));
};




