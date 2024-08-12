import React from 'react';

import { env } from '@/env';

import './index.scss';

export function App() {
  return <p>{env.API_URL}</p>;
}
