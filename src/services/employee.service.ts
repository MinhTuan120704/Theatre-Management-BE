import Employee from '../models/employee.model';

export class EmployeeService {
  static async create(data: any) {
    return Employee.create(data);
  }

  static async getAll() {
    return Employee.findAll();
  }

  static async getById(employee_id: number) {
    return Employee.findByPk(employee_id);
  }

  static async update(employee_id: number, data: Partial<Employee>) {
    const employee = await Employee.findByPk(employee_id);
    if (!employee) return null;
    return employee.update(data);
  }

  static async delete(employee_id: number) {
    const employee = await Employee.findByPk(employee_id);
    if (!employee) return null;
    await employee.destroy();
    return true;
  }
}
