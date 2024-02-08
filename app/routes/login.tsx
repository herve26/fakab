import InputLabel from "#app/components/molecules/input-label.tsx";
import { Button } from "#app/components/ui/button.tsx";
import { getSupabaseClient } from "#app/utils/supa.server.ts";
import { parse } from "@conform-to/zod";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";

const schema = z.object({
    email: z.string(),
    password: z.string()
})

export async function action({request}: ActionFunctionArgs){
    const headers = new Headers()
    const formData = await request.formData()

    const parsedData = parse(formData, { schema })

    if(!parsedData.value){
        return null
    }

    const supabase = getSupabaseClient(request.headers.get("Cookie") ?? '', headers)

    const { error } = await supabase.auth.signInWithPassword({
        email: parsedData.value.email,
        password: parsedData.value.password
    })

    if(error){
        console.log(error)
        return redirect('/auth/error', { headers })
    }

    return redirect('/admin', {headers})
}

export default function Login(){
    return (
        <div className="flex border border-blue-500 md:p-0 justify-center h-full">
            <Form method="POST" className="w-full mx-4 md:w-[40vw] my-6 px-4 py-6 shadow-md rounded-lg md:mx-auto bg-white">
                <h1 className="font-bold w-full text-center mb-4 text-2xl">FAkab Login</h1>
                <InputLabel name="email" label="Email" required/>
                <InputLabel name="password" label="Password" required type="password"/>
                <Button className="w-full" type="submit">Login</Button>
            </Form>
        </div>
    )
}