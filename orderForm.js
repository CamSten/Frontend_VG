const form = document.getElementById('orderForm');
const successMessage = document.getElementById('successMessage');
const formError = document.getElementById('formError');
const closebtn = document.getElementById('closeButton');

// Globally accessible function for product page to open checkout
function showOrderPopup() {
    document.querySelector('.popup').classList.add('active');
    form.classList.remove('hidden');
    form.classList.remove('fade');
    successMessage.classList.add('hidden');
    successMessage.classList.remove('fade', 'in');
    formError.classList.add('hidden');
    form.reset();
    Object.values(inputFields).forEach((field) => {
        field.element.classList.remove("inputWrong", "inputCorrect");
        field.element.classList.add("inputBase");
        const errorElement = field.element.parentElement.querySelector('.errorMessage');
        errorElement.textContent = "";
    })
}

function closePopup() {
    const popup = document.querySelector('.popup');
    popup.classList.remove('active');
    setTimeout(() => {
        form.classList.add('hidden');
        successMessage.classList.add('hidden');
        formError.classList.add('hidden');
    }, 400);
}
closebtn.onclick = closePopup;

const inputFields = {
    name: {
        element: document.getElementById('name'),
        regex: /^[A-Za-zÅÄÖåäö\s]{2,50}$/,
        message: "Enter name",
    },
    email: {
        element: document.getElementById('email'),
        regex: /^[A-Za-zÅÄÖåäö0-9._%+-]+@[A-Za-zÅÄÖåäö0-9.-]+\.[A-Za-z]{1,50}$/,
        message: "Enter email address",
    },
    phone: {
        element: document.getElementById('phone'),
        regex: /^[0-9()-]{1,20}$/,
        message: "Enter phone number",
    },
    address: {
        element: document.getElementById('address'),
        regex: /^[A-Za-zÅÄÖåäö0-9\s.,-]{2,50}$/,
        message: "Enter address",
    },
    postalnr: {
        element: document.getElementById('postalnr'),
        regex: /^[0-9]{5}$/,
        message: "Enter zip code",
    },
    country: {
        element: document.getElementById('county'),
        regex: /^[A-Za-zÅÄÖåäö\s.,-]{2,20}$/,
        message: "Enter country",
    }
}

function validateFields(field) {
    const value = field.element.value.trim();
    const errorelement = field.element.parentElement.querySelector('.errorMessage');
    if (!field.regex.test(value)) {
        field.element.classList.remove("inputCorrect");
        field.element.classList.add("inputWrong");
        errorelement.textContent = field.message;
        return false;
    } else {
        field.element.classList.remove("inputWrong");
        field.element.classList.add("inputCorrect");
        errorelement.textContent = "";
        return true;
    }
}
Object.values(inputFields).forEach((field) => {
    field.element.addEventListener('input', () => validateFields(field));
})
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    Object.values(inputFields).forEach((field) => {
        if (!validateFields(field)) {
            valid = false;
        }
    })
    if (valid) {
        form.classList.remove('in');
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        successMessage.classList.add('fade', 'in');
        clearCart();
    } else {
        formError.classList.remove('hidden');
    }
})

function clearCart(){
    clearCartAfterOrder();
}