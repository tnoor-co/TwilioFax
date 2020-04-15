# Google Cloud Functions - Receive Fax via Twilio & Cloudinary

## Steps

1.  Install dependencies:

        npm install

1.  Deploy:

        gcloud functions deploy twilioFaxReceive --runtime nodejs8 --trigger-http --allow-unauthenticated --env-vars-file .env.yaml
