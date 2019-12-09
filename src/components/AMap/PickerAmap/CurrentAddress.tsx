import React from "react";

export interface CurrentAddressProps {
  formattedAddress?: string;
}

export const CurrentAddress: React.FC<CurrentAddressProps> = ({
  formattedAddress,
  children,
}) => {
  const setAddress = () => formattedAddress || '选择地址';

  return (
    <div>
      <p style={{ margin: '8px 0' }}>当前地址：{setAddress()}</p>
      {children}
    </div>
  );
}

export default CurrentAddress;
