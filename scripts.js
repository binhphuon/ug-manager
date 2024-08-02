document.addEventListener("DOMContentLoaded", function() {
    const newButton = document.getElementById("newButton");
    const boxContainer = document.getElementById("boxContainer");
    const searchInput = document.getElementById("search");

    // Load boxes from local storage
    const boxes = JSON.parse(localStorage.getItem('boxes')) || [];
    boxes.forEach(id => addBox(id));

    newButton.addEventListener("click", () => {
        const boxId = prompt("Enter box number (or range separated by a dash):");
        if (boxId) {
            if (boxId.includes("-")) {
                const [start, end] = boxId.split("-").map(Number);
                for (let i = start; i <= end; i++) {
                    addBox(i);
                    saveBox(i);
                }
            } else {
                addBox(boxId);
                saveBox(boxId);
            }
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
        box.id = `box-${id}`;
        box.innerHTML = `
            <span>G${id}</span>
            <button onclick="handleAction('${id}', 'reboot', this)">Reboot</button>
            <button onclick="handleAction('${id}', 'replace', this)">Replace</button>
            <button onclick="handleAction('${id}', 'sendgem', this)">Send Gem</button>
            <button onclick="handleAction('${id}', 'autoexec', this)">Autoexec</button>
            <button onclick="removeBox('${id}')">Delete</button>
        `;
        boxContainer.appendChild(box);
    }

    function saveBox(id) {
        const boxes = JSON.parse(localStorage.getItem('boxes')) || [];
        boxes.push(id);
        localStorage.setItem('boxes', JSON.stringify(boxes));
    }

    window.removeBox = function(id) {
        const boxElement = document.getElementById(`box-${id}`);
        if (boxElement) {
            boxElement.remove();
        }
        let boxes = JSON.parse(localStorage.getItem('boxes')) || [];
        boxes = boxes.filter(boxId => boxId != id);
        localStorage.setItem('boxes', JSON.stringify(boxes));
    }
});

function handleAction(id, action, button) {
    const url = `https://trigger.macrodroid.com/616f2c21-3620-4c79-af0f-c275d7ca3fd7/${action}_${id}`;
    fetch(url)
        .then(response => response.text())
        .then(text => {
            if (text.trim() === "ok") {
                button.style.backgroundColor = 'green';
                setTimeout(() => {
                    button.style.backgroundColor = '';
                }, 1000);
            } else {
                throw new Error(`Unexpected response: ${text}`);
            }
        })
        .catch(error => {
            console.error('There was an error with the action:', error);
            button.style.backgroundColor = 'red';
            setTimeout(() => {
                button.style.backgroundColor = '';
            }, 1000);
        });
}
