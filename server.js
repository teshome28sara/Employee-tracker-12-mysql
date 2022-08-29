const inquirer = require("inquirer");
cTable = require( "console.table");
const mysql = require("mysql");


require('dotenv').config();

const connection = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: 'employee_tracker_db'
      
    });

    connection.connect(function(err){
      if (err) throw err;
      console.log("welcome to the employee tracker database!")
      startPrompt();
  })

  

  function startPrompt() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Welcome to our employee database! What would you like to do?',
            choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update employee role',
                    "Delete an employee",
                    'EXIT'
                    ]
            }).then(function (answer) {
                switch (answer.action) {
                    case 'View all departments':
                        viewDepartments();
                        break;
                    case 'View all roles':
                        viewRoles();
                        break;
                    case 'View all employees':
                        viewEmployees();
                        break;
                    case 'Add a department':
                        addDepartment();
                        break;
                    case 'Add a role':
                        addRole();
                        break;
                    case 'Add an employee':
                        addEmployee();
                        break;
                    case 'Update employee role':
                        updateRole();
                        break;
                    case 'Delete an employee':
                        deleteEmployee();
                        break;
                    case 'EXIT': 
                        exitApp();
                        break;
                    // default:
                    //     break;
                }
        })
};

 // view all departments in the database
 function viewDepartments() {
  var query = 'SELECT * FROM department';
  connection.query(query, function(err, res) {
      if(err)throw err;
      console.table('All Departments:', res);
      startPrompt();
  })
};

// view all roles in the database
function viewRoles() {
  var query = 'SELECT * FROM role';
  connection.query(query, function(err, res){
      if (err) throw err;
      console.table('All Roles:', res);
      startPrompt();
  })
};


// view all employees in the database
function viewEmployees() {
    var query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found!');
        console.table('All Employees:', res); 
        startPrompt();
    })
};

// view all departments in the database


// add an employee to the database
function addEmployee() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "What is the employee's first name? ",
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "What is the employee's last name? "
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "What is the employee's manager's ID? "
                },
                {
                    name: 'role', 
                    type: 'list',
                    choices: function() {
                    var roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                    },
                    message: "What is this employee's role? "
                }
                ]).then(function (answer) {
                    let role_id;
                    for (let a = 0; a < res.length; a++) {
                        if (res[a].title == answer.role) {
                            role_id = res[a].id;
                            console.log(role_id)
                        }                  
                    }  
                    connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('Your employee has been added!');
                        viewEmployees();
                        startPrompt();
                    })
                })
        })
};

// add a department to the database
function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'newDepartment', 
                type: 'input', 
                message: 'Which department would you like to add?'
            }
            ]).then(function (answer) {
                connection.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.newDepartment
                    });
                var query = 'SELECT * FROM department';
                connection.query(query, function(err, res) {
                if(err)throw err;
                console.log('Your department has been added!');
                console.table('All Departments:', res);
                viewDepartments();
                startPrompt();
                })
            })
};

// add a role to the database
function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
    
        inquirer 
        .prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "What new role would you like to add?"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role? (Enter a number)'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var deptArry = [];
                    for (let i = 0; i < res.length; i++) {
                    deptArry.push(res[i].name);
                    }
                    return deptArry;
                },
            }
        ]).then(function (answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    department_id = res[a].id;
                }
            }
    
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, res) {
                    if(err)throw err;
                    console.log('Your new role has been added!');
                    console.table('All Roles:', res);
                    viewRoles();
                    startPrompt();
                })
        })
    })
}; 

function updateRole() {
    connection.query("select * from employee;", function (err, results) {
      if (err) throw err;
      inquirer
        .prompt({
          name: "updateChooseEmployee",
          type: "list",
          message: "Please select the employee you wish to update: ",
          choices: function () {
            var choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              choiceArray.push(
                i + 1 + " " + results[i].first_name + " " + results[i].last_name
              );
            }
            return choiceArray;
          },
        })
        .then(function (answer) {
          var chosenEmployeeID = parseInt(answer.updateChooseEmployee[0]);
          connection.query("select * from role;", function (err, results) {
            if (err) throw err;
            inquirer
              .prompt({
                name: "updateEmployeeRole",
                type: "list",
                message: "Please select the new role for the chosen employee: ",
                choices: function () {
                  var choiceArray = [];
                  for (let i = 0; i < results.length; i++) {
                    choiceArray.push(i + 1 + " " + results[i].title);
                  }
                  return choiceArray;
                },
              })
              .then(function (answer) {
                console.log(chosenEmployeeID);
                var updatedRoleID = parseInt(answer.updateEmployeeRole[0]);
                connection.query(
                  "update employee set role_id = ? where id = ?;",
                  [updatedRoleID,
                  chosenEmployeeID],
                  function (err) {
                    if (err) throw err;
                    console.log("Employee role updated successfully!");
                    viewEmployees();
                    startPrompt();
                  }
                );
              });
          });
        });
    });
  }


            // function updateRole() {
            //     connection.query('SELECT * FROM employee', function (err, result) {
            //       if (err) throw (err);
            //       inquirer
            //         .prompt([
            //           {
            //             name: "employeeName",
            //             type: "list",
                
            //             message: "Which employee's role is changing?",
            //             choices: function () {
            //               var employeeArray = [];
            //               // for (let i = 0; i < res.length; i++) {
            //               //     employeeArray.push(res[i].last_name);
            //               // }
            //               var employeeArray = [];
            //               result.forEach(result => {
            //                 employeeArray.push(
            //                   result.last_name
            //                 )});
                          
            //               return employeeArray;
            //             }
            //           }
            //         ])
                 
            //         .then(function (answer) {
            //           console.log(answer);
            //           const name = answer.employeeName;
                    
            //           connection.query("SELECT * FROM employee", function (err, res) {
            //             inquirer
            //               .prompt([
            //                 {
            //                   name: "employeeRole",
            //                   type: "list",
            //                   message: "What is their new role?",
            //                   choices: function () {
            //                     var roleArray = [];
            //                     var newroleArray = [];
            //               // for (let i = 0; i < res.length; i++) {
            //               //     roleArray.push(res[i].title);
            //               // }
            //                     res.forEach(res => {
            //                       roleArray.push(
            //                         res.job_title)
            //                     })
            //                     return roleArray;
            //                   }
            //                 }
            //               ]).then(function (answer) {
            //                 console.log(name);
            //                 const role = answer.employeeRole;
                           
            //                 connection.query('SELECT * FROM employee WHERE last_name = ?', [name], function (err, res) {
            //                   console.log(res[0].last_name)
            //                   console.log(role)
            //                   if (err) throw (err);
            //                   // let newRole = res[0].name;
                 
            //                   let query = `UPDATE employee SET job_title = "${role}" WHERE last_name = "${name}";`;
            //                   // let values = role
                      
            //                   connection.query(query,
            //                     function (err, res, fields) {
            //                       console.log(`You have updated ${name}'s role to ${role}.`)
            //                     })
            //                   viewEmployees();
            //                   startPrompt();
            //                 })
            //               })
            //           })
                      
            //         })
            //     })
            //     };

           
            