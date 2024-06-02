

export default function useTagsLoad(setTags) {
    fetch(`${import.meta.env.VITE_API_URL}/tag/all`, {
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