import $api, { API_URL } from './index';

export const register = async (userData) => {
  try {
    const response = await $api.post(`${API_URL}/auth/register`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 409) {
      return {
        success: false,
        error: error.response?.data?.error || 'Пользователь с таким email уже существует'
      };
    }
    return {
      success: false,
      error: error.response?.data?.error || 'Ошибка регистрации'
    };
  }
}
export const login = async (credentials) => {
  try {
    const response = await $api.post(`${API_URL}/auth/authenticate`, credentials);

    // Убедитесь что используете правильные названия полей
    if (response.data.access_token && response.data.refresh_token) {
        return { success: true, data: response.data };
    } else {
        return {
            success: false,
            error: 'Invalid response from server'
        };
    }
  } catch (error) {
    return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Ошибка авторизации'
    };
  }
}
export const getCurrentUser = async () => {
  try {
    const response = await $api.get(`${API_URL}/users/me`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error getCurrentUser:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения данных пользователя'
    };
  }
}
export const RefreshToken = async (refresh_token) => {
  try {
    const response = await $api.post(`${API_URL}/refresh-token`, {
      refresh: refresh_token
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения токена'
    };
  }
}

export const getUserById = async (id) => {
  try {
    const response = await $api.get(`${API_URL}/users/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения пользователя'
    };
  }
}
export const getUserByEmail = async (email) => {
  try {
    const response = await $api.get(`${API_URL}/users/email/${email}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения пользователя'
    };
  }
}

export const getAllStaffSchedules = async () => {
  try {
    const response = await $api.get(`${API_URL}/staff_schedule`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения штатных расписаний'
    };
  }
}

export const getTotalStaffUnitsByBranch = async () => {
  try {
    const response = await $api.get(`${API_URL}/staff_schedule/total-staff_units`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения суммарных штатных единиц'
    };
  }
}

export const getStaffUnitsByDateRange = async (startDate, endDate) => {
  try {
    const response = await $api.get(`${API_URL}/staff_schedule/by_date_range`, {
      params: { startDate, endDate }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения штатных единиц за период'
    };
  }
}

export const createStaffSchedule = async (staffScheduleData) => {
  try {
    const response = await $api.post(`${API_URL}/staff_schedule`, staffScheduleData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка создания штатного расписания'
    };
  }
}
export const getAllPositions = async () => {
  try {
    const response = await $api.get(`${API_URL}/positions`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения должностей'
    };
  }
}

export const getPositionById = async (id) => {
  try {
    const response = await $api.get(`${API_URL}/positions/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения должности'
    };
  }
}

export const createPosition = async (positionData) => {
  try {
    const response = await $api.post(`${API_URL}/positions`, positionData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка создания должности'
    };
  }
}

export const updatePosition = async (id, positionData) => {
  try {
    const response = await $api.put(`${API_URL}/positions/${id}`, positionData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка обновления должности'
    };
  }
}

export const deletePosition = async (id) => {
  try {
    const response = await $api.delete(`${API_URL}/positions/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка удаления должности'
    };
  }
}

export const getSalarySumByPosition = async () => {
  try {
    const response = await $api.get(`${API_URL}/positions/salary-sum`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения суммы зарплат'
    };
  }
}

export const getAverageSalaryByPositionWithCondition = async () => {
  try {
    const response = await $api.get(`${API_URL}/positions/average-salary`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения средней зарплаты'
    };
  }
}

export const getMinMaxSalary = async () => {
  try {
    const response = await $api.get(`${API_URL}/positions/min-max-salary`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения минимальной и максимальной зарплаты'
    };
  }
}
export const getOrderById = async (id) => {
  try {
    const response = await $api.get(`${API_URL}/orders/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения заказа'
    };
  }
}

export const createOrder = async (orderData) => {
  try {
    const response = await $api.post(`${API_URL}/orders`, orderData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка создания заказа'
    };
  }
}

export const createEmployee = async (title) => {
  try {
    const response = await $api.get(`${API_URL}/employees`, {
      params: { title }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения новостей'
    };
  }
}
export const getAllEmployees = async () => {
  try {
    const response = await $api.get(`${API_URL}/employees`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения сотрудников'
    };
  }
}

export const getEmployeeById = async (id) => {
  try {
    const response = await $api.get(`${API_URL}/employees/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения сотрудника'
    };
  }
}

export const updateOrder = async (id, orderData) => {
  try {
    const response = await $api.put(`${API_URL}/orders/${id}`, orderData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка обновления заказа'
    };
  }
}

export const deleteOrder = async (id) => {
  try {
    const response = await $api.delete(`${API_URL}/orders/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка удаления заказа'
    };
  }
}

export const getAllOrders = async () => {
  try {
    const response = await $api.get(`${API_URL}/orders`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения заказов'
    };
  }
}
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await $api.put(`${API_URL}/employees/${id}`, employeeData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка обновления сотрудника'
    };
  }
}

export const deleteEmployee = async (id) => {
  try {
    const response = await $api.delete(`${API_URL}/employees/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка удаления сотрудника'
    };
  }
}

export const getEmployeeNamesAndPhones = async () => {
  try {
    const response = await $api.get(`${API_URL}/employees/names-phones`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения имен и телефонов'
    };
  }
}

export const getDistinctPositions = async () => {
  try {
    const response = await $api.get(`${API_URL}/employees/distinct-positions`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения уникальных должностей'
    };
  }
}

export const getEmployeesSortedByHireDate = async () => {
  try {
    const response = await $api.get(`${API_URL}/employees/sorted-by-hire-date`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения отсортированных сотрудников'
    };
  }
}

export const searchEmployees = async (name) => {
  try {
    const response = await $api.get(`${API_URL}/employees/search`, {
      params: { name }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка поиска сотрудников'
    };
  }
}

export const getEmployeesByComplexCondition = async () => {
  try {
    const response = await $api.get(`${API_URL}/employees/complex-condition`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка выполнения сложного запроса'
    };
  }
}
export const getAllDepartments = async () => {
  try {
    const response = await $api.get(`${API_URL}/department`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения отделов'
    };
  }
}

export const getDepartmentById = async (id) => {
  try {
    const response = await $api.get(`${API_URL}/department/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения отдела'
    };
  }
}

export const createDepartment = async (departmentData) => {
  try {
    const response = await $api.post(`${API_URL}/department`, departmentData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка создания отдела'
    };
  }
}

export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await $api.put(`${API_URL}/department/${id}`, departmentData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка обновления отдела'
    };
  }
}

export const deleteDepartment = async (id) => {
  try {
    const response = await $api.delete(`${API_URL}/department/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка удаления отдела'
    };
  }
}
export const getAllBranches = async () => {
  try {
    const response = await $api.get(`${API_URL}/branch`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения филиалов'
    };
  }
}

export const getBranchById = async (id) => {
  try {
    const response = await $api.get(`${API_URL}/branch/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения филиала'
    };
  }
}

export const createBranch = async (branchData) => {
  try {
    const response = await $api.post(`${API_URL}/branch`, branchData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка создания филиала'
    };
  }
}

export const updateBranch = async (id, branchData) => {
  try {
    const response = await $api.put(`${API_URL}/branch/${id}`, branchData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка обновления филиала'
    };
  }
}

export const deleteBranch = async (id) => {
  try {
    const response = await $api.delete(`${API_URL}/branch/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка удаления филиала'
    };
  }
}