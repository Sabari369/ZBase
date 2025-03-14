window.onload = async function() {
	if (window.location.pathname.endsWith("insert.html")) {
		window.location.href = "dashboard.html"; // Redirect if already logged in
	}
};

txtFormat = ["STRING", "CHAR"];

console.log("dhiewnceugu");

// Function to generate input fields dynamically
function generateInputFields(recordCount) {
	return columnData
		.map((col) => {
			let inputField = "";
			if (col.dataType === "BOOL") {
				let isNullable = true;

				console.log(col.constraints);

				for (const con of col.constraints || []) {
					if (con.type === "PK" || con.type === "NN") {
						console.log(con.type);
						isNullable = false;
						break;
					}
				}

				inputField = `
			<select name="${col.name.toLowerCase()}[]" required>
			  <option value="true">true</option>
			  <option value="false">false</option>
			</select>
		  `;
			} else if (col.dataType === "BLOB") {
				inputField = `<input type="file" name="${col.name.toLowerCase()}[]">`;
			} else if (col.dataType === "STRING") {
				inputField = `<input type="text" name="${col.name.toLowerCase()}[]" required>`;
			} else if (col.dataType === "CHAR") {
				inputField = `<input type="text" maxlength="1" name="${col.name.toLowerCase()}[]" required>`;
			} else if (col.dataType === "FLOAT") {
				inputField = `<input type="text" name="${col.name.toLowerCase()}[]" required 
		    oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/^(\d*\\.\\d*)\\./g, '$1')">`;
			}
			else if (col.dataType === "INT") {
				inputField = `<input type="text" name="${col.name.toLowerCase()}[]" required oninput="this.value = this.value.replace(/\\D/g, '')">`;
			} else {
				inputField = `<input type="number" name="${col.name.toLowerCase()}[]" required>`;
			}

			return `
			<div class="input-row">
			  <div class="column-name">${col.name}</div>
			  <div class="input-field">${inputField}</div>
			</div>
		  `;
		})
		.join("");
}

// Function to add a new record
// document.getElementById("add-row-button").addEventListener("click", addRow);

function addRow() {
	const container = document.getElementById("records-container");
	const recordCount =
		container.getElementsByClassName("record-container").length + 1;

	const newRecord = document.createElement("div");
	newRecord.className = "record-container";
	newRecord.innerHTML = `
        <div class="record-header">
            <span class="record-title">Record #${recordCount}</span>
        </div>
        <div class="record-body">
            ${generateInputFields(recordCount)}
        </div>
    `;

	container.appendChild(newRecord);
}

// Remove record when remove button is clicked
document.addEventListener("click", function(e) {
	if (e.target && e.target.classList.contains("remove-button")) {
		e.target.closest(".record-container").remove();

		// Update record numbers
		const containers = document.getElementsByClassName("record-container");
		for (let i = 0; i < containers.length; i++) {
			containers[i].querySelector(".record-title").textContent = `Record #${i + 1
				}`;
		}
	}
});

// File input label update
document.addEventListener("change", function(e) {
	if (e.target && e.target.classList.contains("file-input")) {
		const fileName =
			e.target.files.length > 0 ? e.target.files[0].name : "Choose file...";
		e.target.nextElementSibling.textContent = fileName;
	}
});

// Form submission
document.getElementById("insertForm").addEventListener("submit", function(e) {
	e.preventDefault();

	const formData = new FormData(this);

	console.log(
		`Inserting ${formData.getAll(columnData[0].name.toLowerCase() + "[]").length
		} records:`
	);

	for (
		let i = 0;
		i < formData.getAll(columnData[0].name.toLowerCase() + "[]").length;
		i++
	) {
		let values = columnData.map((col) => {
			let fieldName = col.name.toLowerCase() + "[]";
			let value = formData.getAll(fieldName)[i];
			return col.dataType === "file" ? value.name || "No file" : value;
		});

		console.log(
			`INSERT INTO records (${columnData
				.map((c) => c.name)
				.join(", ")}) VALUES ('${values.join("', '")}')`
		);
	}

	alert("Records inserted successfully!");
});

// document.getElementById("add-row-button").click();
// addRow();
console.log("Vanakkam da mapla 123....");

function convertToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = function() {
			const base64String = reader.result.split(",")[1]; // Extract Base64 part
			resolve(base64String);
		};

		reader.onerror = function() {
			reject(new Error("Error reading file"));
		};

		reader.readAsDataURL(file); // Read file as Data URL
	});
}

async function insert() {
	console.log(document.querySelectorAll(".input-row"));
	let insertObject = {};
	let promises = [];

	document.querySelectorAll(".input-row").forEach((el) => {
		let colName = el.querySelector(".column-name").textContent.trim(); // Get column name
		let input = el.getElementsByTagName("input")[0];

		if (input.value.trim() == "") {
			insertObject[colName] = "NONE";
		} else if (input.type === "file" && input.files.length > 0) {
			// Push the promise to the array

			let filePromise = convertToBase64(input.files[0]).then((base64String) => {
				insertObject[colName] = base64String;
			});
			promises.push(filePromise);
		} else {
			insertObject[colName] = input.value;
		}
	});

	// Wait for all Base64 conversions to complete before logging
	await Promise.all(promises);
	let obj = {
		dbName: currentDatabase,
		tableName: currentTable
	}
	obj.values = insertObject
	console.log(insertObject);
	insertFetch(obj);
}

function clearInputs() {
	console.log("clearInputs");
	let allInputs = document
		.querySelector(".record-body")
		.getElementsByTagName("input");
	if (allInputs.length > 0) {
		for (const input of allInputs) {
			input.value = "";
		}
	}
}
