import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Cookies from "js-cookie";

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://zakir20-001-site1.gtempurl.com/api/',
        prepareHeaders: (headers) => {
            const token = Cookies.get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        postSecurityLogin: builder.mutation({
            query: (securityData) => ({
                url: `/Account/security/login`,
                method: 'POST',
                body: securityData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        postAdminLogin: builder.mutation({
            query: (adminData) => ({
                url: `/Account/admin/login`,
                method: 'POST',
                body: adminData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        getAllBuildings: builder.query({
            query: () => `/SuperAdminBuilding/getAll`,
        }),
        putOneBuilding: builder.mutation({
            query: (buildingData) => ({
                url: `/SuperAdminBuilding/update`,
                method: 'PUT',
                body: buildingData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        deleteBuilding: builder.mutation({
            query: (id) => ({
                url: `/SuperAdminBuilding/delete/${id}`,
                method: 'DELETE',
            }),
        }),
        postNewBuilding: builder.mutation({
            query: (id) => ({
                url: `/SuperAdminBuilding/add`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
    }),
});

export const {
    usePostSecurityLoginMutation,
    usePostAdminLoginMutation,
    useGetAllBuildingsQuery,
    usePutOneBuildingMutation,
    useDeleteBuildingMutation,
    usePostNewBuildingMutation
} = usersApi;