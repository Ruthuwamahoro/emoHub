
import { ChatUser, MentalHealthChatLayout } from "@/components/Dashboard/Chat";
import { EnhancedChat } from "@/components/Dashboard/Chat2";
const currentUser: ChatUser = {
    id: '1',
    name: 'John Doe',
    role: 'user',
    isOnline: true
  };
  
  const specialist: ChatUser = {
    id: '2',
    name: 'Dr. Smith',
    role: 'specialist',
    isOnline: true
  };
export default function Home() {
  return (
    <div className="">
       <MentalHealthChatLayout />
       {/* <EnhancedChat />  */}
    </div>
  );
}