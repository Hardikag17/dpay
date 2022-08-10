import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {} from '@fortawesome/free-regular-svg-icons';
import User from './user.jsx';
import UserData from './userData.jsx';

export default function Dashboard() {
  return (
    <div className='flex lg:flex-row mx-auto justify-center h-screen w-screen border-2 border-solid border-grey'>
      <div className='w-2/6 flex flex-col items-center'>
        <div className=' flex flex-row border-2 border-solid border-grey py-1 w-full'>
          <button className='text-yellow font-bold text-mobile_large rounded-lg focus:outline-none w-24 h-12 flex items-center justify-center'>
            +
          </button>
          <button className='text-yellow font-bold text-mobile_large rounded-lg  focus:outline-none w-24 h-12 flex items-center justify-center'>
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button class='text-white font-bold text-mobile_large rounded-lg focus:outline-none w-24 h-12 flex items-center justify-center'>
            .
          </button>
        </div>
        <div className=' m-1'>
          <User />
        </div>
      </div>
      <div className='w-4/6 border-2 border-solid border-grey '>
        <UserData />
      </div>
    </div>
  );
}
