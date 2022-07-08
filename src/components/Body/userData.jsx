export default function UserDate() {
  return (
    <div className=' lg:h-full lg:w-full'>
      <div className=' flex flex-row border-solid border-grey border-2 w-full'>
        <div className=' text-left flex items-center w-full font-bold p-1 text-mobile_large px-2'>
          $Tezos: 523
        </div>
        <div className=' flex flex-row justify-end'>
          <button class='text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            Take
          </button>
          <button class='text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            Put
          </button>
          <button class='text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            Stake
          </button>
        </div>
      </div>
      <div className='flex flex-1 flex-col justify-end h-80 w-full'>
        <div className='text-grey py-2 lg:px-2 text-small text-center'>
          <i>Your Chats are end to end encrypted</i>
        </div>
        <div class='bg-black rounded-full w-full flex items-center border-2 border-solid border-grey shadow-xl'>
          <input
            className='rounded-l text-small bg-black w-full px-4 text-gray leading-tight focus:outline-none'
            id='search'
            type='text'
            placeholder='Type you chats'
          />
          <button class='text-gray rounded-full  border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            send{' '}
            <span className=' text-yellow text-right text-web_normal font-bold'>
              .
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
