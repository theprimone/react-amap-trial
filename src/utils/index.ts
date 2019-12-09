import React from 'react';

export function injectChildren(children, properties) {
  return React.Children.map(children, child => {
    if (child) {
      const { type: childType } = child;
      if (typeof childType === 'string') {
        return child;
      }
      return React.cloneElement(child, {
        ...properties,
      });
    }
    return child;
  });
}