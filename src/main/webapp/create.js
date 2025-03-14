window.onload = async function() {
	if (window.location.pathname.endsWith("create.html")) {
		window.location.href = "dashboard.html"; // Redirect if already logged in
	}
};

document.getElementById("selectedDb").textContent += currentDatabase;

columnCounter = 0;
columnsArea = document.getElementById("columnsArea");
console.log(columnsArea);
console.log(databases);

//   const addColumnBtn = document.getElementById("addColumnBtn");
generateSqlBtn = document.getElementById("generateSqlBtn");
sqlPreview = document.getElementById("sqlPreview");
tableForm = document.getElementById("tableForm");

// Sample data types for dropdown
dataTypes = ["INT", "STRING", "CHAR", "BOOLEAN", "FLOAT", "BLOB"];

// Sample tables for foreign key references
sampleTables = ["users", "products", "categories", "orders", "customers"];

document.addEventListener("DOMContentLoaded", function() {
	console.log("kdomo");

	// Sample columns for foreign key references
	sampleColumns = {
		users: ["id", "username", "email"],
		products: ["id", "sku", "product_code"],
		categories: ["id", "category_code"],
		orders: ["id", "order_number"],
		customers: ["id", "customer_code"],
	};

	// Add column function

	// Remove column function
	window.removeCons = function(columnId) {
		const columnElement = document.getElementById(columnId);
		if (columnElement) {
			columnElement.remove();
		}
	};

	// Toggle default value section
	window.toggleDefaultSection = function(columnId) {
		const checkbox = document.getElementById(`${columnId}-default`);
		const section = document.getElementById(`${columnId}-default-section`);

		if (checkbox.checked) {
			section.style.display = "block";
		} else {
			section.style.display = "none";
		}
	};

	allTable = {
		col1: [1, 2],
		col2: [4, 5],
	};

	// Toggle foreign key section
	window.toggleFKSection = function(columnId) {
		const checkbox = document.getElementById(`${columnId}-fk`);
		const section = document.getElementById(`${columnId}-fk-section`);

		console.log("Hello ulla varthu");

		if (checkbox.checked) {
			section.style.display = "block";

			console.log(
				"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
			);

			//   section.getElementsByTagName("select")

			Object.keys(allTable).forEach((key) => {
				if (allTable[key].length > 0 && allTable[key][0] != null) {
					let opt = document.createElement("option");
					opt.text = allTable[key][0];
					opt.value = allTable[key][0];
					section.getElementsByTagName("select")[0].append(opt);
				}
			});
		} else {
			section.style.display = "none";
		}
	};

	// Update reference columns based on selected table
	window.updateDropColumn = function(columnId) {
		const refTable = document.getElementById(`${columnId}-ref-table`).value;
		const refColumnSelect = document.getElementById(`${columnId}-ref-column`);

		// Clear previous options
		refColumnSelect.innerHTML =
			'<option value="">Select reference column</option>';

		// Add new options based on selected table
		if (refTable && sampleColumns[refTable]) {
			sampleColumns[refTable].forEach((column) => {
				const option = document.createElement("option");
				option.value = column;
				option.textContent = column;
				refColumnSelect.appendChild(option);
			});
		}
	};

	// Generate SQL statement
	function generateSQL() {
		const tableName =
			document.getElementById("tableName").value || "table_name";
		let sql = `<span class="sql-keyword">CREATE TABLE</span> ${tableName} (\n`;

		const columns = document.querySelectorAll(".column-row");
		const columnDefinitions = [];
		const constraints = [];

		columns.forEach((column) => {
			const columnId = column.id;
			const columnName =
				document.getElementById(`${columnId}-name`).value || "column_name";
			const dataType =
				document.getElementById(`${columnId}-type`).value || "INT";

			let columnDef = `  ${columnName} <span class="sql-type">${dataType}</span>`;

			// Check constraints
			const isPK = document.getElementById(`${columnId}-pk`).checked;
			const isUnique = document.getElementById(`${columnId}-unique`).checked;
			const isNotNull = document.getElementById(`${columnId}-notnull`).checked;
			const isAutoIncrement = document.getElementById(
				`${columnId}-autoincrement`
			).checked;
			const hasDefault = document.getElementById(`${columnId}-default`).checked;
			const isForeignKey = document.getElementById(`${columnId}-fk`).checked;

			if (isNotNull) {
				columnDef += ` <span class="sql-constraint">NOT NULL</span>`;
			}

			if (isAutoIncrement) {
				columnDef += ` <span class="sql-constraint">AUTO_INCREMENT</span>`;
			}

			if (hasDefault) {
				const defaultValue =
					document.getElementById(`${columnId}-default-value`).value || "NULL";
				columnDef += ` <span class="sql-constraint">DEFAULT</span> ${defaultValue}`;
			}

			if (isPK) {
				constraints.push(
					`  <span class="sql-constraint">PRIMARY KEY</span> (${columnName})`
				);
			}

			if (isUnique) {
				constraints.push(
					`  <span class="sql-constraint">UNIQUE</span> (${columnName})`
				);
			}

			if (isForeignKey) {
				const refTable = document.getElementById(`${columnId}-ref-table`).value;
				const refColumn = document.getElementById(
					`${columnId}-ref-column`
				).value;

				if (refTable && refColumn) {
					constraints.push(
						`  <span class="sql-constraint">FOREIGN KEY</span> (${columnName}) <span class="sql-constraint">REFERENCES</span> ${refTable}(${refColumn})`
					);
				}
			}

			columnDefinitions.push(columnDef);
		});

		sql += columnDefinitions.join(",\n");

		if (constraints.length > 0) {
			sql += ",\n" + constraints.join(",\n");
		}

		sql += "\n);";

		sqlPreview.innerHTML = sql;
	}

	// Event listeners
	//   addColumnBtn.addEventListener("click", addColumn);
	generateSqlBtn.addEventListener("click", generateSQL);

	tableForm.addEventListener("submit", function(e) {
		e.preventDefault();
		generateSQL();
		alert(
			"Table creation SQL has been generated. In a real application, this would be executed against your database."
		);
	});

	// Add first column by default
	addColumn();
});

