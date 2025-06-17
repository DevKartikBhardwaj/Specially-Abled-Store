import { userCollection } from '../Database/models/userModel.js';
import nodemailer from 'nodemailer';
import { generateVerificationEmail } from './emailTemplate.js';
import PasskeyCollection from '../Database/models/passKeyModel.js';
import {Binary} from 'mongodb';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';

//relying party/server constants
const rpName = 'Special Cart Backend';
const rpID = 'localhost';
const origin = `http://${rpID}:5173`;


async function getUserFromDb(userId) {
    const user = await userCollection.findOne({ _id: userId });
    return user;
}

export async function getUserPassKeys(user) {
    const passkeys = await PasskeyCollection.find({ user });
    return passkeys;
}

export async function setCurrentOptions(userId, options) {
    options = JSON.stringify(options);
    await userCollection.findByIdAndUpdate(userId, { options });
}


export const generateAndSaveOtp = async ({ name, email }) => {
    const userExist = await userCollection.findOne({ userEmail: email });

    if (userExist) {
        throw new Error('User already exist');
    }

    const otp = Math.floor(Math.random() * 1e6);

    const newUser = { userName: name, userEmail: email, otp };

    try {
        await sendEmail({ name, email, otp });
    } catch (error) {
        throw new Error("Invalid credentials");
    }

    const { _id } = await userCollection.insertOne(newUser);

    return _id;
}


export async function sendEmail({ name, email, otp }) {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: '"SpecialCart Suppourt Team" <suppourtspecialcart@gmail.com>', // sender address
        to: email, // list of receivers
        subject: `Here's your verification code ${otp}`, // Subject line
        html: generateVerificationEmail({ userName: name, code: otp, companyName: "Special cart", logoUrl: 'https://sdmntpreastus.oaiusercontent.com/files/00000000-1018-61f9-9a11-c53b6443d8fb/raw?se=2025-05-19T18%3A11%3A11Z&sp=r&sv=2024-08-04&sr=b&scid=00000000-0000-0000-0000-000000000000&skoid=31bc9c1a-c7e0-460a-8671-bf4a3c419305&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-19T12%3A55%3A54Z&ske=2025-05-20T12%3A55%3A54Z&sks=b&skv=2024-08-04&sig=ggDCNyOlHR83pWrT5Q2scsuvKqwazS8GPz%2BbNXkvN6k%3D' }), // html body
    });
    return info;
}

export const generateRegistrationOptionsHelper = async ({ _id }) => {
    const user = await getUserFromDb(_id);
    const userPasskeys = await getUserPassKeys(_id);

    const options = await generateRegistrationOptions({
        rpName: rpName,
        rpID: rpID,
        userName: user.userName,

        attestationType: 'none',

        excludeCredentials: userPasskeys.map(passkey => ({
            id: passkey.id,
            transports: passkey.transports,
        })),

        authenticatorSelection: {
            residentKey: 'preferred',
            userVerification: 'preferred',
            authenticatorAttachment: 'platform',
        },
    });

    // (Pseudocode) Remember these options for the user
    await setCurrentOptions(_id, options);

    return options;

}




export const verifyAttRespHelper = async (userId, attResp) => {
    const user = await userCollection.findOne({ _id: userId })
    const currentOptions = JSON.parse(user.options);
    const { verified,registrationInfo } = await verifyRegistrationResponse({
        response: attResp,
        expectedChallenge: currentOptions.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
    })

    if (verified) {
        const {
            credential,
            credentialDeviceType,
            credentialBackedUp,
        } = registrationInfo;


        const newPasskey = {
            // `user` here is from Step 2
            user,
            // Created by `generateRegistrationOptions()` in Step 1
            webauthnUserID: currentOptions.user.id,
            // A unique identifier for the credential
            id: credential.id,
            // The public key bytes, used for subsequent authentication signature verification
            publicKey: new Binary(credential.publicKey),
            // The number of times the authenticator has been used on this site so far
            counter: credential.counter,
            // How the browser can talk with this credential's authenticator
            transports: credential.transports,
            // Whether the passkey is single-device or multi-device
            deviceType: credentialDeviceType,
            // Whether the passkey has been backed up in some way
            backedUp: credentialBackedUp,
        };

        // (Pseudocode) Save the authenticator info so that we can
        // get it by user ID later
        await PasskeyCollection.insertOne(newPasskey);
    }

    return verified;
}

