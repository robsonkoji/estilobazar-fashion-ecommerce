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

    // Se o Firestore respondeu com 0 produtos e o banco NUNCA foi semeado, exibe os modelos locais
    const hasBeenSeeded = localStorage.getItem('estilobazar_firestore_seeded') === 'true';
    if (products.length === 0 && !hasBeenSeeded) {
      console.log('📦 Firestore vazio. Exibindo catálogo modelo...');
      cachedProducts = [...localFallbackProducts];
      return cachedProducts;
    }

    cachedProducts = products;
    return products;
  } catch (error) {
    console.warn('⚠️ Erro ao consultar Firestore. Usando fallback local:', error.message);
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

    localStorage.setItem('estilobazar_firestore_seeded', 'true');
    await getProductsFromFirestore(true);
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
    await getProductsFromFirestore(true);
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

    localStorage.setItem('estilobazar_firestore_seeded', 'true');
    await getProductsFromFirestore(true);
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

// Semeia o banco com o acervo inicial (Suporta forçar recriação)
export async function seedProductsToFirestore(force = false) {
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(productsRef);

    if (!snapshot.empty && !force) {
      const confirmForce = confirm('O banco de dados já possui produtos. Deseja adicionar o lote inicial de modelos novamente?');
      if (!confirmForce) {
        return { success: false, message: 'Operação cancelada.' };
      }
    }

    let count = 0;
    for (const p of localFallbackProducts) {
      const { id, ...pData } = p;
      await addDoc(collection(db, COLLECTION_NAME), {
        ...pData,
        createdAt: new Date().toISOString()
      });
      count++;
    }

    localStorage.setItem('estilobazar_firestore_seeded', 'true');
    await getProductsFromFirestore(true);
    return { success: true, count };
  } catch (error) {
    console.error('Erro ao semear banco:', error);
    return { success: false, error: error.message };
  }
}
