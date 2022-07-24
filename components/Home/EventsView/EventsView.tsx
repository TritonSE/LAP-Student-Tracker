import React, { useContext } from "react";
import styles from "./EventsView.module.css";
import { ClassCard } from "./ClassCard";
import { Class } from "../../../models/class";
import { APIContext } from "../../../context/APIContext";
import { Loader } from "../../util/Loader";
import { CustomError } from "../../util/CustomError";
import { Empty } from "../../util/Empty";
import useSWR from "swr";


type EventsViewProps = {
  setShowEventsViewPage: (showEventsPage: boolean) => void
  userId?: string ;
};


const ClassCardRenderer: React.FC<EventsViewProps> = ({userId}) => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/class", () => client.getAllClasses(userId));
  if (error) return <CustomError />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Class" />;

  return (
    <div className={styles.classCardsContainer}>
      {data.map((classes: Class) => (
            <div key={classes.name} className={styles.cardContainer}>
              <ClassCard
              //temporary id
                id = {userId}
                key={classes.eventInformationId}
                name={classes.name}
                minLevel={classes.minLevel}
                maxLevel={classes.maxLevel}
                rrstring={classes.rrstring}
                startTime={classes.startTime}
                endTime={classes.endTime}
                teachers={classes.teachers}
              />
            </div>
      ))}
  </div>
  );
};

const EventsView: React.FC<EventsViewProps> = ({setShowEventsViewPage, userId}) => {
  return (
    <div>
        <div className={styles.backButtonSpacing}/>
        <div className={styles.buttonContainer}>
            <button className={styles.backButton} onClick={() => setShowEventsViewPage(false)}>
            <img className={styles.backArrow} src="/BackArrow.png" alt={"back"} />
          </button>
        </div>
        <div className={styles.titleSpacing}/>
        <div className={styles.classTitleContainer}>
            <div className={styles.classTitle}>Classes</div>
        </div>
        <div className={styles.titleCardSpacing}/>
        <ClassCardRenderer setShowEventsViewPage = {setShowEventsViewPage} userId= {userId}/>
    </div>
  );
};

export { EventsView, ClassCardRenderer };
