export const search = (studies, query) =>{
    const result = [];

    const lowercaseQuery = query.toLowerCase()

    studies.forEach(s =>{

        let found = false;

        const isQueryIncluded = (query, comparisment) =>{
            if (comparisment && typeof comparisment === 'string') {
                const lowercase = comparisment.toLowerCase();
                if (lowercase.includes(query)) found = true;
            }
        }

        isQueryIncluded(lowercaseQuery, s.description);
        isQueryIncluded(lowercaseQuery, s.title);
        isQueryIncluded(lowercaseQuery, s.status);

        s.questions.forEach(q =>{
            isQueryIncluded(lowercaseQuery, q.question)
            q.artifacts.forEach(a => isQueryIncluded(lowercaseQuery, a.id))
        });

        if (found) result.push(s);
    })

    return result;
}