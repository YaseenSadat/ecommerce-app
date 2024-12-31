import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products,setProducts] = useState([]);
    const [token,setToken] = useState('');
    const navigate = useNavigate();


    const addToCart = async (itemId, rarity) => {
        if (!rarity) {
            toast.error('Select Product Rarity');
            return;
        }
        
        // Clone cart data to avoid direct mutation
        let cartData = structuredClone(cartItems);
        
        // Find the product data for the given itemId
        const productData = products.find(product => product._id === itemId);
        
        if (!productData) {
            toast.error("Product not found");
            return;
        }
        
        // Get available stock for the selected rarity
        const availableStock = productData.rarities[rarity];
        
        // Check if the item is already in the cart
        if (cartData[itemId]) {
            // Check if the specific rarity exists in the cart for this item
            if (cartData[itemId][rarity] !== undefined) {
                // Check if there is enough stock to increase the quantity
                if (cartData[itemId][rarity] + 1 <= availableStock) {
                    cartData[itemId][rarity] += 1; // Increment the quantity by 1
                } else {
                    toast.error("Insufficient stock for this product.");
                    return;
                }
            } else {
                // If rarity is not yet in the cart, initialize it with quantity 1
                cartData[itemId][rarity] = 1;
            }
        } else {
            // If the item is not in the cart, initialize it with the selected rarity and quantity 1
            cartData[itemId] = {};
            cartData[itemId][rarity] = 1;
        }
        
        // Update the cart state with the new data
        setCartItems(cartData);
        
        // If there's a valid token, send the request to the backend
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, rarity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
        
    };
    

    const getCartCount =() => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, rarity, quantity) => {
        let cartData = structuredClone(cartItems); 

        cartData[itemId][rarity] = quantity;

        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', {itemId, rarity, quantity}, {headers:{token}})

            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (itemInfo) {
                for (const rarity in cartItems[itemId]) {
                    if (cartItems[itemId][rarity] > 0) {
                        totalAmount += itemInfo.price * cartItems[itemId][rarity];
                    }
                }
            }
        }
        return totalAmount;
    };
    
    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if(response.data.success){
                setProducts(response.data.products)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    }
    

    useEffect(()=>{
        getProductsData()
    },[])

    useEffect(()=>{
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    },[])
    

    const value = {
        products,
        currency,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        setCartItems,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token,
    };
    
    

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;