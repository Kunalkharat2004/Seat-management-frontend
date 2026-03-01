import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
    getEmployees,
    type GetEmployeesParams,
    type PaginatedEmployees,
} from "../api/admin.employee.api";

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const employeeKeys = {
    all: ["employees"] as const,
    list: (params: GetEmployeesParams) =>
        [...employeeKeys.all, params.page, params.page_size, params.search, params.role, params.status] as const,
};

// ─── useEmployees ────────────────────────────────────────────────────────────

export const useEmployees = (params: GetEmployeesParams) => {
    const { data, isLoading, isFetching, isError, refetch } = useQuery<
        PaginatedEmployees,
        AxiosError
    >({
        queryKey: employeeKeys.list(params),
        queryFn: () => getEmployees(params),
        placeholderData: (previousData) => previousData,
    });

    return { data, isLoading, isFetching, isError, refetch };
};
