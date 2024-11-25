import './index.scss';
import * as React from 'react';
import {LineChart} from '@mui/x-charts/LineChart';
import {useGetAllSuperAdminsVisitorsQuery} from "../../services/usersApi.jsx";

export default function Chart1() {

    const {data: visitors} = useGetAllSuperAdminsVisitorsQuery();
    const list = visitors?.data || [];

    // Aylık ziyaretçi sayısını hesapla
    const monthlyVisitors = Array(12).fill(0); // 12 ay için sıfırlarla başlat

    list.forEach(visitor => {
        const visitedDate = visitor.visitedDate;
        if (visitedDate) {
            // Tarihi doğru şekilde parse et
            const [day, month, year] = visitedDate.split(" ")[0].split("."); // Gün, ay, yıl
            const formattedDate = new Date(`${year}-${month}-${day}`); // ISO formatına çevir
            const monthIndex = formattedDate.getMonth(); // Ayı al (0-11 arası)
            monthlyVisitors[monthIndex] += 1; // İlgili ayda ziyaretçi sayısını artır
        }
    });


    return (
        <section id={"chart"}>
            <LineChart
                xAxis={[
                    {
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        label: 'Aylar',
                    },
                ]}
                series={[
                    {
                        data: monthlyVisitors,
                        label: 'Qonaq sayı',
                        color: '#7F9CB3', // Yaşıl rəng
                    },
                ]}
                width={800}
                height={480}
            />
        </section>
    );
}
