import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {} from '@fortawesome/free-regular-svg-icons';
import User from './user.jsx';
import UserData from './userData.jsx';

export default function Dashboard() {
  return (
    <div className='flex lg:flex-row mx-auto lg:px-4 lg:w-3/4 w-full lg:h-96 m-2 justify-start'>
      <div className='lg:w-2/6 flex flex-col w-full h-full border-2 border-solid border-grey items-center'>
        <div className=' flex flex-row border-2 border-solid border-grey w-full'>
          <button className='text-yellow font-bold text-mobile_large rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            +
          </button>
          <button className='text-yellow font-bold text-mobile_large rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button class='text-white font-bold text-mobile_large rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            .
          </button>
        </div>
        <div className=' w-full m-1'>
          <User />
        </div>
      </div>
      <div className='lg:w-3/5 w-0 h-full border-2 border-solid border-grey flex items-center '>
        <UserData />
      </div>
    </div>
  );
}
