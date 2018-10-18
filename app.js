/**
 * To get started install
 * express bodyparser jsonwebtoken express-jwt
 * via npm
 * command :-
 * npm install express bodyparser jsonwebtoken express-jwt --save
 */

// Bringing all the dependencies in
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
var dateTime = require('node-datetime');
const nodemailer = require('nodemailer');

const app = express(); //alias from the express function

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'archvietnam'
});

connection.connect(err => {
	if (err) {
		return err;
	}
});


app.use(cors());
// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('go to arch Viet Nam');
});

// Insert New
app.get('/addNews', (req, res) => {
	const { title, body, author } = req.query;
	var dt2 = dateTime.create();
	var date_create2 = dt2.format('Y-m-d');
	const ADD_NEWS = `INSERT INTO news (title, body, date_create, status, author) VALUES ('${title}', '${body}', '${date_create2}', '0', '${author}')`;
	connection.query(ADD_NEWS, (err, results) => {
		if (err) {
			return res.send(err)
		} else res.send('Add News Success !')
	});
});

// get List news
app.get('/listnews', (req, res) => {
	const ALL_NEWS = 'SELECT * FROM news ORDER By status ASC, date_create DESC';
	connection.query(ALL_NEWS, (err, results) => {
		if (err) {
			return res.send(err)
		} else {
			return res.json({
				data: results
			})
		}
	})
})

//change Status of News to Hirring (staus == '0')
app.get('/changeToHirring', (req, res) => {
	const { status, id } = req.query;
	const UPDATE__TO_HIRRING = `UPDATE news SET status='${status}' WHERE id=${id}`;
	connection.query(UPDATE__TO_HIRRING, (err, results) => {
		if (err) {
			return res.send(err)
		} else res.send('Update News To Hirring Success !')
	});
});

// change status of News to Hired (status == 1)
app.get('/changeToHired', (req, res) => {
	const { status, id } = req.query;
	const UPDATE_TO_HIRED = `UPDATE news SET status='${status}' WHERE id=${id}`;
	connection.query(UPDATE_TO_HIRED, (err, results) => {
		if (err) {
			return res.send(err)
		} else res.send('Update News To Hired Success !')
	});
});

//Delete News
app.get('/deleteNews', (req, res) => {
	const { id } = req.query;
	const DEL_NEWS = `DELETE FROM news where id=${id}`;
	connection.query(DEL_NEWS, (err, results) => {
		if (err) {
			return res.send(err)
		} else res.send('Delete news success!')
	});
});

//Update News
app.get('/listNews/editNews', (req, res) => {
	const { title, body, id } = req.query;
	var dt3 = dateTime.create();
	var date_create3 = dt3.format('Y-m-d');
	const UPDATE_NEWS = `UPDATE news SET title='${title}', body='${body}', date_update='${date_create3}' WHERE id=${id}`;
	connection.query(UPDATE_NEWS, (err, results) => {
		if (err) {
			return res.send(err)
		} else res.send('update news success !!')
	});
});

// Find News by Id
app.get('/listnews/findById', (req, res) => {
	const { id } = req.query;
	const FIND_NEWS_BY_ID = `SELECT * FROM news WHERE id=${id}`;
	connection.query(FIND_NEWS_BY_ID, (err, results) => {
		if(err){
			return res.send(err)
		} else {
			return res.json({
				data: results
			})
		}
	});
});

// Send email with mail send is gmail....
app.get('/send-email', (req, res) => {
	const { name, email, subject, message } = req.query;
	//get current datetime format
	var dt = dateTime.create();
	var date_create = dt.format('Y-m-d H:M');
	const INSERT_CUSTOMERS = `INSERT INTO customers(name, email, subject, message, date_create, status) VALUES('${name}', '${email}', '${subject}', '${message}', '${date_create}', '0')`;
	nodemailer.createTestAccount((err, acount) => {
		const htmlEmail = `
            <h4>Dear ${name},</h4>
            <span>Thank you for have ideas for our Company. We received your message and will reply you as soon as.</span><br/>
			<span>Best Regard !</span><br/>    
			<span>Please dont reply this email !</span><br/>       
            <h4>ARCH VIETNAM Co. Ltd</h4>
            <span>Address: Tầng 17, Danang Software Park
            Số 02 Quang Trung, quận Hải Châu, thành phố Đà Nẵng.</span><br/> 
						<span>Website: https://arch-vietnam.vn</span><br/>
						<span>Facebook: ARCH VietNam - Offshore Company</span><br/>
						<span>Cellphone: 02363-888-575</span>           
        `
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'tonthat90@gmail.com', // generated ethereal user
				pass: 'hoilamchy321' // generated ethereal password
			}
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"Ly Ku 👻" <tonthat90@gmail.com>', // sender address
			to: `${email}, tonthat90@gmail.com`, // list of receivers
			subject: 'Thank You From ARCH VIETNAM', // Subject line
			text: message, // plain text body
			html: htmlEmail // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		});
	}),
		// Insert Customer to database
		connection.query(INSERT_CUSTOMERS, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else res.send('added CUSTOMER success !')
		})

});

