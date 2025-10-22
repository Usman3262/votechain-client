import React from 'react';
import { Link } from 'react-router-dom';
import WalletButton from '../components/ui/WalletButton';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            VoteChain
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Register
            </Link>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Secure & Private
              <span className="text-blue-600"> Blockchain Voting</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              VoteChain provides a transparent, secure, and anonymous voting system built on blockchain technology. 
              Your vote is protected with advanced privacy mechanisms while maintaining the integrity of the electoral process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-3 bg-white text-blue-600 text-lg font-medium rounded-lg border border-blue-600 hover:bg-blue-50"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy-Preserving Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our system ensures your vote remains anonymous while maintaining the integrity of the voting process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Zero-Knowledge Proofs</h3>
                <p className="text-gray-600">
                  Using advanced cryptographic techniques to ensure votes are counted without revealing voter identity
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Anonymous Voting</h3>
                <p className="text-gray-600">
                  Your identity is never linked to your vote through the use of nullifier hashes and relayer systems
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Transparent Results</h3>
                <p className="text-gray-600">
                  All votes are publicly verifiable while maintaining individual voter privacy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How VoteChain Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our process ensures secure, private, and verifiable elections
              </p>
            </div>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="text-blue-600 font-bold text-lg">Step 1</div>
                  <h3 className="text-xl font-semibold text-gray-800">Register & Verify</h3>
                  <p className="text-gray-600 mt-2">
                    Register with your email and connect your wallet. Admins verify your eligibility.
                  </p>
                </div>
                <div className="md:w-2/3">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600">
                      Users register with personal information and a connected wallet address. 
                      Administrators review and approve registrations to ensure only eligible voters participate.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="text-blue-600 font-bold text-lg">Step 2</div>
                  <h3 className="text-xl font-semibold text-gray-800">Sign Your Vote</h3>
                  <p className="text-gray-600 mt-2">
                    Select your candidate and sign your vote using EIP-712 typed data.
                  </p>
                </div>
                <div className="md:w-2/3">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600">
                      When voting, your vote is signed with your wallet using EIP-712 typed data, 
                      which includes the election ID, candidate ID, nonce, and timestamp.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="text-blue-600 font-bold text-lg">Step 3</div>
                  <h3 className="text-xl font-semibold text-gray-800">Relayer Submission</h3>
                  <p className="text-gray-600 mt-2">
                    A trusted relayer submits your vote to the blockchain on your behalf.
                  </p>
                </div>
                <div className="md:w-2/3">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600">
                      The signed vote is sent to our backend where a relayer submits it to the blockchain. 
                      The relayer pays gas fees and ensures privacy by not linking your identity to your vote.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="text-blue-600 font-bold text-lg">Step 4</div>
                  <h3 className="text-xl font-semibold text-gray-800">Verify Results</h3>
                  <p className="text-gray-600 mt-2">
                    All results are publicly verifiable on the blockchain.
                  </p>
                </div>
                <div className="md:w-2/3">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600">
                      Election results are transparently displayed in real-time, and anyone can verify 
                      the integrity of the results on the blockchain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">VoteChain</h3>
              <p className="text-gray-300">
                Secure and private blockchain voting system for transparent elections.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>© 2023 VoteChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;