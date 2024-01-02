import { Link } from '@remix-run/react';
import { format } from 'date-fns';
import TextLabel from './text-label.tsx';

type Props = {
    orderId: number;
    orderDate: string;
    status: string;
    supplier?: string;
    items: number;
    selected: boolean;
}

const OrderCard = ({ orderId, orderDate, status, supplier, items, selected }: Props) => {
    const statusStyle: Record<string, string> = {'PENDING': "bg-slate-500", "FULFILLED": "bg-green-400", "CANCELLED": "bg-red-500"}
    return (
        <div className={`p-4 bg-white rounded-lg shadow-sm hover:shadow-md ${selected ? "border-2 border-primary" : "border border-slate-200"}`}>
            <div className='flex justify-between items-center mb-4 pb-4 border-b-2 border-slate-400'>
                <h3 className="text-lg font-medium ">Order #{orderId}</h3>
                <span className={`px-3 py-2 text-white rounded-md  ${statusStyle[status]} inline-block`}>{status}</span>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <TextLabel label="Date" text={format(new Date(orderDate), "dd-MMM-yyyy")}/>
                <TextLabel label="Supplier" text={supplier || 'N/A'}/>
                <TextLabel label="Total Items" text={<span className='text-lg font-bold'>{items}</span>}/>
            </div>
            <div className="flex items-center justify-between border-t-2 border-slate-400 mt-4 pt-4">        
                <Link to={`${orderId}`} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default OrderCard;
