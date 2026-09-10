import React, { useState } from 'react';
import LoginPage from './login';
import Signup from './Signup';

function MainLoginSignup() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <div className="relative">
          <div className={`transition-all duration-500 transform ${isLogin ? 'translate-x-0' : '-translate-x-full'}`}>
            {isLogin && (
              <div className="absolute w-full">
                <LoginPage onSignupClick={() => setIsLogin(false)} />
              </div>
            )}
          </div>
          
          <div className={`transition-all duration-500 transform ${!isLogin ? 'translate-x-0' : 'translate-x-full'}`}>
            {!isLogin && (
              <div className="absolute w-full">
                <Signup onLoginClick={() => setIsLogin(true)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLoginSignup;
