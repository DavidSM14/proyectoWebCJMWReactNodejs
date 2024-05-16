import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import Modal from "../ComponentesProductos/modal";
import SkeletonLoader from "../ComponentesProductos/skeletonLoader";

const CardProductBrand = ({ brand }) => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAddedMessage, setShowAddedMessage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:1234/products?codMarca=${brand}`);
                const brandProducts = response.data.filter(item => item.codmarca === brand); // Filtrar por marca
                randomizeAndSetProducts(brandProducts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [brand]);

    const randomizeAndSetProducts = (products) => {
        if (products.length > 4) {
            const shuffled = products.sort(() => 0.5 - Math.random());
            setProducts(shuffled.slice(0, 4)); // Selecciona 4 productos de manera aleatoria
        } else {
            setProducts(products);
        }
    };

    const handleAddToCart = (product) => {
        addToCart({
            id: product.codprodu,
            name: product.desprodu,
            price: 3, // Precio fijo por ahora
            image: product.imageUrl,
            quantity: 1
        });
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 2000);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    return (
        <div>
            {loading ? (
                <SkeletonLoader repeticiones={4} />
            ) : (
                <div className="flex justify-center items-center space-x-4">
                    {products.map(product => (
                        <div key={product.codprodu} className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out transform hover:scale-105 mx-2 mb-7">
                            <div className="relative overflow-hidden" onClick={() => handleProductClick(product)}>
                                <img className="object-cover w-full h-full" src={product.imageUrl} alt={product.desprodu} />
                                <div className="absolute inset-0 bg-black opacity-40"></div>
                            </div>
                            <h3 className="text-center text-xl font-bold text-gray-900 mt-4">{product.desprodu}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-gray-900 font-bold text-lg">€3</span>
                                <button onClick={() => handleAddToCart(product)} className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Adquirir muestra</button>
                            </div>
                        </div>
                    ))}
                    {showAddedMessage && (
                        <div className="fixed top-20 right-2 bg-green-500 text-white p-3 rounded-lg shadow-lg" style={{ animation: 'fadeIn 0.3s' }}>
                            Producto agregado correctamente
                        </div>
                    )}
                </div>
            )}
            {modalOpen && (
                <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={selectedProduct} />
            )}
        </div>
    );
};

export default CardProductBrand;