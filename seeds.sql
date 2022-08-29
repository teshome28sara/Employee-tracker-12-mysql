-- USE employee_tracker_db;


INSERT INTO department (name)
VALUES 
('Technology'),
('Accounting'),
('Legal'),
('Health Care'),
('Construction'),
('Sales and Marketing');

INSERT INTO role (title, salary, department_id)
VALUES
('Web Designer', 78000, 1),
('Accountant', 49000, 2),
('Loyer', 80000, 3),
('Doctor', 100000, 4),
('Builder', 56000, 5),
('Marketing  Rep', 51000, 6);

INSERT INTO employee (first_name, last_name,  role_id, manager_id)
VALUES 
('Lisa', 'Lee',  1, 257),
('Mya', 'Allen',   2, 477),
('Lucy', 'Markis',  3, 687),
('jake', 'Farm',   4, 817),
("Dan", "Davidson", 5, 765),

('Mika', 'Garson',   6, 467);