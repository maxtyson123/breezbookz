import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    const {
        url,
        type,
        cookies,
        data,
    } = request.body;


    // Create the headers
    let headers = {
        'Content-Type': 'application/json',
        'Cookie': cookies,
    };



    response.status(200).json("asd");

    //
    // // Send the request
    // let responseHumanoid = await humanoid.sendRequest(url, type, data, headers);
    //
    // // Log the response
    // response.status(200).json(responseHumanoid);
}