import EntityCard from '@/components/EntityCard';
import Header from '@/components/Header';
import { DynamicListWithPagination } from '@/components/dynamic/DynamicListWithPagination';
import MainLayout from '@/layouts/MainLayout';
import { BACKEND_ROUTES } from '@/lib/routes';
import { GetTeamsResponse } from '@/repository/team.repository';

function Teams() {
  return (
    <MainLayout>
      <Header value="Drużyny" />
      <DynamicListWithPagination
        listClassName="flex flex-wrap gap-4 mb-8"
        child={(team: GetTeamsResponse) => (
          <EntityCard
            className="w-full sm:w-fit"
            href={`${BACKEND_ROUTES.TEAMS}/${team.id}`}
            title={team.name}
            paragraph={team.city.name}
            avatar={{
              size: 68,
              text: team.short_name,
            }}
          />
        )}
        apiURL={BACKEND_ROUTES.TEAMS}
      />
    </MainLayout>
  );
}

export default Teams;
