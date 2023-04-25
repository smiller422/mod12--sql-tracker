const inquirer = require("inquirer");
const util = require('util');
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
        viewAllRoles()
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
          // Perform action to add an employee
          break;
        case "Exit":
          // Exit the application
          process.exit();
        // add a default
      }
    });
}
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data,
//  including employee ids, first names, last names, job titles, departments, salaries,
//   and managers that the employees report to
const viewAllEmployees = () => {
var queryString = "SELECT e.id, e.first_name, e.last_name, r.title,"
  queryString += "d.name, r.salary, mgr.first_name as mgrFirstName, mgr.last_name as mgrLastName FROM employee e "
  queryString += "left join role r on e.role_id = r.id "
  queryString += "left join department d on r.department_id = d.id "
  queryString += "left join employee mgr on mgr.id = e.manager_id;"

  connection.query(queryString, (err, results) => {
    if (err) throw err;
    console.log(results)
    console.table(results);
    mainMenuQuestions()
  });
};

const viewAllDepartments = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenuQuestions()
  });
};
const viewAllRoles = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    console.table(results);
    mainMenuQuestions()
  });
};

mainMenuQuestions();

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
          mainMenuQuestions()
        }
      );
    });
};

const addRole = async () => {
  const query = util.promisify(connection.query).bind(connection);
  let departmentList
  await query("SELECT * FROM department", (err, results) => {
    console.log(results)
if (err) throw err;
 departmentList = Object.values(results);
 inquirer
 .prompt([
   {
     type: "input",
     name: "title",
     message: "Enter the name of the role:",
   },
   {
     type: "input",
     name: "salary",
     message: "Enter the salary:",
   },
   {
      type: "list",
      name: "department",
      message: "Select the department:",
      choices: ["Sales", "Engineering", "Finance", "Legal"]
    
   },
 ])
 .then((answers) => {
   const salary = parseFloat(answers.salary).toFixed(2)
   const departmentId = answers.department 
   connection.query(
     "INSERT INTO role(title, salary, department_id) VALUE (?)",
     { title: answers.title, 
       salary: salary, 
       department_id: departmentId
      },
     (err, results) => {
       if (err) throw err;
       console.log("Role added successfully");
       mainMenuQuestions()
     }
   );
 })});
console.log("are u here")
 
};

const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeId",
        message: "Enter the ID of the employee you want to update:",
      },
      {
        type: "input",
        name: "roleId",
        message: "Enter the ID of the new role for the employee:",
      },
    ])
    .then((answers) => {
      const employeeId = answers.employeeId;
      const roleId = answers.roleId;
      // Perform the update query using the employeeId and roleId
      // Update the employee's role in the database
      // ...
      // After the update is complete, show a success message and return to the main menu
      console.log("Employee role updated successfully");
      mainMenuQuestions();
    });
};


// const addEmployee = async () => {
//   const query = util.promisify(connection.query).bind(connection);
//   const roles = await query("SELECT * FROM role");
//   const employees = await query("SELECT * FROM employee");
//   // let employeeList  = await query("SELECT * FROM employee");
//   let employeeList = await query("SELECT * FROM role");
//   // const managerList = await query("SELECT * FROM manager");
//   const managerList = await query("SELECT * FROM employee");
// //   await query("SELECT * FROM employee", (err, results) => {
// // if (err) throw err;
// //  employeeList = Object.values(results);

const addEmployee = async () => {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const roles = await query("SELECT * FROM role");
    const employees = await query("SELECT * FROM employee");

    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const managerChoices = [
      { name: "None", value: null },
      ...employees
        .filter((employee) => employee.manager_id === null)
        .map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
    ];

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the first name of the employee:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the last name of the employee:",
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the role:",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "managerId",
        message: "Select the manager:",
        choices: managerChoices,
      },
    ]);

    await query("INSERT INTO employee SET ?", {
      first_name: answers.firstName,
      last_name: answers.lastName,
      role_id: answers.roleId,
      manager_id: answers.managerId,
    });

    console.log("Employee added successfully");
    mainMenuQuestions();
  } catch (error) {
    console.error(error)
}};
//     mainMenuQuestions();
//   }
// };
//  inquirer
//  .prompt([
//    {
//      type: "input",
//      name: "firstName",
//      message: "Enter the first name of the employee:",
//    },
//    {
//      type: "input",
//      name: "lastName",
//      message: "Enter the last name of the employee:",
//    },
//    {
//      type: "list",
//      name: "roleId",
//      message: "Select the role:",
//    },
//    {
//      type: "list",
//      name: "managerId",
//      message: "Select employees manager",
//      choices: [
//       { name: "None", value: null },
//       ...managerList.map((manager) => ({
//         name: `${manager.first_name} ${manager.last_name}`,
//         value: manager.id,
//    })),
//  ]}]
//  .then((answers) => {
//   connection.query(
//     "INSERT INTO employee SET ?",
//     {
//       first_name: answers.firstName,
//       last_name: answers.lastName,
//       role_id: answers.roleId,
//       manager_id: answers.managerId,
//     },
//     (err, results) => {
//       if (err) throw err;
//       console.log("Employee added successfully");
//       mainMenuQuestions();
//     }
//   );
// }));                          commented out 280-here, weell one line below
//  .then((answers) => {
//   //  const salary = parseFloat(answers.salary).toFixed(2)
//   connection.query(
//     "INSERT INTO employee SET ?",
//    const employeeId = answers.employee 
   
     
//      { title: answers.addRole, 
//       },
//      (err, results) => {
//        if (err) throw err;
//        console.log("Employee added successfully");
//        mainMenuQuestions()
//      }
//    );
//  })});
// console.log("are u here")
 
// };
// connection.query("SELECT * FROM employees", (err, results) => {
//   if (err) throw err;
//   const choices = results.map((employee) => ({
//     name: `${employee.first_name} ${employee.last_name}`,
//     value: employee.id,
//   }));
//   inquirer.prompt([
//     {
//       type: "list",
//       name: "employeeId",
//     },
//   ]);
// });