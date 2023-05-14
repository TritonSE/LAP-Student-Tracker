import {client} from "../db";
import {VolunteerResponse} from "../../models";
import {decode} from "io-ts-promise";

const postExperience = async (id: string, about: string, experience: string): Promise<void> => {
    // const about = about.trim();
    // const experience = experience.trim();

    const query = {
        text: "INSERT INTO volunteer (id, about, experience) VALUES ($1, $2, $3)",
        values: [id, about.trim(), experience.trim()]
    };

    await client.query(query);



};

const getResponse = async (id: string): Promise<VolunteerResponse | null> => {
    const query = {
        text: "SELECT about, experience FROM volunteer WHERE id = $1",
        values: [id]
    };
    const res = await client.query(query);
    if (res.rows.length == 0) {
        return null;
    }

    return await decode(VolunteerResponse, res.rows[0]);
};



export { postExperience, getResponse };