import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import Humanoid from "humanoid-js";

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


    // Create a new Humanoid instance
    const Humanoid = require("humanoid-js");
    let humanoid = new Humanoid(false);
    await humanoid.get("https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser")
        .then(res => {
                console.log(res.statusCode) // 503
                console.log(res.isSessionChallenged) // true
                humanoid.bypassJSChallenge(res)
                    .then(challengeResponse => {
                        // Note that challengeResponse.isChallengeSolved won't be set to true when doing manual bypassing.
                       console.log(challengeResponse.body) // <!DOCTYPE html><html lang="en">...
                    })
            }
        )
        .catch(err => {
            console.error(err)
        });


    response.status(200).json(await humanoid.get("https://www.paknsave.co.nz/CommonApi/Account/GetCurrentUser"));

    //
    // // Send the request
    // let responseHumanoid = await humanoid.sendRequest(url, type, data, headers);
    //
    // // Log the response
    // response.status(200).json(responseHumanoid);
}