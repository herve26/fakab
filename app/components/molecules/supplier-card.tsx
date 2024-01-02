import TextLabel from './text-label.tsx';

type Props = {
    supplierName: string;
    supplierType: string;
    contactPerson: string | null;
    phoneNumber: string | null;
    email: string | null;
    address: string | null;
}

const SupplierCard = ({ supplier }: { supplier: Props}) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
            <h3 className="text-lg font-medium mb-2">{supplier.supplierName}</h3>
            <TextLabel label="Type" text={supplier.supplierType}/>
            <TextLabel label="Contact Person" text={supplier.contactPerson}/>
            <TextLabel label="Phone Number" text={supplier.phoneNumber}/>
            <TextLabel label="Email" text={supplier.email}/>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                Address: {supplier.address}
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                View Orders
                </button>
            </div>
        </div>
    );
};

export default SupplierCard;
