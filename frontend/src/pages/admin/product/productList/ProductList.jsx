import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, CheckSquare, XSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditProductPopup from '../EditProduct/EditProduct';
import toast from 'react-hot-toast';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [network, setNetwork] = useState(false)
  const [editProduct, setEditedProduct] = useState(false)

  useEffect(()=>{


  },[])

  const navigate = useNavigate()
  const HandleEdit = (product) =>{  
    setEditedProduct(product)
  }

  const handleToogleActivation = async(productId, productStatus)=>{

   try{

      setProducts(products.map((product)=>{
        if(productId === product._id){
          return {...product, status: !productStatus}
        }
        return product
      }))
      toast.success(response.data)
    }
    catch(error){
      toast.error(error.respone.data || error.message)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* edit product */}
      {
        setEditedProduct &&
        <EditProductPopup
          product={editProduct}
          isOpen={editProduct}
          onClose={()=> setEditedProduct(false)}
        />
      }
      {/* end edit product */}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button 
          onClick={()=> navigate('/admin/addproduct')}
        className="bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-300 transition-colors">
          Add New Product
        </button>
      </div>

      {
        products.length ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  product.status ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                }`}>
                  {product.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 truncate">{product.name}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold">${product.currentPrice}</span>
                  {product.regularPrice !== product.currentPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.regularPrice}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Category: {product.category}
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div className="text-sm text-gray-500">
                  Stock: {product.stock.reduce((acc, item) => acc + item.quantity, 0)} units
                </div>
                <div className="flex gap-2">
                  <button 
                    className="p-1 hover:bg-gray-100 rounded transition-colors" 
                    title="View"
                  >
                    <Eye size={18} className="text-blue-600" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded transition-colors" 
                    title="Edit"
                    onClick={()=> HandleEdit(product)}
                  >
                    <Edit size={18} className="text-green-600" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded transition-colors" 
                    title={product.status ? 'Deactivate' : 'Activate'}
                    onClick={()=> handleToogleActivation(product._id, product.status)}
                  >
                    {product.status ? (
                      <XSquare size={18} className="text-red-600" />
                    ) : (
                      <CheckSquare size={18} className="text-green-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      :<div>
        no products
      </div>
      }
    </div>
  );
};

export default AdminProductList;