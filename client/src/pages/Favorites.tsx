import { useSelector } from "react-redux"
import UserProfileFavorites from "../components/ui/Profile/UserProfileFavorites"
import { RootState } from "../store"

const Favorites=()=>{
    const user=useSelector((state:RootState)=>state.auth.user)
return(
    <>
    <div className="flex flex-col">
    <UserProfileFavorites username={user?.username}/>
    </div>
    </>
)
}
export default Favorites