import React from 'react';

const ConnectButton = ({ account, connecting, onConnect, onDisconnect, error }) => {
  if (connecting) {
    return <button className="connect-button" disabled>Connecting...</button>;
  }

  if (account) {
    return <button className="connect-button" onClick={onDisconnect}>Disconnect UP</button>;
  }

  return (
    <>
      <button className="connect-button" onClick={onConnect}>Connect UP</button>
      {error && <p className="error-message">{error}</p>}
    </>
  );
};

export default ConnectButton;
