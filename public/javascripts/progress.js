

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
        <input type="range" min="0" value="10" max="100" id="rangeInput1" oninput="amount${i}.value = this.value" style="margin-left: 1rem;" required />
        <input type="number" value="10" min="0" max="100" id="amount${i}" oninput="rangeInput1.value = this.value" style="margin-left: 1rem;" />
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
    const amount = formData.get("amount");
    const paid = formData.get("paid");
    const number = formData.get("number");
    const estimate = formData.get("estimate");
    const initialized = formData.get("initialized");


    var partPayment = null;
    if(document.getElementById('single').checked) {partPayment = false;
   }else if(document.getElementById('part').checked) { partPayment = true;
   } 




    const progressData = progressInputs.map((input) => ({
        label: input.rangeInput1.previousElementSibling.value,
        progress: input.rangeInput1.value,
    }));
    progressData.push({label:document.getElementById('lab').value, progress: document.getElementById('rangeInput').value,})

  
var payment  = {
  amount: amount,
  paid: paid,
  paymentmethod: partPayment,
  balance: amount-paid

}
    
    const workData = {
        title,
        description,
        payment: JSON.stringify(payment),
        number,
        estimate,
        initialized,
        progress: JSON.stringify(progressData),

    };
    console.log(workData);
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
