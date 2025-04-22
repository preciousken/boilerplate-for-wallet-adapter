import React, { useState, useRef, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import './Header.css';

const Header: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [showSolModal, setShowSolModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { connected, publicKey, disconnect } = useWallet();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleConnectClick = () => {
        if (!connected) {
            setShowModal(true);
        }
    };

    const handleSolClick = () => {
        setShowModal(false);
        setShowSolModal(true);
    };

    const handleEVMClick = () => {
        setShowModal(false);
        // TODO: Implement EVM wallet connection
        console.log('EVM wallet connection to be implemented');
    };

    const handleDisconnect = async () => {
        try {
            await disconnect();
            setShowDropdown(false);
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    };

    // Close modals when wallet is connected
    useEffect(() => {
        if (connected) {
            setShowModal(false);
            setShowSolModal(false);
        }
    }, [connected]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <header className="header">
            <div className="logo">
                <img src="/logo.png" alt="Logo" />
            </div>
            <div className="connect-button">
                {connected ? (
                    <div className="wallet-container" ref={dropdownRef}>
                        <div 
                            className="wallet-address" 
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            {publicKey && formatAddress(publicKey.toString())}
                            <span className="dropdown-arrow">▼</span>
                        </div>
                        {showDropdown && (
                            <div className="wallet-dropdown">
                                <div className="wallet-info">
                                    <span className="full-address">{publicKey?.toString()}</span>
                                </div>
                                <button onClick={handleDisconnect} className="disconnect-button">
                                    Disconnect
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={handleConnectClick} className="connect-wallet-btn">
                        Connect Wallet
                    </button>
                )}
            </div>

            {/* Chain Selection Modal */}
            {showModal && !connected && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Select Chain</h2>
                        <div className="chain-options">
                            <button onClick={handleSolClick} className="chain-option">
                                Solana
                            </button>
                            <button onClick={handleEVMClick} className="chain-option">
                                EVM
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Solana Wallet Modal */}
            {showSolModal && !connected && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <WalletMultiButton />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header; 