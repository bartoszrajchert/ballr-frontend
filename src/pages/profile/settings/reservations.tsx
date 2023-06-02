import Header from '@/components/Header';
import Tile from '@/components/Tile';
import MainLayout from '@/layouts/MainLayout';
import { getAddressFromFacility, getLocaleDateString } from '@/lib/helpers';
import { ROUTES } from '@/lib/routes';
import { withAuth } from '@/lib/withAuth';
import { UserContext } from '@/providers/UserProvider';
import React, { useContext } from 'react';

function ProfileSettingsReservations() {
  const { user } = useContext(UserContext);

  return (
    <MainLayout>
      <Header value="Moje rezerwacje" />
      <>
        {user && user?.reservations?.length <= 0 && (
          <div className="text-center text-gray-500">
            Nie masz żadnych rezerwacji
          </div>
        )}
        {user?.reservations.map((reservation) => (
          <Tile
            key={reservation.id}
            href={`${ROUTES.RESERVATIONS}/${reservation.id}`}
            title={getAddressFromFacility(reservation.field.facility)}
            description={[
              `Data rezerwacji: ${getLocaleDateString(
                reservation.start_time
              )} - ${getLocaleDateString(reservation.end_time)}`,
              `Boisko: ${reservation.field.name}`,
            ]}
          />
        ))}
      </>
    </MainLayout>
  );
}

export default withAuth(ProfileSettingsReservations);
