import React from 'react';
import { ClassViewMenu } from './ClassViewMenu';
import { useRouter } from 'next/router';

const AttendanceView: React.FC = () => {
    return (
        <div>
            Attendance
        </div>
    )
}

const RosterView: React.FC = () => {
    return (
        <div>
            Roster
        </div>
    )
}

const ModulesView: React.FC = () => {
    return (
        <div>
            Modules
        </div>
    )
}

export const ClassView: React.FC = () => {
    const router = useRouter();
    const attendance = router.pathname.includes("/attendance") ? true : false;
    const roster = router.pathname.includes("/roster") ? true : false;
    const modules = router.pathname.includes("/modules") ? true : false;    
    return (
        <>
            <ClassViewMenu /> 
            {attendance && <AttendanceView />}
            {roster && <RosterView />}
            {modules && <ModulesView />}
        </>
    )
}
