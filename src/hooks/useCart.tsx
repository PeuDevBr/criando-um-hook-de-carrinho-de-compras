import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');
    //Buscar dados do localStorage

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updateCart = [...cart] 
      // recebe uma cópia dos dados do array cart

      const productExists = updateCart.find(product => product.id === productId)
      // procura dentro do carinho se existe um produco com id igual ao id fornecido na chamada da função

      const stock = await api.get(`/stock/${productId}`)
      // pega na api e pega os dados do stock referente ao id fornecido

      const stockAmount = stock.data.amount
      // armazena a quantidado do item no estoque

      const currentAmount = productExists ? productExists.amount : 0
      // se o produto existe no carrinho, amarzena a sua quantidade

      const amount = currentAmount + 1;
      // quantidade desejada    
      
      if (amount > stockAmount) {
      // se a quantidade desejada for maior que a quantidade do iten no estoque

        toast.error('Quantidade solicitada fora de estoque'); //mostra o erro
        return; // encerra a função

      }

      if (productExists) {
        // se o produto já existe no carrinho

        productExists.amount = amount;
        // atualiza a quantidade do produto no carrinho
        
      } else {
        // se o produto ainda não existe no carrinho

        const product = await api.get(`/products/${productId}`)
        // pega os dados do produto na api

        const newProduct = {
          ...product.data, // copia os dados do produto em um novo produto
          amount:1, //adiciona a quantidade 1
        }
        updateCart.push(newProduct) // adiciona o produto na cópia do carrinho
      }

      setCart(updateCart) // atualiza os dados do carrinho

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updateCart))
      // transforma os dados em String e salva no localStorage

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
