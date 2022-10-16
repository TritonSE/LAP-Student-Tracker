import * as admin from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const { privateKey } = JSON.parse(process.env.PRIVATE_KEY || "") || "";

// eslint-disable @typescript-eslint/no-explicit-any
const fbConfig = {
  type: process.env.TYPE || "service_account",
  project_id: process.env.PROJECT_ID || "",
  private_key_id: process.env.PRIVATE_KEY_ID || "",
  private_key: privateKey || "",
  client_email: process.env.CLIENT_EMAIL || "",
  client_id: process.env.CLIENT_ID || "",
  auth_uri: process.env.AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
  token_uri: process.env.TOKEN_URI || "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.CLIENT_x509_CERT_URL || "",
};
let fbAdmin;
if (admin.getApps().length == 0) {
  fbAdmin = admin.initializeApp({
    // have to ignore since this way of initializing firebase is not type safe - but it works
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    credential: admin.cert(fbConfig),
  });
} else {
  fbAdmin = admin.getApps()[0];
}

export const authAdmin = getAuth(fbAdmin);
