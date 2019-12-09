import React from 'react';

export default ({ children }) => {
  return (
    <div style={{ height: 'calc(100vh - 16px)' }}>
      {children}
    </div>
  )
}