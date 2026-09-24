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

    // Se houver dados reais cadastrados no Firestore, eles são a fonte absoluta de verdade
    if (products.length > 0) {
      cachedProducts = products;
      return products;
    }

    // Se o Firestore estiver totalmente vazio
    const hasBeenSeeded = localStorage.getItem('estilobazar_firestore_seeded') === 'true';
    if (!hasBeenSeeded) {
      console.log('📦 Firestore sem dados. Carregando catálogo modelo...');
      cachedProducts = localFallbackProducts.map(p => ({ ...p }));
      return cachedProducts;
    }

    cachedProducts = [];
    return [];
  } catch (error) {
    console.warn('⚠️ Erro ao consultar Firestore. Usando fallback local:', error.message);
    if (cachedProducts && cachedProducts.length > 0) return cachedProducts;
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

    if (cachedProducts) {
      cachedProducts = cachedProducts.filter(p => p.id !== id);
    }
    localStorage.setItem('estilobazar_firestore_seeded', 'true');
    return { success: true };
  } catch (error) {
    console.warn('⚠️ Exclusão remota falhou no Firestore. Removendo do painel localmente:', error.message);
    
    // Se o item for local/fallback ou der erro de permissão no Firestore, remove do cache local para a interface atualizar
    if (cachedProducts) {
      cachedProducts = cachedProducts.filter(p => p.id !== id);
    }
    localStorage.setItem('estilobazar_firestore_seeded', 'true');
    return { success: true, warning: error.message };
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
export async function seedProductsToFirestore(force = false) {
  const sampleSeedItems = [
    {
      id: "prod-101",
      title: "Vestido Midi Romântico Floral",
      category: "Vestidos",
      price: 159.90,
      originalPrice: 340.00,
      size: "M",
      condition: "Como Novo",
      brand: "Farm",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      badge: "Brechó Curado",
      isFeatured: true,
      isNew: true,
      isBargain: false
    },
    {
      id: "prod-102",
      title: "Jaqueta Jeans Estonada Retro",
      category: "Jaquetas",
      price: 189.00,
      originalPrice: 450.00,
      size: "M",
      condition: "Como Nova",
      brand: "Levi's",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
      badge: "Brechó Curado",
      isFeatured: true,
      isNew: true,
      isBargain: false
    },
    {
      id: "prod-103",
      title: "Blazer Linho Curado Fendi",
      category: "Jaquetas",
      price: 245.00,
      originalPrice: 650.00,
      size: "M",
      condition: "Vintage Raro",
      brand: "Zara",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
      badge: "Brechó Curado",
      isFeatured: true,
      isNew: true,
      isBargain: false
    }
  ];

  try {
    const productsRef = collection(db, COLLECTION_NAME);
    let count = 0;
    const seededList = [];

    for (const p of sampleSeedItems) {
      const { id, ...pData } = p;
      const productDoc = {
        ...pData,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, COLLECTION_NAME, id), productDoc);
      seededList.push({ id, ...productDoc });
      count++;
    }

    localStorage.setItem('estilobazar_firestore_seeded', 'true');
    cachedProducts = seededList;
    return { success: true, count };
  } catch (error) {
    console.warn('⚠️ Erro ao semear banco Firebase:', error.message);
    if (error.message.includes('permissions') || error.code === 'permission-denied') {
      return { 
        success: false, 
        error: 'As regras de permissão no Firebase Console (Firestore Rules) precisam estar configuradas como "allow read, write: if true;".' 
      };
    }
    return { success: false, error: error.message };
  }
}
