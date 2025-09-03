import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import ScreenView from '#app/components/screen-view.tsx';
import Table from '#app/components/table.tsx';
import { supabaseClient } from '#app/utils/supa.server.ts';

/**
 * The loader function for the employees route.
 * It fetches the list of employees from the database.
 *
 * @returns {Promise<Response>} A promise that resolves with the response.
 */
export async function loader(){
    const { data, error } = await supabaseClient.from("employee").select('first_name, last_name, team!employee_teamid_fkey ( name ) ')

    console.log(data)
    console.log(error)

    if(!data) return json({employees: []})

    const employeesArr = data.map(emp => [emp.first_name, emp.last_name,  emp.team?.name ?? "N/A"])
    
    return json({employees: employeesArr})
}

/**
 * The component for the employees route.
 * It displays a list of employees in a table.
 *
 * @returns {JSX.Element} The employee list component.
 */
function EmployeeList() {
    const { employees } = useLoaderData<typeof loader>()

  return (
    <div className="flex px-8 space-y-2 space-x-6 my-4">
        <ScreenView heading='Employees List' link="new">
            <Table headers={["First Name", "Last Name", "Team"]}>{employees}</Table>
        </ScreenView>
        <Outlet/>
    </div>
  );
}

export default EmployeeList;
