const parseJSON = (xhr, content) => {
  //parse response (obj will be empty in a 204 updated)
  const obj = JSON.parse(xhr.response);
  console.dir(obj);
  
  //if message in response, add to screen
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${obj.message}`;
    content.appendChild(p);
  }
  
  //if users in response, add to screen
  if(obj.users) {
    const userList = document.createElement('p');
    const users = JSON.stringify(obj.users);
    userList.textContent = users;
    content.appendChild(userList);
  }
};

const handleResponse = (xhr, parseResponses) => {
    const content = document.querySelector("#content");

    switch(xhr.status){
      case 200:
        content.innerHTML = `<b>Success</b>`;
        break;
      case 201:
        content.innerHTML = `<b>Created</b>`;
        break;
      case 204:
        content.innerHTML = `<b>Updated</b>`;
        break;
      case 400:
        content.innerHTML = `<b>Bad Request</b>`;
        break;
      case 404:
        content.innerHTML = `<b>Resource Not Found</b>`;
        break;
      default:
        content.innerHTML = `Error code not implemented by client`;
        break;
    }

    if(parseResponses){
        parseJSON(xhr, content);
    }
  };

  const sendAjax = (e, userForm) => {
    const url = userForm.querySelector('#urlField').value;
    console.dir(url);
    const method = userForm.querySelector('#methodSelect').value;
    
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", 'application/json');
    if(method == 'get'){
        xhr.onload = () => handleResponse(xhr, true);
    }
    else{
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
  }

  const init = () => {
    const nameForm = document.querySelector('#nameForm');
    const userForm = document.querySelector('#userForm');

    const getUsers = (e) => sendAjax(e, userForm);
    const addUser = (e) => sendPost(e, nameForm);

    userForm.addEventListener('submit', getUsers);
    nameForm.addEventListener('submit', addUser);
    console.dir('test');
  };

  window.onload = init;
