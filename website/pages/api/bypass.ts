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

    console.log("FOUND SHIT");

    // Conver the json into url a=b&c=d
    let postData = '';
    if(data) {
        for (const [key, value] of Object.entries(data)) {
            postData += key + '=' + value + '&';
        }
    }
    postData = postData.substring(0, postData.length - 1);

    let config = {
        url: 'http://localhost:8191/v1',
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            "cmd": "request." + type,
            "maxTimeout": 60000,
            url,
            cookies
        },
        method: 'post',
    };

    // If it is a post request add the post data
    if(type == "post")
        config.data["postData"] = postData

    const apiRessy = await axios.request(config)


    // Parse the json data
    let jsonresponse = apiRessy.data.solution.response
    jsonresponse = jsonresponse.split("<body><pre>")[1].split("<")[0]
    jsonresponse = JSON.parse(jsonresponse)

    console.log(jsonresponse)
    console.log("DONE")

    response.status(200).json({raw : jsonresponse, cookies: apiRessy.data.solution.cookies});
}