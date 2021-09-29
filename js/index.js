document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('github-form').addEventListener('submit', userSearch);
});

function userSearch(e) {
    e.preventDefault();
    const form = e.target;
    let url;
    let callback;
    const input = form.querySelector('#search').value;
    if (form.querySelector('input[name="searchType"]:checked').value === 'user') {
        url = `https://api.github.com/search/users?q=${input}`;
        callback = displayUsers;
    } else {
        url = `https://api.github.com/search/repositories?q=${input}`;
        callback = (results) => displayRepos(results.items);
    }
    const options = {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    }
    // TODO: uncomment the line below
    sendRequest(url, options, callback);
    console.log(url);
    form.reset();
}

function repoSearch(username) {
    const url = `https://api.github.com/users/${username}/repos`;
    const options = {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    }
    sendRequest(url, options, displayRepos);
}

function displayUsers(users) {
    console.log(users);
    const userList = document.getElementById('user-list');
    userList.replaceChildren();
    users.items.forEach(user => {
        const userItem = document.createElement('li');
        userItem.addEventListener('click', () => repoSearch(user.login));

        const userImg = document.createElement('img');
        userImg.src = user.avatar_url;
        userImg.width = 200;

        const userLabel = document.createElement('span');
        userLabel.textContent = user.login;
        
        const userLink = document.createElement('a');
        userLink.href = user.html_url;
        userLink.textContent = '(View Profile)';

        userItem.append(userImg, userLabel, userLink);
        userList.append(userItem);
    });
}

function displayRepos(repos) {
    const repoList = document.getElementById('repos-list');
    repoList.replaceChildren();
    repos.forEach((repo) => {
        const repoItem = document.createElement('li');

        const repoLink = document.createElement('a');
        repoLink.textContent = repo.name;
        repoLink.href = repo.html_url;

        repoItem.append(repoLink);
        repoList.append(repoItem);
    });
}

function sendRequest(url, options, callback) {
    fetch(url, options).then(response => response.json()).then(callback);
}