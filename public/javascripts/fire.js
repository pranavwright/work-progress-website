

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://DATABASE_NAME.firebaseio.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
  measurementId: "G-MEASUREMENT_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('submit', {
    'size': 'invisible',
    'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
    }
});


const login_form = document.querySelector('#number');



login_form.addEventListener('submit', (e) => {

    e.preventDefault();
    var phoneNumber = ('+' === login_form.mobile.value[0]) ? login_form.mobile.value : '+91' + login_form.mobile.value;
    const appVerifier = window.recaptchaVerifier;

    login_form.submit.disabled = true
    setTimeout(()=>{
        login_form.submit.disabled = false
    },3000)
    

    $.ajax({
        url: '/user-exist',
        data: {
            userNumber: login_form.mobile.value
        },
        method: 'post',
        success: (response) => {

            if(response.admin){
                location.href = response.admin
            }

            if (response.exist) {

                
                firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
                    .then((confirmationResult) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).

                        window.confirmationResult = confirmationResult;

                        login_form.submit.innerText = 'Resend OTP'
                        toastHeader.innerText = 'Enter OTP '
                        toastBody.innerText = 'OTP Sent Successfully'
                        toastCont.classList.add("bg-success", "border-success","text-white")
                        bgHeader.classList.add('bg-success','text-white')
                        toast.show();
                        

                        


                        // ...
                    }).catch((error) => {
                        // Error; SMS not sent
                        toastHeader.innerText = "We can't Get You"
                        toastBody.innerText = error
                        toastCont.classList.add("bg-warning", "border-warning")
                        bgHeader.classList.add('bg-warning')
                        toast.show();
                        login_form.submit.disabled = false
                        // ...
                    });
            } else {
                toastHeader.innerText = 'Check Your Number'
                toastBody.innerText = 'Mobile Number Not Found'
                toastCont.classList.add("bg-warning", "border-warning")
                bgHeader.classList.add('bg-warning')
                toast.show();
            }
        }
    })





})



const otp = document.querySelector('#otp');

otp.addEventListener('submit', (e) => {

    e.preventDefault();
    const code = otp.otp.value;
    confirmationResult.confirm(code).then((result) => {
        // User signed in successfully.
        const user = result.user.uid;
        $.ajax({
            url: '/login',
            data: {
                userId: user,
                userNumber: login_form.mobile.value
            },
            method: 'post',
            success: (response) => {
                if (response.success) {
                    location.href = '/users'
                }
            }
        })
        // ...
    }).catch((error) => {
        // User couldn't sign in (bad verification code?)
        toastHeader.innerText = 'Invalid Code'
        toastBody.innerText = 'error'
        toastCont.classList.add("bg-danger", "border-danger")
        bgHeader.classList.add('bg-danger')
        toast.show();
        // ...
    });



})