function removeColumn(id) {
	console.log(id);

	document.getElementById(id).remove();
}

function addColumn() {
	console.log("varthe");

	columnCounter++;
	const columnId = `column-${columnCounter}`;
	let currentColumnCount = document.querySelectorAll(".column-row").length;

	let row;

	const columnHtml = `
                <div class="column-row" id="${columnId}">
                    <button type="button" class="column-remove" onclick="removeColumn('${columnId}')">&times;</button>
            
  
                    <div class="column-grid">
                        <div class="form-group">
                            <label for="${columnId}-name">Column Name</label>
                            <input type="text" id="${columnId}-name" class="colNameInput" name="${columnId}-name" placeholder="Enter column name" required>
                        </div>
  
                        <div class="form-group">
                            <label for="${columnId}-type">Data Type</label>
                            <select id="${columnId}-type" class="colDataType" name="${columnId}-type" onchange="dynamicColDataType(this)" required>
                                ${dataTypes
			.map(
				(type) =>
					`<option value="${type}">${type}</option>`
			)
			.join("")}
                            </select>
                        </div>
                    </div>
  
                    <div class="constraints-section">
                        <h4 class="constraints-title">Constraints</h4>
                        <div class="constraints-grid">
                            <div class="checkbox-group">
                                <input type="checkbox" class="PKcheckBox" id="${columnId}-pk" name="${columnId}-constraints" value="PK">
                                <label for="${columnId}-pk">Primary Key</label>
                            </div>
  
                            <div class="checkbox-group">
                                <input type="checkbox" class="UKcheckBox" id="${columnId}-unique" name="${columnId}-constraints" value="UK">
                                <label for="${columnId}-unique">Unique</label>
                            </div>
  
                            <div class="checkbox-group">
                                <input type="checkbox" class="NNcheckBox" id="${columnId}-notnull" name="${columnId}-constraints" value="NN">
                                <label for="${columnId}-notnull">Not Null</label>
                            </div>
  
                            <div class="checkbox-group">
                                <input type="checkbox" class="AUTcheckBox" id="${columnId}-autoincrement" name="${columnId}-constraints" value="AUT">
                                <label for="${columnId}-autoincrement">Auto Increment</label>
                            </div>
  
                            <div class="checkbox-group">
                                <input type="checkbox" class="DEFcheckBox" id="${columnId}-default" name="${columnId}-constraints" value="DEF" onchange="toggleDefaultSection('${columnId}')">
                                <label for="${columnId}-default">Default Value</label>
                            </div>
  
                            <div class="checkbox-group">
                                <input type="checkbox" class="FKcheckBox" id="${columnId}-fk" name="${columnId}-constraints" value="FK" onchange="toggleFKSection('${columnId}')">
                                <label for="${columnId}-fk">Foreign Key</label>
                            </div>
                        </div>
  
                        <div id="${columnId}-default-section" class="default-value-section">
                            <div class="form-group">
                                <label for="${columnId}-default-value">Default Value</label>
								<input type="text" class="defaultInputBox" id="${columnId}-default-value" name="${columnId}-default-value" placeholder="Enter default value" required oninput="this.value = this.value.replace(/\\D/g, '')">
                            </div>
                        </div>
  
                        <div id="${columnId}-fk-section" class="foreign-key-section">
                            <div class="fk-group">
                                <div class="form-group">
                                    <label for="${columnId}-ref-table">Reference Table</label>
                                    <select id="${columnId}-ref-table" name="${columnId}-ref-table" onchange="updateDropColumn('${columnId}')">


								

                                    </select>
                                </div>
  
                                <div class="form-group">
                                    <label for="${columnId}-ref-column">Reference Column</label>
                                    <select id="${columnId}-ref-column" name="${columnId}-ref-column">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = columnHtml;

	columnsArea.appendChild(tempDiv.firstElementChild);

	document
		.getElementById(`${columnId}-ref-table`)
		.addEventListener("change", function() {
			const selectedTable = this.value; // Get selected table
			const refColumnDropdown = document.getElementById(
				`${columnId}-ref-column`
			);

			// Clear existing options
			//   refColumnDropdown.innerHTML = `<option value="">Select reference column</option>`;

			if (selectedTable && databases[selectedTable]) {
				// Get Primary Key columns from the selected table
				const primaryKeys = databases[selectedTable].filter((col) =>
					col.constraints.some(
						(constraint) => constraint.type === "PRIMARY_KEY"
					)
				);

				// Populate Reference Column dropdown
				primaryKeys.forEach((pk) => {
					const option = document.createElement("option");
					option.value = pk.name;
					option.textContent = pk.name;
					refColumnDropdown.appendChild(option);
				});
			}
		});

	// Initialize the select elements with proper styling
	const selects = document.querySelectorAll(`#${columnId} select`);
	selects.forEach((select) => {
		select.style.width = "100%";
		select.style.padding = "10px";
		select.style.border = "1px solid #ccc";
		select.style.borderRadius = "4px";
		// select.style.backgroundColor = "white";
	});
}

