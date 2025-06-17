import { generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { userCollection } from "../Database/models/userModel.js";
import { getUserPassKeys, setCurrentOptions } from "./RegistrationHelpers.js";
import jwt from 'jsonwebtoken';

import PasskeyCollection from "../Database/models/passKeyModel.js";


//relying party/server constants
const rpName = 'Special Cart Backend';
const rpID = 'localhost';
const origin = `http://${rpID}:5173`;


export const generateToken=(body,secret)=>{
    const token=jwt.sign(body,secret,{expiresIn:'1h'});
    return token;
}

export const generateAuthenticationOptionsHelper = async (body) => {
    const user = await userCollection.findOne(body);
    const userPasskeys = await getUserPassKeys(user._id);

    const options = await generateAuthenticationOptions({
        rpID,
        allowCredentials: userPasskeys.map(passkey => ({
            id: passkey.id,
            transports: passkey.transports,
        })),
    });


    setCurrentOptions(user, options);

    return options;
}

export const verifyAuthenticationHelper = async ({ userEmail, asseResp }) => {

    const user = await userCollection.findOne({ userEmail });
    // (Pseudocode) Get `options.challenge` that was saved above
    const currentOptions = JSON.parse(user.options);
    // console.log(currentOptions,asseResp);
    const passkey = await PasskeyCollection.findOne({ user: user._id });

    const verification = await verifyAuthenticationResponse({
        response: asseResp,
        expectedChallenge: currentOptions.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
            id: passkey.id,
            publicKey: passkey.publicKey,
            counter: passkey.counter,
            transports: passkey.transports,
        },
    });

    if (verification.verified) {
        const { authenticationInfo } = verification;
        const { newCounter } = authenticationInfo;

        await PasskeyCollection.findByIdAndUpdate(passkey._id,{counter:newCounter});
    }

    return verification;
}