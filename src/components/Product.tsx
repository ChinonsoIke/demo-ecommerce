import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import type { ChatMessage, ProductResponse } from "../models"
import r4 from '../assets/r4.png'


const Product = () => {
    const navigate = useNavigate()
    const {id} = useParams<{id :string}>()
    const [product, setProduct] = useState<ProductResponse>()
    const [showChatModal, setShowChatModal] = useState<boolean>(false)
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [chatInput, setChatInput] = useState('')
    const [disableInput, setDisableInput] = useState(false)

    useEffect(() => {
        const getProduct = async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/products/${id}`)
            if(!response.ok) console.log('problem')
            else setProduct(await response.json())
        }

        getProduct()
    })

    const sendMessage = async () => {
        setDisableInput(true)

        const userMessage = {role: 1, text: chatInput}
        setChatMessages(prev => [...prev, userMessage])
        setChatInput('')

        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/products/query/${id}?query=${userMessage.text}`,{
            method: 'GET'
        })

        if(!response.body) return;

        setChatMessages(prev => [...prev, {role: 0, text: ''}])

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while(true){
            const {done, value} = await reader.read();
            if(done) break;

            const chunk = decoder.decode(value, {stream: true})
            setChatMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    text: updated[updated.length - 1].text + chunk
                };
                return updated;
            });
        }

        setDisableInput(false)
    }

    return (
        <div className="p-12 bg-gray-100 w-full h-full overflow-auto">
            <div className="mb-8">
                <p onClick={() => navigate('/')} className='cursor-pointer text-4xl font-medium overline text-green-500'>EasyBuy</p>
            </div>

            {product && (
                <div className="w-full h-full">
                    <div className="flex w-full h-full gap-8">
                        <div className="w-3/5">
                            <img src={r4} alt="" className="w-full h-5/7 mb-4"/>
                            <div>
                                <p className="font-semibold">Highlight by Chuks, your AI chat assistant:</p>
                                <p className="text-sm mb-3">{product.reviewSummary}</p>
                                <button 
                                    onClick={() => setShowChatModal(true)}
                                    className="cursor-pointer bg-green-500 text-white shadow-md p-2 rounded">Ask Chuks</button>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl mb-4">{product!.name}</h1>
                            <p className="text-lg">{product.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {showChatModal && <div onClick={() => setShowChatModal(false)} 
                className="w-full h-full bg-black opacity-60 absolute top-0 left-0"></div>}

            {showChatModal && (
                <div className="w-1/5 rounded-lg bg-gray-100 shadow-md h-3/5 absolute bottom-1/4 left-8">
                    <div className="absolute h-1/14 top-0 w-full text-xl font-bold flex items-center justify-end px-4 text-green-500">
                            <p onClick={() => {setShowChatModal(false); setChatMessages([])}} 
                                className="p-2 cursor-pointer">x</p>
                        </div>
                    <div className="h-12/14 w-full flex flex-col items-end p-2 overflow-y-auto">
                            {chatMessages.map(m => (
                                <div key={m.text} className={`w-2/3 shadow-xs p-2 text-sm break-words mb-2 rounded ${m.role == 0 ? 'self-start bg-white' : 'self-end bg-green-200'}`}>
                                    <p className="">{m.text}</p>
                                </div>
                                )
                            )}
                    </div>
                    <div className="absolute rounded-br-lg rounded-bl-lg w-full bg-gray-200 h-2/14 bottom-0 flex justify-center items-center">
                        <input type="text"
                            disabled={disableInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={async (e) => {
                                if(e.key == 'Enter') {
                                    await sendMessage()
                                }
                            }}
                            className="border border-green-500 rounded p-1" name='chatInput' value={chatInput} id="" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Product