async function createTable() {
	//   currentDatabase = "DB2";
	console.log("Table creation called");
	console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");

	let tableName = document.getElementById("tableName").value.trim();

	if (!tableName) {
		showNotification("Table name shouldn't be empty!", "error");
		return;
	} else if (databases[currentDatabase].includes(tableName)) {
		showNotification("Table name already exist!", "error");
		return;
	} else if (/\s/.test(tableName)) {
		showNotification("Empty space is not allowed!", "error");
		return;
	} else if (!currentDatabase) {
		showNotification("No database selected!", "alert");
		return;
	}
	// console.log(databases[currentDatabase].includes(tableName));
	//   let columnContainer = document.getElementById("columnInputs");

	let columnContainer = document.querySelectorAll(".colNameInput");
	if (columnContainer.length < 1) {
		showNotification("Table atleast contain a single column!", "error");
		return;
	}

	console.log(columnContainer);

	let duplicateCheck = [];

	for (const el of columnContainer) {
		if (el.value == "") {
			showNotification("Column name shouldn't be empty!", "error");
			return;
		} else if (duplicateCheck.includes(el.value)) {
			showNotification("Same column names aren't allowed!", "error");
			return;
		}
		duplicateCheck.push(el.value);
		console.log(el.value);
		console.log(duplicateCheck);
	}

	console.log(databases);
	console.log(currentDatabase);
	console.log(tableName);

	let columnDataTypes = document.querySelectorAll(".colDataType");
	console.log(columnDataTypes);

	let columns = document
		.querySelector(".content")
		.querySelectorAll(".column-row");
	console.log(columns);

	let columnList = [];

	let createObject = {
		action: "createTable",
		dbName: currentDatabase,
		tableName: tableName,
	};

	//Each dynamic Column box
	for (const element of columns) {
		let colName = element.getElementsByTagName("input")[0].value;
		let type = element.getElementsByTagName("select")[0].value;
		let constraintList = [];

		Array.from(
			element.querySelector(".constraints-grid").getElementsByTagName("div")
		).forEach((el) => {
			// Get the constraint input element (e.g., for DEF, FK, etc.)
			const constraintInput = el.getElementsByTagName("input")[0];
			if (constraintInput.checked) {
				const constraintType = constraintInput.value; // e.g., "DEF", "FK", etc.
				if (constraintType === "DEF") {
					// For default value constraints, get the default value input:


					let defValue =
						el.parentElement.nextElementSibling.getElementsByTagName("input")[0];

					if (!defValue) {
						defValue =
							el.parentElement.nextElementSibling.getElementsByTagName("select")[0]
								.value;
					} else {
						console.log(defValue)
						defValue = defValue.value;
						console.log(defValue)
						if (!defValue || defValue.trim() === "") {
							defValue = "NONE";
						}
					}




					// If the default value is empty or only whitespace, set it to "NONE"

					let cons = {
						constraint: constraintType,
						DefValue: defValue,
					};
					constraintList.push(cons);
				} else if (constraintType === "FK") {
					// For foreign key constraints, get referenced table and column from the select elements:
					let refTable = el.parentElement.nextElementSibling.nextElementSibling.getElementsByTagName("select")[0].value;
					let refColumn = el.parentElement.nextElementSibling.nextElementSibling.getElementsByTagName("select")[1].value;
					// Set to "NONE" if they are empty
					if (!refTable || refTable.trim() === "") {
						refTable = "NONE";
					}
					if (!refColumn || refColumn.trim() === "") {
						refColumn = "NONE";
					}
					let cons = {
						constraint: constraintType,
						refTable: refTable,
						refColumn: refColumn,
					};
					constraintList.push(cons);
				} else {
					// For any other constraint types
					let con = constraintInput.value;
					if (!con || con.trim() === "") {
						con = "NONE";
					}
					let cons = {
						constraint: con,
					};
					constraintList.push(cons);
				}
			}
		});

		let obj = {
			colName: colName,
			datatype: type,
			consList: constraintList,
		};
		columnList.push(obj);
	}

	createObject.columnList = columnList;
	console.log(createObject);

	document.getElementById("columnsArea").innerHTML = "";

	createFetch(createObject);
	showNotification("Table created successfully");
}
console.log(currentDatabase);

