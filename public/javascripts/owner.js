const form = document.querySelector('#admin-form');



form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");

    form.submit.disabled = true;

    $.ajax({
        method: 'post',
        data: {
            username: username,
            password: password
        },
        url: '/admin/login',
        success: (response) => {
            if(response.nullUser){

                toastHeader.innerText = "We can't Get You"
                toastBody.innerText = "User Not Found"
                toastCont.classList.add("bg-warning", "border-warning")
                bgHeader.classList.add('bg-warning')
                toast.show();
                form.submit.disabled = false

            }else if(response.password) {

                toastHeader.innerText = 'Success..'
                toastBody.innerText = 'Logged in successfully'
                toastCont.classList.add("bg-success", "border-success","text-white")
                bgHeader.classList.add('bg-success','text-white')
                toast.show();
                location.href = '/admin'
            }else{
                toastHeader.innerText = "We can't Get You"
                toastBody.innerText = "Wrong Password"
                toastCont.classList.add("bg-warning", "border-warning")
                bgHeader.classList.add('bg-warning')
                toast.show();
                form.submit.disabled = false
            }

        }
    })
})
