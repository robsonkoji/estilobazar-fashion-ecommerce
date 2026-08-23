import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../utils/firebase.js';
import { products as localFallbackProducts } from '../data/products.js';

const COLLECTION_NAME = 'products';
let cachedProducts = null;

// Retorna todos os produtos do Firestore
export async function getProductsFromFirestore(forceRefresh = false) {
  if (cachedProducts && !forceRefresh) {
    return cachedProducts;
  }

  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef);
    const snapshot = await getDocs(q);

    const products = [];
    snapshot.forEach(docSnap => {
      products.push({ id: docSnap.id, ...docSnap.data() });
    });

    const hasBeenSeeded = localStorage.getItem('estilobazar_firestore_seeded') === 'true';
    if (products.length === 0 && !hasBeenSeeded) {
      console.log('📦 Firestore sem dados iniciais. Usando catálogo modelo...');
      cachedProducts = localFallbackProducts.map(p => ({ ...p }));
      return cachedProducts;
    }

    cachedProducts = products;
    return products;
  } catch (error) {
    console.warn('⚠️ Erro ao consultar Firestore. Usando fallback local:', error.message);
    if (cachedProducts) return cachedProducts;
    return localFallbackProducts.map(p => ({ ...p }));
  }
}

// Adiciona um novo produto ao Firestore
export async function addProductToFirestore(productData) {
  try {
    const docData = {
      ...productData,
      createdAt: new Date().toISOString(),
      price: parseFloat(productData.price) || 0,
      originalPrice: parseFloat(productData.originalPrice) || 0,
      isFeatured: !!productData.isFeatured,
      isNew: !!productData.isNew,
      isBargain: !!productData.isBargain
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    const newProduct = { id: docRef.id, ...docData };

    localStorage.setItem('estilobazar_firestore_seeded', 'true');
    if (!cachedProducts) cachedProducts = [];
    cachedProducts.unshift(newProduct);

    return { success: true, product: newProduct };
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, error: error.message };
  }
}

// Atualiza um produto existente
export async function updateProductInFirestore(id, productData) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...productData,
      updatedAt: new Date().toISOString(),
      price: parseFloat(productData.price) || 0,
      originalPrice: parseFloat(productData.originalPrice) || 0,
      isFeatured: !!productData.isFeatured,
      isNew: !!productData.isNew,
      isBargain: !!productData.isBargain
    };

    await updateDoc(docRef, updateData);
    if (cachedProducts) {
      const idx = cachedProducts.findIndex(p => p.id === id);
      if (idx !== -1) {
        cachedProducts[idx] = { ...cachedProducts[idx], ...updateData };
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { success: false, error: error.message };
  }
}

// Exclui APENAS o produto específico selecionado
export async function deleteProductFromFirestore(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);

    // Remove estritamente APENAS o item correspondente do cache da memória
    if (cachedProducts) {
      cachedProducts = cachedProducts.filter(p => p.id !== id);
    }
    localStorage.setItem('estilobazar_firestore_seeded', 'true');
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return { success: false, error: error.message };
  }
}

// Upload de foto do produto para o Storage
export async function uploadProductImage(file) {
  try {
    const filename = `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return { success: true, url: downloadUrl };
  } catch (error) {
    console.error('Erro no upload da imagem:', error);
    return { success: false, error: error.message };
  }
}

// Semeia o banco com o acervo inicial usando IDs determinísticos (prod-1, prod-2, etc.)
export async function seedProductsToFirestore(force = false) {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(productsRef);

    if (!snapshot.empty && !force) {
      const confirmForce = confirm('O banco de dados já possui produtos. Deseja adicionar o lote de modelos novamente?');
      if (!confirmForce) {
        return { success: false, message: 'Operação cancelada.' };
      }
    }

    let count = 0;
    const seededList = [];

    for (const p of localFallbackProducts) {
      const { id, ...pData } = p;
      const productDoc = {
        ...pData,
        createdAt: new Date().toISOString()
      };
      // Grava com o ID explícito (prod-1, prod-2...)
      await setDoc(doc(db, COLLECTION_NAME, id), productDoc);
      seededList.push({ id, ...productDoc });
      count++;
    }

    localStorage.setItem('estilobazar_firestore_seeded', 'true');
    cachedProducts = seededList;
    return { success: true, count };
  } catch (error) {
    console.error('Erro ao semear banco:', error);
    return { success: false, error: error.message };
  }
}
