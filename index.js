const express = require('express');
const { resolve } = require('path');

const app = express();
let { sequelize } = require('./lib/index');
let { employee } = require('./models/employee.model');

app.use(express.json());

let employeeData = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Manager',
    department: 'Sales',
    salary: 90000,
  },
  {
    id: 2,
    name: 'Anna Brown',
    designation: 'Developer',
    department: 'Engineering',
    salary: 80000,
  },
  {
    id: 3,
    name: 'James Smith',
    designation: 'Designer',
    department: 'Marketing',
    salary: 70000,
  },
  {
    id: 4,
    name: 'Emily Davis',
    designation: 'HR Specialist',
    department: 'Human Resources',
    salary: 60000,
  },
  {
    id: 5,
    name: 'Michael Wilson',
    designation: 'Developer',
    department: 'Engineering',
    salary: 85000,
  },
  {
    id: 6,
    name: 'Sarah Johnson',
    designation: 'Data Analyst',
    department: 'Data Science',
    salary: 75000,
  },
  {
    id: 7,
    name: 'David Lee',
    designation: 'QA Engineer',
    department: 'Quality Assurance',
    salary: 70000,
  },
  {
    id: 8,
    name: 'Linda Martinez',
    designation: 'Office Manager',
    department: 'Administration',
    salary: 50000,
  },
  {
    id: 9,
    name: 'Robert Hernandez',
    designation: 'Product Manager',
    department: 'Product',
    salary: 95000,
  },
  {
    id: 10,
    name: 'Karen Clark',
    designation: 'Sales Associate',
    department: 'Sales',
    salary: 55000,
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await employee.bulkCreate(employeeData);

    res.status(200).json({ message: 'Database seeding successfull' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

//Funnction to fetch all employees in the database
async function fetchAllEmployees() {
  let employees = await employee.findAll();
  return { employees };
}

//Endpoint 1: Fetch all employees
app.get('/employees', async (req, res) => {
  try {
    let response = await fetchAllEmployees();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to insert the new employee into the database
async function addNewEmployee(newEmployee) {
  let response = await employee.create(newEmployee);

  return { response };
}

//Endpoint 2: Add a new employee in the database
app.post('/employees/new', async (req, res) => {
  try {
    let newEmployee = req.body.newEmployee;
    let response = await addNewEmployee(newEmployee);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to update the employee in the database
async function updateEmployeeById(updatedEmployeeData, id) {
  let employeeDetails = await employee.findOne({ where: { id } });

  if (!employeeDetails) {
    return {};
  }

  employeeDetails.set(updatedEmployeeData);
  let updatedEmployee = await employeeDetails.save();

  return { message: 'Employee updated successfully', updatedEmployee };
}

//Endpoint 3: Update employee information
app.post('/employees/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newEmployeeData = req.body;
    let response = await updateEmployeeById(newEmployeeData, id);

    if (!response.message) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to delete the employee record from the database
async function deleteEmployeeById(id) {
  let deletedEmployee = await employee.destroy({ where: { id } });

  if (deletedEmployee === 0) {
    return {};
  }

  return { message: 'Employee record deleted successfully' };
}

//Endpoint 4: Delete an employee from the database
app.post('/employees/delete', async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let response = await deleteEmployeeById(id);

    if (!response.message) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
