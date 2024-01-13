import { Form, useFetcher, useLoaderData, useNavigation } from '@remix-run/react';
import db from '../db.server';
import { useEffect, useRef } from 'react';

export const loader = async () => {
    let people = await db.people.findMany();
    if (!people) {
        return [];
      }
    return people;
}

export const action = async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const formData = await request.formData();
    let { _action, ...values } = Object.fromEntries(formData);
    if(_action === 'create') {
        await db.people.create({
            data: values,
        })   
    }

    if(_action === 'delet') {
        console.log(values.id);
        await db.people.delete({ where: { id: values.id } });
    }

    return null;
}

export default function People() {
    let  people  = useLoaderData();
    let navigation = useNavigation();
    let isAdding = navigation.state === "submitting" 
        && navigation.formData.get('_action') === 'create';
    // let isDeleting = navigation.state === "submitting" 
    //     && navigation.formData.get('_action') === 'delete';

    let formRef = useRef();
    let firstNameRef = useRef();

    useEffect(() => {
        if(!isAdding){
            formRef.current?.reset();
            firstNameRef.current?.focus();
        }

    }, [isAdding]);

    return (
        <main>
            <h2>People</h2>
             {people.length ? (
                <ul>
                {people.map((person) => (
                    <PersonItem person={person} key={person.id} />
                ))}
                <li>
                    <Form ref={formRef} method='post'>
                        <input type="text" ref={firstNameRef} name='firstName' placeholder='firstName' required/>{" "}
                        <input type="text" name='lastName' placeholder='lastName' required/>{" "}
                        <button type='submit' name='_action' value='create' disabled={isAdding}>
                            {isAdding ? 'Adding...': 'Add'}
                            </button>
                    </Form>
                </li>
                </ul> 
            ) : (
                <div>
                    <p>Nobody here!</p>
                    <Form ref={formRef} method='post'>
                        <input type="text" ref={firstNameRef} name='firstName' placeholder='firstName' required/>{" "}
                        <input type="text" name='lastName' placeholder='lastName' required/>{" "}
                        <button type='submit' name='_action' value='create' disabled={isAdding}> {isAdding ? 'Adding...': 'Add'}</button>
                    </Form>
                </div>)}
        </main>
    );
}

function  PersonItem({ person }) {
    let fetcher = useFetcher();
    // let navigation = useNavigation();
    let isDeleting = fetcher?.formData?.get('id') === person.id;
    return (
            <li 
                style={{
                    opacity: 
                    isDeleting ? 0.25 : 1,}}
                key={person.id}>
                {person.firstName} {person.lastName}{" "}
                <fetcher.Form method='post' style={{display: 'inline'}}>
                    <input type='hidden' name='id' value={person.id} />
                    <button type='submit' name='_action' value='delet'>x</button>
                </fetcher.Form>
            </li>

    );
}