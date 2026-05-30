import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, query, where, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVDDXb_LVO8JNQbToPLI0P0lSwgebVKNw",
  authDomain: "bixsolweb.firebaseapp.com",
  projectId: "bixsolweb",
  storageBucket: "bixsolweb.firebasestorage.app",
  messagingSenderId: "574097594377",
  appId: "1:574097594377:web:2cd23f9366d3838de5c0d8",
  measurementId: "G-ESXSJDBKV8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runTests() {
  console.log("--- Testing Firestore Connectivity ---");
  
  // Test 1: Fetch sales_team collection listing
  try {
    console.log("Test 1: Fetching all sales_team documents (collection get)...");
    const teamSnap = await getDocs(collection(db, 'sales_team'));
    console.log(`Success! Found ${teamSnap.size} team members:`);
    teamSnap.forEach(d => {
      console.log(` - ID: ${d.id}, Name: ${d.data().name}, Email: ${d.data().email}, Phone: ${d.data().phone}, IsActive: ${d.data().isActive}`);
    });
  } catch (err) {
    console.error("Test 1 FAILED:", err.message);
  }

  // Test 2: Fetch specific team member document
  try {
    console.log("\nTest 2: Fetching specific team member 'BXSP001'...");
    const spDoc = await getDoc(doc(db, 'sales_team', 'BXSP001'));
    if (spDoc.exists()) {
      console.log("Success! Document 'BXSP001' exists:", spDoc.data());
    } else {
      console.log("Success! Query finished, but document 'BXSP001' does not exist.");
    }
  } catch (err) {
    console.error("Test 2 FAILED:", err.message);
  }

  // Test 3: Query sales_team by email
  try {
    console.log("\nTest 3: Querying sales_team where email == 'test@bixsol.com'...");
    const q = query(collection(db, 'sales_team'), where('email', '==', 'test@bixsol.com'));
    const querySnap = await getDocs(q);
    console.log(`Success! Found ${querySnap.size} matches.`);
  } catch (err) {
    console.error("Test 3 FAILED:", err.message);
  }

  // Test 4: Fetch sales_leads collection listing
  try {
    console.log("\nTest 4: Fetching all sales_leads documents (collection get)...");
    const leadsSnap = await getDocs(collection(db, 'sales_leads'));
    console.log(`Success! Found ${leadsSnap.size} leads.`);
  } catch (err) {
    console.error("Test 4 FAILED:", err.message);
  }

  // Test 5: Try to add a test document to applications (write test)
  try {
    console.log("\nTest 5: Trying to write a test document to applications...");
    const docRef = await addDoc(collection(db, 'applications'), {
      name: "Test Connection User",
      email: "test-connection@example.com",
      position: "Test Position",
      submittedAt: new Date()
    });
    console.log("Success! Written document with ID:", docRef.id);
  } catch (err) {
    console.error("Test 5 FAILED:", err.message);
  }

  // Test 6: Fetch applications collection (read test)
  try {
    console.log("\nTest 6: Fetching applications documents (collection read)...");
    const appsSnap = await getDocs(collection(db, 'applications'));
    console.log(`Success! Found ${appsSnap.size} applications.`);
  } catch (err) {
    console.error("Test 6 FAILED:", err.message);
  }

  process.exit(0);
}

runTests();
