import MainLayout from '@/layouts/MainLayout';
import React from 'react';

function Custom404() {
  return (
    <MainLayout>
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mb-2 text-heading-h1">404</h1>
        <p>Strona nie została znaleziona</p>
      </div>
    </MainLayout>
  );
}

export default Custom404;
