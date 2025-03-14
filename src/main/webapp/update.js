window.onload = async function () {
  if (window.location.pathname.endsWith("update.html")) {
    window.location.href = "dashboard.html"; // Redirect if already logged in
  }
};

var columnSelect = document.querySelector(".update-column");
updateColumnDropdown(columnSelect);

updateColumnDropdown(document.querySelector(".condition-column"));

// Update column options in a dropdown
function updateColumnDropdown() {
  const selectedColumns = Array.from(
    document.querySelectorAll(".update-column")
  )
    .map((select) => select.value)
    .filter((value) => value); // Get selected columns (excluding empty ones)

  //   document.querySelectorAll(".update-column").forEach((dropdown) => {
  //     const currentValue = dropdown.value; // Store current selection
  //     dropdown.innerHTML = "";

  //     columnData.forEach((column) => {
  //       if (
  //         !selectedColumns.includes(column.name) ||
  //         column.name === currentValue
  //       ) {
  //         const option = document.createElement("option");
  //         option.value = column.name;
  //         option.textContent = column.name;
  //         dropdown.appendChild(option);
  //       }
  //     });

  //     dropdown.value = currentValue; // Restore previous selection
  //   });

  let columnSelectTag = document.querySelector(".update-column");
  columnSelectTag.innerHTML = "";
  columnData.forEach((el) => {
    let option = document.createElement("option");
    option.value = el.name;
    option.textContent = el.name;
    columnSelectTag.appendChild(option);
  });
}

columnData.forEach((el) => {
  let option = document.createElement("option");
  option.text = el.name;
  option.value = el.name;
  document.querySelector(".condition-column").append(option);
});

function generateColumnOption() {
  let select = document.createElement("select");
  columnData.forEach((el) => {
    let option = document.createElement("option");
    option.text = el.name;
    option.value = el.name;
    select.append(option);
  });
  return select;
}

// Add a new update pair
function addUpdatePair() {
  const container = document.getElementById("update-container");

  const updatePair = document.createElement("div");
  updatePair.className = "update-pair";

  updatePair.innerHTML = `
	  <select class="col-select update-column">
	  </select>
	  <div class="value-input"></div>
	  <button class="btn-remove" onclick="removeUpdatePair(this)">Remove</button>
	`;

  container.appendChild(updatePair);

  const columnSelect = updatePair.querySelector(".update-column");
  const valueInputDiv = updatePair.querySelector(".value-input");

  // Populate select options
  columnData.forEach((col, index) => {
    let option = document.createElement("option");
    option.value = col.name;
    option.textContent = col.name;
    option.setAttribute("data-type", col.type); // Store data type
    columnSelect.appendChild(option);
  });

  // Set initial input type based on the first column
  if (columnData.length > 0) {
    changeInputBox(columnSelect);
  }

  // Attach onchange event
  columnSelect.addEventListener("change", function () {
    changeInputBox(this);
  });
}

function changeInputBox(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const dataType = selectedOption.getAttribute("data-type") || "text";

  const valueInputDiv =
    selectElement.parentElement.querySelector(".value-input");
  valueInputDiv.innerHTML = `<input type="${dataType}" placeholder="New Value" ${
    dataType === "file" ? "" : 'value=""'
  } />`;
}

// Remove an update pair
function removeUpdatePair(button) {
  const pair = button.parentElement;
  pair.remove();
}

function addCondition() {
  const container = document.getElementById("conditions-container");

  const conditionDiv = document.createElement("div");
  conditionDiv.classList.add("condition");
  conditionDiv.innerHTML = `
      <select class="operator-select">
          <option value="=">=</option>
          <option value="!=">!=</option>
          <option value="<"><</option>
          <option value=">">></option>
          <option value=">=">>=</option>
          <option value="<="><=</option>
      </select>
      <input type="text" class="value-input" placeholder="Value">
      <button onclick="removeCondition(this)" class="btn-remove">Remove</button>
  `;

  conditionDiv.prepend(generateColumnOption());

  container.appendChild(conditionDiv);

  // Update dropdown with column names
  const columnSelect = conditionDiv.querySelector(".condition-column");
  updateColumnDropdown(columnSelect);

  // Check if at least one condition exists, then add logical operator
  if (container.children.length > 0) {
    const logicalDiv = document.createElement("div");
    logicalDiv.classList.add("logical-operator"); // Add class to track later
    logicalDiv.innerHTML = `
            <select>
                <option>AND</option>
                <option>OR</option>
            </select>
        `;
    container.appendChild(logicalDiv); // Append logical operator before new condition
  }

  container.appendChild(conditionDiv);
}