//rep mail to customer
app.get('/reply-email', (req, res) => {
	const { email, subject, message } = req.query;
	nodemailer.createTestAccount((err, acount) => {
		const htmlEmail = `
			<span>${message}</span><br/>
			<span>Best Regard !</span><br/>
			<span>Please dont reply this email !</span><br/>          
            <h4>ARCH VIETNAM Co. Ltd</h4>
            <span>Address: Tầng 17, Danang Software Park
            Số 02 Quang Trung, quận Hải Châu, thành phố Đà Nẵng.</span><br/> 
						<span>Website: https://arch-vietnam.vn</span><br/>
						<span>Facebook: ARCH VietNam - Offshore Company</span><br/>
						<span>Cellphone: 02363-888-575</span>           
        `
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'tonthat90@gmail.com', // generated ethereal user
				pass: 'hoilamchy321' // generated ethereal password
			}
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"Ly Ku 👻" <tonthat90@gmail.com>', // sender address
			to: `${email}, tonthat90@gmail.com`, // list of receivers
			subject: subject, // Subject line
			text: message, // plain text body
			html: htmlEmail // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		});
	})
});

//get all customer
app.get('/customers', (req, res) => {
	const ALL_CUSTOMERS = 'SELECT * FROM customers ORDER BY date_create DESC';
	connection.query(ALL_CUSTOMERS, (err, results) => {
		if (err) {
			return res.send(err)
		} else {
			return res.json({
				data: results
			})
		}
	});
});

//find customer by id
app.get('/customers/findById', (req, res) => {
	const { id } = req.query;
	const FIND_CUSTOMER_BY_ID = `SELECT * FROM customers WHERE id = ${id}`;
	connection.query(FIND_CUSTOMER_BY_ID, (err, results) => {
		if (err) {
			return res.send(err)
		} else {
			return res.json({
				data: results
			})
		}
	});
});

// count message don't read
app.get('/customers/count', (req, res) => {
	const SELECT_COUNT = `SELECT * FROM customers WHERE status = '0'`;
	connection.query(SELECT_COUNT, (err, results) => {
		if (err) {
			return res.send(err)
		} else {
			return res.json({
				data: results
			})
		}
	})
});

// update status
app.get('/customers/updateStatus', (req, res) => {
	const { status, id } = req.query;
	const UPDATE_CUSTOMR = `UPDATE customers SET status = '${status}' WHERE id = ${id}`;
	connection.query(UPDATE_CUSTOMR, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else res.send('update status success !')
	})
});

// delete customer
app.get('/customers/deleteCustomer', (req, res) => {
	const { id } = req.query;
	const DELETE_CUSTOMER = `DELETE FROM customers WHERE id = ${id}`;
	connection.query(DELETE_CUSTOMER, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else res.send('delete customer success !')
	})
});

// get users
app.get('/users', (req, res) => {
	const ALL_USERS = `SELECT * FROM users `;
	connection.query(ALL_USERS, (err, results) => {
		if (err) {
			return res.send(err)
		} else {
			return res.json({
				data: results
			})
			
		}
	});
});

// add user
app.get('/users/addUser', (req,res) => {
	const { username, email, password, fullname, rolename, address, birthday, phone, username_create } = req.query;
	var dt4 = dateTime.create();
	var date_create4 = dt4.format('Y-m-d');
	const INSERT_USER = `INSERT INTO users(username, email, password, fullname, date_create, rolename, address, birthday, phone, username_create) VALUES
				('${username}', '${email}', '${password}', '${fullname}', '${date_create4}', '${rolename}', '${address}', '${birthday}', '${phone}', '${username_create}')`;
	connection.query(INSERT_USER, (err, results) => {
		if(err){
			return res.send(err)
		}else res.send('insert user success !')
	});
});

// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
	next();
});


// INstantiating the express-jwt middleware
const jwtMW = exjwt({
	secret: 'keyboard cat 4 ever'
});

//get users from DB
let users = [];
connection.query("select * from users", function(err,results){
	if(err){
		console.log(err);
		return;
	}
	users = results;
});


// LOGIN ROUTE
app.post('/login', (req, res) => {
		
	const { username, password } = req.body;
	// Use your DB ORM logic here to find user and compare password
	for (let user of users) { // I am using a simple array users which i made above
		if (username == user.username && password == user.password /* Use your password hash checking logic here !*/) {
			//If all credentials are correct do this
			let token = jwt.sign({ id: user.id, username: user.username }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
			res.json({
				sucess: true,
				err: null,
				token
			});
			break;
		}
		else {
			res.status(401).json({
				sucess: false,
				token: null,
				err: 'Username or password is incorrect'
			});
		}
	}
});

app.get('/', jwtMW /* Using the express jwt MW here */, (req, res) => {
	res.send('You are authenticated'); //Sending some response when authenticated
});

// Error handling 
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
		res.status(401).send(err);
	}
	else {
		next(err);
	}
});

// Starting the app on PORT 3000
const PORT = 8080;
app.listen(PORT, () => {
	// eslint-disable-next-line
	console.log(`Magic happens on port ${PORT}`);
});
