import React from 'react';

import {Icon} from '@ui-kitten/components';

const CustomIcon = ({name, color, size, ...rest}) => {
  return (
    <Icon
      name={name}
      {...rest}
      fill={color ? color : '#A9AEB5'}
      style={{width: size ? size : 20, height: size ? size : 20}}
    />
  );
};

export default CustomIcon;
