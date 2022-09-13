// Import the Google Cloud client libraries
const { BigQuery } = require('@google-cloud/bigquery');
const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const functions = require('firebase-functions')
const cors = require('cors')({ origin: true });

// Instantiate clients
const bigquery = new BigQuery();
const storage = new Storage();

const metadata = {
  sourceFormat: 'CSV',
  location: 'us-east1',
  autodetect: true,
  writeDisposition: 'WRITE_TRUNCATE',
};

var queryOptions = {
  query: '',
  location: 'us-east1',
}

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "csci5410-assignment4-fenil",
    "private_key_id": "5dc271e745d9726ab3fbcb8f09fbab3d9146f427",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDaxvtmAdAnyEpl\nmwtfzGjBjG5jXIG1yghgoAS8sWL79W9DS60zwGJrSF73S7SwrMqauBRzuSDhtwDf\nuyNEaFUXtsh9Nsf4Xr6f7Ml3iWkdD4IZW49l8/jLaFyxqJyUSTTjEDsgpMUmF3dr\n9pPgtSq5/UzbDK+85uYij/8XH7W2Z0+sf8JAk0ESNuZlTDtQ8AyeyDBco8YfCz6Y\nJGjEgY+t6puZIkUXWRYMatnmQD+rPjgvQvNgt3otlxqHpZxYa+T1lWVDtn4dcOf4\neBtLbJhmHBh4jd9dMzWHFPFhiW/EN6UzDas30aUBvuW4DRAI7E8mJH2/REYouF6s\nn4R029NNAgMBAAECggEAUBKE/9RJDc5yYFbLZnAnpTNTUb2RYepEf60BnthjzKkL\nZHuFtIvE2dQ+oc9NHl7XtqIKJkLLRKGYycoyAb8X6dqF7cJHlWGD7n+ZS015MeAz\nszk+NkgBtt0HFCUMzf8vQq31niCAYc0z8clpXVShgzowz3mItqBh+aNvb1S1SsE+\nyjQFaff6gOeddPIbh1GMr2bGW2MP8TaEI5OjxsD6TfCVAzoHtyBgKN++eSR02K+5\nAD2wY+4xpd1A6ZV7NODSn/vEKBH9sP0H3tNCJUDHpKH1aANNPCq7/gWb4B5ej2ar\n+PD4IC4MocyrCye7R4a+qzh5HGakz+ChyyI+dSSYlwKBgQD4RHabHDvOepcMAEBR\nXdRZWu5Hrgm4CgeumKh8uj5XNRSEEpWrMGDmkdxfMILXoPgNwWNCyXmVXbrVUW1L\n9RP5n/NukgG5plIKO0tkUlNhrcrfVuUYXIVJaiFkjOuzVb875rOf21p2VOfpLgEL\n56mlfQJn15W0Zm+8wpVGDmEJpwKBgQDhl2G5YQWvQcnIPAk++AshgkgK80PoM6vu\nR4QrEZTRX/m72XGCXKqtb1cyUCXA0xXApF8rCXyJRDnBMU5suFySkQ8rlZZfzQh/\nbRXoVYIzsJxLWD4QY2WFxoSF/2JfbU9VZHu3R8I6rZ2eAgltv87YnuxYWrmpTXdz\nn79FyXkx6wKBgQC8+XgCd0o6z+t7khFjHfXOEj3/x8TUFqZkSwUs86MSRHAaW/8a\n8FdCClLhDg76TSejaMnCg5ONk2vshe+Y+rK6tvrX9kFj6+rUqO+pLFUVq/EZcY4u\nrfYyvJswa2fZ+PH4iZG+o3xHSDfCsWbQhgUG15HmMx5b1AFHgCGZ0sYgTwKBgAKB\ng/xjL4T63hrzT8b7SmRc5h/5A9AYgthqwvUXhOeugT+s8q3YCa1Th0xvx3uU3LD/\nIm9/83oy39FdktlyUtTt95UsXDdEN8vykkO6b2/Tjmjn2gikkgQiaGZ0p8sXk8IH\nE7i9e1LbityueRxW/R065rU0jMtsqN8H7z//NPFxAoGBAKvczhgmGu59jIUtRg4Z\n7Xm/C79ESFhQpRUxN4XkYJ87U9ZEEbeoOdCf9lgYMyfAHayxdgFPYfmcOciXuxrB\nuDo//CmeBU0WntItJZztK0ZJb2Jh1qQTDVcaEQkQJAJnTaJdFkNfGoOpU2xyVMmQ\n6PUqJU71QjxBQ2tzvy4tsP5k\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-qbdbf@csci5410-assignment4-fenil.iam.gserviceaccount.com",
    "client_id": "101054428939321940300",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qbdbf%40csci5410-assignment4-fenil.iam.gserviceaccount.com"
  })
});

exports.helloWorld = functions.https.onRequest(async (req, res) => {
  await cors(req, res, async () => {
    // your function body here - use the provided req and res from cors
    const datasetId = 'tour_recommendation'
    const tableId = 'user_tour'
    const bucketName = 'usertours-serverless-2'
    const filename = 'dataVector.csv'
    const [job] = await bigquery
      .dataset(datasetId)
      .table(tableId)
      .load(storage.bucket(bucketName).file(filename), metadata);

    // load() waits for the job to finish
    console.log(`Job ${job.id} completed.`);
    queryOptions.query = `CREATE OR REPLACE MODEL
\`tour_recommendation.recommendation_model\`
OPTIONS (
  model_type='KMEANS',
  num_clusters=3
) AS
SELECT tourId, tourDays FROM \`tour_recommendation.user_tour\`
  `;
    const [job2] = await bigquery.createQueryJob(queryOptions);
    await job2.getQueryResults();
    console.log("Model Created")
    if (req.query.tourDays === undefined || req.query.tourDays === null) {
      queryOptions.query = `SELECT
tourId
FROM
ML.PREDICT(MODEL \`tour_recommendation.recommendation_model\`,(
    SELECT
      tourId, CAST(AVG(tourDays) as INT64) as tourDays
    FROM
      \`tour_recommendation.user_tour\`
    GROUP BY
      tourId
    ))`
    }
    else {
      console.log('Parameterized')
      queryOptions.query = `SELECT
tourId
FROM
ML.PREDICT(MODEL \`tour_recommendation.recommendation_model\`,(
    SELECT
      tourId, CAST(AVG(tourDays) as INT64) as tourDays
    FROM
      \`tour_recommendation.user_tour\`
    WHERE
      tourDays=${req.query.tourDays}
    GROUP BY
      tourId
    ))`
    }
    const [job3] = await bigquery.createQueryJob(queryOptions)
    console.log(`Job ${job3.id} completed.`);
    const [result] = await job3.getQueryResults();
    console.log("Got result")
    console.log(result)
    var recommendTour = []
    const fetchdata = await admin.firestore().collection('tours').get();

    result.forEach(item => {
      fetchdata.forEach(doc => {
        if (doc.data().tourId === item.tourId) {
          recommendTour.push(doc.data())
        }
      })
    })
    if (recommendTour.length > 3) {
      recommendTour = recommendTour.slice(0, 3)
    }
    return res.status(200).json({ data: recommendTour, status: 'success' })
  })
});