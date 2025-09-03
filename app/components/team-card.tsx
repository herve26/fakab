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

/**
 * A card component that displays information about a team.
 *
 * @param {Props} props - The props for the component.
 * @param {number} props.id - The ID of the team.
 * @param {string} props.name - The name of the team.
 * @param {object | null} props.inCharge - The person in charge of the team.
 * @param {string} props.inCharge.id - The ID of the person in charge.
 * @param {string | null} props.inCharge.name - The name of the person in charge.
 * @param {string} props.inCharge.username - The username of the person in charge.
 * @param {object[]} props.members - The members of the team.
 * @param {string} props.members.id - The ID of the member.
 * @param {string | null} props.members.name - The name of the member.
 * @param {string} props.members.username - The username of the member.
 * @returns {JSX.Element} The team card component.
 */
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