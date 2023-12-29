const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');

let users = [];
let currentId = 1;

const server = http.createServer((req, res) => {
    console.log([req.method, req.url]);
  if (req.url === '/') {
    // if ini untuk menghandle home url
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                const html = data.toString().replace('<!-- Ini buat tabel -->', generateUserRows());
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            }
        });
  } else if (req.url === '/addUser' && req.method === 'POST') {
        // If ini untuk menghandle penambahan user
        let body = '';
        req.on('data', chunk => {
        body += chunk;
        });

        req.on('end', () => {
        const userData = qs.parse(body);
        addUser(userData.name, userData.email, userData.dob);

        res.writeHead(302, { 'Location': '/' });
        res.end();
        });
    } else if (req.url.startsWith('/deleteUser') && req.method === 'DELETE') {
        // if ini untuk menghandle penghapusan user
        const parsedUrl = url.parse(req.url, true);
        const userId = parseInt(parsedUrl.query.id, 10);
    
        if (!isNaN(userId)) {
            deleteUser(userId);
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users));
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid DELETE request');
        }
    } else if (req.url.startsWith('/editUser')) {
        // if ini untuk menghandle edit user data
        const match = req.url.match(/^\/editUser\?id=(\d+)&name=(.+)&email=(.+)&dob=(\d{4}-\d{2}-\d{2})$/);
    
        if (match) {
            const userId = parseInt(match[1], 10);
            const name = decodeURIComponent(match[2].replace(/\+/g, ' '));
            const email = decodeURIComponent(match[3]);
            const dob = match[4];
      
            editUser(userId, name, email, dob);
      
            res.writeHead(302, { 'Location': '/' });
            res.end();
          } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid PATCH request');
          }
    } else {
        // If ini digunakan untuk handle jika masuk ke url lain
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Digunakan untuk inisialisasi tabel
function generateUserRows() {
    return users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.dob}</td>
            <td>
                <button onclick="deleteUser(${user.id})">Delete</button>
                <button onclick="editUserForm(${user.id}, '${user.name}', '${user.email}', '${user.dob}')">Edit</button>
            </td>
        </tr>
    `).join('');
}

// Digunakan untuk membuat user baru
function addUser(name, email, dob) {
    const newUser = { id: currentId++, name, email, dob };
    users.push(newUser);
}

// Digunakan untuk mendelete sebuah user
function deleteUser(userId) {
    users = users.filter(user => user.id !== userId);
}

// Digunakan untuk mengedit sebuah user
function editUser(userId, name, email, dob) {
    const userIdInt = parseInt(userId,10);
    const userIndex = users.findIndex(user => user.id === userIdInt);
    if (userIndex !== -1) {
        users[userIndex] = { id: userId, name, email, dob };
    }
}

const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`Server running on ${port}`));
