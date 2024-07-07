export default () => `\
import * as AntdIcons from '@ant-design/icons';
import React from 'react';

const allIcons: Record<string, any> = AntdIcons;

function formatIcon(name: string) {
  return name.replace(name[0], name[0].toUpperCase()).replace(/-(w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

export function createIcon(icon: string | any): React.ReactNode | string {
  if (typeof icon === 'object') {
    return icon;
  }
  if (icon && typeof icon === 'string') {
    const upperIcon = formatIcon(icon);
    if (allIcons[upperIcon] || allIcons[upperIcon + 'Outlined']) {
      return React.createElement(allIcons[upperIcon] || allIcons[upperIcon + 'Outlined']);
    }
  }

  return '';
}
`;