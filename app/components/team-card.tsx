type Props = {
    id: number;
    name: string;
    inCharge: {
        id: string;
        name: string | null;
        username: string;
    } | null;
    members: {
        id: string;
        name: string | null;
        username: string;
    }[];
}

const TeamCard = ({ id, name, inCharge, members }: Props) => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 mb-4">
      <h2 className="text-lg leading-6 font-medium text-gray-900">{name}</h2>
      <p className="mt-1 text-sm text-gray-500">ID: {id}</p>
      <p className="mt-1 text-sm text-gray-500">In Charge: {inCharge ? inCharge.name : 'None'}</p>
      <div className="mt-2">
        <h3 className="text-sm font-semibold text-gray-900">Members:</h3>
        {members.map((member) => (
          <p key={member.id} className="text-sm text-gray-500">{member.name}</p>
        ))}
      </div>
    </div>
);

export default TeamCard