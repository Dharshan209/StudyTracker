import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../Config/firebase'; // Make sure this path is correct

/**
 * A custom hook to fetch a resource document from the 'resources' collection in Firestore.
 * @param {string} problemTitle - The ID of the document to fetch, which corresponds to the problem's title.
 * @returns {{data: object | null, loading: boolean, error: string | null}} - An object containing the fetched data, loading state, and any errors.
 */
const useGetResources = (problemTitle) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't fetch if the problemTitle isn't available yet
    if (!problemTitle) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Construct a reference to the document: /resources/{problem.title}
        const docRef = doc(db, 'resources', problemTitle);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // If the document is found, store its content
          setData(docSnap.data());
        } else {
          // If not found, set an error
          setError(`Resource not found for "${problemTitle}".`);
          setData(null);
        }
      } catch (err) {
        // Handle any errors during the fetch operation
        console.error("Error fetching resource from Firebase:", err);
        setError("Failed to fetch resource data.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [problemTitle]); // Re-run the effect if problemTitle changes

  return { data, loading, error };
};

export default useGetResources;