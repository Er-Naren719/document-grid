// Hypothetical APIs for this project if you had to allow for adding, removing and  updating the elements
import { http, HttpResponse } from "msw";

let documents = [
	{ id: "1", type: "bank-draft", title: "Bank Draft", position: 0 },
	{ id: "2", type: "bill-of-lading", title: "Bill of Lading", position: 1 },
	{ id: "3", type: "invoice", title: "Invoice", position: 2 },
	{ id: "4", type: "bank-draft-2", title: "Bank Draft 2", position: 3 },
	{ id: "5", type: "bill-of-lading-2", title: "Bill of Lading 2", position: 4 },
];

export const handlers = [
	// GET all documents
	http.get("/api/documents", () => {
		return HttpResponse.json(documents);
	}),

	// GET single document
	http.get("/api/documents/:id", ({ params }) => {
		const document = documents.find(doc => doc.id === params.id);
		return document 
			? HttpResponse.json(document)
			: HttpResponse.json({ error: "Document not found" }, { status: 404 });
	}),

	// CREATE new document
	http.post("/api/documents", async ({ request }) => {
		const newDocument = await request.json();
		newDocument.id = `${documents.length + 1}`;
		newDocument.position = documents.length;
		documents.push(newDocument);
		return HttpResponse.json(newDocument, { status: 201 });
	}),

	// UPDATE document
	http.put("/api/documents/:id", async ({ params, request }) => {
		const index = documents.findIndex(doc => doc.id === params.id);
		if (index === -1) {
			return HttpResponse.json({ error: "Document not found" }, { status: 404 });
		}
		
		const updatedDocument = await request.json();
		documents[index] = { ...documents[index], ...updatedDocument };
		return HttpResponse.json(documents[index]);
	}),

	// DELETE document
	http.delete("/api/documents/:id", ({ params }) => {
		const index = documents.findIndex(doc => doc.id === params.id);
		if (index === -1) {
			return HttpResponse.json({ error: "Document not found" }, { status: 404 });
		}
		
		documents.splice(index, 1);
		// Reindex remaining documents
		documents = documents.map((doc, idx) => ({
			...doc,
			position: idx
		}));

		return HttpResponse.json({ message: "Document deleted" });
	})
];