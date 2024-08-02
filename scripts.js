document.addEventListener("DOMContentLoaded", function() {
    const newButton = document.getElementById("newButton");
    const boxContainer = document.getElementById("boxContainer");
    const searchInput = document.getElementById("search");

    newButton.addEventListener("click", () => {
        const boxId = prompt("Enter box number (or range separated by a dash):");
        if (boxId.includes("-")) {
            const [start, end] = boxId.split("-").map(Number);
            for (let i = start; i <= end; i++) {
                addBox(`G${i}`);
            }
        } else {
            addBox(`G${boxId}`);
        }
    });

    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();
        const boxes = document.querySelectorAll(".box");
        boxes.forEach(box => {
            if (box.querySelector("span").textContent.toLowerCase().includes(searchValue)) {
                box.style.display = "";
            } else {
                box.style.display = "none";
            }
        });
    });

    function addBox(id) {
        const box = document.createElement("div");
        box.className = "box";
        box.innerHTML = `
            <span>${id}</span>
            <button onclick="handleAction('${id}', 'reboot')">Reboot</button>
            <button onclick="handleAction('${id}', 'replace')">Replace</button>
            <button onclick="handleAction('${id}', 'sendgem')">Send Gem</button>
            <button onclick="handleAction('${id}', 'autoexec')">Autoexec</button>
        `;
        boxContainer.appendChild(box);
    }
});

function handleAction(id, action) {
    const url = `https://trigger.macrodroid.com/616f2c21-3620-4c79-af0f-c275d7ca3fd7/${action}_${id}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(`Action ${action} for ${id} was successful!`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Action ${action} for ${id} failed!`);
        });
}
