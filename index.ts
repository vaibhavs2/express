import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import { firestoreDB } from "./firebase";
import { F_FORM_COLLECTION } from "./appConstant";


function createServer(port: string = "5732") {
  const app = express();

  app.use(express.json());
  app.use(cors())

  app.get("/", (request, response) => {
    response.send("Hello, ");
  });

  app.post("/form", async (request, response) => {
    const formData = request.body as {
      name: string;
      phone: string;
      email: string;
      metadata: string;
    };
    if (!formData.email || !formData.phone || !formData.email) {
      response.status(200);
      response.send({ error: true, message: "Missing form attribute", formData });
      return;
    }
    const docRef = firestoreDB.collection(F_FORM_COLLECTION).doc();
    await docRef.set(formData);
    response.status(200);
    response.send({ message: "Successfull , Data stored!", formId: docRef.id });
  });

  app.get("/form/:formId", async (request, response) => {
    const { formId } = request.params;
    const docRef = firestoreDB.collection(F_FORM_COLLECTION).doc(formId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      response.status(200);
      response.send({
        error: true,
        message: "No data available, maybe form is deleted!",
      });
      return;
    } else {
      response.status(200);
      response.send(docSnap.data());
    }
  });

  app.delete("/form/:formId", async (request, response) => {
    const { formId } = request.params;
    const docRef = firestoreDB.collection(F_FORM_COLLECTION).doc(formId);
    await docRef.delete();
    response.status(200);
    response.send({ error: false, message: "Form deleted" });
  });

  app.put("/form/:formId", async (request, response) => {
    const { formId } = request.params;
    const formData = request.body as {
      name: string;
      phone: string;
      email: string;
      metadata: string;
    };
    const docRef = firestoreDB.collection(F_FORM_COLLECTION).doc(formId);
    await docRef.update(formData);
    response.status(200);
    response.send({ message: "Form deleted" });
  });

  app.get("/get-all-forms", async (request, response) => {
    try {
      const collectionRef = await firestoreDB.collection(F_FORM_COLLECTION).get();
      if (collectionRef.empty) {
        response.status(200);
        response.send([]);
        return;
      } 

        const allForms = collectionRef.docs.map((eachDocs) => ({
          ...eachDocs.data(),
          id: eachDocs.id,
        }));
        response.status(200);
        response.send(allForms);
    
    } catch (e) {
      console.log("eee all-forms", e);
    }
  });

  app.listen(port, () => {
    console.log("server started at port:", port);
  });
}

createServer(process.env.PORT);
