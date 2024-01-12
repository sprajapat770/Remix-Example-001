export default function People() {
    let people = [];

    return (
        <main>
            <h2>People</h2>
             {people.length ? (
                <ul>
                {people.map((person) => (
                    <li key={person.id}>
                        {person.firstname}{person.lastName}
                    </li>

                ))}
                </ul> 
            ) : (<p>Nobody here!</p>)}
        </main>
    );
    
}