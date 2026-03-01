import api from "./axios";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Employee {
    id: string;
    employee_id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

export interface PaginatedEmployees {
    items: Employee[];
    total: number;
    page: number;
    page_size: number;
}

export interface GetEmployeesParams {
    page: number;
    page_size: number;
    search?: string;
    role?: string;
    status?: string;
}

export interface CreateEmployeePayload {
    employee_id: string;
    name: string;
    email: string;
    role?: string;
}

export interface UpdateEmployeePayload {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Fetch a paginated, filterable list of employees.
 * GET /admin/employees
 */
export const getEmployees = async (
    params: GetEmployeesParams,
): Promise<PaginatedEmployees> => {
    const { data } = await api.get<PaginatedEmployees>("/admin/employees", {
        params,
    });
    return data;
};

/**
 * Create a new employee and trigger an invite email.
 * POST /admin/employees
 */
export const createEmployee = async (
    payload: CreateEmployeePayload,
): Promise<Employee> => {
    const { data } = await api.post<Employee>("/admin/employees", payload);
    return data;
};

/**
 * Update an employee's profile fields.
 * PATCH /admin/employees/:id
 */
export const updateEmployee = async (
    employeeId: string,
    payload: UpdateEmployeePayload,
): Promise<Employee> => {
    const { data } = await api.patch<Employee>(
        `/admin/employees/${employeeId}`,
        payload,
    );
    return data;
};

/**
 * Soft-delete (deactivate) an employee.
 * DELETE /admin/employees/:id
 */
export const deleteEmployee = async (
    employeeId: string,
): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(
        `/admin/employees/${employeeId}`,
    );
    return data;
};

// ─── Bulk Upload ─────────────────────────────────────────────────────────────

export interface BulkUploadResponse {
    total_rows: number;
    successful_creations: number;
    skipped_rows: number;
    failed_rows: number;
}

/**
 * Bulk-create employees from a CSV file.
 * POST /admin/employees/bulk-upload
 */
export const bulkUploadEmployees = async (
    file: File,
): Promise<BulkUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<BulkUploadResponse>(
        "/admin/employees/bulk-upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
};
