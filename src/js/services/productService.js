import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../utils/firebase.js';
import { products as localFallbackProducts } from '../data/products.js';

const COLLECTION_NAME = 'products';
let cachedProducts = null;

// Retorna todos os produtos do Firestore (com fallback para local caso offline/sem permissão)
export async function getProductsFromFirestore() {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef);
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('📦 Firestore vazio. Usando catálogo inicial local...');
      cachedProducts = [...localFallbackProducts];
      return cachedProducts;
    }

    const products = [];
    snapshot.forEach(docSnap => {
      products.push({ id: docSnap.id, ...docSnap.data() });
    });

    cachedProducts = products;
    return products;
  } catch (error) {
    console.warn('⚠️ Não foi possível carregar do Firestore. Usando fallback local:', error.message);
    if (cachedProducts) return cachedProducts;
    return localFallbackProducts;
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

    if (cachedProducts) {
      cachedProducts.unshift(newProduct);
    }
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

// Exclui um produto do Firestore
export async function deleteProductFromFirestore(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);

    if (cachedProducts) {
      cachedProducts = cachedProducts.filter(p => p.id !== id);
    }
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

// Semeia o banco com o acervo inicial
export async function seedProductsToFirestore() {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(productsRef);
    if (!snapshot.empty) {
      return { success: false, message: 'Banco de dados já contém produtos.' };
    }

    for (const p of localFallbackProducts) {
      const { id, ...pData } = p;
      await setDoc(doc(db, COLLECTION_NAME, id), {
        ...pData,
        createdAt: new Date().toISOString()
      });
    }

    return { success: true, count: localFallbackProducts.length };
  } catch (error) {
    console.error('Erro ao semear banco:', error);
    return { success: false, error: error.message };
  }
}
