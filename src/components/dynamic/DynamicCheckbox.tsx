import dynamic from 'next/dynamic';

export const DynamicCheckbox = dynamic(() => import('@/components/Checkbox'));
