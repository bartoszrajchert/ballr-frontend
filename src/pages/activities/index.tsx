import Button from '@/components/Button';
import Header from '@/components/Header';
import TextField from '@/components/TextField';
import MainLayout from '@/layouts/MainLayout';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import footballImage1 from '../../../public/prapoth-panchuea-_lTF9zrF1PY-unsplash.jpg';

function Activities() {
  return (
    <MainLayout>
      <Header value="Zajęcia" />
      <div className="flex gap-5">
        <aside>
          <p className="mb-8 text-heading-h3">Filtry</p>
          <Form />
        </aside>
        <div className="w-full space-y-4">
          <ActivityTile />
          <ActivityTile />
          <ActivityTile />
        </div>
      </div>
    </MainLayout>
  );
}

function Form() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <TextField label="Lokalizacja" {...register('location')} />
      <TextField label="Obiekt" {...register('object')} />
      <div className="flex gap-2">
        <TextField label="Cena od" {...register('price_from')} />
        <TextField label="Cena do" {...register('price_to')} />
      </div>
      <div className="flex gap-2">
        <TextField label="Data od" type="date" {...register('date_from')} />
        <TextField label="Data do" type="date" {...register('date_to')} />
      </div>
      <div className="flex gap-2">
        <TextField label="Godzina od" type="time" {...register('time_from')} />
        <TextField label="Godzina do" type="time" {...register('time_to')} />
      </div>
      {/* TODO: Add gender */}
      {/* TODO: Add level */}
      {/* TODO: Add referee */}
      <Button value="Szukaj" isSubmit />
    </form>
  );
}

function ActivityTile() {
  return (
    <div className="flex w-full cursor-pointer gap-5 rounded-2xl border border-gray-300 bg-grey-100 p-4 hover:bg-green-100">
      <div className="relative h-full w-[220px]">
        <Image
          className="aspect-video rounded-2xl bg-green-900 object-cover"
          src={footballImage1}
          quality={20}
          alt=""
        />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="mb-1 text-label-medium">Warszawa, Zwyciężców 44</h3>
          <p>29.03 • 19:30</p>
        </div>
        <div>
          <Tag />
        </div>
      </div>
    </div>
  );
}

function Tag() {
  return (
    <div className="w-fit rounded-full border border-grey-600 px-2 py-1">
      <p className="text-label-small text-green-900">12/12 (min: 8)</p>
    </div>
  );
}

export default Activities;
