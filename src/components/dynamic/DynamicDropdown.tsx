import dynamic from 'next/dynamic';

export const DynamicDropdown = dynamic(() => import('@/components/Dropdown'));
