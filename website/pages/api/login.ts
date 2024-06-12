import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    const {email, password} = request.body;




    const apiRessy = await axios.request(config)

    // Log the cookie SessionCookieIdV2
    let cookie : string | string[] | undefined = apiRessy.headers['set-cookie'];
    if(cookie) {
        for (let i = 0; i < cookie.length; i++) {
            if (cookie[i].includes('SessionCookieIdV2')) {
                cookie = cookie[i];
                break;
            }
        }
    }

    response.status(200).json({cookie : cookie, data: apiRessy.data});
}