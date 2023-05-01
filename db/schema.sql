-- scheema should contain the following 3 tbls:
-- department, role, employee

DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;


CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
     FOREIGN KEY (department_id) REFERENCES department(id)
);


CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  -- FOREIGN KEY (role_id),
  FOREIGN KEY(role_id) REFERENCES role(id),
  -- FOREIGN KEY (manager_id) REFERENCES employee(id)
);



