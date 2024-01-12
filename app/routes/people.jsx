import { Form, useLoaderData } from '@remix-run/react';
import db from '../db.server';

export const loader = async () => {
    let people = await db.people.findMany();
    console.log(people);
    if (!people) {
        return [];
      }
    return people;
}

export const action = async ({ request }) => {
    const formData = await request.formData();
    let obj = Object.fromEntries(formData);
    console.log(obj);
    await db.people.create({
        data: obj,
    })
    return null;
}

export default function People() {
    let  people  = useLoaderData();

    return (
        <main>
            <h2>People</h2>
             {people.length ? (
                <ul>
                {people.map((person) => (
                    <li key={person.id}>
                        {person.firstName} {person.lastName}
                    </li>
                ))}
                <li>
                    <Form method='post'>
                        <input type="text" name='firstName' placeholder='firstName' required/>{" "}
                        <input type="text" name='lastName' placeholder='lastName' required/>{" "}
                        <button type='submit'>Submit</button>
                    </Form>
                </li>
                </ul> 
            ) : (
                <div>
                    <p>Nobody here!</p>
                    <Form method='post'>
                        <input type="text" name='firstName' placeholder='firstName' required/>{" "}
                        <input type="text" name='lastName' placeholder='lastName' required/>{" "}
                        <button type='submit'>Submit</button>
                    </Form>
                </div>)}
        </main>
    );
    
}