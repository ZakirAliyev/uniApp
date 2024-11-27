import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Cookies from "js-cookie";

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://bsuapp-001-site1.otempurl.com/api/',
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
        postNewBuilding: builder.mutation({
            query: (id) => ({
                url: `/SuperAdminBuilding/add`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        changeAvailabilityBuilding: builder.mutation({
            query: ({id, data}) => ({
                url: `/SuperAdminBuilding/change/availity?id=${id}`,
                method: 'PUT',
                body: data,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        getAllFaculties: builder.query({
            query: () => `/SuperAdminFaculty/getAll`,
        }),
        putOneFaculty: builder.mutation({
            query: (buildingData) => ({
                url: `/SuperAdminFaculty/update`,
                method: 'PUT',
                body: buildingData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        postNewFaculty: builder.mutation({
            query: (id) => ({
                url: `/SuperAdminFaculty/add`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        changeAvailabilityFaculty: builder.mutation({
            query: ({id, data}) => ({
                url: `/SuperAdminFaculty/change/availity?id=${id}`,
                method: 'PUT',
                body: data,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        getAllDepartments: builder.query({
            query: () => `/SuperAdminDepartment/getAll`,
        }),
        putOneDepartment: builder.mutation({
            query: (buildingData) => ({
                url: `/SuperAdminDepartment/update`,
                method: 'PUT',
                body: buildingData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        postNewDepartment: builder.mutation({
            query: (id) => ({
                url: `/SuperAdminDepartment/add`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        changeAvailabilityDepartment: builder.mutation({
            query: ({id, data}) => ({
                url: `/SuperAdminDepartment/change/availity?id=${id}`,
                method: 'PUT',
                body: data,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        getAllTeachers: builder.query({
            query: () => `/Admin/admin/getAll`,
        }),
        putOneTeacher: builder.mutation({
            query: (buildingData) => ({
                url: `/Admin/update`,
                method: 'PUT',
                body: buildingData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        postNewTeacher: builder.mutation({
            query: (id) => ({
                url: `/Admin/add/admin`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        deleteTeacher: builder.mutation({
            query: (id) => ({
                url: `/Admin/delete/${id}`,
                method: 'DELETE',
            }),
        }),

        getAdminProfileData: builder.query({
            query: () => `/Admin/profil`,
        }),
        putAdminProfileData: builder.mutation({
            query: (buildingData) => ({
                url: `/Admin/profil/update`,
                method: 'PUT',
                body: buildingData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),


        getSecurityProfileData: builder.query({
            query: () => `/Admin/profil`,
        }),

        getAllSecurity: builder.query({
            query: () => `/Admin/admin/security`,
        }),
        postNewGuardians: builder.mutation({
            query: (id) => ({
                url: `/Admin/add/security`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        getVisitorsDataForSecurity: builder.query({
            query: () => `/Security/getAll/visitors`,
        }),


        getExcelFile: builder.query(({
            query: () => `/Security/exportExcel/visitors`,
        })),
        getPdfFile: builder.query(({
            query: () => `/Security/exportPdf/visitors`,
        })),
        getPrintFile: builder.query(({
            query: () => `/Security/print/today/visitors`,
        })),

        putChangeIsVisited: builder.mutation({
            query: ({id, data}) => ({
                url: `/Security/change/isVisited?id=${id}`,
                method: 'PUT',
                body: data,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        getAllAdmins: builder.query({
            query: () => `/Visitor/admin/getAll/forVisitors`,
        }),

        postNewVisitor: builder.mutation({
            query: (id) => ({
                url: `/Visitor/register/visitor`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        getAllAdminsVisitors: builder.query({
            query: () => `/Admin/admin/getAll/visitors`,
        }),

        postVisitorAccept: builder.mutation({
            query: (id) => ({
                url: `/Visitor/accept/visitor`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        postVisitorReject: builder.mutation({
            query: (id) => ({
                url: `/Visitor/reject/visitor`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        getAllSuperAdminsVisitors: builder.query({
            query: () => `/Visitor/superAdmin/getAll/visitors`,
        }),

        postSubAdminLogin: builder.mutation({
            query: (id) => ({
                url: `/SubAdmin/login`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        getAllVisitorRequests: builder.query({
            query: () => `/Visitor/getAll/visitor-requests`,
        }),

        createVisitorPost: builder.mutation({
            query: (id) => ({
                url: `/Visitor/create/visitor`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),

        addASubAdminPost: builder.mutation({
            query: (id) => ({
                url: `/SubAdmin/add/Subadmin`,
                method: 'POST',
                body: id,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        getAllSubadmins: builder.query({
            query: () => `/SubAdmin/all/SubAdmin`,
        }),
        putSubAdminData: builder.mutation({
            query: (buildingData) => ({
                url: `/SubAdmin/updateSubAdmin`,
                method: 'PUT',
                body: buildingData,
                headers: {'Content-Type': 'application/json'}
            }),
        }),
        putAdminPassword: builder.mutation({
            query: (buildingData) => ({
                url: `/Admin/change-passoword`,
                method: 'PUT',
                body: buildingData,
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
    usePostNewBuildingMutation,
    useChangeAvailabilityBuildingMutation,

    useGetAllFacultiesQuery,
    usePutOneFacultyMutation,
    usePostNewFacultyMutation,
    useChangeAvailabilityFacultyMutation,

    useGetAllDepartmentsQuery,
    usePutOneDepartmentMutation,
    usePostNewDepartmentMutation,
    useChangeAvailabilityDepartmentMutation,

    useGetAllTeachersQuery,
    usePutOneTeacherMutation,
    usePostNewTeacherMutation,
    useDeleteTeacherMutation,

    useGetAdminProfileDataQuery,
    usePutAdminProfileDataMutation,

    useGetSecurityProfileDataQuery,

    useGetAllSecurityQuery,
    usePostNewGuardiansMutation,

    useGetVisitorsDataForSecurityQuery,


    useGetExcelFileQuery,
    useGetPdfFileQuery,
    useGetPrintFileQuery,

    usePutChangeIsVisitedMutation,
    useGetAllAdminsQuery,
    usePostNewVisitorMutation,


    useGetAllAdminsVisitorsQuery,

    usePostVisitorAcceptMutation,
    usePostVisitorRejectMutation,

    useGetAllSuperAdminsVisitorsQuery,

    usePostSubAdminLoginMutation,

    useGetAllVisitorRequestsQuery,

    useCreateVisitorPostMutation,

    useAddASubAdminPostMutation,
    useGetAllSubadminsQuery,
    usePutSubAdminDataMutation,

    usePutAdminPasswordMutation
} = usersApi;