import { MongoClient, ObjectId, Db, Collection } from "mongodb";

/**
 * MongoDB 连接 URI
 */
const uri: string = process.env.MONGODB_URI || "mongodb://localhost:27017"; // ✅ 使用显式 `string` 类型
const options: object = {}; // ✅ 确保 MongoDB 连接选项是 `object`

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// ✅ 确保 MongoDB URI 存在
if (!process.env.MONGODB_URI) {
  throw new Error("❌ 请将 MongoDB URI 添加到 .env.local");
}

// ✅ 处理不同环境的连接方式
interface GlobalMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalWithMongo = globalThis as unknown as GlobalMongo;

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// ✅ 连接数据库，返回类型安全的对象
export const connectDb = async (databaseName: string, collectionName: string): Promise<{
  client: MongoClient;
  db: Db;
  collection: Collection;
  ObjectId: typeof ObjectId;
}> => {
  const client = await clientPromise;
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);

  return { client, db, collection, ObjectId };
};