function removeCondition(button) {
  const container = document.getElementById("conditions-container");
  const condition = button.parentElement;

  // Find the index of the condition
  const conditions = Array.from(container.getElementsByClassName("condition"));
  const index = conditions.indexOf(condition);

  // Remove the condition
  condition.remove();

  // Remove the corresponding logical operator
  if (index > 0) {
    // Remove the logical operator before this condition
    const logicalOperators =
      container.getElementsByClassName("logical-operator");
    if (logicalOperators[index - 1]) {
      logicalOperators[index - 1].remove();
    }
  } else if (container.children.length > 0) {
    // If the first condition is removed, remove the logical operator after it
    const firstLogicalOperator = container.querySelector(".logical-operator");
    if (firstLogicalOperator) {
      firstLogicalOperator.remove();
    }
  }
}

function changeInputBox(type) {
  console.log(type);

  let column;
  for (const col of columnData) {
    console.log(col.name, type.value);

    if (col.name == type.value) {
      column = col;
      console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

      break;
    }
  }

  console.log(column);

  if (column["dataType"] == "BLOB") {
    let newInput = document.createElement("input");
    newInput.type = "file";
    // newInput.name = type.name; // Keep the same name if needed
    // newInput.id = type.id; // Keep the same ID if needed

    let inputContainer = type.parentElement.querySelector(".value-input");
    inputContainer.innerHTML = "";
    inputContainer.appendChild(newInput);
  } else if (column["dataType"] == "BOOL") {
    let newInput = document.createElement("select");

    let opt1 = document.createElement("option");
    opt1.value = "true";
    opt1.text = "True";

    let opt2 = document.createElement("option");
    opt2.value = "false";
    opt2.text = "Flase";

    newInput.appendChild(opt1);
    newInput.appendChild(opt2);

    let inputContainer = type.parentElement.querySelector(".value-input");
    inputContainer.innerHTML = "";
    inputContainer.appendChild(newInput);
  } else {
    let newInput = document.createElement("input");
    newInput.type = "text";
    newInput.placeholder = "Value";
    newInput.name = type.name; // Keep the same name if needed
    // newInput.id = type.id; // Keep the same ID if needed

    let inputContainer = type.parentElement.querySelector(".value-input");
    inputContainer.innerHTML = "";
    inputContainer.appendChild(newInput);
  }
}
async function executeQuery() {
  const updatePairs = document.querySelectorAll(".update-pair");
  const conditionPairs = document.querySelectorAll(".condition");
  const logicalOperator = "AND"; // Fixed logical operator for multiple conditions

  let updateData = {};
  let conditionsData = [];

  let hasUpdateColumn = false;
  let filePromises = []; // Store promises for Base64 conversion

  for (const pair of updatePairs) {
    const columnSelect = pair.querySelector(".update-column");

    if (!columnSelect || columnSelect.selectedIndex === -1) {
      console.warn("No column selected");
      continue;
    }

    const column = columnSelect.value;
    const inputElement = pair.querySelector(".value-input").firstElementChild;
    let value = inputElement.value;

    if (inputElement.type === "file" && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      // Convert file to Base64 asynchronously
      const filePromise = convertToBase64(file).then((base64) => {
        updateData[column] = base64;
      });

      filePromises.push(filePromise);
    } else {
      updateData[column] = value.trim() === "" ? "NONE" : value;
    }

    hasUpdateColumn = true;
  }

  if (!hasUpdateColumn) {
    alert("Please select at least one column to update.");
    return;
  }

  // Wait for all file conversions to complete
  await Promise.all(filePromises);

  // Collect conditions data
  conditionPairs.forEach((pair, index) => {
    const column = pair.querySelector(".condition-column").value;
    const operator = pair.querySelector(".operator-select").value;
    const value = pair.querySelector(".value-input").value;

    if (column) {
      let conditionObj = { column, operator, value };

      // Add logicalOperator only from the second condition onward
      if (index > 0) {
        conditionObj.logicalOperator = logicalOperator;
      }

      conditionsData.push(conditionObj);
    }
  });

  // Warn if no conditions are provided
  if (conditionsData.length === 0) {
    if (
      !confirm(
        "Warning: You are about to update all records in the table. Continue?"
      )
    ) {
      return;
    }
  }

  // Construct the final object
  const updateQueryObject = {
    dbName: currentDatabase,
    tableName: currentTable,
    columnValue: updateData,
    conditions: conditionsData,
  };

  console.log(updateQueryObject); // Output the object for testing
  updateServlet(updateQueryObject);
}
