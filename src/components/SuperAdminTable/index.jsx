import './index.scss';
import {Table} from 'antd';
import {useGetAllSuperAdminsVisitorsQuery} from "../../services/usersApi.jsx";
import {useEffect, useState} from "react";
import Chart1 from "../Chart1/index.jsx";
import Chart2 from "../Chart2/index.jsx";

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Ad',
        dataIndex: 'name',
    },
    {
        title: 'Soyad',
        dataIndex: 'surname',
    },
    {
        title: 'FIN Kod',
        dataIndex: 'finCode',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Mobil nömrə',
        dataIndex: 'phoneNumber',
    },
    {
        title: 'Açıqlama',
        dataIndex: 'description',
    },
    {
        title: 'Ziyarət tarixi',
        dataIndex: 'visitedDate',
        render: (text) => text || "N/A",
    },
    {
        title: 'Avtomobil nömrəsi',
        dataIndex: 'carNumber',
        render: (text) => text || "N/A",
    },
    {
        title: 'Statusu',
        dataIndex: 'isVisited',
        render: (text) => {
            if (text === -1) {
                return <button className={"scpBtn reBtn"}>Rədd edildi</button>;
            } else if (text === 0) {
                return <button className={"scpBtn"}>Gözləyir</button>;
            } else if (text === 1) {
                return <button className={"scpBtn yelBtn"}>Gəlir</button>;
            } else if (text === 2) {
                return <button className={"scpBtn"}>İçəridə</button>;
            } else if (text === 3) {
                return <button className={"scpBtn reBtn"}>Getdi</button>;
            }
        },
    }
];

const SuperAdminTable = () => {
    const {data: allBuildings, refetch} = useGetAllSuperAdminsVisitorsQuery();
    const [selectedDate, setSelectedDate] = useState(null);
    const [filter, setFilter] = useState("all");

    const parseDate = (dateString) => {
        const [day, month, yearAndTime] = dateString.split(".");
        const [year, time] = yearAndTime.split(" ");
        return new Date(`${year}-${month}-${day}T${time}`);
    };

    const getFilteredData = () => {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const yesterday = new Date(startOfDay);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(endOfDay);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return (allBuildings?.data || [])
            .map((item) => ({
                ...item,
                visitedDateParsed: parseDate(item.visitedDate),
            }))
            .filter((item) => {
                if (selectedDate) {
                    const targetDate = new Date(selectedDate);
                    const startOfTarget = new Date(targetDate.setHours(0, 0, 0, 0));
                    const endOfTarget = new Date(targetDate.setHours(23, 59, 59, 999));
                    return item.visitedDateParsed >= startOfTarget && item.visitedDateParsed <= endOfTarget;
                }
                if (filter === "today") {
                    return item.visitedDateParsed >= startOfDay && item.visitedDateParsed <= endOfDay;
                } else if (filter === "yesterday") {
                    return item.visitedDateParsed >= yesterday && item.visitedDateParsed < startOfDay;
                } else if (filter === "tomorrow") {
                    return item.visitedDateParsed > endOfDay && item.visitedDateParsed <= tomorrow;
                }
                return true; // "all" seçimi üçün
            })
            .reverse();
    };

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <div id="userTableForSecurity">
            <div className={"wrapperWrapper"}>
                <div className="filter-section">
                    <label htmlFor="dateFilter">Tarixi seçin:</label>
                    <input
                        type="date"
                        id="dateFilter"
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setFilter("all"); // Tarix seçiləndə `filter`-i sıfırlayırıq
                        }}
                    />
                </div>
                <div className="filter-section">
                    <select
                        id="quickFilter"
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setSelectedDate(null); // Filter seçiləndə `selectedDate`-i sıfırlayırıq
                        }}
                    >
                        <option value="all">Hamısı</option>
                        <option value="today">Bu gün</option>
                        <option value="yesterday">Dünən</option>
                        <option value="tomorrow">Sabah</option>
                    </select>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={getFilteredData()}
                rowKey="id"
                pagination={{pageSize: 7}}
            />
        </div>
    );
};

export default SuperAdminTable;
