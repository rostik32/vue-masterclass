import { findById, upsert } from '@/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.js';

export function makeAppendChildToParent(child, parent) {
  return (childId, parentId) => {
    const resource = findById(parent, parentId);

    if (!resource) {
      console.warn(
        `Appending ${child} ${childId} to ${parent} ${parentId}
        failed because the parent didn't exist`
      );

      return;
    }

    resource[child] = resource[child] || [];

    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
}

export async function fetchItem(resource, resourceName, id) {
  const docRef = doc(db, resourceName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const item = { id: docSnap.id, ...docSnap.data() };

    upsert(resource, item);

    return item;
  }

  return null;
}

export async function fetchItems(resource, resourceName, ids) {
  ids = ids || [];
  return Promise.all(ids.map((id) => fetchItem(resource, resourceName, id)));
}
