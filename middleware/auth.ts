
import * as admin from 'firebase-admin/app';
import { getAuth } from "firebase-admin/auth";
const { privateKey } = JSON.parse(process.env.PRIVATE_KEY || "");
const fbConfig: any = {
        type: process.env.TYPE || "",
        project_id: process.env.PROJECT_ID || "",
        private_key_id: process.env.PRIVATE_KEY_ID || "",
        private_key: privateKey || "",
        client_email: process.env.CLIENT_EMAIL || "",
        client_id: process.env.CLIENT_ID || "",
        auth_uri: process.env.AUTH_URI || "",
        token_uri: process.env.TOKEN_URI || "",
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL || "",
        client_x509_cert_url: process.env.CLIENT_x509_CERT_URL || ""
};
let fbAdmin;
if(admin.getApps().length == 0) {
        fbAdmin = admin.initializeApp({
                credential: admin.cert(fbConfig)
        });
} else {
        fbAdmin = admin.getApps()[0];
}

const fbAdminAuth =  getAuth(fbAdmin);

export { fbAdminAuth };