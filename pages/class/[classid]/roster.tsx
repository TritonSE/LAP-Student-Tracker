import React from 'react';
import { ClassViewMenu } from '../../../components/ClassView/ClassViewMenu';
import type { NextApplicationPage } from "../../_app";

const RosterPage: NextApplicationPage = () => {
    return (
        <div>
            <ClassViewMenu/>
            Roster
        </div>
    )
  }

  export default RosterPage;