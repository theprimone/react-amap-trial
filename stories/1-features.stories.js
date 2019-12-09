import React from 'react';
import PolyEditor from '../src/Page/1-Features/0-PolyEditor';
import PathPlayer from '../src/Page/1-Features/1-PathPlayer';

export default {
  title: 'Features',
};

export const polyEditor = () => <PolyEditor />;
polyEditor.story = {
  name: 'Poly Editor',
}

export const pathPlayer = () => <PathPlayer />;
pathPlayer.story = {
  name: 'Path Player',
}
