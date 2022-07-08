import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Body() {
  let history = useHistory();

  return (
    <div className=' flex flex-col lg:mx-64 mx-auto lg:my-10 my-24 lg:px-4 lg:w-1/2 w-10/12'>
      <div className=' lg:text-web_title text-mobile_title'>
        Verify your Identity
      </div>
      <div className='text-grey py-5 lg:px-2 text-small lg:w-3/4 w-full'>
        Your identity must be verifed by texos domains
      </div>
      <div class='lg:w-3/4 w-full'>
        <div class='bg-black flex items-center rounded-lg border-2 border-solid border-grey shadow-xl'>
          <input
            className='rounded-l bg-black w-full px-4 text-gray leading-tight focus:outline-none'
            id='search'
            type='text'
            placeholder='Eg: alex'
          />
          <button class='text-gray rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            .tez
          </button>
        </div>
      </div>
      <div className=' py-10 z-10'>
        <div>
          <button
            onClick={() => {
              history.push('/dashboard');
            }}
            className='bg-yellow hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-black font-semibold lg:text-2xl text-xl text-center'>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
