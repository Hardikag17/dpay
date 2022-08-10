import { useEffect, useState, useReducer } from 'react';
import Gun from 'gun';

// initialize gun locally
const gun = Gun({
  peers: ['http://localhost:5000/gun'],
});

// create the initial state to hold the messages
const initialState = {
  messages: [],
};

// Create a reducer that will update the messages array
function reducer(state, message) {
  return {
    messages: [message, ...state.messages],
  };
}

export default function UserDate() {
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    name: '',
    message: '',
  });

  // initialize the reducer & state for holding the messages array
  const [state, dispatch] = useReducer(reducer, initialState);

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state
  useEffect(() => {
    const messages = gun.get('messages');
    messages.map().on((m) => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt,
      });
    });
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage() {
    const messages = gun.get('messages');
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now(),
    });
    setForm({
      name: '',
      message: '',
    });
  }

  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  return (
    <div className=' w-full flex flex-col'>
      <div className=' flex flex-row border-solid border-grey border-2 w-full'>
        <div className=' text-left flex items-center w-full font-bold p-1 text-mobile_large px-2'>
          $Tezos: 523
        </div>
        <div className=' flex flex-row justify-end'>
          <button class='text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 '>
            Take
          </button>
          <button class='text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 '>
            Put
          </button>
          <button class='text-gray rounded-lg border-2 m-1 border-solid border-grey focus:outline-none w-24 h-12 '>
            Stake
          </button>
        </div>
      </div>
      <div className='absolute flex flex-col justify-end right-0 bottom-0 w-4/6'>
        <div className='text-grey py-2 lg:px-2 text-small text-center'>
          {/* {state.messages.map((message) => (
            <div key={message.createdAt}>
              <h2>{message.message}</h2>
              <h3>From: {message.name}</h3>
              <p>Date: {message.createdAt}</p>
            </div>
          ))} */}
          <i>Your Chats are end to end encrypted</i>
        </div>
        <div class='bg-black rounded-full w-full flex items-center border-2 border-solid border-grey shadow-xl'>
          <input
            className='rounded-l text-small bg-black w-full px-4 text-gray leading-tight focus:outline-none'
            id='search'
            type='text'
            placeholder='Type you chats'
            onChange={onChange}
            name='message'
            value={formState.message}
          />
          <button
            onClick={saveMessage}
            class='text-gray rounded-full  border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            send{' '}
            <span className=' text-yellow text-right text-web_normal font-bold'>
              .
            </span>
          </button>
        </div>
        <div></div>
      </div>
    </div>
  );
}
