

export default function useTagsLoad(setTags) {
    fetch(`http://localhost:3000/tag/all`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(values => {
        setTags(values);
    });
}