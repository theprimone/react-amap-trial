import React from 'react';
import { Button } from "antd";
import styles from './index.less';

export default () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className={styles.h1}>Hello, React Antd Storybook!</h1>
      <Button>Hello</Button>
    </div>
  );
}
