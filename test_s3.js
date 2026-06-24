const { S3Client, ListBucketsCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config({ path: ".env.local" });

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucketName = process.env.S3_BUCKET_NAME || "";

async function run() {
  console.log("Checking S3 Credentials...");
  console.log("Region:", process.env.AWS_REGION);
  console.log("Bucket:", bucketName);
  console.log("Access Key ID:", process.env.AWS_ACCESS_KEY_ID);

  try {
    console.log("\n1. Testing: Listing your S3 buckets...");
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("Success! Found buckets:");
    data.Buckets.forEach(b => console.log(` - ${b.Name}`));
    
    const { GetBucketLocationCommand } = require("@aws-sdk/client-s3");
    const loc = await s3Client.send(new GetBucketLocationCommand({ Bucket: bucketName }));
    console.log(`Bucket Location (Region Constraint):`, loc.LocationConstraint || "us-east-1 (default)");
  } catch (err) {
    console.log("Failed to List Buckets or get location:", err.message);
  }

  try {
    console.log(`\n2. Testing: Uploading dummy file to "${bucketName}"...`);
    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: "test_connection_file.txt",
      Body: "Connection test from DMS app",
    }));
    console.log("Success! Dummy file uploaded successfully!");
  } catch (err) {
    console.log("Failed to Upload to S3:", err.message);
  }
}

run();
