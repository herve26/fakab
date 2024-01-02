import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import ScreenView from '#app/components/screen-view.tsx';
import Table from '#app/components/table.tsx';
import { prisma } from '#app/utils/db.server.ts';

export async function loader(){
    const employees = await prisma.employee.findMany()
    const employeesArr = employees.map(emp => [emp.firstName, emp.lastName, emp.teamId ? emp.teamId : "N/A"])
    return json({employees: employeesArr})
}

function EmployeeList() {
    const { employees } = useLoaderData<typeof loader>()

  return (
    <div className="flex px-8 space-y-2 space-x-6 my-4">
        <ScreenView heading='Employees List' link="new">
            <Table headers={["First Name", "Last Name", "Team"]} children={employees}/>
        </ScreenView>
        <Outlet/>
    </div>
  );
}

export default EmployeeList;
