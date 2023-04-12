
const inquirer = require('inquirer');


// npm install mysql2 inquirer console.table
const mysql = require('mysql2');
const consoleTable = require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_db'
  });
  connection.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
  });


const PORT = 3001;

const app = express();


inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ])
  .then(answers => {
    switch (answers.action) {
      case 'View all departments':
        // Perform action to view all departments
        break;
      case 'View all roles':
        // Perform action to view all roles
        break;
      case 'View all employees':
        // Perform action to view all employees
        break;
      case 'Add a department':
        // Perform action to add a department
        break;
      case 'Add a role':
        // Perform action to add a role
        break;
      case 'Add an employee':
        // Perform action to add an employee
        break;
      case 'Update an employee role':
        // Perform action to update an employee role
        break;
      case 'Exit':
        // Exit the application
        process.exit();
        break;
    }
  });

  connection.query('SELECT * FROM departments', (err, results) => {
    if (err) throw err;
    console.table(results);
  });

  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:'
    }
  ])
  .then(answers => {
    connection.query('INSERT INTO departments SET ?', { name: answers.name }, (err, results) => {
      if (err) throw err;
      console.log('Department added successfully');
    });
  });

  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) throw err;
    const choices = results.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
    inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId'
      }
    ]);
  });