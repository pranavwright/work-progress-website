

const form = document.getElementById("work");
const rowAdder = document.getElementById("rowAdder");
let progressInputs = [];
var i = 0;
rowAdder.addEventListener("click", function () {
    const newRow = document.createElement("div");
    newRow.classList.add("row");
    i++;
    newRow.innerHTML = `
      <div class="input-group m-3">
        <input type="text" placeholder="Label" oninput="rangeInput1.name = this.value" required>
        <input type="range" min="0" max="100" id="rangeInput1" oninput="amount${i}.value = this.value" style="margin-left: 1rem;" required />
        <input type="number" value="50" min="0" max="100" id="amount${i}" oninput="rangeInput1.value = this.value" style="margin-left: 1rem;" />
        <div class="input-group-prepend">
          <button class="btn btn-danger delete-row" type="button">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
    `;


    newRow.querySelector(".delete-row").addEventListener("click", function () {
        newRow.remove();
        progressInputs = progressInputs.filter(
            (input) => input.rangeInput1 !== this.previousElementSibling
        );
    });

    document.getElementById("newinput").appendChild(newRow);

    const rangeInput1 = newRow.querySelector("input[type='range']");
    progressInputs.push({ rangeInput1 });
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("title");
    const description = formData.get("discription");
    const advance = formData.get("advance");
    const number = formData.get("number");
    const estimate = formData.get("estimate");
    const initialized = formData.get("initialized");
    const remaining = formData.get("remaining");

    const progressData = progressInputs.map((input) => ({
        label: input.rangeInput1.previousElementSibling.value,
        progress: input.rangeInput1.value,
    }));
    progressData.push({label:document.getElementById('lab').value, progress: document.getElementById('rangeInput').value,})

    
    const workData = {
        title,
        description,
        advance,
        number,
        estimate,
        remaining,
        initialized,
        progress: JSON.stringify(progressData),

    };
    $.ajax({
        url: '/admin/add-user/new-work',
        dataType: 'json',
        data: workData,
        method: 'post',
        success: (response) => {
            if(response) location.href = '/admin'
        }
    })
    
})
