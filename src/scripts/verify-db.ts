import "./load-env";
import { tryConnectMongo } from "@/lib/db/mongoose";

async function main() {
  const m = await tryConnectMongo();
  if (!m?.connection.db) {
    console.log("NO_MONGO");
    process.exit(1);
  }
  const cols = await m.connection.db.listCollections().toArray();
  for (const c of cols.sort((a, b) => a.name.localeCompare(b.name))) {
    const n = await m.connection.db!.collection(c.name).countDocuments();
    console.log(`${c.name}: ${n}`);
  }
  console.log(`OK collections=${cols.length}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
