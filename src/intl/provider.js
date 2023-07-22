import React from 'react';

import i18n from './i18n';
export const getRowText = (id) => {
 const language= process.env.REACT_APP_LANGUAGE==="en"?"en":"zh";
 return i18n[language][id];
};
