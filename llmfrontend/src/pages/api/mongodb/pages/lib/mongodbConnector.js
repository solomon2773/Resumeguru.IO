import { MongoClient, ServerApiVersion } from "mongodb";
import path from "path";

// MongoDB connection settings
const clientCertificatePath = path.join(process.cwd(),  process.env.MONGODB_CERTIFICATE_KEY_FILE);

const mongodDbUri = process.env.MONGODB_URI;


const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  tls: true,
  tlsCertificateKeyFile: clientCertificatePath,
  serverApi: ServerApiVersion.v1
};

const client = new MongoClient(mongodDbUri, options);

let mongoClient;
const mongodbDatabase = process.env.MONGODB_DB_NAME;
export async function mongodbConnector() {
  if (!mongoClient) {
    mongoClient = await client.connect();
    console.log("Connected to MongoDB using x.509 authentication");
  } else {
    // console.log(clientCertificatePath)
    // console.log(process.env.MONGODB_CERTIFICATE_KEY_FILE)
  }
  return mongoClient.db(mongodbDatabase);
}
