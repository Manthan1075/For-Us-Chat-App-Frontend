import React, { useEffect } from 'react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Image, Send } from 'lucide-react'
import Message from '../components/Message.jsx'
import { getMessages } from '../services/messageServices.js'
import { useUser } from '../context/UserContext.jsx'

function ChatPage() {
  const { user } = useUser()
  const fetchMessages = async () => {
    try {
      const response = await getMessages({
        page: 1,
        userId: user?._id,
      })
      console.log("RESPONSE FROM GET MESSAGES :", response);

    } catch (error) {
      console.log("ERROR GETTING MESSAGES :", error);
    }
  }

  const handleSendMsg = async () => {
    try {

    } catch (error) {

    }
  }

  useEffect(() => { fetchMessages() }, [])

  return (
    <div>
      <div>
        <Message />
      </div>
      <div className='fixed bottom-0 w-3/4  flex p-4 gap-2' >
        <Input placeholder="Type a message..." />


        <label className="bg-primary cursor-pointer px-2 py-2 rounded flex items-center hover:bg-primary/90 transition-colors duration-200 shadow-sm">
          <Input type="file" className="hidden" accept="image/*" />
          <Image size={18} className="text-white" />
        </label>
        <Button> <Send /> </Button>
      </div>
    </div>
  )
}

export default ChatPage
