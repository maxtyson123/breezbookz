import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    const {idCookie} = request.body;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser',
        headers: {
            'Cookie': `SessionCookieIdV2=${idCookie};`
        }
    };


    const apiRessy = await axios.request(config)
    console.log(apiRessy.data);

    response.status(200).json({token : apiRessy.data.access_token});
}