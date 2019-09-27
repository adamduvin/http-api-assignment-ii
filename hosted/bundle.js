const handleResponse = (xhr, parseResponses) => {
    const content = document.querySelector("#content");

    switch (xhr.status) {
        case 200:
            content.innerHTML = `<b>Success</b>`;
            break;
        case 400:
            content.innerHTML = `<b>Bad Request</b>`;
            break;
        case 401:
            content.innerHTML = `<b>Unauthorized</b>`;
            break;
        case 403:
            content.innerHTML = `<b>Forbidden</b>`;
            break;
        case 500:
            content.innerHTML = `<b>Internal Server Error</b>`;
            break;
        case 501:
            content.innerHTML = `<b>Feature not yet Implemented</b>`;
            break;
        case 404:
            content.innerHTML = `<b>Resource Not Found</b>`;
            break;
        default:
            content.innerHTML = `Error code not implemented by client`;
            break;
    }

    if (parseResponses) {
        let obj;
        if (xhr.getResponseHeader('content-type') === 'text/xml') {
            /*obj = JSON.parse(xhr.response);
            console.dir(obj);*/
        } else {
            obj = JSON.parse(xhr.response);
            console.dir(obj);
        }
        content.innerHTML += `<p>${xhr.response}</p>`;
    } else {
        content.innerHTML += '<p>Meta Data Received</p>';
    }

    if (obj.message) {
        content.innerHTML += `<p>Message: ${obj.message}</p>`;
    }
};

const sendAjax = (url, fileType, method) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", fileType);
    if (method == 'get') {
        xhr.onload = () => handleResponse(xhr, true);
    } else {
        xhr.onload = () => handleResponse(xhr, false);
    }

    xhr.send();

    e.preventDefault();

    return false;
};

const sendPost = (e, nameForm) => {
    const nameAction = nameForm.getAttribute('action');
    const nameMethod = nameForm.getAttribute('method');

    const nameField = nameForm.querySelector('#nameField');
    const ageField = nameForm.querySelector('#ageField');

    const xhr = new XMLHttpRequest();

    xhr.open(nameMethod, nameAction);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr);

    const formData = `name=${nameField.value}&age=${ageField.value}`;

    xhr.send(formData);

    e.preventDefault();
    return false;
};

const init = () => {
    const nameForm = document.querySelector("#nameForm");
    const userForm = document.querySelector("#userForm");

    const sendRequest = () => {
        sendAjax(userForm.querySelector('#urlField').value, 'application.json', userForm.querySelector('#methodSelect').value);
    };

    const addUser = e => sendPost(e, nameForm);

    userForm.addEventListener('submit', sendRequest);
    nameForm.addEventListener('submit', addUser);
};

window.onload = init;
