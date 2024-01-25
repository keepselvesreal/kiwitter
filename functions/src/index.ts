/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as cors from 'cors';
import axios from "axios";
import { config } from "dotenv";
import { KakaoUser } from "./@types";

config();

const corsHandler = cors({ origin: true });

interface TokenResponse {
    token_type: string;
    access_token: string;
    id_token?: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
    scope?: string;
}
  
const getToken = async (code: string): Promise<TokenResponse> => {
    const body = {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY || "",
        redirect_uri: process.env.KAKAO_REDIRECT_URI || "",
        code, //TODO: 확인 필요
    };

    const res = await axios.post<TokenResponse>(
        "https://kauth.kakao.com/oauth/token",
        new URLSearchParams(body)
    );
    return res.data;
};

const getKakaoUser = async (token: string): Promise<KakaoUser> => {
    const res = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      { headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

exports.kakaoToken = functions.https.onRequest((request, response) => {
    corsHandler(request, response, async () => {
      // request.method를 확인하여 POST 요청만을 처리합니다.
      if (request.method === 'POST') {
        const { code } = request.body;
        
  
        if (!code) {
          response.status(400).send({
            code: 400,
            message: 'code is a required parameter.',
          });
          return;
        }
  
        try {
            const tokenResponse = await getToken(code);
            const kakaoUser = await getKakaoUser(tokenResponse.access_token);

            response.status(200).send({
                token: tokenResponse,
                user: kakaoUser,
            });
        } catch (error: any) {
            response.status(500).send({
                message: error.message,
            });
        }
      } else {
        // POST 요청이 아닌 경우, 405 Method Not Allowed 오류를 반환합니다.
        response.status(405).send({
          message: 'Only POST requests are allowed.',
        });
      }
    });
  });
