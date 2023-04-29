const inquirer = require("inquirer");
const util = require("util");
// npm install mysql2 inquirer console.table
const mysql = require("mysql2");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kissy54321!!",
  database: "employees_db",
});
connection.connect((err) => {
  if (err) console.log(err);

  console.log("Connected to database");
});

const PORT = 3001;

function mainMenuQuestions() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      let choice = answers.action;
      // console.log(choice)
      console.log("before switch");
      switch (choice) {
        case "View all departments":
          viewAllDepartments();
          // Perform action to view all departments
          console.log("here are all the departments");
          break;
        case "View all roles":
          viewAllRoles();
          // Perform action to view all roles
          break;
        case "View all employees":
          viewAllEmployees();
          // Perform action to view all employees
          break;
        case "Add a department":
          addDepartment();
          // Perform action to add a department
          break;
        case "Add a role":
          addRole();
          // Perform action to add a role
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          // Perform action to update a role
          break;
        case "Add an employee":
          addEmployee();
          // Perform action to add an employee
          break;
        case "Exit":
          // Exit the application
          process.exit();
        // add a default
      }
    });
}

const viewAllDepartments = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    console.table(results);
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "return",
          message: "return to main menu?",
        },
      ])
      .then((answer) => {
        mainMenuQuestions();
      });
  });
};

const viewAllRoles = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    console.table(results);
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "return",
          message: "return to main menu?",
        },
      ])
      .then((answer) => {
        if (answer.return) {
         } mainMenuQuestions();
      });
  });
};

mainMenuQuestions();

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data,
//  including employee ids, first names, last names, job titles, departments, salaries,
//   and managers that the employees report to
const viewAllEmployees = () => {
  var queryString = "SELECT e.id, e.first_name, e.last_name, r.title,";
  queryString +=
    "d.name, r.salary, mgr.first_name as mgrFirstName, mgr.last_name as mgrLastName FROM employee e ";
  queryString += "left join role r on e.role_id = r.id ";
  queryString += "left join department d on r.department_id = d.id ";
  queryString += "left join employee mgr on mgr.id = e.manager_id;";

  connection.query(queryString, (err, results) => {
    if (err) throw err;
    console.log(results);
    console.table(results);
    mainMenuQuestions();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO department SET ?",
        { name: answers.name },
        (err, results) => {
          if (err) throw err;
          console.log("Department added successfully");
          mainMenuQuestions();
        }
      );
    });
};

const addRole = () => {
  inquirer // Prompt the user for the role title, salary, and department ID
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the role title:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the role salary:",
      },
      {
        type: "input",
        name: "departmentId",
        message: "Enter the department ID for the role:",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answers.title,
          salary: answers.salary,
          department_id: answers.departmentId,
        },
        (err, results) => {
          if (err) throw err;
          console.log("Role added successfully");
          mainMenuQuestions();
        }
      );
    });
};

//
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
      },
      {
        type: "input",
        name: "roleId",
        message: "Enter the employee's role ID:",
      },
      {
        type: "input",
        name: "managerId",
        message: "Enter the employee's manager ID:",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answers.firstName,
          last_name: answers.lastName,
          role_id: answers.roleId,
          manager_id: answers.managerId,
        },
        (err, results) => {
          if (err) throw err;
          console.log("Employee added successfully");
          mainMenuQuestions();
        }
      );
    });
};

const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeId",
        message: "Enter the employee's ID:",
      },
      {
        type: "input",
        name: "roleId",
        message: "Enter the employee's new role ID:",
      },
    ])
    .then((answers) => {
      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: answers.roleId,
          },
          {
            id: answers.employeeId,
          },
        ],
        (err, results) => {
          if (err) throw err;
          console.log("Employee role updated successfully");
          mainMenuQuestions();
        }
      );
    });
};
