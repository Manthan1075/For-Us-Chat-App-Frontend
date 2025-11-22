import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useUser } from '../context/UserContext'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Edit } from 'lucide-react'
import { editProfile } from '../services/userServices'

function Profile({ id = "", username = "manthan", bio = "Hello", profilePhoto = "" }) {
    // const { user, removeUser } = useUser()
    const user = {
        id: "",
        username: "admin",
        bio: "Hii",
    }
    const [isEditOn, setIsEditOn] = useState(false)

    const handleEditUser = async () => {
        try {
            const response = await editProfile();
            console.log("Response Of Edit Profile : ", response);
        } catch (error) {
            console.log("Error While Edit Profile : ", error);
        }
    }

    return (
        <div>
            <Button variant={"icon"} onClick={() => setIsEditOn(prev => !prev)}> <Edit /> </Button>
            <div className='flex '>
                <Avatar>
                    <AvatarImage src={profilePhoto} />
                    <AvatarFallback>
                        {username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <Input
                        value={username}
                        readOnly={!isEditOn}
                    />
                </div>
            </div>
            <div>
                <Input
                    value={bio}
                    readOnly={!isEditOn}
                />
            </div>
            <div>
                {
                    isEditOn ? (
                        <Button>Save</Button>
                    ) : (
                        <div className='flex gap-2 w-full'>
                            {(user?.id === id || user?.role === "admin") && (
                                <Button className="w-full text-white" variant="destructive">
                                    Delete User
                                </Button>
                            )}
                            <Button variant={'secondary'}>Logout</Button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Profile
