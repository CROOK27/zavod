import $api, { API_URL } from './index';
import axios from 'axios';

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
// В ваш файл api.js добавьте:
export const login = async (email, password) => {
    try {
        console.log('API: Отправка запроса на логин:', {
            email,
            password: password ? '***' : 'empty',
            url: '/auth/authenticate'
        });

        const requestData = {
            email: email,
            password: password
        };

        console.log('API: Данные запроса:', JSON.stringify(requestData));

        const response = await $api.post('/auth/authenticate', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        console.log('API: Успешный ответ от сервера:', response);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('API: Полная ошибка при логине:', error);
        console.error('API: Response data:', error.response?.data);
        console.error('API: Response status:', error.response?.status);
        console.error('API: Response headers:', error.response?.headers);

        const errorMessage = error.response?.data?.message ||
                           error.response?.data?.error ||
                           error.message ||
                           'Ошибка авторизации';

        return {
            success: false,
            error: errorMessage,
            status: error.response?.status
        };
    }
};
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
export const getUserByToken = async (token = null) => {
    if (token) {
      return axios.get(`${API_URL}/users/by-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    // Иначе используем токен из localStorage через интерцептор
    return api.get('/users/by-token');
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
    console.log('API: Получение пользователя по email:', email);

    // Получаем токен из localStorage
    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('Токен авторизации не найден');
    }

    const response = await $api.get(`${API_URL}/users/email/${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API: Успешный ответ getUserByEmail:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.log('Error in getUserByEmail:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения пользователя',
      status: error.response?.status
    };
  }
};

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

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await $api.put(`${API_URL}/orders/${orderId}/status`, { status });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка обновления статуса заказа'
    };
  }
}
export const getOrdersUserById = async (userId) => {
  try {
    const response = await $api.get(`${API_URL}/orders/user/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения заказа'
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
    console.log("orders data: ", orderData);
    console.log("orders create: ", response);
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
    const response = await $api.post(`${API_URL}/employees`, title);
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
export const getEmployeeByUserId = async (id) => {
  try {
    const response = await $api.get(`${API_URL}/employees/by-user-with-details/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка получения сотрудника'
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
    const response = await $api.get(`${API_URL}/branches`);
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
    const response = await $api.get(`${API_URL}/branches/${id}`);
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
    const response = await $api.post(`${API_URL}/branches`, branchData);
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
    const response = await $api.put(`${API_URL}/branches/${id}`, branchData);
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
    const response = await $api.delete(`${API_URL}/branches/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Ошибка удаления филиала'
    };
  }
}