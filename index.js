const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.azxym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

// =====================================
async function run() {
	try {
		await client.connect();
		const database = client.db("node-recap");
		const servicesCollection = database.collection("services");
		// create a document to insert
		app.post("/services", async (req, res) => {
			const data = req.body;
			const result = await servicesCollection.insertOne(data);

			res.send(result);
			// if (result.acknowledged) {
			// 	console.log("okk");
			app.get("/services", async (req, res) => {
				const services = await servicesCollection.find({});
				const data = await services.toArray();
				res.send(data);
			});
		});
		app.get("/services", async (req, res) => {
			const services = await servicesCollection.find({});
			const data = await services.toArray();
			res.send(data);
		});
		app.delete("/services/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await servicesCollection.deleteOne(query);
			res.send(result);
		});
		app.put("/services/:id", async (req, res) => {
			const filter = { _id: ObjectId(req.body.id) };
			const updateDoc = {
				$set: {
					name: req.body.name,
				},
			};
			const result = await servicesCollection.updateOne(filter, updateDoc);
			res.send(result);
		});
	} finally {
		//await client.close();
	}
}

run().catch(console.dir);
// ==========================================
app.get("/", (req, res) => {
	res.send({ id: 567 });
});

app.listen(port, () => {
	console.log("listening");
});
