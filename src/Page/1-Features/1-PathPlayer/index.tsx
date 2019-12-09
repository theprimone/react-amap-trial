import React, { useState, useEffect } from 'react';
import PathPlayer from '../../../components/PathPlayer';
// import styles from './index.less';

export default function () {
  const [path, setPath] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('https://a.amap.com/amap-ui/static/data/big-routes.json');
      const json = await response.json();
      setPath(json);
    }
    getData();
  }, []);

  return (
    <div>
      <PathPlayer
        height='calc(100vh - 10px)'
        path={path.length ? [path[0]] : path}
      />
    </div>
  )
}
