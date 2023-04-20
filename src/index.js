
function validateEmail(email) {
    if (!email.match(/\w{2,}@[a-zA-Z]{2,}\.[a-zA-Z]{2,}/)) {
        const err = new Error('Email inválido.')
        err.input = 'email'
        throw err
    }
}

function validatePassword(password) {
    if (
        password.length < 8 || 
        !password.match(/[a-z]/) || 
        !password.match(/[A-Z]/) || 
        !password.match(/[0-9]/) ||
        !password.match(/[^a-zA-Z0-9\s]/)
    ) {
        const err = new Error('Senha inválida.')
        err.input = 'password'
        throw err
    }
}

function resetFormStyles() {
    Object.entries(userInputs).forEach(([key, value]) => {
        value.classList.remove('success', 'error')
        document.querySelector(`#${key}-error`).textContent = ''
    })
}

const userInputs = {
    name: document.querySelector('#name'),
    email: document.querySelector('#email'),
    password: document.querySelector('#password')
}

const renderUsers = (user) => {
    const userContainer = document.createElement('div');
    userContainer.classList.add('user-container');
    userContainer.id = `container-${user.id}`;

    const userName = document.createElement('p');
    userName.classList.add('username');
    userName.textContent = user.name;

    const userEmail = document.createElement('p');
    userEmail.classList.add('user-email');
    userEmail.textContent = user.email;

    const userPassword = document.createElement('p');
    userPassword.classList.add('user-password');
    userPassword.textContent = user.password;

    userContainer.append(userName, userEmail, userPassword);
    document.querySelector('#users-container').appendChild(userContainer);
}

const fetchUsers = async () => {
    const response = await fetch('http://localhost:3000/users').then(res => res.json());
    response.forEach(renderUsers);
}

const fetchUsersFromForm = async () => {
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        body: JSON.stringify({name, email, password}),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(res => res.json());

    response.forEach(renderUsers);
}

const form = document.querySelector('form')

form.addEventListener('submit', (ev) => {
    ev.preventDefault()
    resetFormStyles()
    try {
        userInputs.name.classList.add('success')
        validateEmail(userInputs.email.value)
        userInputs.email.classList.add('success')
        validatePassword(userInputs.password.value)
        userInputs.password.classList.add('success')
        fetchUsersFromForm()
    } catch (err) {
        userInputs[err.input].classList.add('error')
        document.querySelector(`#${err.input}-error`).textContent = err.message
    }
});

document.addEventListener('DOMContentLoaded', fetchUsers);