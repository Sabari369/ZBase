window.onload = async function() {
	if (window.location.pathname.endsWith("delete.html")) {
		window.location.href = "dashboard.html"; // Redirect if already logged in
	}
}


conditionCount = 0;

function addCondition() {
	conditionCount++;
	const container = document.getElementById("conditions-container");

	if (conditionCount > 1) {
		const logicalOperator = document.createElement("select");
		logicalOperator.innerHTML =
			'<option value="AND">AND</option><option value="OR">OR</option>';
		logicalOperator.className = "logical-operator";
		container.appendChild(logicalOperator);
	}

	const conditionDiv = document.createElement("div");
	conditionDiv.className = "condition";
	conditionDiv.innerHTML = `
<select class="column" id="column-${conditionCount}">
    <option value="">--Select column--</option>
</select>
<select class="operator">
    <option>=</option>
    <option>!=</option>
    <option>></option>
    <option><</option>
</select>
<input type="text" class="value" placeholder="Value">
<button class="remove-btn" onclick="removeCondition(this)">X</button>
`;
	container.appendChild(conditionDiv);

	// Load column data into the newly added select element
	loadColumnData(`column-${conditionCount}`);
}

function removeCondition(button) {
	const conditionDiv = button.parentElement;
	const container = document.getElementById("conditions-container");
	if (
		conditionDiv.previousElementSibling &&
		conditionDiv.previousElementSibling.tagName === "SELECT"
	) {
		container.removeChild(conditionDiv.previousElementSibling);
	}
	container.removeChild(conditionDiv);
	conditionCount--;
}


function executeQuery() {
	let deleteJSON = {};

	const conditions = [];
	const conditionElements = document.querySelectorAll(".conditions-container");
	const logicalOperators = document.querySelectorAll(".logical-operator");

	conditionElements.forEach((element, index) => {
		const columnEl = element.querySelector(".column");
		const operatorEl = element.querySelector(".operator");
		const valueEl = element.querySelector(".value");

		// Ensure all required inputs exist
		if (!columnEl || !operatorEl || !valueEl) {
			return;
		}

		const column = columnEl.value;
		const operator = operatorEl.value;
		const value = valueEl.value.trim();

		let condition = {
			columnName: column,
			conditionType: operator,
			conditionValue: value,
		};

		// If there is more than one condition, add the logical operator from the previous condition
		if (index > 0 && logicalOperators[index - 1]) {
			condition.operation = logicalOperators[index - 1].value;
		}

		conditions.push(condition);
	});

	deleteJSON.dbName = currentDatabase;
	deleteJSON.tableName = currentTable;
	// Always assign the conditions key; if no conditions, it will be an empty array
	deleteJSON.conditions = conditions;

	deleteServlet(deleteJSON);
}


function loadColumnData(id) {
	console.log(columnData)
	let selectElement = document.getElementById(id);
	selectElement.innerHTML = '<option value="">--Select column--</option>'; // Reset previous options

	columnData.forEach((column) => {
		let option = document.createElement("option");
		option.value = column.name;
		option.textContent = column.name;
		selectElement.appendChild(option);
	});
}


