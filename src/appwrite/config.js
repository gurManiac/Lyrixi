import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_ENDPOINT)
  .setProject(import.meta.env.VITE_PROJECT_ID);

const databases = new Databases(client);

// More collections can be added here
const collections = [
    {
        name: "songSections",
        id: import.meta.env.VITE_COLLECTION_SONGSECTIONS_ID,
        dbId: import.meta.env.VITE_DATABASE_ID
    },
];
 
export { client, databases, collections};
