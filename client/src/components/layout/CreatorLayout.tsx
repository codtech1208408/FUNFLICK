import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileFrameWrapper } from './MobileFrameWrapper';

export const CreatorLayout: React.FC = () => {
  return (
    <MobileFrameWrapper>
      <Outlet />
    </MobileFrameWrapper>
  );
};

