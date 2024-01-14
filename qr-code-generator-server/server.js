const express = require('express');
const bodyParser = require('body-parser');
const qr = require('qr-image');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const ejs = require('ejs');
const popup = require('alert');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '***',
  database: '****',
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  } else {
    console.log('Connected to MySQL database');
  }
});
app.post('/submit-form', (req, res) => {
  const formData = req.body;
  let sql = `INSERT INTO qr_codes (id, data) VALUES (${formData.userid}, '${JSON.stringify(formData.data)}')`;
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log("1 record inserted");
    res.json({ "url": "/generate/" + formData.userid });
  });
});
app.get('/generate/:id', (req, res) => {
  let url = req.protocol + '://' + req.get('host') + "/getForm/" + req.params.id;
  const qrCode = qr.image(url, { type: 'png' });
  res.type('png');
  qrCode.pipe(res);
});
app.get('/getForm/:id', (req, res) => {
  const userid = req.params.id;
  let sql = `SELECT * FROM qr_codes where id='${userid}'`;
  console.log(sql);
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching form fields from MySQL:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(result[0].data);
    console.log(Object.values(JSON.parse(result[0].data)));
    const formFields = Object.values(JSON.parse(result[0].data));

    res.render('index', { formFields });
  });
});
app.post('/submit_form', (req, res) => {
  let content;
  const { userid, email, lastName, firstName } = req.body;
  let sql = `INSERT INTO student_details (id, firstname, lastname, email) VALUES (${userid}, '${firstName}', '${lastName}', '${email}')`;
  db.query(sql, (err, result) => {
    console.log(err);
    // content.log(result);
    if (err) {
      content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Success Page</title>
        </head>
        <body>
          <h1>Internal Server Error!</h1>
          <p>Your operation was successful.</p>
        </body>
        </html>
      `;
    } else {
      content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Success Page</title>
        </head>
        <body>
          <h1>Success!</h1>
          <p>Your operation was successful.</p>
        </body>
        </html>
      `;
    }
    // Send the HTML content as the response
    res.send(content);
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});