import { UserProfile } from "@clerk/nextjs";
const UserProfilePage = () => <div className="user-profile"><UserProfile path="/user" routing="path" />;</div>

export default UserProfilePage;