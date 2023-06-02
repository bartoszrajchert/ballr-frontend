import Header from '@/components/Header';
import Tile from '@/components/Tile';
import MainLayout from '@/layouts/MainLayout';
import { getAddressFromFacility, getLocaleDateString } from '@/lib/helpers';
import { ROUTES } from '@/lib/routes';
import { withAuth } from '@/lib/withAuth';
import { UserContext } from '@/providers/UserProvider';
import React, { useContext } from 'react';

function ProfileSettingsMatches() {
  const { user } = useContext(UserContext);

  return (
    <MainLayout>
      <Header value="Mecze" />
      <>
        {user && user?.matches?.length <= 0 && (
          <div className="text-center text-gray-500">
            Nie masz żadnych meczy
          </div>
        )}
        {user?.matches.map((match) => (
          <Tile
            key={match.match_id}
            href={`${ROUTES.MATCHES}/${match.match_id}`}
            title={'Mecz'}
            description={[
              `Data meczu: ${getLocaleDateString(match.match_start_date)}`,
            ]}
          />
        ))}
      </>
    </MainLayout>
  );
}

export default withAuth(ProfileSettingsMatches);
