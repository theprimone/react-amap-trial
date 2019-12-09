import React from 'react';
import Hello from '../src';

export default {
  title: 'Hello',
};

export const hello = () => <Hello />;

hello.story = {
  name: 'Hello World',
};
