

export default function useTagsLoad(setTags) {
    fetch(`http://127.0.0.1:3000/tag/add`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(values => {
        setTags(values);
        console.log("111");
    });
}