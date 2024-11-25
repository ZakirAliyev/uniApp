import './index.scss';
import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useGetAllSuperAdminsVisitorsQuery } from "../../services/usersApi.jsx";

export default function Chart2() {
    const { data: visitors } = useGetAllSuperAdminsVisitorsQuery();

    const list = visitors?.data;

    // isVisited dəyərlərini qruplaşdır və say
    const isVisitedCounts = list?.reduce((acc, visitor) => {
        acc[visitor.isVisited] = (acc[visitor.isVisited] || 0) + 1;
        return acc;
    }, {});

    // Default dəyərlər əlavə et, əgər yoxdursa
    const counts = {
        "-1": isVisitedCounts?.[-1] || 0,
        "1": isVisitedCounts?.[1] || 0,
        "2": isVisitedCounts?.[2] || 0,
        "3": isVisitedCounts?.[3] || 0,
    };

    // Ümumi dəyərləri hesabla
    const totalCount = counts["-1"] + counts["1"] + counts["2"] + counts["3"];

    // Faizləri hesabla
    const percentages = {
        "-1": ((counts["-1"] / totalCount) * 100).toFixed(2), // 2 rəqəm dəqiqliklə
        "1": ((counts["1"] / totalCount) * 100).toFixed(2),
        "2-3": (((counts["2"] + counts["3"]) / totalCount) * 100).toFixed(2),
    };

    return (
        <>
            <PieChart
                series={[
                    {
                        arcLabel: (item) => `${item.value}%`,
                        arcLabelMinAngle: 35,
                        arcLabelRadius: '60%',
                        data: [
                            { label: 'Rədd edilən ziyarətçilər', value: percentages["-1"], color: '#7F9CB3' },
                            { label: 'Dəvətli ziyarətçilər', value: percentages["1"], color: '#D7B56D' },
                            { label: 'Gələn ziyarətçilər', value: percentages["2-3"], color: '#CCCCCC' },
                        ],
                        color: (item) => item.color,
                    },
                ]}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fontWeight: 'bold',
                    },
                }}
                width={800}
                height={400}
            />
        </>
    );
}