// for (const [tableName, columns] of Object.entries(tables)) {
// 	if(columns.length > 0){
// 		<option value="${columns[0]}">${allTable[0]}</option>
//   }
// }

document.addEventListener("DOMContentLoaded", function() {
	document
		.getElementById("columnsArea")
		.addEventListener("change", function(event) {
			if (event.target.classList.contains("datatype")) {
				handleDatatypeChange(event.target);
			}
		});
});

function handleDatatypeChange(selectElement) {
	let selectedType = selectElement.value.toUpperCase();
	let columnRow = selectElement.closest(".form-group");
	let autoIncrement = columnRow.querySelector(".autoIncrement");
	let primaryKey = columnRow.querySelector(".primaryKey");
	let foreignKey = columnRow.querySelector(".foreignKey");
	let defaultValue = columnRow.querySelector(".defaultValue");

	// Enable/Disable AutoIncrement based on datatype
	if (selectedType === "INT" || selectedType === "FLOAT") {
		autoIncrement.disabled = false;
	} else {
		autoIncrement.disabled = true;
		autoIncrement.checked = false;
	}

	// Disable Primary Key and Foreign Key for BLOB
	if (selectedType === "BLOB") {
		primaryKey.disabled = true;
		primaryKey.checked = false;
		foreignKey.disabled = true;
		foreignKey.checked = false;

		// Convert Default Value into file input
		let fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.className = "defaultValue";
		fileInput.accept = "*/*";

		fileInput.classList.add("defaultInputBox");

		defaultValue.replaceWith(fileInput);
	} else {
		// Revert Default Value to text input if not BLOB
		if (defaultValue.type === "file") {
			let textInput = document.createElement("input");
			textInput.type = "text";
			textInput.className = "defaultValue";
			textInput.placeholder = "Default Value";

			textInput.classList.add("defaultInputBox");
			defaultValue.replaceWith(textInput);
		}

		primaryKey.disabled = false;
		foreignKey.disabled = false;
	}
}

