// "use client";

// import type React from "react";

// import { createContext, useContext, useReducer, type ReactNode } from "react";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   quantity: number;
// }

// interface CartState {
//   items: CartItem[];
//   total: number;
//   itemCount: number;
// }

// type CartAction =
//   | {
//       type: "ADD_ITEM";
//       payload: Omit<CartItem, "quantity"> & { quantity?: number };
//     }
//   | { type: "REMOVE_ITEM"; payload: { id: number } }
//   | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
//   | { type: "CLEAR_CART" };

// const CartContext = createContext<{
//   state: CartState;
//   dispatch: React.Dispatch<CartAction>;
// } | null>(null);

// function cartReducer(state: CartState, action: CartAction): CartState {
//   switch (action.type) {
//     case "ADD_ITEM": {
//       const existingItem = state.items.find(
//         (item) => item.id === action.payload.id
//       );

//       if (existingItem) {
//         const updatedItems = state.items.map((item) =>
//           item.id === action.payload.id
//             ? {
//                 ...item,
//                 quantity: item.quantity + (action.payload.quantity || 1),
//               }
//             : item
//         );

//         return {
//           ...state,
//           items: updatedItems,
//           total: updatedItems.reduce(
//             (sum, item) => sum + item.price * item.quantity,
//             0
//           ),
//           itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
//         };
//       } else {
//         const newItem = {
//           ...action.payload,
//           quantity: action.payload.quantity || 1,
//         };
//         const updatedItems = [...state.items, newItem];

//         return {
//           ...state,
//           items: updatedItems,
//           total: updatedItems.reduce(
//             (sum, item) => sum + item.price * item.quantity,
//             0
//           ),
//           itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
//         };
//       }
//     }

//     case "REMOVE_ITEM": {
//       const updatedItems = state.items.filter(
//         (item) => item.id !== action.payload.id
//       );

//       return {
//         ...state,
//         items: updatedItems,
//         total: updatedItems.reduce(
//           (sum, item) => sum + item.price * item.quantity,
//           0
//         ),
//         itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
//       };
//     }

//     case "UPDATE_QUANTITY": {
//       if (action.payload.quantity <= 0) {
//         return cartReducer(state, {
//           type: "REMOVE_ITEM",
//           payload: { id: action.payload.id },
//         });
//       }

//       const updatedItems = state.items.map((item) =>
//         item.id === action.payload.id
//           ? { ...item, quantity: action.payload.quantity }
//           : item
//       );

//       return {
//         ...state,
//         items: updatedItems,
//         total: updatedItems.reduce(
//           (sum, item) => sum + item.price * item.quantity,
//           0
//         ),
//         itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
//       };
//     }

//     case "CLEAR_CART": {
//       return {
//         items: [],
//         total: 0,
//         itemCount: 0,
//       };
//     }

//     default:
//       return state;
//   }
// }

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(cartReducer, {
//     items: [],
//     total: 0,
//     itemCount: 0,
//   });

//   return (
//     <CartContext.Provider value={{ state, dispatch }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// }
"use client";

import type React from "react";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity?: number };
    }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

// localStorage key
const CART_STORAGE_KEY = "skincare-cart";

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  clearCartAfterOrder: (orderId: string) => void;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: item.quantity + (action.payload.quantity || 1),
              }
            : item
        );

        newState = {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      } else {
        const newItem = {
          ...action.payload,
          quantity: action.payload.quantity || 1,
        };
        const updatedItems = [...state.items, newItem];

        newState = {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }
      break;
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );

      newState = {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
      break;
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: { id: action.payload.id },
        });
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      newState = {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
      break;
    }

    case "CLEAR_CART": {
      newState = {
        items: [],
        total: 0,
        itemCount: 0,
      };
      break;
    }

    case "LOAD_CART": {
      newState = action.payload;
      break;
    }

    default:
      return state;
  }

  return newState;
}

// Helper functions for localStorage
const saveCartToStorage = (cartState: CartState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }
};

const loadCartFromStorage = (): CartState | null => {
  if (typeof window !== "undefined") {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }
  return null;
};

const clearCartFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear cart from localStorage:", error);
    }
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: savedCart });
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);

  // Function to clear cart after successful order
  const clearCartAfterOrder = (orderId: string) => {
    // Save the order information before clearing (optional)
    if (typeof window !== "undefined") {
      try {
        const completedOrders = JSON.parse(
          localStorage.getItem("completed-orders") || "[]"
        );
        completedOrders.push({
          orderId,
          items: state.items,
          total: state.total,
          completedAt: new Date().toISOString(),
        });
        localStorage.setItem(
          "completed-orders",
          JSON.stringify(completedOrders)
        );
      } catch (error) {
        console.error("Failed to save order history:", error);
      }
    }

    // Clear the cart
    dispatch({ type: "CLEAR_CART" });
    clearCartFromStorage();
  };

  return (
    <CartContext.Provider value={{ state, dispatch, clearCartAfterOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
