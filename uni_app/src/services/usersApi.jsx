import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({baseUrl: 'https://zakir20-001-site1.gtempurl.com/api/'}),
    endpoints: (builder) => ({
        postSecurityLogin: builder.mutation({
            query: (securityData) => ({
                url: `/Admin/security/login`,
                method: 'POST',
                body: securityData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        postAdminLogin: builder.mutation({
            query: (adminData) => ({
                url: `/Admin/admin/login`,
                method: 'POST',
                body: adminData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
    }),
})
export const {
    usePostSecurityLoginMutation,
    usePostAdminLoginMutation
} = usersApi