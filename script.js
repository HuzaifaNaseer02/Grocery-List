let totalBillAmount = 0;

document.getElementById("itemInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        document.getElementById("quantityInput").focus();
    }
});

document.getElementById("quantityInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addItem();
    }
});

function addItem() {
    const itemInput = document.getElementById("itemInput");
    const quantityInput = document.getElementById("quantityInput");
    const groceryList = document.getElementById("groceryList");

    const li = document.createElement("li");
    li.innerHTML = `
        <div class="item-section">
            <span class="item-name">${itemInput.value}</span>
            <input type="text" class="edit-item-input" style="display:none;">
            <span class="item-quantity"> (${quantityInput.value})</span>
            <input type="number" class="price-input" placeholder="Price" onkeyup="if(event.key === 'Enter') addPrice(this, '${itemInput.value}', '${quantityInput.value}');">
        </div>
        <div class="button-section">
            <button onclick="markAsDone(this)">Mark as done</button>
            <button onclick="editItem(this)">Edit</button>
            <button onclick="deleteItem(this)">Delete</button>
        </div>
    `;
    groceryList.appendChild(li);

    itemInput.value = "";
    quantityInput.value = "";
}

function editItem(buttonElement) {
    const li = buttonElement.parentNode.parentNode;
    const itemNameSpan = li.querySelector(".item-name");
    const editItemInput = li.querySelector(".edit-item-input");
    const saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.onclick = function() { saveEdit(saveButton); };

    editItemInput.value = itemNameSpan.innerText;
    editItemInput.style.display = "inline";
    itemNameSpan.style.display = "none";
    
    li.querySelector(".button-section").appendChild(saveButton);
}

function saveEdit(buttonElement) {
    const li = buttonElement.parentNode.parentNode;
    const itemNameSpan = li.querySelector(".item-name");
    const editItemInput = li.querySelector(".edit-item-input");

    itemNameSpan.innerText = editItemInput.value;

    itemNameSpan.style.display = "inline";
    editItemInput.style.display = "none";

    buttonElement.remove();
}

function deleteItem(buttonElement) {
    const li = buttonElement.parentNode.parentNode;
    li.remove();
}

function markAsDone(buttonElement) {
    const li = buttonElement.parentNode.parentNode;
    li.querySelector(".price-input").style.display = "inline-block";
    li.querySelector(".price-input").focus();
    li.querySelector(".button-section").style.display = "none";
    li.style.borderBottom = "none"; // This removes the border from the marked item.
}

function addPrice(inputElement, itemName, quantity) {
    const price = parseFloat(inputElement.value);
    if (isNaN(price)) {
        alert("Please enter a valid price.");
        return;
    }

    totalBillAmount += price;

    const billList = document.getElementById("billList");
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="bill-item">
            <span>${itemName} (${quantity})</span>
            <span>Rs${price.toFixed(2)}</span>
        </div>
    `;
    billList.appendChild(li);

    document.getElementById("totalBill").innerText = `Rs${totalBillAmount.toFixed(2)}`;
    inputElement.style.display = "none";
    inputElement.parentNode.querySelector(".item-name").style.display = "none";
    inputElement.parentNode.querySelector(".item-quantity").style.display = "none";
}

function viewBill() {
    const mainInterface = document.getElementById("mainInterface");
    const billSection = document.getElementById("billSection");
    
    mainInterface.style.display = "none";
    billSection.style.display = "block";
}

function backToItems() {
    const mainInterface = document.getElementById("mainInterface");
    const billSection = document.getElementById("billSection");
    
    mainInterface.style.display = "block";
    billSection.style.display = "none";
}

function saveAsPDF() {
    const billSection = document.getElementById("billSection");
    const pdf = new jsPDF();
    pdf.text("Your Bill", 10, 10);
    let yOffset = 20;
    const billItems = billSection.querySelectorAll("li");
    billItems.forEach((item, index) => {
        pdf.text(item.innerText, 10, yOffset + (index * 10));
    });
    pdf.text(`Total: ${document.getElementById("totalBill").innerText}`, 10, yOffset + (billItems.length * 10));
    pdf.save("bill.pdf");
}

function clearBill() {
    const billList = document.getElementById("billList");
    billList.innerHTML = '';
    totalBillAmount = 0;
    document.getElementById("totalBill").innerText = `Rs${totalBillAmount.toFixed(2)}`;
}
