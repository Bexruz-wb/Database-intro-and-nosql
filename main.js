 import { createServer } from 'http';
import { getData, setData } from './file-module.js';

const server = createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

 



  if (req.url === '/users' && req.method === 'GET') {
    const users = await getData();
    res.writeHead(200);
    return res.end(JSON.stringify(users));
  }

 


  if (req.url.startsWith('/users/') && req.method === 'GET') {
    const userId = +req.url.split('/')[2];
    const users = await getData();
    const user = users.find((el) => el.id === userId);

    if (!user) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: `User not found by id ${userId}` }));
    }

    res.writeHead(200);
    return res.end(JSON.stringify(user));
  }

  



  if (req.url === '/users' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));

    req.on('end', async () => {
      const users = await getData();
      const parsed = JSON.parse(body);

      const newUser = {
        id: users.length ? users.at(-1).id + 1 : 1,
        ...parsed,
      };

      users.push(newUser);
      await setData(users);

      res.writeHead(201);
      return res.end(JSON.stringify(newUser));
    });
    return;
  }

 



  if (req.url.startsWith('/users/') && req.method === 'PUT') {
    const userId = +req.url.split('/')[2];
    const users = await getData();
    const userIndex = users.findIndex((el) => el.id === userId);

    if (userIndex === -1) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: `User not found by id ${userId}` }));
    }

    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));

    req.on('end', async () => {
      const updatedData = JSON.parse(body);
      users[userIndex] = { id: userId, ...updatedData };

      await setData(users);
      res.writeHead(200);
      return res.end(JSON.stringify(users[userIndex]));
    });
    return;
  }

 


  if (req.url.startsWith('/users/') && req.method === 'DELETE') {
    const userId = +req.url.split('/')[2];
    const users = await getData();
    const userExists = users.some((el) => el.id === userId);

    if (!userExists) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: `User not found by id ${userId}` }));
    }

    const filtered = users.filter((el) => el.id !== userId);
    await setData(filtered);

    res.writeHead(200);
    return res.end(JSON.stringify({ message: `User with id ${userId} deleted` }));
  }

 
  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Not Found' }));
});

server.listen(3000, () => console.log('Server running at http://localhost:3000/'));