function dynamicColDataType(columnType) {
	console.log("loglogloglog");

	let checkboxesClasses = [
		"PKcheckBox",
		"UKcheckBox",
		"NNcheckBox",
		"AUTcheckBox",
		"DEFcheckBox",
		"FKcheckBox",
	];

	console.log(
		columnType.parentElement.parentElement.parentElement.querySelector(
			".PKcheckBox"
		)
	);

	for (const elementClass of checkboxesClasses) {
		columnType.parentElement.parentElement.parentElement.querySelector(
			"." + elementClass
		).parentElement.style.display = "flex";
	}

	if (columnType.value == "STRING" || columnType.value == "CHAR") {

		columnType.parentElement.parentElement.parentElement.querySelector(
			".AUTcheckBox"
		).parentElement.style.display = "none";

		if (columnType.value == "CHAR") {
			let oldInputBox =
				columnType.parentElement.parentElement.parentElement.querySelector(
					".defaultInputBox"
				);
			let newInputBox = document.createElement("input");
			newInputBox.type = "text";
			newInputBox.placeholder = "Enter the default char";
			newInputBox.maxLength = 1;
			newInputBox.required = true;

			newInputBox.classList.add("defaultInputBox");
			oldInputBox.replaceWith(newInputBox);
		} else if (columnType.value == "STRING") {
			let oldInputBox =
				columnType.parentElement.parentElement.parentElement.querySelector(
					".defaultInputBox"
				);
			let newInputBox = document.createElement("input");
			newInputBox.type = "text";
			newInputBox.placeholder = "Enter the default String";
			newInputBox.required = true;

			newInputBox.classList.add("defaultInputBox");
			oldInputBox.replaceWith(newInputBox);
		}
	} else if (columnType.value == "BLOB" || columnType.value == "BOOLEAN") {
		let removableClasses = [
			"AUTcheckBox",
			"DEFcheckBox",
			"PKcheckBox",
			"UKcheckBox",
			"FKcheckBox",
		];

		for (const check of removableClasses) {
			columnType.parentElement.parentElement.parentElement.querySelector(
				"." + check
			).parentElement.style.display = "none";
		}

		if (columnType.value == "BOOLEAN") {
			columnType.parentElement.parentElement.parentElement.querySelector(
				".NNcheckBox"
			).parentElement.style.display = "none";
			columnType.parentElement.parentElement.parentElement.querySelector(
				".DEFcheckBox"
			).parentElement.style.display = "flex";

			let oldInputBox =
				columnType.parentElement.parentElement.parentElement.querySelector(
					".defaultInputBox"
				);
			console.log(oldInputBox);

			// Create a new select element
			let newSelectBox = document.createElement("select");

			let opt1 = document.createElement("option");
			opt1.text = "True";
			opt1.value = "true";

			let opt2 = document.createElement("option");
			opt2.text = "False";
			opt2.value = "false";

			newSelectBox.appendChild(opt1);
			newSelectBox.appendChild(opt2);

			newSelectBox.classList.add("defaultInputBox");
			oldInputBox.replaceWith(newSelectBox); // Replace the old element
		} else if (columnType.value == "BLOB") {
			for (const check of removableClasses) {
				columnType.parentElement.parentElement.parentElement.querySelector(
					"." + check
				).parentElement.style.display = "none";
			}

			let oldInputBox =
				columnType.parentElement.parentElement.parentElement.querySelector(
					".defaultInputBox"
				);

			let inputField = document.createElement("input");
			inputField.type = "file";
			inputField.required = true;
			inputField.classList.add("defaultInputBox");

			oldInputBox.replaceWith(inputField); // Replace the old element
		}
	} else if (columnType.value == "FLOAT") {

		let oldInputBox =
			columnType.parentElement.parentElement.parentElement.querySelector(
				".defaultInputBox"
			);

		let inputField = document.createElement("input");
		inputField.type = "text";
		inputField.placeholder = "Enter the default floot";
		inputField.required = true;
		inputField.oninput = function() {
			this.value = this.value
				.replace(/[^0-9.]/g, "")
				.replace(/^(\d*\.\d*)\./g, "$1");
		};

		inputField.classList.add("defaultInputBox");

		oldInputBox.replaceWith(inputField); // Replace the old element
	} else if (columnType.value == "INT") {
		let oldInputBox =
			columnType.parentElement.parentElement.parentElement.querySelector(
				".defaultInputBox"
			);

		let inputField = document.createElement("input");
		inputField.placeholder = "Enter the default Int";
		inputField.type = "text";
		inputField.required = true;
		inputField.classList.add("defaultInputBox");
		inputField.oninput = function() {
			this.value = this.value.replace(/\D/g, ""); // Removes non-digit characters
		};

		oldInputBox.replaceWith(inputField);
	}
}
