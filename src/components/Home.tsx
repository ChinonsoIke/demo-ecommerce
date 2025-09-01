import { useEffect, useState } from 'react'
import '../App.css'
import type { ProductResponse } from '../models'
import r1 from '../assets/r4.png'
import { useNavigate } from 'react-router'

function Home() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const navigate = useNavigate()

  const getProducts = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/products`, {
      method: 'GET'
    });
    if(!response.ok) {
      console.log("problem")
    } else setProducts(await response.json())
  }

  useEffect(() => {
    const fetchProducts = async () => {
      await getProducts();
    }

    fetchProducts();
  }, [])

  return (
    <div className='overflow-auto p-12 bg-gray-100 w-full h-full'>
      <div>
        <p onClick={() => navigate('/')} className='cursor-pointer text-4xl font-medium overline text-green-500'>EasyBuy</p>
      </div>
      <div className='overflow-auto flex flex-wrap md:gap-8 justify-center py-12'>
        {products && products.map(p => (
          <div key={p.id} 
            onClick={() => navigate(`/product/${p.id}`)} 
            className='bg-white p-4 md:w-1/4 rounded shadow-md cursor-pointer'>
            <img src={r1} alt="" className='mb-4' />
            <p className='font-medium text-lg'>{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
